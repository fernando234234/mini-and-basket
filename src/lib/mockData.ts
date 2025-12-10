import { GalleryPhoto } from '@/types/gallery'

// Mock Registration interface for admin dashboard (extended for display purposes)
export interface MockRegistration {
  id?: string
  created_at?: string
  
  // Package Selection
  package_type: 'standard' | 'alta_specializzazione'
  bus_transfer: boolean
  
  // Parent/Guardian Information
  genitore_nome_cognome: string
  genitore_codice_fiscale?: string
  genitore_citta: string
  genitore_cap: string
  genitore_indirizzo: string
  genitore_telefono: string
  genitore_email: string
  
  // Participant Information
  camper_nome_cognome: string
  camper_codice_fiscale: string
  camper_luogo_nascita: string
  camper_data_nascita: string
  camper_sesso: 'M' | 'F'
  camper_citta: string
  camper_cap: string
  camper_indirizzo: string
  camper_scuola: string
  camper_classe: string
  camper_taglia: 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL'
  camper_altezza: number
  camper_peso: number
  camper_numero_scarpe: string
  
  // Experience Level
  camper_esperienza: 'principiante' | 'intermedio' | 'avanzato'
  camper_societa?: string
  
  // Medical Information
  allergie_intolleranze?: string
  patologie_note?: string
  terapie_in_corso?: string
  
  // Consents
  liberatoria_foto_video: boolean
  accettazione_regolamento: boolean
  privacy_policy: boolean
  
  // Status
  status: 'pending' | 'confirmed' | 'cancelled'
  
  // Payment
  payment_status?: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded'
  payment_type?: 'full' | 'deposit'
  amount_paid?: number
  amount_due?: number
  stripe_session_id?: string
  payment_date?: string
}

