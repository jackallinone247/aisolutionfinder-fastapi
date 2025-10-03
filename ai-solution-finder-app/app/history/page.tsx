"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../components/AuthProvider';

export default function HistoryPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    // Fetch past analyses from Supabase
    (async () => {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setRecords(data || []);
      setLoading(false);
    })();
  }, [user]);

  if (!user) {
    return <p>Bitte anmelden, um Ihre Historie einzusehen.</p>;
  }
  if (loading) return <p>Laden…</p>;
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Verlauf</h2>
      {records.length === 0 && <p>Keine Analysen gefunden.</p>}
      <ul className="space-y-3">
        {records.map((rec) => (
          <li
            key={rec.id}
            className="border-brand-border border-thick rounded-lg p-3 shadow-card bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{rec.process_description?.slice(0, 60) || 'Prozess'}</p>
              <p className="text-xs text-gray-600">{new Date(rec.created_at).toLocaleString('de-DE')}</p>
            </div>
            <a
              href={`/results?session=${rec.session_id}`}
              className="btn-primary text-xs"
            >
              Anzeigen
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}