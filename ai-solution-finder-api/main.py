import os
import uuid
import asyncio
from typing import List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from langchain.schema import HumanMessage
from langchain_openai import ChatOpenAI

from vectorstore import get_vectorstore
from pathlib import Path
from prompts import (
    COMPLIANCE_SYSTEM, COMPLIANCE_TEMPLATE,
    BUSINESS_SYSTEM, BUSINESS_TEMPLATE,
    TOOL_TEMPLATE,
)


# Load environment variables
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set in environment variables")


app = FastAPI(title="AI Solution Finder API")

# Allow CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prepare vector store and LLM on startup
PDFS = [
    str(Path(__file__).parent / 'data' / 'GDPR.pdf'),
    str(Path(__file__).parent / 'data' / 'EU_AI_ACT.pdf'),
]
try:
    vector_store = get_vectorstore(PDFS)
except Exception:
    vector_store = None

llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)

class GenerateRequest(BaseModel):
    description: str
    applications: List[str] = Field(default_factory=list)
    time_required: str
    frequency: str
    stakeholders: List[str] = Field(default_factory=list)
    uses_personal_data: Optional[bool]

class GenerateResponse(BaseModel):
    session_id: str

class SessionData(BaseModel):
    compliance: dict
    business: dict
    tools: dict

# In‑memory session store. In a production environment this should be replaced
# with persistent storage (e.g. Supabase Postgres). Data retention is
# indefinite until a DSR request triggers deletion.
SESSIONS: dict[str, SessionData] = {}

def safe_json_parse(raw: str):
    """Try to parse JSON returned by the model, cleaning up common formatting issues."""
    text = raw.strip().strip("```json").strip("```")
    try:
        import json
        return json.loads(text)
    except Exception:
        import re
        cleaned = re.sub(r",\s*}", "}", re.sub(r",\s*\]", "]", text))
        return json.loads(cleaned)


@app.post("/generate", response_model=GenerateResponse)
async def generate(req: GenerateRequest):
    if not req.description.strip():
        raise HTTPException(status_code=400, detail="Description is required")
    # Similarity search to build excerpts from law documents
    excerpts = ""
    if vector_store is not None:
        docs = vector_store.similarity_search(req.description, k=5)
        excerpts = "\n\n".join(d.page_content for d in docs)
    # Prepare results container
    results: dict[str, Optional[dict]] = {"comp": None, "val": None, "tools": None}

    # Build calls
    async def call_compliance():
        content = COMPLIANCE_TEMPLATE.format(excerpts=excerpts, description=req.description)
        resp = llm.predict_messages([COMPLIANCE_SYSTEM, HumanMessage(content=content)])
        results["comp"] = safe_json_parse(resp.content)

    async def call_business():
        stkh = req.stakeholders[0] if req.stakeholders else ""
        prompt = BUSINESS_TEMPLATE.format(
            time_required=req.time_required,
            frequency=req.frequency,
            stakeholder=stkh
        )
        resp = llm.predict_messages([BUSINESS_SYSTEM, HumanMessage(content=prompt)])
        results["val"] = safe_json_parse(resp.content)

    async def call_tools():
        prompt = TOOL_TEMPLATE.format(description=req.description, applications=", ".join(req.applications))
        resp = llm.predict_messages([HumanMessage(content=prompt)])
        results["tools"] = safe_json_parse(resp.content)

    # Run calls concurrently
    await asyncio.gather(call_compliance(), call_business(), call_tools())

    # Persist results in session store
    session_id = str(uuid.uuid4())
    SESSIONS[session_id] = SessionData(
        compliance=results["comp"], business=results["val"], tools=results["tools"]
    )
    return GenerateResponse(session_id=session_id)


@app.get("/session/{session_id}")
async def get_session(session_id: str):
    data = SESSIONS.get(session_id)
    if not data:
        raise HTTPException(status_code=404, detail="Session not found")
    return data