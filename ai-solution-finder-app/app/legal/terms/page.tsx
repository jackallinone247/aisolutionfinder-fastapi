export default function TermsPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Nutzungsbedingungen</h2>
      <p>
        Durch die Nutzung dieser Anwendung akzeptieren Sie die folgenden Bedingungen:
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>
          Diese Anwendung dient ausschließlich zu Informationszwecken und stellt keine Rechts- oder
          Beratungsdienstleistung dar.
        </li>
        <li>
          Sie stellen sicher, dass die von Ihnen eingegebenen Daten korrekt sind und keine
          vertraulichen personenbezogenen Daten enthalten, die Sie nicht teilen dürfen.
        </li>
        <li>
          Die erstellten Analysen basieren auf öffentlich verfügbaren Informationen sowie Ihren
          Eingaben. Wir übernehmen keine Gewähr für die Vollständigkeit oder Richtigkeit der
          Ergebnisse.
        </li>
        <li>
          Die bereitgestellten Inhalte dürfen nicht ohne unsere Zustimmung weiterverwendet
          werden.
        </li>
      </ul>
    </div>
  );
}