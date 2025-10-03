import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <section className="flex flex-col items-center gap-6 text-center">
      <div className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-brand-border border-thick shadow-card rounded-xl px-8 py-12 max-w-3xl w-full">
        <h2 className="text-3xl font-semibold mb-2">Willkommen beim AI Solution Finder</h2>
        <p className="text-lg max-w-xl mx-auto">
          Analysieren Sie Ihre Geschäftsprozesse auf Compliance und Automatisierungspotential.
          Unser KI‑System bewertet AI Act, DSGVO‑Konformität und Business Value.
        </p>
      </div>
      <Link href="/process" className="btn-primary flex items-center gap-2">
        Prozess analysieren
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}