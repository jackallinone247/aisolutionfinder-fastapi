"use client";

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, FileText, Package, Clock, Shield, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

/**
 * ProcessPage implements a four–step wizard for collecting the information required
 * by the AI engine. Each step is rendered conditionally and includes navigation
 * controls. Once all steps are complete the data is submitted to the backend API
 * and the user is redirected to the results page.
 */
export default function ProcessPage() {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Form state
  const [description, setDescription] = useState('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [timeRequired, setTimeRequired] = useState('');
  const [frequency, setFrequency] = useState('');
  const [stakeholders, setStakeholders] = useState<string[]>([]);
  const [usesPersonalData, setUsesPersonalData] = useState<boolean | null>(null);

  // App definitions
  const apps = [
    'Notion',
    'Slack',
    'Microsoft Teams',
    'Asana',
    'Trello',
    'Google Workspace (Sheets, Docs, Slides, Gmail, Drive)',
    'Apple Numbers | Pages | Keynote',
    'LibreOffice',
    'Confluence',
    'Miro',
    'Figma',
    'Coda',
    'Salesforce',
    'HubSpot',
  ];

  const timeOptions = ['< 15 min', '15-30 min', '30-60 min', '1-2 h', '> 2 h'];
  const freqOptions = ['täglich', 'mehrmals pro Woche', 'wöchentlich', 'monatlich', 'seltener'];
  const stakeholderOptions = ['mich', 'mein Team', 'meinen Chef', 'Kunden', 'andere'];

  const handleAppToggle = (app: string) => {
    setSelectedApps((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleStakeholderToggle = (item: string) => {
    setStakeholders((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const nextStep = () => {
    setStep((s) => Math.min(s + 1, 4));
  };
  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          applications: selectedApps,
          time_required: timeRequired,
          frequency,
          stakeholders,
          uses_personal_data: usesPersonalData,
        }),
      });
      if (!res.ok) {
        throw new Error(`Failed to generate: ${res.status}`);
      }
      const data = await res.json();
      // persist to Supabase (messages, runs, etc.) in API layer
      // store result locally and redirect
      const sessionId = data.session_id ?? '';
      router.push(`/results?session=${sessionId}`);
    } catch (err) {
      console.error(err);
      alert('Beim Analysieren ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="bg-white border-brand-border border-thick shadow-card p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Prozess analysieren</h3>
          <span className="text-sm">Schritt {step} von 4</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-brand-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      {step === 1 && (
        <div className="card">
          <div className="flex flex-col items-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-brand-primary" />
            <h2 className="text-2xl font-semibold">Beschreiben Sie Ihren Prozess</h2>
            <p className="text-center text-sm max-w-lg">
              Erzählen Sie uns möglichst ausführlich über den Prozess, den Sie optimieren möchten.
              Je detaillierter Ihre Beschreibung, desto präziser wird unsere Analyse.
            </p>
          </div>
          <label className="block font-medium mb-1" htmlFor="process-description">
            Prozessbeschreibung
          </label>
          <textarea
            id="process-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full border-brand-border border-thick rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white"
            placeholder="Beschreibe deinen Prozess möglichst ausführlich. Mach dir keine Gedanken zur Rechtschreibung oder Grammatik. Tippe einfach drauf los…"
          />
          <div className="mt-2 text-xs text-gray-600 text-right">
            {description.length} Zeichen (mindestens 20 für die nächste Stufe)
          </div>
          <div className="mt-4 bg-brand-accent border-brand-border border-thick rounded-lg p-4 flex gap-2">
            <Lightbulb className="h-5 w-5 text-brand-primary mt-1" />
            <div className="text-sm">
              <p className="font-semibold">Tipp für eine bessere Analyse:</p>
              <ul className="list-disc list-inside">
                <li>Welche Schritte sind Teil des Prozesses?</li>
                <li>Welche Tools oder Systeme verwenden Sie?</li>
                <li>Wo entstehen Wartezeiten oder Unterbrechungen?</li>
                <li>Was sind die häufigsten Probleme oder Fehlerquellen?</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <div className="flex flex-col items-center gap-2 mb-4">
            <Package className="h-8 w-8 text-brand-primary" />
            <h2 className="text-2xl font-semibold">Welche Anwendungen nutzen Sie?</h2>
            <p className="text-center text-sm max-w-lg">
              Wählen Sie alle Tools und Systeme aus, die in Ihrem Prozess verwendet werden.
            </p>
          </div>
          {selectedApps.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedApps.map((app) => (
                <span
                  key={app}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand-primary text-white border-brand-border border-thick shadow-card text-sm"
                >
                  {app}
                  <button
                    onClick={() => handleAppToggle(app)}
                    className="p-0.5 rounded-full hover:bg-brand-secondary"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-2">
            {apps.map((app) => (
              <button
                key={app}
                type="button"
                onClick={() => handleAppToggle(app)}
                className={clsx(
                  'flex items-center justify-between px-4 py-2 rounded-lg border-brand-border border-thick shadow-card',
                  selectedApps.includes(app)
                    ? 'bg-brand-primary text-white'
                    : 'bg-white text-brand-border'
                )}
              >
                {app}
                {selectedApps.includes(app) && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <div className="flex flex-col items-center gap-2 mb-4">
            <Clock className="h-8 w-8 text-brand-primary" />
            <h2 className="text-2xl font-semibold">Prozessdetails</h2>
            <p className="text-center text-sm max-w-lg">
              Helfen Sie uns, den Aufwand und die Auswirkungen Ihres Prozesses zu verstehen.
            </p>
          </div>
          <div className="mb-4">
            <p className="font-medium mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-4 w-4"><Clock className="h-4 w-4" /></span>
              Zeitaufwand pro Ausführung
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {timeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setTimeRequired(opt)}
                  className={clsx(
                    'px-2 py-2 rounded-md border-brand-border border-thick shadow-card text-sm',
                    timeRequired === opt
                      ? 'bg-brand-primary text-white'
                      : 'bg-white text-brand-border'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="font-medium mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-4 w-4">⏱️</span>
              Wie oft wird der Prozess ausgeführt?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {freqOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFrequency(opt)}
                  className={clsx(
                    'px-2 py-2 rounded-md border-brand-border border-thick shadow-card text-sm',
                    frequency === opt
                      ? 'bg-brand-primary text-white'
                      : 'bg-white text-brand-border'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="font-medium mb-2 flex items-center gap-2">
              <span className="inline-flex items-center justify-center h-4 w-4">👥</span>
              Betroffene Person(en) – Mehrfachauswahl möglich
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {stakeholderOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleStakeholderToggle(opt)}
                  className={clsx(
                    'px-2 py-2 rounded-md border-brand-border border-thick shadow-card text-sm',
                    stakeholders.includes(opt)
                      ? 'bg-brand-primary text-white'
                      : 'bg-white text-brand-border'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="card">
          <div className="flex flex-col items-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-brand-primary" />
            <h2 className="text-2xl font-semibold">Datenschutz & Compliance</h2>
            <p className="text-center text-sm max-w-lg">
              Diese Informationen helfen uns bei der Bewertung von DSGVO‑ und AI Act‑Compliance.
            </p>
          </div>
          <p className="font-medium mb-2">Enthält Ihr Prozess personenbezogene Daten?</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <button
              type="button"
              onClick={() => setUsesPersonalData(false)}
              className={clsx(
                'px-4 py-3 rounded-md border-brand-border border-thick shadow-card text-center',
                usesPersonalData === false
                  ? 'bg-status-green text-white'
                  : 'bg-white text-brand-border'
              )}
            >
              Nein<br />
              <span className="text-xs font-normal">Keine personenbezogenen Daten</span>
            </button>
            <button
              type="button"
              onClick={() => setUsesPersonalData(true)}
              className={clsx(
                'px-4 py-3 rounded-md border-brand-border border-thick shadow-card text-center',
                usesPersonalData === true
                  ? 'bg-brand-primary text-white'
                  : 'bg-white text-brand-border'
              )}
            >
              Ja<br />
              <span className="text-xs font-normal">Personenbezogene Daten vorhanden</span>
            </button>
          </div>
          <div className="bg-brand-accent border-brand-border border-thick rounded-lg p-4 text-sm flex gap-2">
            <Shield className="h-5 w-5 text-brand-primary mt-1" />
            <p>
              Ihre Angaben werden ausschließlich für die Prozessanalyse verwendet und DSGVO‑konform
              verarbeitet. Es werden keine identifizierbaren persönlichen Daten gespeichert.
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="btn-tertiary flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" /> Zurück
          </button>
        ) : (
          <span />
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={
              (step === 1 && description.trim().length < 20) ||
              (step === 2 && selectedApps.length === 0) ||
              (step === 3 && (!timeRequired || !frequency || stakeholders.length === 0))
            }
            className="btn-primary flex items-center gap-1 disabled:opacity-50"
          >
            Weiter <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={usesPersonalData === null || loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-4 w-4" />
            )}
            Prozess analysieren
          </button>
        )}
      </div>
    </div>
  );
}