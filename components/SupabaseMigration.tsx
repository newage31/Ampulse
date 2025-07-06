'use client';

import { useState, useEffect } from 'react';
import { SupabaseMigrationService, MigrationResult } from '../utils/supabaseMigration';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

export default function SupabaseMigration() {
  const [migrationStatus, setMigrationStatus] = useState<{
    hotels: number;
    operateurs: number;
    clients: number;
    chambres: number;
    reservations: number;
  }>({
    hotels: 0,
    operateurs: 0,
    clients: 0,
    chambres: 0,
    reservations: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MigrationResult[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const status = await SupabaseMigrationService.checkMigrationStatus();
      setMigrationStatus(status);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const migrateHotels = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await SupabaseMigrationService.migrateHotels();
      setResults(prev => [...prev, result]);
      await checkStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateOperateurs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await SupabaseMigrationService.migrateOperateurs();
      setResults(prev => [...prev, result]);
      await checkStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateClients = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await SupabaseMigrationService.migrateClients();
      setResults(prev => [...prev, result]);
      await checkStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateReservations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await SupabaseMigrationService.migrateReservations();
      setResults(prev => [...prev, result]);
      await checkStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const migrateAll = async () => {
    setIsLoading(true);
    setError('');
    setResults([]);
    try {
      const results = await SupabaseMigrationService.migrateAll();
      setResults(results);
      await checkStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllData = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer toutes les données ?')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const result = await SupabaseMigrationService.clearAllData();
      setResults([result]);
      await checkStatus();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Migration des données vers Supabase</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* État actuel */}
          <div>
            <h3 className="text-lg font-semibold mb-4">État actuel de la base de données :</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{migrationStatus.hotels}</div>
                <div className="text-sm text-gray-600">Hôtels</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{migrationStatus.operateurs}</div>
                <div className="text-sm text-gray-600">Opérateurs</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{migrationStatus.clients}</div>
                <div className="text-sm text-gray-600">Clients</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{migrationStatus.chambres}</div>
                <div className="text-sm text-gray-600">Chambres</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{migrationStatus.reservations}</div>
                <div className="text-sm text-gray-600">Réservations</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Actions de migration :</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={migrateHotels} 
                disabled={isLoading}
                variant="outline"
              >
                Migrer les hôtels
              </Button>
              <Button 
                onClick={migrateOperateurs} 
                disabled={isLoading}
                variant="outline"
              >
                Migrer les opérateurs
              </Button>
              <Button 
                onClick={migrateClients} 
                disabled={isLoading}
                variant="outline"
              >
                Migrer les clients
              </Button>
              <Button 
                onClick={migrateReservations} 
                disabled={isLoading}
                variant="outline"
              >
                Migrer les réservations
              </Button>
              <Button 
                onClick={migrateAll} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Migration complète
              </Button>
              <Button 
                onClick={clearAllData} 
                disabled={isLoading}
                variant="destructive"
              >
                Nettoyer tout
              </Button>
              <Button 
                onClick={checkStatus} 
                disabled={isLoading}
                variant="ghost"
              >
                Actualiser
              </Button>
            </div>
          </div>

          {/* Erreurs */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Résultats */}
          {results.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Résultats de la migration :</h3>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg border ${
                      result.success 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={result.success ? 'default' : 'destructive'}>
                        {result.success ? 'Succès' : 'Erreur'}
                      </Badge>
                      <span className="font-medium">{result.message}</span>
                      {result.count && (
                        <span className="text-sm text-gray-600">
                          ({result.count} enregistrements)
                        </span>
                      )}
                    </div>
                    {result.error && (
                      <p className="text-sm text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 