// Mock Registrations Data - Diverse data for testing
export const mockRegistrations: MockRegistration[] = [
  {
    id: '1a2b3c4d',
    created_at: '2025-01-15T10:30:00Z',
    package_type: 'standard',
    bus_transfer: false,
    camper_nome_cognome: 'Marco Rossi',
    camper_codice_fiscale: 'RSSMRC15C20H501Z',
    camper_luogo_nascita: 'Roma',
    camper_data_nascita: '2015-03-20',
    camper_sesso: 'M',
    camper_citta: 'Roma',
    camper_cap: '00100',
    camper_indirizzo: 'Via Roma 123',
    camper_scuola: 'Scuola Media Statale',
    camper_classe: '2a',
    camper_taglia: 'M',
    camper_altezza: 145,
    camper_peso: 38,
    camper_numero_scarpe: '36',
    camper_esperienza: 'intermedio',
    allergie_intolleranze: '',
    patologie_note: '',
    genitore_nome_cognome: 'Giuseppe Rossi',
    genitore_email: 'giuseppe.rossi@email.com',
    genitore_telefono: '+39 333 1234567',
    genitore_codice_fiscale: 'RSSGPP80A01H501Z',
    genitore_citta: 'Roma',
    genitore_cap: '00100',
    genitore_indirizzo: 'Via Roma 123',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'confirmed',
    payment_status: 'paid',
    payment_type: 'full',
    amount_paid: 610,
    amount_due: 0,
    payment_date: '2025-01-15T10:35:00Z',
  },
  {
    id: '2b3c4d5e',
    created_at: '2025-01-18T14:20:00Z',
    package_type: 'alta_specializzazione',
    bus_transfer: true,
    camper_nome_cognome: 'Luca Bianchi',
    camper_codice_fiscale: 'BNCLCU13L12F205Y',
    camper_luogo_nascita: 'Milano',
    camper_data_nascita: '2013-07-12',
    camper_sesso: 'M',
    camper_citta: 'Milano',
    camper_cap: '20100',
    camper_indirizzo: 'Via Milano 45',
    camper_scuola: 'Liceo Scientifico',
    camper_classe: '1a',
    camper_taglia: 'L',
    camper_altezza: 165,
    camper_peso: 55,
    camper_numero_scarpe: '42',
    camper_esperienza: 'avanzato',
    allergie_intolleranze: 'Arachidi e frutta secca',
    patologie_note: 'Asma lieve - porta sempre inalatore',
    genitore_nome_cognome: 'Paolo Bianchi',
    genitore_email: 'paolo.bianchi@email.com',
    genitore_telefono: '+39 340 1122334',
    genitore_codice_fiscale: 'BNCPLA75B02F205Y',
    genitore_citta: 'Milano',
    genitore_cap: '20100',
    genitore_indirizzo: 'Via Milano 45',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'confirmed',
    payment_status: 'paid',
    payment_type: 'full',
    amount_paid: 860,
    amount_due: 0,
    payment_date: '2025-01-18T14:25:00Z',
  },
  {
    id: '3c4d5e6f',
    created_at: '2025-01-20T09:15:00Z',
    package_type: 'standard',
    bus_transfer: false,
    camper_nome_cognome: 'Sofia Verdi',
    camper_codice_fiscale: 'VRDSFO18S05L219X',
    camper_luogo_nascita: 'Torino',
    camper_data_nascita: '2018-11-05',
    camper_sesso: 'F',
    camper_citta: 'Torino',
    camper_cap: '10100',
    camper_indirizzo: 'Corso Torino 78',
    camper_scuola: 'Scuola Elementare',
    camper_classe: '1a',
    camper_taglia: 'XS',
    camper_altezza: 115,
    camper_peso: 22,
    camper_numero_scarpe: '30',
    camper_esperienza: 'principiante',
    allergie_intolleranze: '',
    patologie_note: '',
    genitore_nome_cognome: 'Francesco Verdi',
    genitore_email: 'francesco.verdi@email.com',
    genitore_telefono: '+39 349 5566778',
    genitore_codice_fiscale: 'VRDFNC82C03L219X',
    genitore_citta: 'Torino',
    genitore_cap: '10100',
    genitore_indirizzo: 'Corso Torino 78',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'confirmed',
    payment_status: 'paid',
    payment_type: 'full',
    amount_paid: 610,
    amount_due: 0,
    payment_date: '2025-01-20T09:20:00Z',
  },
  {
    id: '4d5e6f7g',
    created_at: '2025-01-22T16:45:00Z',
    package_type: 'standard',
    bus_transfer: true,
    camper_nome_cognome: 'Alessandro Ferrari',
    camper_codice_fiscale: 'FRRLSS14D28G702W',
    camper_luogo_nascita: 'Napoli',
    camper_data_nascita: '2014-04-28',
    camper_sesso: 'M',
    camper_citta: 'Napoli',
    camper_cap: '80100',
    camper_indirizzo: 'Piazza Napoli 12',
    camper_scuola: 'Scuola Media',
    camper_classe: '3a',
    camper_taglia: 'M',
    camper_altezza: 150,
    camper_peso: 42,
    camper_numero_scarpe: '38',
    camper_esperienza: 'intermedio',
    allergie_intolleranze: 'Lattosio',
    patologie_note: '',
    genitore_nome_cognome: 'Roberto Ferrari',
    genitore_email: 'roberto.ferrari@email.com',
    genitore_telefono: '+39 335 9988776',
    genitore_codice_fiscale: 'FRRRBT78D04G702W',
    genitore_citta: 'Napoli',
    genitore_cap: '80100',
    genitore_indirizzo: 'Piazza Napoli 12',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'pending',
    payment_status: 'partial',
    payment_type: 'deposit',
    amount_paid: 200,
    amount_due: 470,
    payment_date: '2025-01-22T16:50:00Z',
  },
  {
    id: '5e6f7g8h',
    created_at: '2025-01-25T11:00:00Z',
    package_type: 'alta_specializzazione',
    bus_transfer: false,
    camper_nome_cognome: 'Giulia Romano',
    camper_codice_fiscale: 'RMNGLU10P15A662V',
    camper_luogo_nascita: 'Firenze',
    camper_data_nascita: '2010-09-15',
    camper_sesso: 'F',
    camper_citta: 'Firenze',
    camper_cap: '50100',
    camper_indirizzo: 'Via Firenze 90',
    camper_scuola: 'Liceo Classico',
    camper_classe: '2a',
    camper_taglia: 'L',
    camper_altezza: 168,
    camper_peso: 58,
    camper_numero_scarpe: '40',
    camper_esperienza: 'avanzato',
    allergie_intolleranze: '',
    patologie_note: '',
    genitore_nome_cognome: 'Andrea Romano',
    genitore_email: 'andrea.romano@email.com',
    genitore_telefono: '+39 347 1234567',
    genitore_codice_fiscale: 'RMNNDR73E05A662V',
    genitore_citta: 'Firenze',
    genitore_cap: '50100',
    genitore_indirizzo: 'Via Firenze 90',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'confirmed',
    payment_status: 'paid',
    payment_type: 'full',
    amount_paid: 800,
    amount_due: 0,
    payment_date: '2025-01-25T11:05:00Z',
  },
  {
    id: '6f7g8h9i',
    created_at: '2025-01-28T08:30:00Z',
    package_type: 'standard',
    bus_transfer: false,
    camper_nome_cognome: 'Matteo Colombo',
    camper_codice_fiscale: 'CLMMTT17A10B354U',
    camper_luogo_nascita: 'Bologna',
    camper_data_nascita: '2017-01-10',
    camper_sesso: 'M',
    camper_citta: 'Bologna',
    camper_cap: '40100',
    camper_indirizzo: 'Via Bologna 34',
    camper_scuola: 'Scuola Elementare',
    camper_classe: '2a',
    camper_taglia: 'S',
    camper_altezza: 125,
    camper_peso: 28,
    camper_numero_scarpe: '32',
    camper_esperienza: 'intermedio',
    allergie_intolleranze: '',
    patologie_note: 'Porta occhiali - necessita protezione',
    genitore_nome_cognome: 'Davide Colombo',
    genitore_email: 'davide.colombo@email.com',
    genitore_telefono: '+39 338 2233445',
    genitore_codice_fiscale: 'CLMDVD79F06B354U',
    genitore_citta: 'Bologna',
    genitore_cap: '40100',
    genitore_indirizzo: 'Via Bologna 34',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'pending',
    payment_status: 'pending',
    amount_due: 610,
  },
  {
    id: '7g8h9i0j',
    created_at: '2025-02-01T13:20:00Z',
    package_type: 'standard',
    bus_transfer: false,
    camper_nome_cognome: 'Emma Ricci',
    camper_codice_fiscale: 'RCCMMA19H22C351T',
    camper_luogo_nascita: 'Venezia',
    camper_data_nascita: '2019-06-22',
    camper_sesso: 'F',
    camper_citta: 'Venezia',
    camper_cap: '30100',
    camper_indirizzo: 'Corso Venezia 56',
    camper_scuola: 'Scuola Materna',
    camper_classe: '3a',
    camper_taglia: 'XXS',
    camper_altezza: 105,
    camper_peso: 18,
    camper_numero_scarpe: '28',
    camper_esperienza: 'principiante',
    allergie_intolleranze: '',
    patologie_note: '',
    genitore_nome_cognome: 'Marco Ricci',
    genitore_email: 'marco.ricci@email.com',
    genitore_telefono: '+39 342 6677889',
    genitore_codice_fiscale: 'RCCMRC81G07C351T',
    genitore_citta: 'Venezia',
    genitore_cap: '30100',
    genitore_indirizzo: 'Corso Venezia 56',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'confirmed',
    payment_status: 'paid',
    payment_type: 'full',
    amount_paid: 610,
    amount_due: 0,
    payment_date: '2025-02-01T13:25:00Z',
  },
  {
    id: '8h9i0j1k',
    created_at: '2025-02-03T10:00:00Z',
    package_type: 'alta_specializzazione',
    bus_transfer: false,
    camper_nome_cognome: 'Lorenzo Martini',
    camper_codice_fiscale: 'MRTLRN12T03D612S',
    camper_luogo_nascita: 'Genova',
    camper_data_nascita: '2012-12-03',
    camper_sesso: 'M',
    camper_citta: 'Genova',
    camper_cap: '16100',
    camper_indirizzo: 'Via Genova 23',
    camper_scuola: 'Scuola Media',
    camper_classe: '1a',
    camper_taglia: 'L',
    camper_altezza: 158,
    camper_peso: 48,
    camper_numero_scarpe: '40',
    camper_esperienza: 'avanzato',
    allergie_intolleranze: 'Glutine',
    patologie_note: 'Celiachia diagnosticata - richiede pasti speciali',
    genitore_nome_cognome: 'Simone Martini',
    genitore_email: 'simone.martini@email.com',
    genitore_telefono: '+39 345 1122334',
    genitore_codice_fiscale: 'MRTSMN76H08D612S',
    genitore_citta: 'Genova',
    genitore_cap: '16100',
    genitore_indirizzo: 'Via Genova 23',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'cancelled',
    payment_status: 'refunded',
    payment_type: 'full',
    amount_paid: 0,
    amount_due: 0,
  },
  {
    id: '9i0j1k2l',
    created_at: '2025-02-05T15:45:00Z',
    package_type: 'standard',
    bus_transfer: true,
    camper_nome_cognome: 'Chiara Gallo',
    camper_codice_fiscale: 'GLLCHR16M17E463R',
    camper_luogo_nascita: 'Palermo',
    camper_data_nascita: '2016-08-17',
    camper_sesso: 'F',
    camper_citta: 'Palermo',
    camper_cap: '90100',
    camper_indirizzo: 'Piazza Palermo 8',
    camper_scuola: 'Scuola Elementare',
    camper_classe: '3a',
    camper_taglia: 'S',
    camper_altezza: 128,
    camper_peso: 26,
    camper_numero_scarpe: '33',
    camper_esperienza: 'intermedio',
    allergie_intolleranze: '',
    patologie_note: '',
    genitore_nome_cognome: 'Alessandro Gallo',
    genitore_email: 'alessandro.gallo@email.com',
    genitore_telefono: '+39 341 5566778',
    genitore_codice_fiscale: 'GLLLSS74I09E463R',
    genitore_citta: 'Palermo',
    genitore_cap: '90100',
    genitore_indirizzo: 'Piazza Palermo 8',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'pending',
    payment_status: 'failed',
    amount_due: 670,
  },
  {
    id: '0j1k2l3m',
    created_at: '2025-02-08T12:30:00Z',
    package_type: 'standard',
    bus_transfer: false,
    camper_nome_cognome: 'Federico Russo',
    camper_codice_fiscale: 'RSSFDR17B25F839Q',
    camper_luogo_nascita: 'Bari',
    camper_data_nascita: '2017-02-25',
    camper_sesso: 'M',
    camper_citta: 'Bari',
    camper_cap: '70100',
    camper_indirizzo: 'Via Bari 67',
    camper_scuola: 'Scuola Elementare',
    camper_classe: '2a',
    camper_taglia: 'S',
    camper_altezza: 122,
    camper_peso: 25,
    camper_numero_scarpe: '31',
    camper_esperienza: 'principiante',
    allergie_intolleranze: '',
    patologie_note: '',
    genitore_nome_cognome: 'Luca Russo',
    genitore_email: 'luca.russo@email.com',
    genitore_telefono: '+39 346 9988776',
    genitore_codice_fiscale: 'RSSLCU72L10F839Q',
    genitore_citta: 'Bari',
    genitore_cap: '70100',
    genitore_indirizzo: 'Via Bari 67',
    liberatoria_foto_video: true,
    accettazione_regolamento: true,
    privacy_policy: true,
    status: 'confirmed',
    payment_status: 'paid',
    payment_type: 'full',
    amount_paid: 610,
    amount_due: 0,
    payment_date: '2025-02-08T12:35:00Z',
  },
]

