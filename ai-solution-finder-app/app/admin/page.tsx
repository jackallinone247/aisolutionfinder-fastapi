import { useAuth } from '../../components/AuthProvider';

export default function AdminPage() {
  const { user } = useAuth();
  // In a real implementation you would check the user's role stored in Supabase
  const isAdmin = user?.email?.endsWith('@example.com'); // placeholder
  if (!isAdmin) {
    return <p>Sie haben keinen Zugriff auf diesen Bereich.</p>;
  }
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
      <p>Hier sehen Sie Audit-Logs, Fehlerberichte und können Retention-Einstellungen verwalten.</p>
      {/* Placeholder content */}
      <div className="bg-brand-accent border-brand-border border-thick rounded-lg p-4">
        <p className="text-sm">Audit-Logs werden hier angezeigt … (nicht implementiert).</p>
      </div>
    </div>
  );
}