"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../components/AuthProvider';

export default function DsrPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [exportUrl, setExportUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (!user) return;
    setLoading(true);
    // Simulate export: fetch records and generate CSV client‑side
    const { data } = await supabase
      .from('ideas')
      .select('id, process_description, created_at')
      .eq('user_id', user.id);
    const rows = data || [];
    const csv = [
      ['id', 'process_description', 'created_at'],
      ...rows.map((r) => [r.id, r.process_description, r.created_at]),
    ]
      .map((r) => r.join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    setExportUrl(url);
    setLoading(false);
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    if (!confirm('Möchten Sie wirklich all Ihre Daten löschen? Dies kann nicht rückgängig gemacht werden.')) return;
    await supabase
      .from('ideas')
      .delete()
      .eq('user_id', user.id);
    alert('Ihre Daten wurden gelöscht.');
  };

  if (!user) {
    return <p>Bitte melden Sie sich an, um Ihre Daten zu verwalten.</p>;
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">DSR‑Portal</h2>
      <p>
        Hier können Sie Ihre gespeicherten Daten einsehen, herunterladen oder löschen. Diese
        Funktionen unterstützen Sie bei der Ausübung Ihrer Rechte gemäß der DSGVO.
      </p>
      <button onClick={handleExport} className="btn-secondary" disabled={loading}>
        Daten exportieren
      </button>
      {exportUrl && (
        <a href={exportUrl} download={`ai-solution-finder-export-${user.id}.csv`} className="underline text-brand-primary">
          Export herunterladen
        </a>
      )}
      <button onClick={handleDeleteAll} className="btn-tertiary">
        Alle Daten löschen
      </button>
    </div>
  );
}