// Mock Gallery Photos Data
export const mockGalleryPhotos: GalleryPhoto[] = [
  // 2024 Photos
  {
    id: '1',
    created_at: '2024-07-15T10:00:00Z',
    updated_at: '2024-07-15T10:00:00Z',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    alt_text: 'Allenamento di basket in palestra',
    year: 2024,
    category: 'allenamenti',
    featured: true,
    sort_order: 1,
  },
  {
    id: '2',
    created_at: '2024-07-15T10:05:00Z',
    updated_at: '2024-07-15T10:05:00Z',
    url: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=800',
    alt_text: 'Partita amichevole tra squadre',
    year: 2024,
    category: 'partite',
    featured: true,
    sort_order: 2,
  },
  {
    id: '3',
    created_at: '2024-07-16T09:00:00Z',
    updated_at: '2024-07-16T09:00:00Z',
    url: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=800',
    alt_text: 'Esercizi di tiro a canestro',
    year: 2024,
    category: 'allenamenti',
    featured: false,
    sort_order: 3,
  },
  {
    id: '4',
    created_at: '2024-07-16T14:00:00Z',
    updated_at: '2024-07-16T14:00:00Z',
    url: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800',
    alt_text: 'Attività di gruppo',
    year: 2024,
    category: 'attivita',
    featured: true,
    sort_order: 4,
  },
  {
    id: '5',
    created_at: '2024-07-17T10:00:00Z',
    updated_at: '2024-07-17T10:00:00Z',
    url: 'https://images.unsplash.com/photo-1577416412292-747c6607f055?w=800',
    alt_text: 'Foto di gruppo del camp',
    year: 2024,
    category: 'gruppo',
    featured: true,
    sort_order: 5,
  },
  {
    id: '6',
    created_at: '2024-07-17T15:00:00Z',
    updated_at: '2024-07-17T15:00:00Z',
    url: 'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?w=800',
    alt_text: 'Torneo finale',
    year: 2024,
    category: 'partite',
    featured: false,
    sort_order: 6,
  },
  {
    id: '7',
    created_at: '2024-07-18T11:00:00Z',
    updated_at: '2024-07-18T11:00:00Z',
    url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?w=800',
    alt_text: 'Sessione di dribbling',
    year: 2024,
    category: 'allenamenti',
    featured: false,
    sort_order: 7,
  },
  // 2023 Photos
  {
    id: '8',
    created_at: '2023-07-10T10:00:00Z',
    updated_at: '2023-07-10T10:00:00Z',
    url: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800',
    alt_text: 'Camp 2023 - Primo giorno',
    year: 2023,
    category: 'gruppo',
    featured: true,
    sort_order: 1,
  },
  {
    id: '9',
    created_at: '2023-07-11T09:00:00Z',
    updated_at: '2023-07-11T09:00:00Z',
    url: 'https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?w=800',
    alt_text: 'Allenamento tecnico 2023',
    year: 2023,
    category: 'allenamenti',
    featured: false,
    sort_order: 2,
  },
  {
    id: '10',
    created_at: '2023-07-12T14:00:00Z',
    updated_at: '2023-07-12T14:00:00Z',
    url: 'https://images.unsplash.com/photo-1485395037613-e83d5c1f5290?w=800',
    alt_text: 'Giochi di squadra',
    year: 2023,
    category: 'attivita',
    featured: false,
    sort_order: 3,
  },
  {
    id: '11',
    created_at: '2023-07-13T10:00:00Z',
    updated_at: '2023-07-13T10:00:00Z',
    url: 'https://images.unsplash.com/photo-1474224017046-182ece80b263?w=800',
    alt_text: 'Match 2023',
    year: 2023,
    category: 'partite',
    featured: true,
    sort_order: 4,
  },
  {
    id: '12',
    created_at: '2023-07-14T16:00:00Z',
    updated_at: '2023-07-14T16:00:00Z',
    url: 'https://images.unsplash.com/photo-1607457561901-e6ec3a6d16cf?w=800',
    alt_text: 'Premiazione 2023',
    year: 2023,
    category: 'gruppo',
    featured: false,
    sort_order: 5,
  },
  // 2022 Photos
  {
    id: '13',
    created_at: '2022-07-08T10:00:00Z',
    updated_at: '2022-07-08T10:00:00Z',
    url: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?w=800',
    alt_text: 'Camp 2022 - Apertura',
    year: 2022,
    category: 'gruppo',
    featured: true,
    sort_order: 1,
  },
  {
    id: '14',
    created_at: '2022-07-09T11:00:00Z',
    updated_at: '2022-07-09T11:00:00Z',
    url: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?w=800',
    alt_text: 'Fondamentali basket 2022',
    year: 2022,
    category: 'allenamenti',
    featured: false,
    sort_order: 2,
  },
  {
    id: '15',
    created_at: '2022-07-10T15:00:00Z',
    updated_at: '2022-07-10T15:00:00Z',
    url: 'https://images.unsplash.com/photo-1562040506-a9b32cb51b94?w=800',
    alt_text: 'Torneo 2022',
    year: 2022,
    category: 'partite',
    featured: false,
    sort_order: 3,
  },
  {
    id: '16',
    created_at: '2022-07-11T14:00:00Z',
    updated_at: '2022-07-11T14:00:00Z',
    url: 'https://images.unsplash.com/photo-1629464261479-78fb8f4ea660?w=800',
    alt_text: 'Attività ricreative 2022',
    year: 2022,
    category: 'attivita',
    featured: true,
    sort_order: 4,
  },
  {
    id: '17',
    created_at: '2022-07-12T10:00:00Z',
    updated_at: '2022-07-12T10:00:00Z',
    url: 'https://images.unsplash.com/photo-1542652735873-fb2825bac6e2?w=800',
    alt_text: 'Sessione intensiva 2022',
    year: 2022,
    category: 'allenamenti',
    featured: false,
    sort_order: 5,
  },
  // 2021 Photos
  {
    id: '18',
    created_at: '2021-07-05T10:00:00Z',
    updated_at: '2021-07-05T10:00:00Z',
    url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    alt_text: 'Camp 2021 - Gruppo iniziale',
    year: 2021,
    category: 'gruppo',
    featured: true,
    sort_order: 1,
  },
  {
    id: '19',
    created_at: '2021-07-06T09:00:00Z',
    updated_at: '2021-07-06T09:00:00Z',
    url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    alt_text: 'Training 2021',
    year: 2021,
    category: 'allenamenti',
    featured: false,
    sort_order: 2,
  },
  {
    id: '20',
    created_at: '2021-07-07T14:00:00Z',
    updated_at: '2021-07-07T14:00:00Z',
    url: 'https://images.unsplash.com/photo-1471295253337-3ceaaedca402?w=800',
    alt_text: 'Amichevole 2021',
    year: 2021,
    category: 'partite',
    featured: false,
    sort_order: 3,
  },
  {
    id: '21',
    created_at: '2021-07-08T11:00:00Z',
    updated_at: '2021-07-08T11:00:00Z',
    url: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?w=800',
    alt_text: 'Giochi e attività 2021',
    year: 2021,
    category: 'attivita',
    featured: true,
    sort_order: 4,
  },
  // Additional 2024 photos
  {
    id: '22',
    created_at: '2024-07-19T10:00:00Z',
    updated_at: '2024-07-19T10:00:00Z',
    url: 'https://images.unsplash.com/photo-1560012057-4372e14c5085?w=800',
    alt_text: 'Minibasket drills',
    year: 2024,
    category: 'allenamenti',
    featured: false,
    sort_order: 8,
  },
  {
    id: '23',
    created_at: '2024-07-19T14:00:00Z',
    updated_at: '2024-07-19T14:00:00Z',
    url: 'https://images.unsplash.com/photo-1628891890377-57dba2715caf?w=800',
    alt_text: 'Semifinale torneo',
    year: 2024,
    category: 'partite',
    featured: false,
    sort_order: 9,
  },
  {
    id: '24',
    created_at: '2024-07-20T09:00:00Z',
    updated_at: '2024-07-20T09:00:00Z',
    url: 'https://images.unsplash.com/photo-1578432014316-48b448d79d57?w=800',
    alt_text: 'Team building',
    year: 2024,
    category: 'attivita',
    featured: false,
    sort_order: 10,
  },
  {
    id: '25',
    created_at: '2024-07-20T16:00:00Z',
    updated_at: '2024-07-20T16:00:00Z',
    url: 'https://images.unsplash.com/photo-1545809074-59472b3f5ecc?w=800',
    alt_text: 'Foto finale camp 2024',
    year: 2024,
    category: 'gruppo',
    featured: true,
    sort_order: 11,
  },
]

