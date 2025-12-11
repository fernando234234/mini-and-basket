
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RegistrationInsert } from "@/types/registration";
import { tshirtSizes, experienceLevelLabels, packageLabels } from "@/types/registration";
import StripeCheckout from "./StripeCheckout";
import { validatePhoneNumber, validateCodiceFiscale, validationMessages } from "@/lib/validation";
import { isEarlyBird, PACKAGE_PRICES, ADDON_PRICES } from "@/lib/stripe";

// Types
interface ParentInfo {
  nomeCognome: string;
  codiceFiscale: string;
  citta: string;
  cap: string;
  indirizzo: string;
  telefono: string;
  email: string;
}

interface CamperInfo {
  nomeCognome: string;
  codiceFiscale: string;
  luogoNascita: string;
  dataNascita: string;
  sesso: 'M' | 'F' | '';
  citta: string;
  cap: string;
  indirizzo: string;
  scuola: string;
  classe: string;
  taglia: string;
  altezza: string;
  peso: string;
  numeroScarpe: string;
  esperienza: string;
  societa: string;
}

interface MedicalInfo {
  allergieIntolleranze: string;
  patologieNote: string;
  terapieInCorso: string;
}

interface FormData {
  packageType: 'standard' | 'alta_specializzazione' | '';
  busTransfer: boolean;
  parent: ParentInfo;
  camper: CamperInfo;
  medical: MedicalInfo;
  liberatoriaFotoVideo: boolean;
  accettazioneRegolamento: boolean;
  privacyPolicy: boolean;
  codiceInvito: string;
  sameAddress: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// Package options
const packages = [
  {
    id: "standard",
    title: "CAMP STANDARD",
    price: isEarlyBird() ? "€590" : "€610",
    originalPrice: isEarlyBird() ? "€610" : null,
    description: "7 giorni di Camp",
    features: ["Pensione completa", "Assicurazione", "Kit Camp", "Assistenza H24"],
    gradient: "from-brand-green to-emerald-600",
  },
  {
    id: "alta_specializzazione",
    title: "ALTA SPECIALIZZAZIONE",
    price: isEarlyBird() ? "€760" : "€800",
    originalPrice: isEarlyBird() ? "€800" : null,
    description: "+7 ore tecnica individuale",
    features: ["Tutto Standard incluso", "Lavoro personalizzato", "Max 20 posti"],
    gradient: "from-brand-orange to-red-500",
    limited: true,
  },
];

const experienceLevels = [
  { value: "principiante", label: "Non ho mai giocato", icon: "🆕" },
  { value: "intermedio", label: "Gioco al campetto", icon: "🏀" },
  { value: "avanzato", label: "Gioco in una squadra", icon: "⭐" },
];

export default function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [earlyBird, setEarlyBird] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    packageType: '',
    busTransfer: false,
    parent: {
      nomeCognome: '',
      codiceFiscale: '',
      citta: '',
      cap: '',
      indirizzo: '',
      telefono: '',
      email: '',
    },
    camper: {
      nomeCognome: '',
      codiceFiscale: '',
      luogoNascita: '',
      dataNascita: '',
      sesso: '',
      citta: '',
      cap: '',
      indirizzo: '',
      scuola: '',
      classe: '',
      taglia: '',
      altezza: '',
      peso: '',
      numeroScarpe: '',
      esperienza: '',
      societa: '',
    },
    medical: {
      allergieIntolleranze: '',
      patologieNote: '',
      terapieInCorso: '',
    },
    liberatoriaFotoVideo: false,
    accettazioneRegolamento: false,
    privacyPolicy: false,
    codiceInvito: '',
    sameAddress: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setEarlyBird(isEarlyBird());
  }, []);

  const steps = [
    { number: 1, title: "Pacchetto", icon: "📦" },
    { number: 2, title: "Genitore", icon: "👤" },
    { number: 3, title: "Atleta", icon: "🏀" },
    { number: 4, title: "Medico", icon: "🏥" },
    { number: 5, title: "Conferma", icon: "✅" },
    { number: 6, title: "Pagamento", icon: "💳" },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.packageType) {
          newErrors.packageType = "Seleziona un pacchetto";
        }
        break;
      case 2:
        if (!formData.parent.nomeCognome.trim()) {
          newErrors["parent.nomeCognome"] = "Nome e cognome obbligatori";
        }
        if (!formData.parent.citta.trim()) {
          newErrors["parent.citta"] = "Città obbligatoria";
        }
        if (!formData.parent.cap.trim()) {
          newErrors["parent.cap"] = "CAP obbligatorio";
        }
        if (!formData.parent.indirizzo.trim()) {
          newErrors["parent.indirizzo"] = "Indirizzo obbligatorio";
        }
        if (!formData.parent.telefono.trim()) {
          newErrors["parent.telefono"] = "Telefono obbligatorio";
        } else if (!validatePhoneNumber(formData.parent.telefono)) {
          newErrors["parent.telefono"] = validationMessages.phoneInvalid;
        }
        if (!formData.parent.email.trim()) {
          newErrors["parent.email"] = "Email obbligatoria";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parent.email)) {
          newErrors["parent.email"] = "Inserisci un'email valida";
        }
        break;
      case 3:
        if (!formData.camper.nomeCognome.trim()) {
          newErrors["camper.nomeCognome"] = "Nome e cognome obbligatori";
        }
        if (!formData.camper.codiceFiscale.trim()) {
          newErrors["camper.codiceFiscale"] = "Codice fiscale obbligatorio";
        } else if (!validateCodiceFiscale(formData.camper.codiceFiscale)) {
          newErrors["camper.codiceFiscale"] = validationMessages.codiceFiscaleInvalid;
        }
        if (!formData.camper.luogoNascita.trim()) {
          newErrors["camper.luogoNascita"] = "Luogo di nascita obbligatorio";
        }
        if (!formData.camper.dataNascita) {
          newErrors["camper.dataNascita"] = "Data di nascita obbligatoria";
        }
        if (!formData.camper.sesso) {
          newErrors["camper.sesso"] = "Seleziona il sesso";
        }
        if (!formData.sameAddress) {
          if (!formData.camper.citta.trim()) {
            newErrors["camper.citta"] = "Città obbligatoria";
          }
          if (!formData.camper.cap.trim()) {
            newErrors["camper.cap"] = "CAP obbligatorio";
          }
          if (!formData.camper.indirizzo.trim()) {
            newErrors["camper.indirizzo"] = "Indirizzo obbligatorio";
          }
        }
        if (!formData.camper.scuola.trim()) {
          newErrors["camper.scuola"] = "Scuola obbligatoria";
        }
        if (!formData.camper.classe.trim()) {
          newErrors["camper.classe"] = "Classe obbligatoria";
        }
        if (!formData.camper.taglia) {
          newErrors["camper.taglia"] = "Seleziona una taglia";
        }
        if (!formData.camper.altezza.trim()) {
          newErrors["camper.altezza"] = "Altezza obbligatoria";
        }
        if (!formData.camper.peso.trim()) {
          newErrors["camper.peso"] = "Peso obbligatorio";
        }
        if (!formData.camper.numeroScarpe.trim()) {
          newErrors["camper.numeroScarpe"] = "Numero scarpe obbligatorio";
        }
        if (!formData.camper.esperienza) {
          newErrors["camper.esperienza"] = "Seleziona il livello di esperienza";
        }
        break;
      case 4:
        // Medical info is optional, no validation needed
        break;
      case 5:
        if (!formData.liberatoriaFotoVideo) {
          newErrors.liberatoriaFotoVideo = "Devi accettare la liberatoria foto/video";
        }
        if (!formData.accettazioneRegolamento) {
          newErrors.accettazioneRegolamento = "Devi accettare il regolamento";
        }
        if (!formData.privacyPolicy) {
          newErrors.privacyPolicy = "Devi accettare la privacy policy";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Prepare data for Supabase
    const registrationData: RegistrationInsert = {
      package_type: formData.packageType as 'standard' | 'alta_specializzazione',
      bus_transfer: formData.busTransfer,
      genitore_nome_cognome: formData.parent.nomeCognome,
      genitore_codice_fiscale: formData.parent.codiceFiscale || undefined,
      genitore_citta: formData.parent.citta,
      genitore_cap: formData.parent.cap,
      genitore_indirizzo: formData.parent.indirizzo,
      genitore_telefono: formData.parent.telefono,
      genitore_email: formData.parent.email,
      camper_nome_cognome: formData.camper.nomeCognome,
      camper_codice_fiscale: formData.camper.codiceFiscale,
      camper_luogo_nascita: formData.camper.luogoNascita,
      camper_data_nascita: formData.camper.dataNascita,
      camper_sesso: formData.camper.sesso as 'M' | 'F',
      camper_citta: formData.sameAddress ? formData.parent.citta : formData.camper.citta,
      camper_cap: formData.sameAddress ? formData.parent.cap : formData.camper.cap,
      camper_indirizzo: formData.sameAddress ? formData.parent.indirizzo : formData.camper.indirizzo,
      camper_scuola: formData.camper.scuola,
      camper_classe: formData.camper.classe,
      camper_taglia: formData.camper.taglia as 'XXS' | 'XS' | 'S' | 'M' | 'L' | 'XL',
      camper_altezza: parseInt(formData.camper.altezza) || 0,
      camper_peso: parseInt(formData.camper.peso) || 0,
      camper_numero_scarpe: formData.camper.numeroScarpe,
      camper_esperienza: formData.camper.esperienza as 'principiante' | 'intermedio' | 'avanzato',
      camper_societa: formData.camper.societa || undefined,
      allergie_intolleranze: formData.medical.allergieIntolleranze || undefined,
      patologie_note: formData.medical.patologieNote || undefined,
      terapie_in_corso: formData.medical.terapieInCorso || undefined,
      liberatoria_foto_video: formData.liberatoriaFotoVideo,
      accettazione_regolamento: formData.accettazioneRegolamento,
      privacy_policy: formData.privacyPolicy,
      status: 'pending',
      codice_invito: formData.codiceInvito || undefined,
    };

    try {
      // Call the API route which uses the service role key to bypass RLS
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Si è verificato un errore durante l\'invio');
      }

      setRegistrationId(result.registrationId || null);
      setIsSubmitting(false);
      setCurrentStep(6);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(error instanceof Error ? error.message : 'Si è verificato un errore imprevisto. Riprova più tardi.');
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentType: 'full' | 'deposit', sessionId: string) => {
    const params = new URLSearchParams({
      session_id: sessionId,
      registration_id: registrationId || '',
      payment_type: paymentType,
      camper_name: formData.camper.nomeCognome,
      package: formData.packageType,
      email: formData.parent.email,
    });
    router.push(`/iscrizione/success?${params.toString()}`);
  };

  const handlePaymentCancel = () => {
    setCurrentStep(5);
  };

  const handlePayLater = () => {
    setIsSubmitted(true);
  };

  const updateParent = (field: keyof ParentInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      parent: { ...prev.parent, [field]: value },
    }));
    const errorKey = `parent.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const updateCamper = (field: keyof CamperInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      camper: { ...prev.camper, [field]: value },
    }));
    const errorKey = `camper.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const updateMedical = (field: keyof MedicalInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      medical: { ...prev.medical, [field]: value },
    }));
  };

  const selectedPackage = packages.find((p) => p.id === formData.packageType);
  
  const calculateTotal = () => {
    let total = 0;
    if (formData.packageType === 'standard') {
      total = earlyBird ? 590 : 610;
    } else if (formData.packageType === 'alta_specializzazione') {
      total = earlyBird ? 760 : 800;
    }
    if (formData.busTransfer) {
      total += 60;
    }
    return total;
  };

  // Success screen
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center max-w-2xl mx-auto">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-brand-green to-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">
          Iscrizione Registrata!
        </h2>
        <p className="text-brand-gray text-lg mb-6">
          Grazie per aver iscritto {formData.camper.nomeCognome} al Mini & Basket Camp 2026!
        </p>

        {registrationId && (
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-brand-gray mb-1">Numero di riferimento:</p>
            <p className="text-xl font-mono font-bold text-brand-dark">{registrationId}</p>
          </div>
        )}

        <div className="bg-brand-green/10 rounded-2xl p-6 mb-6 text-left">
          <h3 className="font-bold text-brand-dark mb-4 text-center">Riepilogo Iscrizione</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-gray">Atleta:</span>
              <span className="font-semibold text-brand-dark">{formData.camper.nomeCognome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">Pacchetto:</span>
              <span className="font-semibold text-brand-dark">{selectedPackage?.title}</span>
            </div>
            {formData.busTransfer && (
              <div className="flex justify-between">
                <span className="text-brand-gray">Transfer Bus:</span>
                <span className="font-semibold text-brand-dark">€60</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-brand-gray">Totale:</span>
              <span className="font-bold text-brand-orange text-lg">€{calculateTotal()}</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-8">
          <p className="text-yellow-800 font-semibold">
            ⚠️ Ricorda di completare il pagamento!
          </p>
          <p className="text-sm text-yellow-700 mt-1">
            Acconto di €200 entro l&apos;iscrizione<br />
            Saldo entro il 31 Maggio 2026
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-8">
          <p className="text-blue-700 font-semibold">
            📧 Ti abbiamo inviato un&apos;email di conferma a:
          </p>
          <p className="text-brand-dark font-bold text-lg">{formData.parent.email}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-brand-green to-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Torna alla Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
            <div
              className="h-full bg-gradient-to-r from-brand-green to-brand-orange transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            />
          </div>

          {steps.map((step) => (
            <div
              key={step.number}
              className={`flex flex-col items-center ${
                step.number <= currentStep ? "text-brand-green" : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                  step.number < currentStep
                    ? "bg-brand-green text-white"
                    : step.number === currentStep
                    ? "bg-gradient-to-br from-brand-green to-emerald-500 text-white shadow-lg scale-110"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.number < currentStep ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span className="mt-2 text-xs font-semibold hidden sm:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
        {/* Step 1: Package Selection */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Scegli il tuo pacchetto</h2>
            <p className="text-brand-gray mb-6">Camp 2026: 28 Giugno - 5 Luglio | Villaggio Bahja, Paola (CS)</p>

            {earlyBird && (
              <div className="mb-6 bg-gradient-to-r from-brand-orange/10 to-red-100 border border-brand-orange/30 rounded-xl p-4">
                <p className="text-brand-orange font-bold flex items-center gap-2">
                  <span>⏰</span> Early Bird Attivo! Risparmia fino a €40 - Scade il 28 Feb 2026
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, packageType: pkg.id as 'standard' | 'alta_specializzazione' }));
                    if (errors.packageType) {
                      setErrors(prev => ({ ...prev, packageType: "" }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFormData(prev => ({ ...prev, packageType: pkg.id as 'standard' | 'alta_specializzazione' }));
                    }
                  }}
                  className={`relative p-6 rounded-2xl text-left transition-all duration-300 cursor-pointer select-none ${
                    formData.packageType === pkg.id
                      ? "ring-4 ring-brand-green shadow-xl scale-[1.02] bg-brand-green/5"
                      : "border-2 border-gray-200 hover:border-brand-green hover:shadow-lg bg-white"
                  }`}
                >
                  {pkg.limited && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                      🏆 MAX 20 POSTI
                    </span>
                  )}
                  <div className={`h-2 rounded-full bg-gradient-to-r ${pkg.gradient} mb-4`} />
                  <h3 className="font-bold text-brand-dark text-lg">{pkg.title}</h3>
                  <div className="flex items-end gap-2 my-2">
                    <span className={`text-3xl font-black bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}>
                      {pkg.price}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">{pkg.originalPrice}</span>
                    )}
                  </div>
                  <p className="text-sm text-brand-gray mb-3">{pkg.description}</p>
                  <ul className="space-y-1">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="text-xs text-brand-gray flex items-center gap-1">
                        <svg className="w-4 h-4 text-brand-green" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {formData.packageType === pkg.id && (
                    <div className="absolute top-4 right-4">
                      <div className="w-6 h-6 bg-brand-green rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.packageType && (
              <p className="mt-2 text-sm text-red-500">{errors.packageType}</p>
            )}

            {/* Bus Transfer Option */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <label className="flex items-center gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.busTransfer}
                  onChange={(e) => setFormData(prev => ({ ...prev, busTransfer: e.target.checked }))}
                  className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <div className="flex-1">
                  <span className="font-semibold text-brand-dark flex items-center gap-2">
                    <span>🚌</span> Transfer Bus Napoli A/R
                  </span>
                  <p className="text-sm text-brand-gray">Partenza da Napoli e/o provincia</p>
                </div>
                <span className="font-bold text-blue-600">+€60</span>
              </label>
            </div>

            {/* Total */}
            {formData.packageType && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-brand-gray">Totale:</span>
                  <span className="text-2xl font-black text-brand-dark">€{calculateTotal()}</span>
                </div>
                <p className="text-sm text-brand-gray mt-1">Acconto richiesto: €200</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Parent Information */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Dati Genitore/Tutore</h2>
            <p className="text-brand-gray mb-6">Inserisci i dati del genitore o tutore legale</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Nome e Cognome *
                </label>
                <input
                  type="text"
                  value={formData.parent.nomeCognome}
                  onChange={(e) => updateParent("nomeCognome", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.nomeCognome"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Es: Mario Rossi"
                />
                {errors["parent.nomeCognome"] && <p className="mt-1 text-sm text-red-500">{errors["parent.nomeCognome"]}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Codice Fiscale <span className="text-brand-gray font-normal">(opzionale)</span>
                </label>
                <input
                  type="text"
                  value={formData.parent.codiceFiscale}
                  onChange={(e) => updateParent("codiceFiscale", e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none uppercase"
                  placeholder="RSSMRA80A01H501Z"
                  maxLength={16}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Città *</label>
                <input
                  type="text"
                  value={formData.parent.citta}
                  onChange={(e) => updateParent("citta", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.citta"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Es: Napoli"
                />
                {errors["parent.citta"] && <p className="mt-1 text-sm text-red-500">{errors["parent.citta"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">CAP *</label>
                <input
                  type="text"
                  value={formData.parent.cap}
                  onChange={(e) => updateParent("cap", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.cap"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="80100"
                  maxLength={5}
                />
                {errors["parent.cap"] && <p className="mt-1 text-sm text-red-500">{errors["parent.cap"]}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Indirizzo *</label>
                <input
                  type="text"
                  value={formData.parent.indirizzo}
                  onChange={(e) => updateParent("indirizzo", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.indirizzo"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Via Roma, 123"
                />
                {errors["parent.indirizzo"] && <p className="mt-1 text-sm text-red-500">{errors["parent.indirizzo"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Telefono *</label>
                <input
                  type="tel"
                  value={formData.parent.telefono}
                  onChange={(e) => updateParent("telefono", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.telefono"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="+39 333 1234567"
                />
                {errors["parent.telefono"] && <p className="mt-1 text-sm text-red-500">{errors["parent.telefono"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.parent.email}
                  onChange={(e) => updateParent("email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.email"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="mario.rossi@email.com"
                />
                {errors["parent.email"] && <p className="mt-1 text-sm text-red-500">{errors["parent.email"]}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Camper Information */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Dati Atleta</h2>
            <p className="text-brand-gray mb-6">Inserisci i dati del partecipante al camp</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Nome e Cognome *</label>
                <input
                  type="text"
                  value={formData.camper.nomeCognome}
                  onChange={(e) => updateCamper("nomeCognome", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.nomeCognome"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Es: Marco Rossi"
                />
                {errors["camper.nomeCognome"] && <p className="mt-1 text-sm text-red-500">{errors["camper.nomeCognome"]}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Codice Fiscale *</label>
                <input
                  type="text"
                  value={formData.camper.codiceFiscale}
                  onChange={(e) => updateCamper("codiceFiscale", e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none uppercase ${
                    errors["camper.codiceFiscale"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="RSSMRC10A01H501Z"
                  maxLength={16}
                />
                {errors["camper.codiceFiscale"] && <p className="mt-1 text-sm text-red-500">{errors["camper.codiceFiscale"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Luogo di Nascita *</label>
                <input
                  type="text"
                  value={formData.camper.luogoNascita}
                  onChange={(e) => updateCamper("luogoNascita", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.luogoNascita"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Es: Napoli"
                />
                {errors["camper.luogoNascita"] && <p className="mt-1 text-sm text-red-500">{errors["camper.luogoNascita"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Data di Nascita *</label>
                <input
                  type="date"
                  value={formData.camper.dataNascita}
                  onChange={(e) => updateCamper("dataNascita", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.dataNascita"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors["camper.dataNascita"] && <p className="mt-1 text-sm text-red-500">{errors["camper.dataNascita"]}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Sesso *</label>
                <div className="flex gap-4">
                  {[{ value: 'M', label: 'Maschio' }, { value: 'F', label: 'Femmina' }].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateCamper("sesso", option.value)}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                        formData.camper.sesso === option.value
                          ? "bg-brand-green text-white"
                          : "bg-gray-100 text-brand-gray hover:bg-brand-green/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {errors["camper.sesso"] && <p className="mt-1 text-sm text-red-500">{errors["camper.sesso"]}</p>}
              </div>

              {/* Address Same as Parent */}
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    checked={formData.sameAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, sameAddress: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                  />
                  <span className="text-brand-dark font-medium">Residenza uguale al genitore/tutore</span>
                </label>
              </div>

              {!formData.sameAddress && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">Città *</label>
                    <input
                      type="text"
                      value={formData.camper.citta}
                      onChange={(e) => updateCamper("citta", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors["camper.citta"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                      }`}
                    />
                    {errors["camper.citta"] && <p className="mt-1 text-sm text-red-500">{errors["camper.citta"]}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brand-dark mb-2">CAP *</label>
                    <input
                      type="text"
                      value={formData.camper.cap}
                      onChange={(e) => updateCamper("cap", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors["camper.cap"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                      }`}
                      maxLength={5}
                    />
                    {errors["camper.cap"] && <p className="mt-1 text-sm text-red-500">{errors["camper.cap"]}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-brand-dark mb-2">Indirizzo *</label>
                    <input
                      type="text"
                      value={formData.camper.indirizzo}
                      onChange={(e) => updateCamper("indirizzo", e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                        errors["camper.indirizzo"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                      }`}
                    />
                    {errors["camper.indirizzo"] && <p className="mt-1 text-sm text-red-500">{errors["camper.indirizzo"]}</p>}
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Scuola Frequentata *</label>
                <input
                  type="text"
                  value={formData.camper.scuola}
                  onChange={(e) => updateCamper("scuola", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.scuola"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Es: Scuola Media Carducci"
                />
                {errors["camper.scuola"] && <p className="mt-1 text-sm text-red-500">{errors["camper.scuola"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Classe *</label>
                <input
                  type="text"
                  value={formData.camper.classe}
                  onChange={(e) => updateCamper("classe", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.classe"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Es: 2° Media"
                />
                {errors["camper.classe"] && <p className="mt-1 text-sm text-red-500">{errors["camper.classe"]}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Taglia Maglietta *</label>
                <div className="flex flex-wrap gap-2">
                  {tshirtSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateCamper("taglia", size)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                        formData.camper.taglia === size
                          ? "bg-brand-green text-white"
                          : "bg-gray-100 text-brand-gray hover:bg-brand-green/10"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors["camper.taglia"] && <p className="mt-1 text-sm text-red-500">{errors["camper.taglia"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Altezza (cm) *</label>
                <input
                  type="number"
                  value={formData.camper.altezza}
                  onChange={(e) => updateCamper("altezza", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.altezza"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="165"
                />
                {errors["camper.altezza"] && <p className="mt-1 text-sm text-red-500">{errors["camper.altezza"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Peso (kg) *</label>
                <input
                  type="number"
                  value={formData.camper.peso}
                  onChange={(e) => updateCamper("peso", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.peso"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="55"
                />
                {errors["camper.peso"] && <p className="mt-1 text-sm text-red-500">{errors["camper.peso"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Numero Scarpe (EU) *</label>
                <input
                  type="text"
                  value={formData.camper.numeroScarpe}
                  onChange={(e) => updateCamper("numeroScarpe", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.numeroScarpe"] ? "border-red-400 bg-red-50" : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="40"
                />
                {errors["camper.numeroScarpe"] && <p className="mt-1 text-sm text-red-500">{errors["camper.numeroScarpe"]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">Società Sportiva</label>
                <input
                  type="text"
                  value={formData.camper.societa}
                  onChange={(e) => updateCamper("societa", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none"
                  placeholder="Es: Basket Napoli ASD"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Livello di Esperienza *</label>
                <div className="grid grid-cols-3 gap-3">
                  {experienceLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateCamper("esperienza", level.value)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex flex-col items-center gap-1 ${
                        formData.camper.esperienza === level.value
                          ? "bg-brand-orange text-white"
                          : "bg-gray-100 text-brand-gray hover:bg-brand-orange/10"
                      }`}
                    >
                      <span className="text-xl">{level.icon}</span>
                      <span className="text-xs text-center">{level.label}</span>
                    </button>
                  ))}
                </div>
                {errors["camper.esperienza"] && <p className="mt-1 text-sm text-red-500">{errors["camper.esperienza"]}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Medical Information */}
        {currentStep === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Informazioni Mediche</h2>
            <p className="text-brand-gray mb-6">Queste informazioni sono opzionali ma importanti per la sicurezza dell&apos;atleta</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Allergie e Intolleranze Alimentari
                </label>
                <textarea
                  value={formData.medical.allergieIntolleranze}
                  onChange={(e) => updateMedical("allergieIntolleranze", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Es: Allergia alle arachidi, intolleranza al lattosio..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Patologie Note
                </label>
                <textarea
                  value={formData.medical.patologieNote}
                  onChange={(e) => updateMedical("patologieNote", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Es: Asma, diabete..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Terapie in Corso
                </label>
                <textarea
                  value={formData.medical.terapieInCorso}
                  onChange={(e) => updateMedical("terapieInCorso", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Specificare farmaci e posologie..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm flex items-start gap-2">
                  <span className="text-lg">ℹ️</span>
                  <span>
                    <strong>Certificato medico:</strong> Per partecipare al camp è necessario il certificato per attività 
                    sportiva agonistica rilasciato dal medico sportivo. Il certificato deve essere consegnato all&apos;arrivo.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review and Confirm */}
        {currentStep === 5 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Riepilogo e Conferma</h2>
            <p className="text-brand-gray mb-6">Verifica i dati inseriti e accetta i consensi</p>

            {/* Summary Cards */}
            <div className="space-y-4 mb-8">
              <div className="bg-gradient-to-r from-brand-green/10 to-brand-orange/10 rounded-2xl p-5">
                <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
                  <span>📦</span> Pacchetto Selezionato
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-dark">{selectedPackage?.title}</span>
                    {formData.busTransfer && (
                      <p className="text-sm text-brand-gray">+ Transfer Bus Napoli</p>
                    )}
                  </div>
                  <span className="text-2xl font-black text-brand-orange">€{calculateTotal()}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
                  <span>👤</span> Genitore/Tutore
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-brand-gray">Nome:</span>
                    <span className="font-semibold text-brand-dark ml-2">{formData.parent.nomeCognome}</span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Email:</span>
                    <span className="font-semibold text-brand-dark ml-2">{formData.parent.email}</span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Telefono:</span>
                    <span className="font-semibold text-brand-dark ml-2">{formData.parent.telefono}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5">
                <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
                  <span>🏀</span> Atleta
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-brand-gray">Nome:</span>
                    <span className="font-semibold text-brand-dark ml-2">{formData.camper.nomeCognome}</span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Data nascita:</span>
                    <span className="font-semibold text-brand-dark ml-2">{formData.camper.dataNascita}</span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Taglia:</span>
                    <span className="font-semibold text-brand-dark ml-2">{formData.camper.taglia}</span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Esperienza:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {experienceLevels.find(l => l.value === formData.camper.esperienza)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Consents */}
            <div className="space-y-4 mb-6">
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.liberatoriaFotoVideo ? "border-brand-green bg-brand-green/5" : "border-gray-200 hover:border-brand-green"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.liberatoriaFotoVideo}
                  onChange={(e) => setFormData(prev => ({ ...prev, liberatoriaFotoVideo: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <div>
                  <span className="font-semibold text-brand-dark">
                    Liberatoria Foto e Video *
                  </span>
                  <p className="text-sm text-brand-gray mt-1">
                    Autorizzo la pubblicazione di immagini e video realizzati durante le attività del camp.
                  </p>
                </div>
              </label>
              {errors.liberatoriaFotoVideo && (
                <p className="text-sm text-red-500">{errors.liberatoriaFotoVideo}</p>
              )}

              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.accettazioneRegolamento ? "border-brand-green bg-brand-green/5" : "border-gray-200 hover:border-brand-green"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.accettazioneRegolamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, accettazioneRegolamento: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <div>
                  <span className="font-semibold text-brand-dark">
                    Accetto il Regolamento del Camp *
                  </span>
                  <p className="text-sm text-brand-gray mt-1">
                    Ho letto e accetto il <Link href="/regolamento" className="text-brand-green underline" target="_blank">regolamento del Mini&Basket Camp</Link>.
                  </p>
                </div>
              </label>
              {errors.accettazioneRegolamento && (
                <p className="text-sm text-red-500">{errors.accettazioneRegolamento}</p>
              )}

              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.privacyPolicy ? "border-brand-green bg-brand-green/5" : "border-gray-200 hover:border-brand-green"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.privacyPolicy}
                  onChange={(e) => setFormData(prev => ({ ...prev, privacyPolicy: e.target.checked }))}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <div>
                  <span className="font-semibold text-brand-dark">
                    Accetto la Privacy Policy *
                  </span>
                  <p className="text-sm text-brand-gray mt-1">
                    Autorizzo il trattamento dei dati personali secondo il <Link href="/privacy" className="text-brand-green underline" target="_blank">Regolamento Europeo N. 679/2016</Link>.
                  </p>
                </div>
              </label>
              {errors.privacyPolicy && (
                <p className="text-sm text-red-500">{errors.privacyPolicy}</p>
              )}
            </div>

            {/* Invitation Code */}
            <div className="mt-6">
              <label className="block text-sm font-semibold text-brand-dark mb-2">
                Codice Invito <span className="text-brand-gray font-normal">(opzionale)</span>
              </label>
              <input
                type="text"
                value={formData.codiceInvito}
                onChange={(e) => setFormData(prev => ({ ...prev, codiceInvito: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none uppercase"
                placeholder="Inserisci il codice se ne hai uno"
              />
            </div>
          </div>
        )}

        {/* Step 6: Payment */}
        {currentStep === 6 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">Pagamento</h2>
            <p className="text-brand-gray mb-6">Completa il pagamento per confermare la tua iscrizione</p>

            <StripeCheckout
              packageType={formData.packageType}
              registrationData={{
                id: registrationId || undefined,
                participantName: formData.camper.nomeCognome,
                email: formData.parent.email,
              }}
              onSuccess={handlePaymentSuccess}
              onCancel={handlePaymentCancel}
            />

            {/* Pay Later Option */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePayLater}
                className="w-full text-center text-brand-gray hover:text-brand-dark font-medium transition-colors"
              >
                Preferisci pagare dopo? <span className="underline">Completa senza pagamento</span>
              </button>
              <p className="text-sm text-brand-gray text-center mt-2">
                Nota: Il tuo posto sarà riservato ma non confermato fino al pagamento dell&apos;acconto
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons - Only show for steps 1-5 */}
        {currentStep <= 5 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 text-brand-gray hover:text-brand-dark font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Indietro
              </button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-brand-green to-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                Avanti
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <div className="flex flex-col items-end gap-2">
                {submitError && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-lg">
                    {submitError}
                  </p>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`bg-gradient-to-r from-brand-orange to-red-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 flex items-center gap-2 ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-lg hover:scale-105"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Invio in corso...</span>
                    </>
                  ) : (
                    <>
                      <span>PROCEDI AL PAGAMENTO</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}