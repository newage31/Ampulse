const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase Production
const PROD_SUPABASE_URL = 'https://xlehtdjshcurmrxedefi.supabase.co';
const PROD_SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTgzOTIxMywiZXhwIjoyMDY3NDE1MjEzfQ.fuZ6eQXLJOGiKvN7mTHpJv3F42PfnwtEFJmIyzBJYeY';

const prodClient = createClient(PROD_SUPABASE_URL, PROD_SUPABASE_SERVICE_ROLE_KEY);

console.log('🚀 Migration vers Supabase Production');
console.log('=====================================\n');

// Données synthétiques pour la migration
const syntheticData = {
  hotels: [
    {
      nom: "Hôtel Central",
      adresse: "123 rue de la Paix",
      ville: "Paris",
      code_postal: "75001",
      telephone: "01.42.00.01.01",
      email: "contact@hotel-central.fr",
      gestionnaire: "Jean Dupont",
      statut: "ACTIF",
      chambres_total: 50,
      chambres_occupees: 35,
      taux_occupation: 70.00
    },
    {
      nom: "Résidence Saint-Martin",
      adresse: "456 avenue des Champs",
      ville: "Paris",
      code_postal: "75008",
      telephone: "01.42.00.02.02",
      email: "contact@residence-saint-martin.fr",
      gestionnaire: "Marie Martin",
      statut: "ACTIF",
      chambres_total: 30,
      chambres_occupees: 25,
      taux_occupation: 83.33
    },
    {
      nom: "Hôtel du Commerce",
      adresse: "789 boulevard Haussmann",
      ville: "Paris",
      code_postal: "75009",
      telephone: "01.42.00.03.03",
      email: "contact@hotel-commerce.fr",
      gestionnaire: "Pierre Durand",
      statut: "ACTIF",
      chambres_total: 40,
      chambres_occupees: 28,
      taux_occupation: 70.00
    }
  ],
  operateursSociaux: [
    {
      nom: "Dupont",
      prenom: "Sophie",
      email: "sophie.dupont@asso.fr",
      telephone: "01.42.00.10.10",
      type_organisme: "Association",
      adresse: "123 rue de la Solidarité",
      ville: "Paris",
      code_postal: "75011",
      statut: "actif"
    },
    {
      nom: "Martin",
      prenom: "Jean",
      email: "jean.martin@ccas.fr",
      telephone: "01.42.00.11.11",
      type_organisme: "CCAS",
      adresse: "456 avenue de l'Insertion",
      ville: "Paris",
      code_postal: "75012",
      statut: "actif"
    },
    {
      nom: "Bernard",
      prenom: "Marie",
      email: "marie.bernard@fondation.fr",
      telephone: "01.42.00.12.12",
      type_organisme: "Fondation",
      adresse: "789 boulevard de l'Accueil",
      ville: "Paris",
      code_postal: "75013",
      statut: "actif"
    }
  ],
  conventionsPrix: [
    {
      operateur_id: 1,
      hotel_id: 1,
      prix_nuit: 45.00,
      date_debut: "2024-01-01",
      date_fin: "2024-12-31",
      statut: "active"
    },
    {
      operateur_id: 1,
      hotel_id: 2,
      prix_nuit: 50.00,
      date_debut: "2024-01-01",
      date_fin: "2024-12-31",
      statut: "active"
    },
    {
      operateur_id: 2,
      hotel_id: 1,
      prix_nuit: 42.00,
      date_debut: "2024-01-01",
      date_fin: "2024-12-31",
      statut: "active"
    },
    {
      operateur_id: 2,
      hotel_id: 3,
      prix_nuit: 48.00,
      date_debut: "2024-01-01",
      date_fin: "2024-12-31",
      statut: "active"
    },
    {
      operateur_id: 3,
      hotel_id: 2,
      prix_nuit: 52.00,
      date_debut: "2024-01-01",
      date_fin: "2024-12-31",
      statut: "active"
    }
  ],
  reservations: [
    {
      hotel_id: 1,
      operateur_id: 1,
      usager: "Jean Dubois",
      date_arrivee: "2024-01-15",
      date_depart: "2024-02-15",
      nombre_personnes: 1,
      statut: "EN_COURS",
      prix_total: 1350.00,
      notes: "Accompagnement social requis"
    },
    {
      hotel_id: 2,
      operateur_id: 2,
      usager: "Marie Martin",
      date_arrivee: "2024-01-20",
      date_depart: "2024-03-20",
      nombre_personnes: 2,
      statut: "EN_COURS",
      prix_total: 3000.00,
      notes: "Famille avec enfant"
    },
    {
      hotel_id: 3,
      operateur_id: 3,
      usager: "Pierre Durand",
      date_arrivee: "2024-02-01",
      date_depart: "2024-02-28",
      nombre_personnes: 1,
      statut: "EN_COURS",
      prix_total: 1344.00,
      notes: "Sortie d'hôpital"
    }
  ],
  processusReservations: [
    {
      reservation_id: 1,
      etape: "Demande initiale",
      statut: "termine",
      commentaires: "Demande reçue et validée"
    },
    {
      reservation_id: 1,
      etape: "Vérification disponibilité",
      statut: "termine",
      commentaires: "Chambre disponible confirmée"
    },
    {
      reservation_id: 1,
      etape: "Accueil",
      statut: "en_cours",
      commentaires: "Accueil en cours"
    },
    {
      reservation_id: 2,
      etape: "Demande initiale",
      statut: "termine",
      commentaires: "Demande reçue"
    },
    {
      reservation_id: 2,
      etape: "Vérification disponibilité",
      statut: "termine",
      commentaires: "Chambre familiale disponible"
    }
  ],
  conversations: [
    {
      operateur_id: 1,
      sujet: "Demande de prolongation",
      statut: "ouverte"
    },
    {
      operateur_id: 2,
      sujet: "Question sur les tarifs",
      statut: "ouverte"
    },
    {
      operateur_id: 3,
      sujet: "Nouvelle demande d'hébergement",
      statut: "ouverte"
    }
  ],
  messages: [
    {
      conversation_id: 1,
      expediteur_id: 1,
      contenu: "Bonjour, nous avons une demande de prolongation pour M. Dubois.",
      lu: false
    },
    {
      conversation_id: 1,
      expediteur_id: null,
      contenu: "Bonjour, pouvez-vous me donner plus de détails ?",
      lu: true
    },
    {
      conversation_id: 2,
      expediteur_id: 2,
      contenu: "Quels sont les tarifs pour une chambre double ?",
      lu: false
    }
  ],
  users: [
    {
      email: "admin@ampulse.fr",
      nom: "Admin",
      prenom: "Système",
      role: "admin",
      statut: "actif",
      hotel_id: null
    },
    {
      email: "gestionnaire1@hotel-central.fr",
      nom: "Dupont",
      prenom: "Jean",
      role: "gestionnaire",
      statut: "actif",
      hotel_id: 1
    },
    {
      email: "gestionnaire2@residence-saint-martin.fr",
      nom: "Martin",
      prenom: "Marie",
      role: "gestionnaire",
      statut: "actif",
      hotel_id: 2
    }
  ],
  documentTemplates: [
    {
      nom: "Template Réservation Standard",
      type_document: "reservation",
      contenu_template: "Réservation pour {{usager}} du {{date_arrivee}} au {{date_depart}}",
      variables: '{"usager": "string", "date_arrivee": "date", "date_depart": "date"}',
      actif: true
    },
    {
      nom: "Template Facture",
      type_document: "facture",
      contenu_template: "Facture pour {{usager}} - Montant: {{montant}}€",
      variables: '{"usager": "string", "montant": "number"}',
      actif: true
    }
  ],
  notifications: [
    {
      user_id: 1,
      type: "reservation",
      titre: "Nouvelle réservation",
      message: "Une nouvelle réservation a été créée",
      lu: false
    },
    {
      user_id: 2,
      type: "system",
      titre: "Maintenance",
      message: "Maintenance prévue ce soir",
      lu: true
    }
  ],
  auditLogs: [
    {
      user_id: 1,
      action: "CREATE",
      table_name: "reservations",
      record_id: 1,
      nouvelles_valeurs: '{"usager": "Jean Dubois"}',
      ip_address: "127.0.0.1"
    },
    {
      user_id: 2,
      action: "UPDATE",
      table_name: "hotels",
      record_id: 1,
      anciennes_valeurs: '{"chambres_occupees": 30}',
      nouvelles_valeurs: '{"chambres_occupees": 35}',
      ip_address: "127.0.0.1"
    }
  ]
};

