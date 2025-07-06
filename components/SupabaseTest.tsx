'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export default function SupabaseTest() {

  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [testData, setTestData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setConnectionStatus('testing');
      setError('');

      // Test de connexion basique
      const { data, error: connectionError } = await supabase
        .from('hotels')
        .select('*')
        .limit(1);

      if (connectionError) {
        throw connectionError;
      }

      setConnectionStatus('connected');
      setTestData(data);
    } catch (err: any) {
      setConnectionStatus('error');
      setError(err.message || 'Erreur de connexion');
    }
  };

  const testAllTables = async () => {
    try {
      const tables = ['hotels', 'operateurs', 'clients', 'chambres', 'reservations'];
      const results: any = {};

      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(3);

        if (error) {
          results[table] = { error: error.message };
        } else {
          results[table] = { count: data?.length || 0, sample: data };
        }
      }

      setTestData(results);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Connecté';
      case 'error': return 'Erreur';
      default: return 'Test en cours...';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Test de connexion Supabase
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
            <Badge variant={connectionStatus === 'connected' ? 'default' : 'destructive'}>
              {getStatusText()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={testConnection} disabled={connectionStatus === 'testing'}>
              Tester la connexion
            </Button>
            <Button onClick={testAllTables} variant="outline">
              Tester toutes les tables
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">Erreur :</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {testData && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Données de test :</h3>
              
              {Array.isArray(testData) ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">Table hotels :</p>
                  <pre className="text-sm mt-2 overflow-auto">
                    {JSON.stringify(testData, null, 2)}
                  </pre>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(testData).map(([table, data]: [string, any]) => (
                    <div key={table} className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">Table {table} :</p>
                      {data.error ? (
                        <p className="text-red-600 text-sm mt-1">{data.error}</p>
                      ) : (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Nombre d'enregistrements : {data.count}</p>
                          <pre className="text-sm mt-2 overflow-auto max-h-40">
                            {JSON.stringify(data.sample, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 