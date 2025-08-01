# 📋 Instructions pour créer les tables Supabase manuellement

## 🎯 Objectif
Créer les tables nécessaires dans votre base de données Supabase via l'interface web.

## 🔗 Accès au Dashboard Supabase

1. **Ouvrez votre navigateur** et allez sur : https://supabase.com/dashboard
2. **Connectez-vous** avec votre compte Supabase
3. **Sélectionnez votre projet** : `lirebtpsrbdgkdeyggdr`

## 📊 Création des tables

### 1. Table `clients`

1. **Allez dans l'onglet "Table Editor"**
2. **Cliquez sur "New Table"**
3. **Nom de la table** : `clients`
4. **Colonnes** :

```sql
id: int8 (Primary Key, Identity)
numero_client: varchar(50)
nom: varchar(100)
prenom: varchar(100)
raison_sociale: varchar(200)
email: varchar(255)
telephone: varchar(20)
adresse: text
code_postal: varchar(10)
ville: varchar(100)
pays: varchar(100) [Default: 'France']
statut: varchar(20) [Default: 'actif']
notes: text
conditions_paiement: varchar(100)
siret: varchar(14)
secteur_activite: varchar(100)
nombre_employes: int4
numero_agrement: varchar(50)
nombre_adherents: int4
nombre_enfants: int4
created_at: timestamptz [Default: now()]
updated_at: timestamptz [Default: now()]
created_by: uuid
updated_by: uuid
```

### 2. Table `rooms`

1. **Cliquez sur "New Table"**
2. **Nom de la table** : `rooms`
3. **Colonnes** :

```sql
id: int8 (Primary Key, Identity)
name: varchar(100) [Not Null]
description: text
capacity: int4
price_per_hour: numeric(10,2)
price_per_day: numeric(10,2)
is_active: bool [Default: true]
created_at: timestamptz [Default: now()]
updated_at: timestamptz [Default: now()]
```

### 3. Table `reservations`

1. **Cliquez sur "New Table"**
2. **Nom de la table** : `reservations`
3. **Colonnes** :

```sql
id: int8 (Primary Key, Identity)
room_id: int8 [Not Null, Foreign Key -> rooms.id]
client_id: int8 [Not Null, Foreign Key -> clients.id]
start_time: timestamptz [Not Null]
end_time: timestamptz [Not Null]
total_price: numeric(10,2)
status: varchar(20) [Default: 'confirmed']
notes: text
created_at: timestamptz [Default: now()]
updated_at: timestamptz [Default: now()]
```

## 📝 Insertion de données de test

### Clients de test

1. **Allez dans la table `clients`**
2. **Cliquez sur "Insert Row"**
3. **Insérez ces données** :

**Client 1 :**
- numero_client: `CLI001`
- nom: `Dupont`
- prenom: `Jean`
- email: `jean.dupont@email.com`
- telephone: `0123456789`
- adresse: `123 Rue de la Paix`
- code_postal: `75001`
- ville: `Paris`
- statut: `actif`

**Client 2 :**
- numero_client: `ENT001`
- raison_sociale: `Entreprise Test SARL`
- email: `contact@entreprise-test.com`
- telephone: `0987654321`
- adresse: `456 Avenue des Champs`
- code_postal: `69001`
- ville: `Lyon`
- statut: `actif`
- siret: `12345678901234`

**Client 3 :**
- numero_client: `ASS001`
- raison_sociale: `Association Culturelle`
- email: `info@association-culturelle.fr`
- telephone: `0555666777`
- adresse: `789 Boulevard de la Culture`
- code_postal: `31000`
- ville: `Toulouse`
- statut: `actif`
- nombre_adherents: `150`
- nombre_enfants: `45`

### Salles de test

1. **Allez dans la table `rooms`**
2. **Cliquez sur "Insert Row"**
3. **Insérez ces données** :

**Salle 1 :**
- name: `Salle de Réunion A`
- description: `Salle de réunion moderne avec vidéoprojecteur`
- capacity: `20`
- price_per_hour: `50.00`
- price_per_day: `400.00`
- is_active: `true`

**Salle 2 :**
- name: `Salle de Formation B`
- description: `Salle de formation avec tableau interactif`
- capacity: `15`
- price_per_hour: `40.00`
- price_per_day: `320.00`
- is_active: `true`

**Salle 3 :**
- name: `Bureau Privé C`
- description: `Bureau privé avec équipement complet`
- capacity: `4`
- price_per_hour: `25.00`
- price_per_day: `200.00`
- is_active: `true`

## ✅ Vérification

1. **Allez dans l'onglet "Table Editor"**
2. **Vérifiez que les 3 tables existent** : `clients`, `rooms`, `reservations`
3. **Vérifiez que les données de test sont présentes**
4. **Testez une requête simple** dans l'onglet "SQL Editor" :

```sql
SELECT COUNT(*) FROM clients;
SELECT COUNT(*) FROM rooms;
```

## 🎉 Résultat attendu

- ✅ 3 tables créées
- ✅ 3 clients de test insérés
- ✅ 3 salles de test insérées
- ✅ Base de données prête pour l'application

## 🔧 URL de votre projet

- **Dashboard** : https://supabase.com/dashboard/project/lirebtpsrbdgkdeyggdr
- **API URL** : https://lirebtpsrbdgkdeyggdr.supabase.co

---

**Note** : Une fois les tables créées, votre application pourra se connecter et utiliser la base de données normalement. 