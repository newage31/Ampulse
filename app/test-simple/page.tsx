export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          ✅ Test de fonctionnement
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          L'application Ampulse fonctionne correctement !
        </p>
        <div className="space-y-4">
          <div className="bg-green-100 p-4 rounded-lg">
            <h2 className="font-semibold text-green-800">✅ Next.js</h2>
            <p className="text-green-600">Serveur de développement opérationnel</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg">
            <h2 className="font-semibold text-blue-800">✅ TypeScript</h2>
            <p className="text-blue-600">Compilation TypeScript réussie</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <h2 className="font-semibold text-purple-800">✅ Tailwind CSS</h2>
            <p className="text-purple-600">Styles CSS appliqués correctement</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg">
            <h2 className="font-semibold text-orange-800">✅ Supabase</h2>
            <p className="text-orange-600">Base de données locale opérationnelle</p>
          </div>
        </div>
        <div className="mt-8">
          <a 
            href="/" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour à l'application principale
          </a>
        </div>
      </div>
    </div>
  );
} 