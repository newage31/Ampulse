import SupabaseTest from '../../components/SupabaseTest';

export default function SupabaseTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Test de connexion Supabase</h1>
        <SupabaseTest />
      </div>
    </div>
  );
} 