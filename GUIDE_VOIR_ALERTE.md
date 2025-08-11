# Guide pour voir l'alerte de fin de séjour

## ✅ Modifications effectuées

L'alerte de fin de séjour a été intégrée avec succès dans votre application ! Voici ce qui a été créé :

### 1. Hook personnalisé (`hooks/useEndingStays.ts`)
- Récupère les réservations qui se terminent aujourd'hui ou qui sont déjà terminées
- Utilise des données de démonstration pour l'instant
- Calcule l'urgence de chaque séjour

### 2. Composant d'alerte (`components/features/EndingStaysAlert.tsx`)
- Affiche les alertes avec un design moderne
- Différencie les séjours terminés, qui se terminent aujourd'hui, et en retard
- Permet d'actualiser les données et de voir plus d'alertes

### 3. Intégration dans le tableau de bord
- L'alerte est maintenant visible dans l'onglet "Tableau de bord" (`ReservationsAvailability`)
- Elle apparaît en haut de la page, avant la recherche de disponibilité

## 🔍 Comment voir les modifications

### Option 1 : Rafraîchir votre navigateur
1. Allez sur `http://localhost:3000`
2. Appuyez sur `Ctrl + R` (ou `Cmd + R` sur Mac) pour rafraîchir la page
3. Cliquez sur l'onglet "Tableau de bord" dans la sidebar
4. Vous devriez voir l'alerte orange en haut de la page

### Option 2 : Vider le cache du navigateur
Si vous ne voyez toujours pas les modifications :
1. Appuyez sur `Ctrl + Shift + R` (ou `Cmd + Shift + R` sur Mac)
2. Ou ouvrez les outils de développement (`F12`) et faites un clic droit sur le bouton de rafraîchissement → "Vider le cache et recharger"

### Option 3 : Vérifier les erreurs
1. Ouvrez les outils de développement (`F12`)
2. Allez dans l'onglet "Console"
3. Vérifiez s'il y a des erreurs en rouge
4. Si vous voyez des erreurs, partagez-les avec moi

## 🎯 Ce que vous devriez voir

L'alerte devrait afficher :
- Un titre "Alertes de fin de séjour" avec une icône d'avertissement
- Un badge indiquant le nombre d'alertes
- Une liste de séjours avec :
  - Chambre 101 (Hôtel Central) : Séjour qui se termine aujourd'hui
  - Chambre 102 (Hôtel Central) : Séjour déjà terminé hier
  - Chambre 201 (Résidence du Port) : Séjour qui se terminent demain
  - Chambre 103 (Hôtel Central) : Séjour terminé

## 🔧 Prochaines étapes

Une fois que vous voyez l'alerte :
1. Testez le bouton "Actualiser"
2. Testez le bouton "Voir tout" pour afficher plus d'alertes
3. Vérifiez que les couleurs changent selon l'urgence (rouge pour terminé, orange pour aujourd'hui, jaune pour demain)

## 🆘 Si vous ne voyez toujours pas les modifications

1. **Vérifiez que le serveur fonctionne** : Le terminal devrait afficher des logs Next.js
2. **Vérifiez l'URL** : Assurez-vous d'être sur `http://localhost:3000`
3. **Vérifiez l'onglet** : Cliquez bien sur "Tableau de bord" dans la sidebar
4. **Partagez les erreurs** : Si vous voyez des erreurs dans la console, partagez-les

## 📝 Données de démonstration

Pour l'instant, l'alerte utilise des données simulées car la base de données locale n'est pas accessible. Les données incluent :
- Séjours qui se terminent aujourd'hui
- Séjours déjà terminés
- Séjours qui se terminent demain

Une fois que votre base de données Supabase sera configurée, l'alerte utilisera les vraies données.
