-- ============================================
-- Mini & Basket Camp - Seed Data
-- Test data for local development
-- ============================================

-- ============================================
-- TEST REGISTRATIONS
-- ============================================

INSERT INTO registrations (
    package_type,
    bus_transfer,
    genitore_nome_cognome,
    genitore_codice_fiscale,
    genitore_citta,
    genitore_cap,
    genitore_indirizzo,
    genitore_telefono,
    genitore_email,
    camper_nome_cognome,
    camper_codice_fiscale,
    camper_luogo_nascita,
    camper_data_nascita,
    camper_sesso,
    camper_citta,
    camper_cap,
    camper_indirizzo,
    camper_scuola,
    camper_classe,
    camper_taglia,
    camper_altezza,
    camper_peso,
    camper_numero_scarpe,
    camper_esperienza,
    camper_societa,
    allergie_intolleranze,
    liberatoria_foto_video,
    accettazione_regolamento,
    privacy_policy,
    status,
    payment_status
) VALUES 
-- Registration 1: Standard package, pending payment
(
    'standard',
    true,
    'Mario Rossi',
    'RSSMRA80A01H501Z',
    'Napoli',
    '80100',
    'Via Roma 123',
    '+39 333 1234567',
    'mario.rossi@email.com',
    'Luca Rossi',
    'RSSLCU12A01H501Z',
    'Napoli',
    '2012-06-15',
    'M',
    'Napoli',
    '80100',
    'Via Roma 123',
    'Scuola Media Carducci',
    '2° Media',
    'M',
    165,
    55,
    '40',
    'intermedio',
    'Basket Napoli ASD',
    NULL,
    true,
    true,
    true,
    'pending',
    'pending'
),
-- Registration 2: Alta Specializzazione, paid
(
    'alta_specializzazione',
    false,
    'Anna Bianchi',
    'BNCNNA75B02F839X',
    'Casalnuovo di Napoli',
    '80013',
    'Via Garibaldi 45',
    '+39 339 8765432',
    'anna.bianchi@email.com',
    'Sofia Bianchi',
    'BNCSFA13B02F839Y',
    'Napoli',
    '2013-02-20',
    'F',
    'Casalnuovo di Napoli',
    '80013',
    'Via Garibaldi 45',
    'IC Kennedy',
    '1° Media',
    'S',
    155,
    45,
    '37',
    'avanzato',
    'CA75 Basket Casalnuovo',
    'Intolleranza al lattosio',
    true,
    true,
    true,
    'confirmed',
    'paid'
),
-- Registration 3: Standard package, partial payment
(
    'standard',
    true,
    'Giuseppe Verde',
    'VRDGPP70C03A089K',
    'Afragola',
    '80021',
    'Corso Vittorio Emanuele 78',
    '+39 347 5551234',
    'giuseppe.verde@email.com',
    'Marco Verde',
    'VRDMRC14C03A089L',
    'Afragola',
    '2014-03-10',
    'M',
    'Afragola',
    '80021',
    'Corso Vittorio Emanuele 78',
    'Scuola Elementare De Amicis',
    '5° Elementare',
    'XS',
    140,
    38,
    '35',
    'principiante',
    NULL,
    'Allergia alle fragole',
    true,
    true,
    true,
    'pending',
    'partial'
),
-- Registration 4: Cancelled registration
(
    'standard',
    false,
    'Lucia Neri',
    'NRILCU85D04E715M',
    'Pomigliano d''Arco',
    '80038',
    'Via Nazionale 200',
    '+39 320 9876543',
    'lucia.neri@email.com',
    'Andrea Neri',
    'NRINDR15D04E715N',
    'Pomigliano d''Arco',
    '2015-04-05',
    'M',
    'Pomigliano d''Arco',
    '80038',
    'Via Nazionale 200',
    'IC Falcone',
    '4° Elementare',
    'XS',
    135,
    35,
    '34',
    'principiante',
    NULL,
    NULL,
    true,
    true,
    true,
    'cancelled',
    'refunded'
);

-- ============================================
-- TEST PAYMENTS
-- ============================================

-- Get registration IDs for payments
DO $$
DECLARE
    reg1_id UUID;
    reg2_id UUID;
    reg3_id UUID;
BEGIN
    SELECT id INTO reg1_id FROM registrations WHERE genitore_email = 'mario.rossi@email.com' LIMIT 1;
    SELECT id INTO reg2_id FROM registrations WHERE genitore_email = 'anna.bianchi@email.com' LIMIT 1;
    SELECT id INTO reg3_id FROM registrations WHERE genitore_email = 'giuseppe.verde@email.com' LIMIT 1;
    
    -- Payment for registration 2 (full payment via Stripe)
    INSERT INTO payments (registration_id, payment_method, payment_type, amount, status, stripe_payment_intent_id, stripe_session_id)
    VALUES (reg2_id, 'stripe', 'full', 80000, 'completed', 'pi_test_1234567890', 'cs_test_1234567890');
    
    -- Payment for registration 3 (deposit via bonifico)
    INSERT INTO payments (registration_id, payment_method, payment_type, amount, status, bonifico_reference)
    VALUES (reg3_id, 'bonifico', 'deposit', 20000, 'completed', 'CRO123456789');
END $$;

-- ============================================
-- TEST GALLERY PHOTOS
-- ============================================

INSERT INTO gallery_photos (url, alt_text, year, category, featured, sort_order) VALUES
('/images/gallery/allenamento-1.jpg', 'Allenamento tecnico con Coach Nappi', 2024, 'allenamenti', true, 1),
('/images/gallery/allenamento-2.jpg', 'Esercizi di palleggio', 2024, 'allenamenti', false, 2),
('/images/gallery/partita-1.jpg', 'Partita amichevole 3vs3', 2024, 'partite', true, 3),
('/images/gallery/partita-2.jpg', 'Torneo finale del camp', 2024, 'partite', false, 4),
('/images/gallery/gruppo-1.jpg', 'Foto di gruppo Camp 2024', 2024, 'gruppo', true, 5),
('/images/gallery/gruppo-2.jpg', 'Staff e partecipanti', 2024, 'gruppo', false, 6),
('/images/gallery/attivita-1.jpg', 'Attività in piscina', 2024, 'attivita', true, 7),
('/images/gallery/attivita-2.jpg', 'Giochi di team building', 2024, 'attivita', false, 8),
('/images/gallery/allenamento-2023-1.jpg', 'Sessione di tiro', 2023, 'allenamenti', false, 9),
('/images/gallery/gruppo-2023-1.jpg', 'Foto di gruppo Camp 2023', 2023, 'gruppo', true, 10);

-- ============================================
-- TEST CONTACT SUBMISSIONS
-- ============================================

INSERT INTO contact_submissions (name, email, phone, subject, message, status) VALUES
('Anna Bianchi', 'anna.bianchi@email.com', '+39 333 9876543', 'info', 'Vorrei sapere se ci sono ancora posti disponibili per il camp estivo.', 'new'),
('Giovanni Esposito', 'g.esposito@email.com', '+39 340 1112233', 'pagamenti', 'Ho effettuato il bonifico per l''iscrizione di mio figlio. Potete confermare la ricezione?', 'read'),
('Francesca Marino', 'f.marino@email.com', '+39 328 4445566', 'programma', 'Quali sono gli orari delle attività? Mia figlia ha impegni il pomeriggio.', 'responded'),
('Roberto Ferrara', 'r.ferrara@email.com', '+39 345 7778899', 'iscrizione', 'Vorrei iscrivere due bambini. È previsto uno sconto per fratelli?', 'new');