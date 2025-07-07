-- Migration 006: Fonction pour la réservation rapide
-- Ajout d'une fonction pour récupérer les vraies chambres disponibles

-- Fonction pour récupérer les chambres disponibles avec leurs détails
CREATE OR REPLACE FUNCTION get_available_rooms_with_details(
    p_date_debut DATE,
    p_date_fin DATE,
    p_hotel_id INTEGER DEFAULT NULL,
    p_room_type VARCHAR(50) DEFAULT NULL,
    p_capacity INTEGER DEFAULT NULL
)
RETURNS TABLE(
    room_id INTEGER,
    hotel_id INTEGER,
    hotel_nom VARCHAR(255),
    hotel_adresse VARCHAR(255),
    hotel_ville VARCHAR(100),
    room_numero VARCHAR(20),
    room_type VARCHAR(50),
    room_prix DECIMAL(10,2),
    room_statut VARCHAR(20),
    room_description TEXT,
    is_available BOOLEAN,
    price_per_night DECIMAL(10,2),
    total_price DECIMAL(10,2),
    capacity INTEGER,
    characteristics TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id as room_id,
        h.id as hotel_id,
        h.nom as hotel_nom,
        h.adresse as hotel_adresse,
        h.ville as hotel_ville,
        r.numero as room_numero,
        r.type as room_type,
        r.prix as room_prix,
        r.statut as room_statut,
        r.description as room_description,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM public.reservations res
                WHERE res.chambre_id = r.id
                AND res.statut IN ('CONFIRMEE', 'EN_COURS')
                AND (
                    (res.date_arrivee <= p_date_fin AND res.date_depart >= p_date_debut)
                )
            ) THEN FALSE
            ELSE TRUE
        END as is_available,
        r.prix as price_per_night,
        r.prix * EXTRACT(DAY FROM (p_date_fin - p_date_debut)) as total_price,
        CASE 
            WHEN r.type = 'Suite' THEN 3
            WHEN r.type = 'Familiale' THEN 4
            WHEN r.type = 'Double' THEN 2
            ELSE 1
        END as capacity,
        ARRAY[
            'WiFi',
            'TV',
            'Salle de bain privée',
            CASE WHEN r.type IN ('Suite', 'Familiale') THEN 'Balcon' ELSE NULL END,
            CASE WHEN r.type = 'Suite' THEN 'Mini-bar' ELSE NULL END
        ] FILTER (WHERE x IS NOT NULL) as characteristics
    FROM public.rooms r
    INNER JOIN public.hotels h ON r.hotel_id = h.id
    WHERE r.statut = 'disponible'
    AND (p_hotel_id IS NULL OR h.id = p_hotel_id)
    AND (p_room_type IS NULL OR r.type = p_room_type)
    AND (p_capacity IS NULL OR 
        CASE 
            WHEN r.type = 'Suite' THEN 3 >= p_capacity
            WHEN r.type = 'Familiale' THEN 4 >= p_capacity
            WHEN r.type = 'Double' THEN 2 >= p_capacity
            ELSE 1 >= p_capacity
        END
    )
    ORDER BY h.nom, r.numero;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour créer une réservation rapide
CREATE OR REPLACE FUNCTION create_quick_reservation(
    p_usager_nom VARCHAR(100),
    p_usager_prenom VARCHAR(100),
    p_usager_telephone VARCHAR(20),
    p_usager_email VARCHAR(255),
    p_room_id INTEGER,
    p_operateur_id INTEGER,
    p_date_arrivee DATE,
    p_date_depart DATE,
    p_nombre_personnes INTEGER,
    p_notes TEXT DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    v_usager_id INTEGER;
    v_hotel_id INTEGER;
    v_prix DECIMAL(10,2);
    v_duree INTEGER;
    v_prescripteur VARCHAR(255);
    v_reservation_id INTEGER;
BEGIN
    -- Récupérer les informations de la chambre et de l'hôtel
    SELECT hotel_id, prix INTO v_hotel_id, v_prix
    FROM public.rooms
    WHERE id = p_room_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Chambre non trouvée';
    END IF;
    
    -- Récupérer le prescripteur depuis l'opérateur
    SELECT organisation INTO v_prescripteur
    FROM public.operateurs_sociaux
    WHERE id = p_operateur_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Opérateur non trouvé';
    END IF;
    
    -- Calculer la durée
    v_duree := EXTRACT(DAY FROM (p_date_depart - p_date_arrivee));
    
    -- Créer l'usager
    INSERT INTO public.usagers (nom, prenom, telephone, email, statut)
    VALUES (p_usager_nom, p_usager_prenom, p_usager_telephone, p_usager_email, 'heberge')
    RETURNING id INTO v_usager_id;
    
    -- Créer la réservation
    INSERT INTO public.reservations (
        usager_id, 
        chambre_id, 
        hotel_id, 
        date_arrivee, 
        date_depart, 
        statut, 
        prescripteur, 
        prix, 
        duree, 
        operateur_id, 
        notes
    )
    VALUES (
        v_usager_id,
        p_room_id,
        v_hotel_id,
        p_date_arrivee,
        p_date_depart,
        'CONFIRMEE',
        v_prescripteur,
        v_prix * v_duree,
        v_duree,
        p_operateur_id,
        p_notes
    )
    RETURNING id INTO v_reservation_id;
    
    -- Mettre à jour le statut de la chambre
    UPDATE public.rooms 
    SET statut = 'occupee'
    WHERE id = p_room_id;
    
    RETURN v_reservation_id;
END;
$$ LANGUAGE plpgsql;

-- Index pour améliorer les performances de la recherche de chambres
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_type ON public.rooms(hotel_id, type);
CREATE INDEX IF NOT EXISTS idx_reservations_dates_overlap ON public.reservations(date_arrivee, date_depart);

-- Commentaires pour documenter les nouvelles fonctions
COMMENT ON FUNCTION get_available_rooms_with_details IS 'Récupère les chambres disponibles avec leurs détails pour une période donnée';
COMMENT ON FUNCTION create_quick_reservation IS 'Crée une réservation rapide avec création automatique de l''usager'; 