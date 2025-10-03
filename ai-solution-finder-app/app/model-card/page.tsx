export default function ModelCardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Modellkarte</h2>
      <p>
        Diese Anwendung verwendet das Modell „gpt‑4o‑mini“ von OpenAI in Kombination mit
        benutzerdefinierten Prompt‑Vorlagen sowie einem Retrieval‑Augmented‑Generation (RAG)
        Mechanismus. Ziel ist es, die Einhaltung der DSGVO und des EU AI Act zu bewerten, den
        Business Value einzuschätzen und passende Tools zu empfehlen.
      </p>
      <h3 className="font-semibold text-xl">Fähigkeiten</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>Analyse von Prozessbeschreibungen auf KI‑Nutzung und personenbezogene Daten.</li>
        <li>Zuordnung zu relevanten Artikeln des DSGVO und AI Act durch semantische Suche.</li>
        <li>Berechnung eines Business‑Value‑Scores basierend auf Zeit, Häufigkeit und Stakeholdern.</li>
        <li>Empfehlung passender Automatisierungs‑ oder Produktivitäts‑Tools.</li>
      </ul>
      <h3 className="font-semibold text-xl">Grenzen</h3>
      <ul className="list-disc list-inside space-y-2">
        <li>Die Qualität der Ergebnisse hängt stark von der Detailtiefe Ihrer Eingaben ab.</li>
        <li>Das Modell kann falsche oder veraltete Interpretationen liefern, besonders bei
          unvollständigen oder widersprüchlichen Informationen.</li>
        <li>Rechtliche Einschätzungen ersetzen keine professionelle Beratung.</li>
        <li>Empfehlungen basieren auf einer begrenzten Menge an Quellen und sind nicht
          vollständig.</li>
      </ul>
      <h3 className="font-semibold text-xl">Datenquellen</h3>
      <p>
        Für die Einschätzung der Compliance werden Auszüge aus der DSGVO und dem Entwurf des
        EU AI Act herangezogen. Diese Dokumente werden als Referenz in einem Vektorindex
        gespeichert und bei Bedarf abgefragt. Zusätzlich verwendet das Modell Ihre
        Prozessbeschreibung und Metadaten (Zeit, Häufigkeit, Stakeholder, Anwendungen).
      </p>
    </div>
  );
}