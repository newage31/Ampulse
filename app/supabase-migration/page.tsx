import SupabaseMigration from '../../components/SupabaseMigration';

export default function SupabaseMigrationPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Migration des données vers Supabase</h1>
        <SupabaseMigration />
      </div>
    </div>
  );
} 