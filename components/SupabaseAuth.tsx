'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

export default function SupabaseAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    // Vérifier l'utilisateur actuel
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Compte créé avec succès ! Vérifiez votre email.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: 'Connexion réussie !' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setMessage({ type: 'success', text: 'Déconnexion réussie !' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Veuillez entrer votre email' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Lien magique envoyé ! Vérifiez votre email.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Authentification Supabase
              <Badge variant="default">Connecté</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Utilisateur connecté :</h3>
              <p className="text-green-700">{user.email}</p>
              <p className="text-sm text-green-600">ID: {user.id}</p>
              <p className="text-sm text-green-600">
                Créé le: {new Date(user.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <Button onClick={handleSignOut} variant="destructive">
              Se déconnecter
            </Button>

            {message && (
              <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Authentification Supabase
            <Badge variant="secondary">Non connecté</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
              />
            </div>

            {!isSignUp && (
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  required
                />
              </div>
            )}

            {isSignUp && (
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Créez un mot de passe"
                  required
                  minLength={6}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="flex-1"
              >
                {isSignUp ? 'Créer un compte' : 'Se connecter'}
              </Button>
              <Button 
                type="button" 
                onClick={() => setIsSignUp(!isSignUp)}
                variant="outline"
              >
                {isSignUp ? 'Connexion' : 'Inscription'}
              </Button>
            </div>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou
              </span>
            </div>
          </div>

          <Button 
            onClick={handleMagicLink} 
            disabled={loading || !email}
            variant="outline"
            className="w-full"
          >
            Envoyer un lien magique
          </Button>

          {message && (
            <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 