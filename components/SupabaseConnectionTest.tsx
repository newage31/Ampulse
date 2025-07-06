'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SupabaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('🔍 Test de connexion à Supabase Production...');
      console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      // Test de connexion avec récupération des hôtels
      const { data: hotels, error: hotelsError } = await supabase
        .from('hotels')
        .select('*')
        .limit(5);

      if (hotelsError) {
        throw new Error(`Erreur hôtels: ${hotelsError.message}`);
      }

      // Test avec les opérateurs sociaux
      const { data: operateurs, error: operateursError } = await supabase
        .from('operateurs_sociaux')
        .select('*')
        .limit(5);

      if (operateursError) {
        throw new Error(`Erreur opérateurs: ${operateursError.message}`);
      }

      // Test avec les réservations
      const { data: reservations, error: reservationsError } = await supabase
        .from('reservations')
        .select(`
          *,
          hotels (nom),
          operateurs_sociaux (nom, prenom)
        `)
        .limit(5);

      if (reservationsError) {
        throw new Error(`Erreur réservations: ${reservationsError.message}`);
      }

      setData({
        hotels,
        operateurs,
        reservations
      });
      setConnectionStatus('success');
      console.log('✅ Connexion Supabase Production réussie !');
      
    } catch (err: any) {
      setError(err.message);
      setConnectionStatus('error');
      console.error('❌ Erreur de connexion:', err);
    }
  };

  const refreshData = () => {
    setConnectionStatus('testing');
    setError('');
    testConnection();
  };

  if (connectionStatus === 'testing') {
    return (
      <div className="p-6 bg-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-600">Test de connexion à Supabase Production...</span>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-red-800">❌ Erreur de connexion</h3>
            <p className="text-red-600 mt-2">{error}</p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2">
          <span className="text-green-600 text-xl">✅</span>
          <h3 className="text-lg font-semibold text-green-800">
            Connexion Supabase Production réussie !
          </h3>
        </div>
        <p className="text-green-600 mt-2">
          URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}
        </p>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hôtels */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-lg mb-3">🏨 Hôtels ({data.hotels.length})</h4>
            <div className="space-y-2">
              {data.hotels.map((hotel: any) => (
                <div key={hotel.id} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">{hotel.nom}</div>
                  <div className="text-sm text-gray-600">{hotel.ville}</div>
                  <div className="text-xs text-gray-500">
                    {hotel.chambres_occupees}/{hotel.chambres_total} chambres
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Opérateurs */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-lg mb-3">👥 Opérateurs ({data.operateurs.length})</h4>
            <div className="space-y-2">
              {data.operateurs.map((operateur: any) => (
                <div key={operateur.id} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">{operateur.prenom} {operateur.nom}</div>
                  <div className="text-sm text-gray-600">{operateur.type_organisme}</div>
                  <div className="text-xs text-gray-500">{operateur.email}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Réservations */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-semibold text-lg mb-3">📅 Réservations ({data.reservations.length})</h4>
            <div className="space-y-2">
              {data.reservations.map((reservation: any) => (
                <div key={reservation.id} className="p-2 bg-gray-50 rounded">
                  <div className="font-medium">{reservation.usager}</div>
                  <div className="text-sm text-gray-600">
                    {reservation.hotels?.nom}
                  </div>
                  <div className="text-xs text-gray-500">
                    {reservation.date_arrivee} → {reservation.date_depart}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={refreshData}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Actualiser les données
        </button>
      </div>
    </div>
  );
} 