# 🏀 Project Overview

## What is Mini & Basket Camp?

**Mini & Basket Camp** is an Italian basketball summer camp for children aged 6-14 (primarily 11-18 for the main camp). It has been running since 2004 and is one of the premier basketball camps in Italy.

### Camp Details (2026 Edition)

| Aspect | Details |
|--------|---------|
| **Dates** | June 28 - July 5, 2026 (7 days) |
| **Location** | Villaggio Residence Bahja****, Paola (CS), Calabria, Italy |
| **Age Range** | 6-14 years old (minibasket) to 18 years (basketball) |
| **Capacity** | 100+ participants |
| **Staff** | 15+ professional coaches |

---

## Target Audience

### Primary Users
- **Parents** (genitori) of children aged 6-14
- Italian-speaking families from the Campania region primarily
- Basketball enthusiasts looking for summer camp experiences

### User Journey
1. **Discovery** → Homepage, program page
2. **Information Gathering** → FAQ, staff, gallery
3. **Decision** → Pricing cards, package comparison
4. **Registration** → Multi-step wizard form
5. **Payment** → Stripe Checkout (deposit or full)
6. **Confirmation** → Success page, email confirmation

---

## Business Logic

### Package Types

#### 1. Camp Standard (`standard`)
```typescript
{
  name: 'Camp Standard 2026',
  fullPrice: 61000,      // €610 in cents
  earlyBirdPrice: 59000, // €590 early bird
  depositPrice: 20000,   // €200 deposit
}
```

**Includes:**
- 7 days of camp
- Full board accommodation (pensione completa)
- Insurance coverage
- 24-hour assistance
- Camp kit (t-shirt, shorts)

#### 2. Alta Specializzazione (`alta_specializzazione`)
```typescript
{
  name: 'Alta Specializzazione 2026',
  fullPrice: 80000,      // €800 in cents
  earlyBirdPrice: 76000, // €760 early bird
  depositPrice: 20000,   // €200 deposit
  maxSpots: 20,          // Limited availability
}
```

**Includes everything in Standard, PLUS:**
- 7 additional hours of individual technique training
- Personalized workout sessions
- Limited to first 20 registrants

### Add-ons

#### Bus Transfer
```typescript
{
  name: 'Transfer Bus Napoli A/R',
  price: 6000, // €60
}
```
Round-trip bus transfer from Naples area to the camp village.

---

## Early Bird Pricing Logic

Early bird discount applies until **February 28, 2026**.

```typescript
// From src/lib/stripe.ts
export const isEarlyBird = () => {
  const now = new Date();
  const earlyBirdDeadline = new Date('2026-02-28T23:59:59');
  return now <= earlyBirdDeadline;
};
```

| Package | Before Feb 28 | After Feb 28 | Savings |
|---------|---------------|--------------|---------|
| Standard | €590 | €610 | €20 |
| Alta Specializzazione | €760 | €800 | €40 |

---

## Payment Flow

### Payment Options
1. **Full Payment** - Pay entire amount upfront
2. **Deposit** - Pay €200 now, balance due by May 31, 2026

### Payment Methods Accepted
- Credit/Debit Cards (Visa, Mastercard, American Express)
- Apple Pay / Google Pay
- PayPal
- Klarna (Buy Now, Pay Later)
- SEPA Direct Debit
- Bancontact
- iDEAL

### Payment Statuses
```typescript
type PaymentStatus = 
  | 'pending'   // Not yet paid
  | 'partial'   // Deposit paid, balance pending
  | 'paid'      // Fully paid
  | 'failed'    // Payment failed
  | 'refunded'  // Refunded
```

---

## Registration Flow

### Step-by-Step Process

```
Step 1: Package Selection
├── Choose: Standard or Alta Specializzazione
├── Optional: Add bus transfer (+€60)
└── View total price

Step 2: Parent/Guardian Information
├── Full name (nome e cognome)
├── Tax code (codice fiscale) - optional
├── Address (città, CAP, indirizzo)
├── Phone number
└── Email address

Step 3: Camper Information
├── Full name
├── Tax code (required for child)
├── Birth place and date
├── Gender (M/F)
├── Address (can be same as parent)
├── School and class
├── T-shirt size (XXS to XL)
├── Height, weight, shoe size
├── Experience level
└── Sports club (optional)

Step 4: Medical Information (optional)
├── Allergies and intolerances
├── Medical conditions
└── Current medications

Step 5: Review & Consents
├── Photo/video release
├── Camp rules acceptance
├── Privacy policy acceptance
└── Invitation code (optional)

Step 6: Payment
├── Choose: Full payment or Deposit
├── Stripe Checkout redirect
└── Success page on completion
```

