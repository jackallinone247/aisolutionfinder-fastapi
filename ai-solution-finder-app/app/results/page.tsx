"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Shield, AlertTriangle, AlertCircle, Circle, Gauge, BadgeInfo } from 'lucide-react';
import clsx from 'clsx';
import TrafficLight from "../../components/TrafficLight"; // or "@/components/TrafficLight"


interface ComplianceResult {
  gdpr_status: 'green' | 'yellow' | 'red';
  gdpr_section: string;
  ai_act_status: 'ok' | 'warning' | 'violation';
  ai_act_section: string;
  explanations: {
    gdpr: string;
    ai_act: string;
  };
}

interface BusinessResult {
  score: number;
  narrative: string;
}

interface ToolsResult {
  recommendations: { tool: string; reason: string }[];
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const [loading, setLoading] = useState<boolean>(true);
  const [compliance, setCompliance] = useState<ComplianceResult | null>(null);
  const [business, setBusiness] = useState<BusinessResult | null>(null);
  const [tools, setTools] = useState<ToolsResult | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/session/${sessionId}`);
        if (!res.ok) {
          throw new Error(`Error fetching session: ${res.status}`);
        }
        const data = await res.json();
        setCompliance(data.compliance);
        setBusiness(data.business);
        setTools(data.tools);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [sessionId]);

  const TrafficLight = ({ status, type }: { status: string; type: 'gdpr' | 'ai' }) => {
    // Map statuses to index: 0 green/compliant, 1 yellow/warning, 2 red/violation
    let activeIndex = 0;
    if (type === 'gdpr') {
      if (status === 'yellow') activeIndex = 1;
      else if (status === 'red') activeIndex = 2;
    } else {
      if (status === 'warning') activeIndex = 1;
      else if (status === 'violation') activeIndex = 2;
    }
    const colours = ['bg-status-green', 'bg-status-yellow', 'bg-status-red'];
    return (
      <div className="flex flex-col items-center gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              'h-8 w-8 rounded-full border-brand-border border-thick flex items-center justify-center',
              i === activeIndex ? colours[i] : 'bg-gray-200'
            )}
          >
            {i === activeIndex && <Circle className="h-5 w-5 text-white" />}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <p className="text-center">Analyse wird geladen…</p>;
  }

  if (!compliance || !business || !tools) {
    return <p className="text-center">Keine Ergebnisse gefunden.</p>;
  }

  return (
    <div className="space-y-8">
      {/* Compliance Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-6 w-6 text-brand-primary" /> Compliance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* EU AI Act */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold flex items-center gap-1">EU AI Act</h3>
            <TrafficLight status={compliance.ai_act_status} type="ai" />
            <span
              className={clsx(
                'px-2 py-1 rounded-md border-brand-border border-thick w-fit text-sm font-medium shadow-card',
                compliance.ai_act_status === 'ok' && 'bg-status-green text-white',
                compliance.ai_act_status === 'warning' && 'bg-status-yellow text-white',
                compliance.ai_act_status === 'violation' && 'bg-status-red text-white'
              )}
            >
              {compliance.ai_act_status === 'ok'
                ? 'Compliant'
                : compliance.ai_act_status === 'warning'
                ? 'Warning'
                : 'Violation'}
            </span>
            <div className="bg-brand-accent border-brand-border border-thick rounded-lg p-3 text-sm">
              <p className="font-semibold mb-1">Begründung EU AI Act:</p>
              <p>{compliance.explanations.ai_act}</p>
            </div>
          </div>
          {/* GDPR */}
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold flex items-center gap-1">DSGVO</h3>
            <TrafficLight status={compliance.gdpr_status} type="gdpr" />
            <span
              className={clsx(
                'px-2 py-1 rounded-md border-brand-border border-thick w-fit text-sm font-medium shadow-card',
                compliance.gdpr_status === 'green' && 'bg-status-green text-white',
                compliance.gdpr_status === 'yellow' && 'bg-status-yellow text-white',
                compliance.gdpr_status === 'red' && 'bg-status-red text-white'
              )}
            >
              {compliance.gdpr_status === 'green'
                ? 'Compliant'
                : compliance.gdpr_status === 'yellow'
                ? 'Warnung'
                : 'Verstoß'}
            </span>
            <div className="bg-brand-accent border-brand-border border-thick rounded-lg p-3 text-sm">
              <p className="font-semibold mb-1">Begründung DSGVO:</p>
              <p>{compliance.explanations.gdpr}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Business Value Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Gauge className="h-6 w-6 text-brand-primary" /> Business Value
        </h2>
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative flex items-center justify-center">
            <div className="h-24 w-24 rounded-full border-brand-border border-thick flex items-center justify-center text-2xl font-bold">
              {business.score.toFixed(1)}
              <span className="text-sm font-normal ml-1">/10</span>
            </div>
          </div>
          <div className="flex-1">
            <span
              className={clsx(
                'px-2 py-1 rounded-md border-brand-border border-thick w-fit text-sm font-medium shadow-card',
                business.score >= 7
                  ? 'bg-status-green text-white'
                  : business.score >= 4
                  ? 'bg-status-yellow text-white'
                  : 'bg-status-red text-white'
              )}
            >
              {business.score >= 7
                ? 'Hoch'
                : business.score >= 4
                ? 'Mittel'
                : 'Niedrig'}
            </span>
            <div className="mt-4 bg-brand-accent border-brand-border border-thick rounded-lg p-3 text-sm">
              <p className="font-semibold mb-1">Business Value Berechnung:</p>
              <p>{business.narrative}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Tools Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BadgeInfo className="h-6 w-6 text-brand-primary" /> Tool‑Empfehlung
        </h2>
        <ul className="space-y-3 text-sm">
          {tools.recommendations.map((rec, idx) => (
            <li key={idx} className="bg-brand-accent border-brand-border border-thick rounded-lg p-3 shadow-card">
              <strong>{rec.tool}:</strong> {rec.reason}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}