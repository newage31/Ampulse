import SupabaseAuth from '../../components/SupabaseAuth';

export default function SupabaseAuthPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Authentification Supabase</h1>
        <SupabaseAuth />
      </div>
    </div>
  );
} 