// Helper functions to work with mock data
export const getRegistrationStats = () => {
  const total = mockRegistrations.length
  const pending = mockRegistrations.filter(r => r.status === 'pending').length
  const confirmed = mockRegistrations.filter(r => r.status === 'confirmed').length
  const cancelled = mockRegistrations.filter(r => r.status === 'cancelled').length
  
  // Calculate revenue based on actual payments
  const revenue = mockRegistrations
    .filter(r => r.status === 'confirmed' || r.payment_status === 'paid' || r.payment_status === 'partial')
    .reduce((sum, r) => sum + (r.amount_paid || 0), 0)
  
  // Count pending payments
  const pendingPayments = mockRegistrations.filter(
    r => r.payment_status === 'pending' || r.payment_status === 'partial'
  ).length
  
  return { total, pending, confirmed, cancelled, revenue, pendingPayments }
}

// Calculate age helper
const calculateAge = (birthDate: string) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

// Get t-shirt size distribution
export const getSizeDistribution = () => {
  const sizes: Record<string, number> = { XXS: 0, XS: 0, S: 0, M: 0, L: 0, XL: 0 }
  mockRegistrations
    .filter(r => r.status !== 'cancelled')
    .forEach(r => {
      if (sizes[r.camper_taglia] !== undefined) {
        sizes[r.camper_taglia]++
      }
    })
  return sizes
}

