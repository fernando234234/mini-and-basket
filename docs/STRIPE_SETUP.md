# Stripe Setup Guide - Mini & Basket Camp 2025

Questa guida spiega come configurare Stripe per il sistema di pagamenti del Mini & Basket Camp.

---

## ⚡ QUICK START - Risposte Veloci

### ❓ Devo creare Prodotti in Stripe?

**NO!** Non è necessario creare prodotti nel dashboard Stripe.

Il nostro sistema usa **dynamic pricing** (prezzi dinamici) con `price_data`. Questo significa che:
- I prezzi sono definiti nel codice (`src/lib/stripe.ts`)
- Ogni checkout crea la line item dinamicamente
- Non servono Product o Price preconfigurati su Stripe

```typescript
// Esempio da checkout/route.ts - il prezzo viene creato al volo
line_items: [{
  price_data: {
    currency: 'eur',
    product_data: {
      name: 'Mini & Basket Camp 2025 - Camp Standard',
      description: 'Pagamento completo per Camp Standard',
    },
    unit_amount: 61000, // €610 in centesimi
  },
  quantity: 1,
}]
```

### 💰 Prezzi Configurati

I prezzi sono definiti in `src/lib/stripe.ts`:

| Pacchetto | Prezzo Pieno | Early Bird | Acconto |
|-----------|--------------|------------|---------|
| Standard | €610 | €590 | €200 |
| Alta Specializzazione | €800 | €760 | €200 |
| Transfer Bus | +€60 | - | - |

**Early Bird** scade automaticamente il 28 Febbraio 2025.

### 🔑 Variabili d'Ambiente Richieste

```bash
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx  # O pk_live_xxxx per produzione
STRIPE_SECRET_KEY=sk_test_xxxx                    # O sk_live_xxxx per produzione
STRIPE_WEBHOOK_SECRET=whsec_xxxx                  # Dal webhook configurato
```

### 🪝 Webhook - Come Configurarlo

