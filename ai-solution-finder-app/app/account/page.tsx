import { useAuth } from '../../components/AuthProvider';
import { supabase } from '../../lib/supabaseClient';

export default function AccountPage() {
  const { user } = useAuth();

  if (!user) {
    return <p>Bitte melden Sie sich an, um Ihr Konto zu verwalten.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Konto</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>User ID:</strong> {user.id}</p>
      <p className="text-sm text-gray-700">
        Um Ihre Daten zu exportieren oder zu löschen, besuchen Sie bitte den
        <a href="/dsr" className="underline ml-1">DSR‑Bereich</a>.
      </p>
    </div>
  );
}