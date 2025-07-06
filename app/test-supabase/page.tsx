import SupabaseConnectionTest from '../../components/SupabaseConnectionTest';

export default function TestSupabasePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🧪 Test de Connexion Supabase Production
          </h1>
          <p className="text-gray-600">
            Cette page teste la connexion à votre projet Supabase en ligne et affiche les données migrées.
          </p>
        </div>

        <SupabaseConnectionTest />

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">📋 Informations de connexion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>URL Supabase:</strong>
              <div className="font-mono bg-white p-2 rounded mt-1 break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </div>
            </div>
            <div>
              <strong>Clé anonyme:</strong>
              <div className="font-mono bg-white p-2 rounded mt-1 break-all text-xs">
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 50)}...
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">🔗 Liens utiles</h2>
          <div className="space-y-2">
            <a 
              href="https://supabase.com/dashboard/project/xlehtdjshcurmrxedefi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              🌐 Dashboard Supabase
            </a>
            <a 
              href="https://xlehtdjshcurmrxedefi.supabase.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              📊 Supabase Studio
            </a>
            <a 
              href="/" 
              className="block text-blue-600 hover:text-blue-800 underline"
            >
              🏠 Retour à l'application principale
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 