1. Vai su [Stripe Dashboard → Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Clicca **Add endpoint**
3. **URL Endpoint**: `https://TUO-DOMINIO.com/api/webhook`
4. **Eventi da selezionare**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copia il **Signing secret** (inizia con `whsec_`)
6. Salvalo in `STRIPE_WEBHOOK_SECRET`

### ✅ Checklist Minima per Andare Live

1. [ ] Crea account Stripe (se non l'hai già)
2. [ ] Copia le chiavi API live dal dashboard
3. [ ] Configura il webhook con l'URL di produzione
4. [ ] Imposta le 3 variabili d'ambiente su Netlify
5. [ ] Fai un test payment reale di €1

---

## 📋 Indice Completo

1. [Configurazione Account](#configurazione-account)
2. [Branding Dashboard](#branding-dashboard)
3. [Metodi di Pagamento](#metodi-di-pagamento)
4. [Webhook Events](#webhook-events)
5. [Codici Promozionali](#codici-promozionali)
6. [Impostazioni Fiscali](#impostazioni-fiscali)
7. [Test Mode vs Live Mode](#test-mode-vs-live-mode)
8. [Troubleshooting](#troubleshooting)

---

## 🔐 Configurazione Account

### Variabili d'Ambiente

Aggiungi queste variabili al file `.env.local`:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_xxxx          # Chiave segreta (server-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxx  # Chiave pubblica (client-side)
STRIPE_WEBHOOK_SECRET=whsec_xxxx        # Segreto webhook (per verificare eventi)
```

### Ottenere le Chiavi API

1. Vai su [Stripe Dashboard](https://dashboard.stripe.com)
2. Seleziona **Developers** → **API keys**
3. Copia le chiavi (test o live a seconda dell'ambiente)

---

## 🎨 Branding Dashboard

### Configurazione nel Dashboard Stripe

Vai su **Settings** → **Branding** → **Checkout & Payment Links**

#### Logo
- **Dimensioni raccomandate**: 512x512px (quadrato) o 600x200px (rettangolare)
- **Formato**: PNG, SVG o JPEG
- **Upload**: Carica il logo Mini & Basket Camp

#### Colori Brand
```
Primary Color (Brand Green): #84C14A
Accent Color (Brand Orange): #F7941D
Background: #FFFFFF
Text: #1F2937
```

#### Icona (Favicon)
- Usa l'icona del pallone da basket
- **Dimensioni**: 32x32px o 48x48px

#### Aspetto Checkout
- **Button color**: `#84C14A` (Brand Green)
- **Button corner radius**: `24px` (rounded)
- **Font**: Default o simile (clean, modern)

### Branding Impostazioni Aggiuntive

1. **Business Name**: Mini & Basket Camp
2. **Statement descriptor**: MINIBASKETCAMP (max 22 caratteri)
3. **Short descriptor**: CAMP2025
4. **Support email**: info@miniandbasketcamp.it
5. **Support phone**: +39 XXX XXX XXXX

---

## 💳 Metodi di Pagamento

### Metodi da Abilitare nel Dashboard

Vai su **Settings** → **Payment methods**

| Metodo | Disponibilità | Note |
|--------|---------------|------|
| ✅ **Cards** | Automatico | Visa, Mastercard, Amex |
| ✅ **Apple Pay** | Via Cards | Richiede verifica dominio |
| ✅ **Google Pay** | Via Cards | Automatico con Cards |
| ✅ **PayPal** | Da abilitare | Richiede account PayPal collegato |
| ✅ **Klarna** | Da abilitare | Paga in 3 rate |
| ✅ **SEPA Direct Debit** | Da abilitare | Bonifico SEPA |
| ✅ **Link** | Automatico | Checkout veloce Stripe |
| ⚠️ **Bancontact** | Opzionale | Popolare in Belgio |
| ⚠️ **iDEAL** | Opzionale | Popolare in Olanda |

### Configurazione Apple Pay

Per abilitare Apple Pay è necessario verificare il dominio:

1. Vai su **Settings** → **Payment methods** → **Apple Pay**
2. Clicca **Add new domain**
3. Inserisci: `miniandbasketcamp.it`
4. Scarica il file di verifica
5. Caricalo nella cartella: `/.well-known/apple-developer-merchantid-domain-association`
6. Completa la verifica

### Configurazione PayPal

1. Vai su **Settings** → **Payment methods** → **PayPal**
2. Clicca **Enable PayPal**
3. Collega il tuo account PayPal Business
4. Completa la verifica

### Configurazione Klarna (Rate)

Klarna permette il pagamento in 3 rate senza interessi:

1. Vai su **Settings** → **Payment methods** → **Klarna**
2. Clicca **Enable**
3. Accetta i termini di Klarna
4. Imposta la valuta: EUR
5. Paesi supportati: Italia (IT)

**Esempio rate per i nostri pacchetti:**
- €450 (Settimana Completa) = 3 × €150
- €250 (One Day Camp) = 3 × €83.33
- €150 (Weekend) = 3 × €50

---

## 🔔 Webhook Events

### Configurazione Webhook

1. Vai su **Developers** → **Webhooks**
2. Clicca **Add endpoint**
3. URL endpoint: `https://miniandbasketcamp.it/api/webhook`
4. Seleziona gli eventi

### Eventi da Sottoscrivere

```
checkout.session.completed    # Checkout completato con successo
checkout.session.expired      # Sessione checkout scaduta
payment_intent.succeeded      # Pagamento riuscito
payment_intent.payment_failed # Pagamento fallito
customer.created              # Nuovo cliente creato
invoice.paid                  # Fattura pagata
invoice.payment_failed        # Pagamento fattura fallito
charge.refunded               # Rimborso effettuato
```

### Gestione Webhook nel Codice

Il file `src/app/api/webhook/route.ts` gestisce questi eventi:

```typescript
// Esempio eventi gestiti
switch (event.type) {
  case 'checkout.session.completed':
    // Salva iscrizione nel database
    // Invia email di conferma
    break;
  case 'payment_intent.payment_failed':
    // Notifica fallimento pagamento
    break;
  case 'invoice.paid':
    // Aggiorna stato fattura
    break;
}
```

### Test Webhook Locali

Usa Stripe CLI per testare i webhook localmente:

```bash
# Installa Stripe CLI
# Windows
scoop install stripe

# Esegui forward
stripe listen --forward-to localhost:3000/api/webhook

# In un altro terminale, triggera un evento
stripe trigger checkout.session.completed
```

---

## 🏷️ Codici Promozionali

### Creare Codici Sconto

Vai su **Products** → **Coupons** → **Create coupon**

### Codici Consigliati

| Codice | Tipo | Valore | Descrizione |
|--------|------|--------|-------------|
| `EARLYBIRD` | Percentuale | 10% | Sconto prenotazione anticipata |
| `FRATELLI` | Percentuale | 15% | Sconto fratelli/sorelle |
| `AMICI2025` | Importo | €50 | Sconto fisso amici |
| `FEDELTA` | Percentuale | 20% | Ritorno partecipanti |
| `PROMO10` | Percentuale | 10% | Promozione generica |

### Impostazioni Coupon

Per ogni coupon, configura:

1. **Nome**: Nome interno (es. "Sconto Early Bird")
2. **ID**: Codice che useranno i clienti (es. EARLYBIRD)
3. **Tipo**: Percentuale o importo fisso
4. **Durata**: Una volta, ripetuto, o per sempre
5. **Limitazioni**:
   - Data di scadenza
   - Numero massimo di utilizzi
   - Primo ordine solo
   - Importo minimo ordine

### Abilitare Codici nel Checkout

Il nostro checkout ha già `allow_promotion_codes: true` abilitato.
I clienti vedranno un campo "Codice promozionale" nella pagina di checkout.

---

## 🧾 Impostazioni Fiscali

### IVA Italia (22%)

1. Vai su **Settings** → **Tax**
2. Abilita **Stripe Tax** o gestisci manualmente

#### Configurazione Manuale

Se non usi Stripe Tax:
- L'IVA è inclusa nei prezzi mostrati
- €450 = €368.85 + €81.15 IVA (22%)
- €250 = €204.92 + €45.08 IVA (22%)
- €150 = €122.95 + €27.05 IVA (22%)

#### Con Stripe Tax

1. Abilita Stripe Tax
2. Imposta la sede: Italia
3. Categoria prodotto: "Eventi e intrattenimento" o "Servizi sportivi"
4. I prezzi possono essere impostati come "tax inclusive" o "tax exclusive"

### Fatturazione

Le fatture vengono create automaticamente con `invoice_creation: { enabled: true }`.
I clienti riceveranno:
- Ricevuta email automatica
- Link per scaricare la fattura PDF
- Dettagli completi del pagamento

---

## 🔄 Test Mode vs Live Mode

### Test Mode

**Quando usare**: Sviluppo e test

```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

**Carte di test**:
| Carta | Numero |
|-------|--------|
| Successo | 4242 4242 4242 4242 |
| Richiede autenticazione | 4000 0025 0000 3155 |
| Rifiutata | 4000 0000 0000 0002 |
| Fondi insufficienti | 4000 0000 0000 9995 |

**Dati aggiuntivi test**:
- CVV: qualsiasi 3 cifre
- Data scadenza: qualsiasi data futura
- CAP: qualsiasi 5 cifre

**Metodi che funzionano in test mode**:
- ✅ Cards
- ✅ SEPA Direct Debit
- ⚠️ PayPal (limitato)
- ⚠️ Klarna (limitato, richiede account test)
- ❌ Apple Pay (richiede dominio verificato)

### Live Mode

**Quando usare**: Produzione

```bash
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
```

**Prima di andare live**:
- [ ] Verifica identità business
- [ ] Collega conto bancario
- [ ] Verifica dominio per Apple Pay
- [ ] Configura webhook per URL produzione
- [ ] Testa un pagamento reale di €1

---

## 🔧 Troubleshooting

### Errori Comuni

#### "No API key provided"
```
Soluzione: Verifica che STRIPE_SECRET_KEY sia impostato in .env.local
```

#### "Invalid API key"
```
Soluzione: Verifica che la chiave sia corretta e che stai usando
test keys per test mode e live keys per production
```

#### "Webhook signature verification failed"
```
Soluzione: Verifica che STRIPE_WEBHOOK_SECRET corrisponda
al secret del webhook nel dashboard
```

#### "Payment method not available"
```
Soluzione: Alcuni metodi di pagamento richiedono abilitazione
manuale nel dashboard o non sono disponibili in test mode
```

#### Apple Pay non appare
```
Soluzioni:
1. Verifica che il dominio sia registrato
2. Deve essere HTTPS
3. L'utente deve avere Apple Pay configurato
4. Test solo su Safari/dispositivi Apple
```

### Log e Debug

Per vedere i log dettagliati:

```typescript
// In development
console.log('Stripe session:', session);

// Nel dashboard Stripe
// Vai su Developers → Logs per vedere tutte le richieste API
```

### Contatti Supporto Stripe

- **Documentazione**: https://stripe.com/docs
- **Supporto**: https://support.stripe.com
- **Status**: https://status.stripe.com

---

## 📱 Integrazione Mobile

Se in futuro sviluppi un'app mobile:

### React Native / Expo
```bash
npm install @stripe/stripe-react-native
```

### Flutter
```bash
flutter pub add flutter_stripe
```

---

## 🔒 Sicurezza

### Best Practices

1. **Mai esporre la Secret Key** nel codice client
2. **Usa sempre HTTPS** in produzione
3. **Verifica sempre le firme webhook**
4. **Non loggare dati sensibili** (numeri carta, etc.)
5. **Usa Content Security Policy** appropriata
6. **Aggiorna regolarmente** le dipendenze Stripe

### Compliance

- **PCI DSS**: Stripe gestisce la compliance PCI
- **GDPR**: Implementa privacy policy appropriata
- **SCA (Strong Customer Authentication)**: Automatico con Stripe

---

## 📝 Checklist Pre-Lancio

- [ ] Chiavi API live configurate
- [ ] Webhook endpoint live configurato
- [ ] Dominio verificato per Apple Pay
- [ ] PayPal collegato
- [ ] Klarna abilitato
- [ ] Branding configurato
- [ ] Codici promo creati
- [ ] Email di conferma testate
- [ ] Rimborsi testati
- [ ] Privacy policy aggiornata con metodi pagamento
- [ ] Test pagamento reale effettuato