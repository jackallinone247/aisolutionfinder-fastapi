export default function PrivacyPolicy() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Datenschutzerklärung</h2>
      <p>
        Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Diese Anwendung speichert und
        verarbeitet Ihre Eingaben ausschließlich zur Analyse Ihrer Prozesse und zur Bereitstellung
        der AI‑gestützten Empfehlungen. Eine Weitergabe Ihrer Daten an Dritte erfolgt nicht.
      </p>
      <p>
        Alle Daten werden in einer Supabase‑Datenbank in der Region Frankfurt (eu‑central‑1)
        gespeichert. Die Daten werden verschlüsselt übertragen und ruhen verschlüsselt in der
        Datenbank. Sie können Ihre Daten jederzeit im DSR‑Portal einsehen, exportieren oder
        löschen.
      </p>
      <p>
        Für die Generierung der Empfehlungen wird die OpenAI API genutzt. Dabei werden Ihre
        Eingaben an OpenAI übertragen. OpenAI verarbeitet die Daten außerhalb der EU. Die
        Übermittlung erfolgt auf Grundlage der Standardvertragsklauseln (SCCs) der EU. Weitere
        Informationen entnehmen Sie bitte der Modellbeschreibung.
      </p>
    </div>
  );
}