---

## Key Italian Terminology

### Registration Form Terms

| Italian | English | Database Column |
|---------|---------|-----------------|
| Genitore | Parent/Guardian | `genitore_*` |
| Camper/Atleta | Child Participant | `camper_*` |
| Nome e Cognome | Full Name | `*_nome_cognome` |
| Codice Fiscale | Tax Code (SSN equivalent) | `*_codice_fiscale` |
| Luogo di Nascita | Place of Birth | `camper_luogo_nascita` |
| Data di Nascita | Date of Birth | `camper_data_nascita` |
| Sesso | Gender | `camper_sesso` |
| Indirizzo | Address | `*_indirizzo` |
| Città | City | `*_citta` |
| CAP | Postal Code | `*_cap` |
| Telefono | Phone | `genitore_telefono` |
| Scuola | School | `camper_scuola` |
| Classe | Grade/Class | `camper_classe` |
| Taglia | T-shirt Size | `camper_taglia` |
| Altezza | Height (cm) | `camper_altezza` |
| Peso | Weight (kg) | `camper_peso` |
| Numero Scarpe | Shoe Size (EU) | `camper_numero_scarpe` |

### Experience Levels

| Italian | English | Value |
|---------|---------|-------|
| Non ho mai giocato | Never played | `principiante` |
| Gioco al campetto | Play casually | `intermedio` |
| Gioco in una squadra | Play on a team | `avanzato` |

### Consents

| Italian | English | Database Column |
|---------|---------|-----------------|
| Liberatoria Foto/Video | Photo/Video Release | `liberatoria_foto_video` |
| Accettazione Regolamento | Rules Acceptance | `accettazione_regolamento` |
| Privacy Policy | Privacy Policy | `privacy_policy` |

---

## Camp Schedule (Typical Day)

### Morning
- 08:00 - Wake up, breakfast
- 09:30 - Morning training session
- 12:30 - Lunch

### Afternoon
- 15:00 - Afternoon training/activities
- 18:00 - Free time, pool, beach

### Evening
- 20:00 - Dinner
- 21:00 - Evening activities with animation
- 23:00 - Lights out

---

## Staff Structure

### Camp Director
- **Antonio Nappi** - Responsabile Mini&Basket Camp

### Coaches (Allenatori)
The camp features 14+ professional coaches including:
- Gianluca Tucci
- Elia Confessore
- Gianluca Moreno
- Walter De Raffaele
- And more...

### Guest Stars (Campioni)
Professional basketball players visit the camp:
- Linton Johnson
- Pino Corvo
- Marida Orazzo
- And others...

---

## Contact Information

| Type | Value |
|------|-------|
| **Phone** | +39 339 877 5790 |
| **Email** | info@miniandbasketcamp.it |
| **Website** | www.miniandbasketcamp.it |
| **Organization** | ASD CA75 Basket Casalnuovo |
| **P.IVA/C.F.** | 92042810637 |

### Bank Details (for manual payments)
| Field | Value |
|-------|-------|
| Beneficiary | ASD CA75 Basket Casalnuovo |
| IBAN | IT 68 S 01005 03401 000000000033 |
| Reference | Iscrizione Mini&Basket Camp 2026 |

---

## Key Dates (2026 Edition)

| Date | Event |
|------|-------|
| **Now** | Registrations open |
| **Feb 28, 2026** | Early bird deadline |
| **May 31, 2026** | Final payment deadline |
| **June 28, 2026** | Camp starts (arrival from 15:30) |
| **July 5, 2026** | Camp ends (departure from 14:30) |

---

## Technical Requirements

### Medical Certificate
- Required: Sports medical certificate (certificato per attività sportiva agonistica)
- Must be issued by a sports medicine doctor
- Valid for one year
- Must be presented at arrival

### What to Bring
- 7-8 underwear
- 10 pairs of sports socks
- 4 game shorts
- 5 game t-shirts/jerseys
- 1 pair basketball shoes
- Casual clothes for evenings
- 2 swimsuits
- Beach towel
- Sunscreen
- Toiletries

---

## Gallery & Media

The website features:
- Photo galleries organized by year/collection
- Photos stored in Supabase Storage
- Public bucket for image serving
- Support for multiple collections per camp year

---

*For technical implementation details, see other documentation files.*