async function migrateData() {
  try {
    console.log('📊 Préparation des données synthétiques...');
    
    console.log('\n🏨 Migration des hôtels...');
    const { data: hotels, error: hotelsError } = await prodClient
      .from('hotels')
      .insert(syntheticData.hotels)
      .select();
    
    if (hotelsError) {
      console.error('❌ Erreur migration hôtels:', JSON.stringify(hotelsError, null, 2));
      return false;
    }
    console.log(`✅ ${hotels.length} hôtels migrés`);
    
    console.log('\n👥 Migration des opérateurs sociaux...');
    const { data: operateurs, error: operateursError } = await prodClient
      .from('operateurs_sociaux')
      .insert(syntheticData.operateursSociaux)
      .select();
    
    if (operateursError) {
      console.error('❌ Erreur migration opérateurs:', JSON.stringify(operateursError, null, 2));
      return false;
    }
    console.log(`✅ ${operateurs.length} opérateurs migrés`);
    
    console.log('\n💰 Migration des conventions de prix...');
    const { data: conventions, error: conventionsError } = await prodClient
      .from('conventions_prix')
      .insert(syntheticData.conventionsPrix)
      .select();
    
    if (conventionsError) {
      console.error('❌ Erreur migration conventions:', JSON.stringify(conventionsError, null, 2));
      return false;
    }
    console.log(`✅ ${conventions.length} conventions migrées`);
    
    console.log('\n📅 Migration des réservations...');
    const { data: reservations, error: reservationsError } = await prodClient
      .from('reservations')
      .insert(syntheticData.reservations)
      .select();
    
    if (reservationsError) {
      console.error('❌ Erreur migration réservations:', JSON.stringify(reservationsError, null, 2));
      return false;
    }
    console.log(`✅ ${reservations.length} réservations migrées`);
    
    console.log('\n🔄 Migration des processus de réservation...');
    const { data: processus, error: processusError } = await prodClient
      .from('processus_reservations')
      .insert(syntheticData.processusReservations)
      .select();
    
    if (processusError) {
      console.error('❌ Erreur migration processus:', JSON.stringify(processusError, null, 2));
      return false;
    }
    console.log(`✅ ${processus.length} processus migrés`);
    
    console.log('\n💬 Migration des conversations...');
    const { data: conversations, error: conversationsError } = await prodClient
      .from('conversations')
      .insert(syntheticData.conversations)
      .select();
    
    if (conversationsError) {
      console.error('❌ Erreur migration conversations:', JSON.stringify(conversationsError, null, 2));
      return false;
    }
    console.log(`✅ ${conversations.length} conversations migrées`);
    
    console.log('\n💌 Migration des messages...');
    const { data: messages, error: messagesError } = await prodClient
      .from('messages')
      .insert(syntheticData.messages)
      .select();
    
    if (messagesError) {
      console.error('❌ Erreur migration messages:', JSON.stringify(messagesError, null, 2));
      return false;
    }
    console.log(`✅ ${messages.length} messages migrés`);
    
    console.log('\n👤 Migration des utilisateurs...');
    const { data: users, error: usersError } = await prodClient
      .from('users')
      .insert(syntheticData.users)
      .select();
    
    if (usersError) {
      console.error('❌ Erreur migration utilisateurs:', JSON.stringify(usersError, null, 2));
      return false;
    }
    console.log(`✅ ${users.length} utilisateurs migrés`);
    
    console.log('\n📄 Migration des templates de documents...');
    const { data: templates, error: templatesError } = await prodClient
      .from('document_templates')
      .insert(syntheticData.documentTemplates)
      .select();
    
    if (templatesError) {
      console.error('❌ Erreur migration templates:', JSON.stringify(templatesError, null, 2));
      return false;
    }
    console.log(`✅ ${templates.length} templates migrés`);
    
    console.log('\n🔔 Migration des notifications...');
    const { data: notifications, error: notificationsError } = await prodClient
      .from('notifications')
      .insert(syntheticData.notifications)
      .select();
    
    if (notificationsError) {
      console.error('❌ Erreur migration notifications:', JSON.stringify(notificationsError, null, 2));
      return false;
    }
    console.log(`✅ ${notifications.length} notifications migrées`);
    
    console.log('\n📝 Migration des logs d\'audit...');
    const { data: auditLogs, error: auditLogsError } = await prodClient
      .from('audit_logs')
      .insert(syntheticData.auditLogs)
      .select();
    
    if (auditLogsError) {
      console.error('❌ Erreur migration logs d\'audit:', JSON.stringify(auditLogsError, null, 2));
      return false;
    }
    console.log(`✅ ${auditLogs.length} logs d'audit migrés`);
    
    console.log('\n🎉 Migration terminée avec succès !');
    console.log('=====================================');
    console.log(`📊 Résumé de la migration:`);
    console.log(`   🏨 Hôtels: ${hotels.length}`);
    console.log(`   👥 Opérateurs: ${operateurs.length}`);
    console.log(`   💰 Conventions: ${conventions.length}`);
    console.log(`   📅 Réservations: ${reservations.length}`);
    console.log(`   🔄 Processus: ${processus.length}`);
    console.log(`   💬 Conversations: ${conversations.length}`);
    console.log(`   💌 Messages: ${messages.length}`);
    console.log(`   👤 Utilisateurs: ${users.length}`);
    console.log(`   📄 Templates: ${templates.length}`);
    console.log(`   🔔 Notifications: ${notifications.length}`);
    console.log(`   📝 Logs d'audit: ${auditLogs.length}`);
    
    console.log('\n🔗 URL de votre projet Supabase:');
    console.log(`   🌐 Dashboard: https://supabase.com/dashboard/project/xlehtdjshcurmrxedefi`);
    console.log(`   📊 Studio: https://xlehtdjshcurmrxedefi.supabase.co`);
    
    console.log('\n🔑 Clés d\'accès:');
    console.log(`   🔗 URL: ${PROD_SUPABASE_URL}`);
    console.log(`   🔑 Clé anonyme: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsZWh0ZGpzaGN1cm1yeGVkZWZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MzkyMTMsImV4cCI6MjA2NzQxNTIxM30.rUTpcdCOEzrJX_WEeDh8BAI7sMU2F55fZbyaZeDuSWI`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
    return false;
  }
}

// Lancer la migration
migrateData(); 