// Get age distribution
export const getAgeDistribution = () => {
  const ages = { '6-8': 0, '9-11': 0, '12-14': 0, '15+': 0 }
  mockRegistrations
    .filter(r => r.status !== 'cancelled')
    .forEach(r => {
      const age = calculateAge(r.camper_data_nascita)
      if (age >= 6 && age <= 8) ages['6-8']++
      else if (age >= 9 && age <= 11) ages['9-11']++
      else if (age >= 12 && age <= 14) ages['12-14']++
      else if (age >= 15) ages['15+']++
    })
  return ages
}

// Get experience distribution
export const getExperienceDistribution = () => {
  const experience = { principiante: 0, intermedio: 0, avanzato: 0 }
  mockRegistrations
    .filter(r => r.status !== 'cancelled')
    .forEach(r => {
      experience[r.camper_esperienza]++
    })
  return experience
}

// Get special needs count (allergies/medical notes)
export const getSpecialNeedsCount = () => {
  const active = mockRegistrations.filter(r => r.status !== 'cancelled')
  const withAllergies = active.filter(r => r.allergie_intolleranze && r.allergie_intolleranze.trim() !== '').length
  const withMedicalNotes = active.filter(r => r.patologie_note && r.patologie_note.trim() !== '').length
  const withAnyNotes = active.filter(r => 
    (r.allergie_intolleranze && r.allergie_intolleranze.trim() !== '') || 
    (r.patologie_note && r.patologie_note.trim() !== '')
  ).length
  return { withAllergies, withMedicalNotes, withAnyNotes, total: active.length }
}

export const getRecentRegistrations = (limit: number = 5) => {
  return [...mockRegistrations]
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, limit)
}

export const getFeaturedPhotos = () => {
  return mockGalleryPhotos.filter(p => p.featured)
}

export const getPhotosByYear = (year: number) => {
  return mockGalleryPhotos.filter(p => p.year === year)
}

export const getPhotosByCategory = (category: string) => {
  return mockGalleryPhotos.filter(p => p.category === category)
}