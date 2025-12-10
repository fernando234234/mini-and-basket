"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { RegistrationInsert } from "@/types/registration";
import StripeCheckout from "./StripeCheckout";
import { validatePhoneNumber, validateCodiceFiscale, validationMessages } from "@/lib/validation";

// Types
interface CamperInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  tshirtSize: string;
  experience: string;
  allergies: string;
  medicalConditions: string;
}

interface ParentInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  codiceFiscale: string;
  address: string;
  city: string;
  cap: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface FormData {
  package: string;
  camper: CamperInfo;
  parent: ParentInfo;
  emergency: EmergencyContact;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}

interface FormErrors {
  [key: string]: string;
}

// Package options
const packages = [
  {
    id: "giornaliero",
    title: "PACCHETTO GIORNALIERO",
    price: "€250",
    description: "7 giorni di camp",
    features: ["Alloggio Incluso", "3 Pasti al Giorno", "Kit Camp"],
    gradient: "from-slate-600 to-slate-800",
  },
  {
    id: "settimanale",
    title: "SETTIMANA COMPLETA",
    price: "€450",
    originalPrice: "€550",
    description: "8 giorni completi",
    features: ["Tutto incluso", "Foto e Video", "Certificato"],
    gradient: "from-brand-orange to-red-500",
    popular: true,
  },
  {
    id: "weekend",
    title: "PACCHETTO WEEKEND",
    price: "€150",
    description: "2 giorni intensivi",
    features: ["Alloggio Incluso", "3 Pasti al Giorno"],
    gradient: "from-brand-green to-emerald-600",
  },
];

const tshirtSizes = ["XS", "S", "M", "L", "XL"];
const experienceLevels = [
  { value: "none", label: "Nessuna esperienza" },
  { value: "1-2", label: "1-2 anni" },
  { value: "3+", label: "3+ anni" },
];
const relationships = [
  "Genitore",
  "Nonno/Nonna",
  "Zio/Zia",
  "Altro familiare",
  "Altro",
];

export default function RegistrationWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    package: "",
    camper: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      tshirtSize: "",
      experience: "",
      allergies: "",
      medicalConditions: "",
    },
    parent: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      codiceFiscale: "",
      address: "",
      city: "",
      cap: "",
    },
    emergency: {
      name: "",
      relationship: "",
      phone: "",
    },
    acceptTerms: false,
    acceptPrivacy: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const router = useRouter();
  const [showPayment, setShowPayment] = useState(false);

  const steps = [
    { number: 1, title: "Pacchetto", icon: "📦" },
    { number: 2, title: "Atleta", icon: "🏀" },
    { number: 3, title: "Genitore", icon: "👤" },
    { number: 4, title: "Emergenza", icon: "🚨" },
    { number: 5, title: "Conferma", icon: "✅" },
    { number: 6, title: "Pagamento", icon: "💳" },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1:
        if (!formData.package) {
          newErrors.package = "Seleziona un pacchetto";
        }
        break;
      case 2:
        if (!formData.camper.firstName.trim()) {
          newErrors["camper.firstName"] = "Il nome è obbligatorio";
        }
        if (!formData.camper.lastName.trim()) {
          newErrors["camper.lastName"] = "Il cognome è obbligatorio";
        }
        if (!formData.camper.dateOfBirth) {
          newErrors["camper.dateOfBirth"] = "La data di nascita è obbligatoria";
        }
        if (!formData.camper.tshirtSize) {
          newErrors["camper.tshirtSize"] = "Seleziona una taglia";
        }
        if (!formData.camper.experience) {
          newErrors["camper.experience"] = "Seleziona il livello di esperienza";
        }
        break;
      case 3:
        if (!formData.parent.firstName.trim()) {
          newErrors["parent.firstName"] = "Il nome è obbligatorio";
        }
        if (!formData.parent.lastName.trim()) {
          newErrors["parent.lastName"] = "Il cognome è obbligatorio";
        }
        if (!formData.parent.email.trim()) {
          newErrors["parent.email"] = "L'email è obbligatoria";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.parent.email)) {
          newErrors["parent.email"] = "Inserisci un'email valida";
        }
        if (!formData.parent.phone.trim()) {
          newErrors["parent.phone"] = "Il telefono è obbligatorio";
        } else if (!validatePhoneNumber(formData.parent.phone)) {
          newErrors["parent.phone"] = validationMessages.phoneInvalid;
        }
        if (!formData.parent.codiceFiscale.trim()) {
          newErrors["parent.codiceFiscale"] = "Il codice fiscale è obbligatorio";
        } else if (!validateCodiceFiscale(formData.parent.codiceFiscale)) {
          newErrors["parent.codiceFiscale"] = validationMessages.codiceFiscaleInvalid;
        }
        if (!formData.parent.address.trim()) {
          newErrors["parent.address"] = "L'indirizzo è obbligatorio";
        }
        if (!formData.parent.city.trim()) {
          newErrors["parent.city"] = "La città è obbligatoria";
        }
        if (!formData.parent.cap.trim()) {
          newErrors["parent.cap"] = "Il CAP è obbligatorio";
        }
        break;
      case 4:
        if (!formData.emergency.name.trim()) {
          newErrors["emergency.name"] = "Il nome è obbligatorio";
        }
        if (!formData.emergency.relationship) {
          newErrors["emergency.relationship"] = "Seleziona la relazione";
        }
        if (!formData.emergency.phone.trim()) {
          newErrors["emergency.phone"] = "Il telefono è obbligatorio";
        } else if (!validatePhoneNumber(formData.emergency.phone)) {
          newErrors["emergency.phone"] = validationMessages.phoneInvalid;
        }
        break;
      case 5:
        if (!formData.acceptTerms) {
          newErrors.acceptTerms = "Devi accettare i termini e condizioni";
        }
        if (!formData.acceptPrivacy) {
          newErrors.acceptPrivacy = "Devi accettare la privacy policy";
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

    // Map package id to the correct type
    const packageTypeMap: Record<string, 'giornaliero' | 'completa' | 'weekend'> = {
      'giornaliero': 'giornaliero',
      'settimanale': 'completa',
      'weekend': 'weekend'
    };

    // Map experience to the correct type
    const experienceMap: Record<string, 'nessuna' | '1-2-anni' | '3+-anni'> = {
      'none': 'nessuna',
      '1-2': '1-2-anni',
      '3+': '3+-anni'
    };

    // Prepare data for Supabase
    const registrationData: RegistrationInsert = {
      package_type: packageTypeMap[formData.package] || 'completa',
      camper_nome: formData.camper.firstName,
      camper_cognome: formData.camper.lastName,
      camper_data_nascita: formData.camper.dateOfBirth,
      camper_taglia: formData.camper.tshirtSize as 'XS' | 'S' | 'M' | 'L' | 'XL',
      camper_esperienza: experienceMap[formData.camper.experience] || 'nessuna',
      camper_allergie: formData.camper.allergies || undefined,
      camper_note_mediche: formData.camper.medicalConditions || undefined,
      genitore_nome: formData.parent.firstName,
      genitore_cognome: formData.parent.lastName,
      genitore_email: formData.parent.email,
      genitore_telefono: formData.parent.phone,
      genitore_codice_fiscale: formData.parent.codiceFiscale,
      genitore_indirizzo: `${formData.parent.address}, ${formData.parent.cap} ${formData.parent.city}`,
      emergenza_nome: formData.emergency.name,
      emergenza_relazione: formData.emergency.relationship,
      emergenza_telefono: formData.emergency.phone,
      status: 'pending',
      terms_accepted: formData.acceptTerms,
      privacy_accepted: formData.acceptPrivacy,
    };

    try {
      // Check if Supabase is configured
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase
          .from('registrations')
          .insert([registrationData])
          .select()
          .single();

        if (error) {
          console.error('Supabase error:', error);
          setSubmitError('Si è verificato un errore durante l\'invio. Riprova più tardi.');
          setIsSubmitting(false);
          return;
        }

        setRegistrationId(data?.id || null);
      } else {
        // Supabase not configured - simulate success for development
        console.log('Supabase not configured. Registration data:', registrationData);
        // Generate a fake ID for development
        setRegistrationId(`DEV-${Date.now().toString(36).toUpperCase()}`);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      setIsSubmitting(false);
      // Move to payment step instead of showing success
      setCurrentStep(6);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError('Si è verificato un errore imprevisto. Riprova più tardi.');
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentType: 'full' | 'deposit', sessionId: string) => {
    // Navigate to success page with registration details
    const params = new URLSearchParams({
      session_id: sessionId,
      registration_id: registrationId || '',
      payment_type: paymentType,
      camper_name: `${formData.camper.firstName} ${formData.camper.lastName}`,
      package: formData.package,
      email: formData.parent.email,
    });
    router.push(`/iscrizione/success?${params.toString()}`);
  };

  const handlePaymentCancel = () => {
    // Go back to review step
    setCurrentStep(5);
  };

  const handlePayLater = () => {
    // Skip payment and go to success without payment
    setIsSubmitted(true);
  };

  const updateFormData = (
    section: keyof FormData,
    field: string,
    value: string | boolean
  ) => {
    if (section === "acceptTerms" || section === "acceptPrivacy" || section === "package") {
      setFormData((prev) => ({ ...prev, [section]: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as object),
          [field]: value,
        },
      }));
    }
    // Clear error
    const errorKey = section === "package" || section === "acceptTerms" || section === "acceptPrivacy" 
      ? section 
      : `${section}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({ ...prev, [errorKey]: "" }));
    }
  };

  const selectedPackage = packages.find((p) => p.id === formData.package);

  // Success screen
  if (isSubmitted) {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center max-w-2xl mx-auto">
        <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-brand-green to-emerald-500 rounded-full flex items-center justify-center animate-scale-in">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-brand-dark mb-4">
          Iscrizione Completata!
        </h2>
        <p className="text-brand-gray text-lg mb-6">
          Grazie per aver iscritto {formData.camper.firstName} al Mini & Basket Camp 2025!
        </p>

        {/* Reference Number */}
        {registrationId && (
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-brand-gray mb-1">Numero di riferimento:</p>
            <p className="text-xl font-mono font-bold text-brand-dark">{registrationId}</p>
          </div>
        )}

        {/* Registration Summary */}
        <div className="bg-brand-green/10 rounded-2xl p-6 mb-6 text-left">
          <h3 className="font-bold text-brand-dark mb-4 text-center">Riepilogo Iscrizione</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-gray">Atleta:</span>
              <span className="font-semibold text-brand-dark">{formData.camper.firstName} {formData.camper.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">Pacchetto:</span>
              <span className="font-semibold text-brand-dark">{selectedPackage?.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-gray">Prezzo:</span>
              <span className="font-bold text-brand-orange">{selectedPackage?.price}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-8">
          <p className="text-blue-700 font-semibold">
            📧 Ti abbiamo inviato un&apos;email di conferma a:
          </p>
          <p className="text-brand-dark font-bold text-lg">{formData.parent.email}</p>
          <p className="text-sm text-blue-600 mt-2">
            Controlla anche la cartella spam se non la trovi.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-gradient-to-r from-brand-green to-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Torna alla Home
          </Link>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setCurrentStep(1);
              setFormData({
                package: "",
                camper: {
                  firstName: "",
                  lastName: "",
                  dateOfBirth: "",
                  tshirtSize: "",
                  experience: "",
                  allergies: "",
                  medicalConditions: "",
                },
                parent: {
                  firstName: "",
                  lastName: "",
                  email: "",
                  phone: "",
                  codiceFiscale: "",
                  address: "",
                  city: "",
                  cap: "",
                },
                emergency: {
                  name: "",
                  relationship: "",
                  phone: "",
                },
                acceptTerms: false,
                acceptPrivacy: false,
              });
            }}
            className="border-2 border-brand-green text-brand-green font-bold py-3 px-8 rounded-full transition-all duration-300 hover:bg-brand-green hover:text-white"
          >
            Nuova Iscrizione
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
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
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.icon
                )}
              </div>
              <span className="mt-2 text-xs font-semibold hidden sm:block">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl">
        {/* Step 1: Package Selection */}
        {currentStep === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">
              Scegli il tuo pacchetto
            </h2>
            <p className="text-brand-gray mb-6">
              Seleziona il pacchetto più adatto alle tue esigenze
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, package: pkg.id }));
                    if (errors.package) {
                      setErrors(prev => ({ ...prev, package: "" }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setFormData(prev => ({ ...prev, package: pkg.id }));
                      if (errors.package) {
                        setErrors(prev => ({ ...prev, package: "" }));
                      }
                    }
                  }}
                  className={`relative p-6 rounded-2xl text-left transition-all duration-300 cursor-pointer select-none ${
                    formData.package === pkg.id
                      ? "ring-4 ring-brand-green shadow-xl scale-[1.02] bg-brand-green/5"
                      : "border-2 border-gray-200 hover:border-brand-green hover:shadow-lg bg-white"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                      🔥 Più Popolare
                    </span>
                  )}
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${pkg.gradient} mb-4`}
                  />
                  <h3 className="font-bold text-brand-dark">{pkg.title}</h3>
                  <div className="flex items-end gap-2 my-2">
                    <span
                      className={`text-3xl font-black bg-gradient-to-r ${pkg.gradient} bg-clip-text text-transparent`}
                    >
                      {pkg.price}
                    </span>
                    {pkg.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        {pkg.originalPrice}
                      </span>
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
                  {formData.package === pkg.id && (
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
            {errors.package && (
              <p className="mt-4 text-sm text-red-500">{errors.package}</p>
            )}
          </div>
        )}

        {/* Step 2: Camper Information */}
        {currentStep === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">
              Informazioni Atleta
            </h2>
            <p className="text-brand-gray mb-6">
              Inserisci i dati del giovane partecipante
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.camper.firstName}
                  onChange={(e) => updateFormData("camper", "firstName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.firstName"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Mario"
                />
                {errors["camper.firstName"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["camper.firstName"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Cognome *
                </label>
                <input
                  type="text"
                  value={formData.camper.lastName}
                  onChange={(e) => updateFormData("camper", "lastName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.lastName"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Rossi"
                />
                {errors["camper.lastName"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["camper.lastName"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Data di Nascita *
                </label>
                <input
                  type="date"
                  value={formData.camper.dateOfBirth}
                  onChange={(e) => updateFormData("camper", "dateOfBirth", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["camper.dateOfBirth"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                />
                {errors["camper.dateOfBirth"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["camper.dateOfBirth"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Taglia T-Shirt *
                </label>
                <div className="flex gap-2">
                  {tshirtSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => updateFormData("camper", "tshirtSize", size)}
                      className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${
                        formData.camper.tshirtSize === size
                          ? "bg-brand-green text-white"
                          : "bg-gray-100 text-brand-gray hover:bg-brand-green/10"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {errors["camper.tshirtSize"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["camper.tshirtSize"]}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Esperienza Basket *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {experienceLevels.map((level) => (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => updateFormData("camper", "experience", level.value)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                        formData.camper.experience === level.value
                          ? "bg-brand-orange text-white"
                          : "bg-gray-100 text-brand-gray hover:bg-brand-orange/10"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
                {errors["camper.experience"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["camper.experience"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Allergie (opzionale)
                </label>
                <textarea
                  value={formData.camper.allergies}
                  onChange={(e) => updateFormData("camper", "allergies", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Es: Allergia alle arachidi..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Condizioni Mediche (opzionale)
                </label>
                <textarea
                  value={formData.camper.medicalConditions}
                  onChange={(e) => updateFormData("camper", "medicalConditions", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white transition-all duration-300 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Es: Asma, diabete..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Parent Information */}
        {currentStep === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">
              Informazioni Genitore/Tutore
            </h2>
            <p className="text-brand-gray mb-6">
              Inserisci i dati del genitore o tutore legale
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.parent.firstName}
                  onChange={(e) => updateFormData("parent", "firstName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.firstName"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Giuseppe"
                />
                {errors["parent.firstName"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["parent.firstName"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Cognome *
                </label>
                <input
                  type="text"
                  value={formData.parent.lastName}
                  onChange={(e) => updateFormData("parent", "lastName", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.lastName"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Rossi"
                />
                {errors["parent.lastName"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["parent.lastName"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.parent.email}
                  onChange={(e) => updateFormData("parent", "email", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.email"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="giuseppe.rossi@email.com"
                />
                {errors["parent.email"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["parent.email"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Telefono *
                </label>
                <input
                  type="tel"
                  value={formData.parent.phone}
                  onChange={(e) => updateFormData("parent", "phone", e.target.value)}
                  onBlur={() => {
                    if (formData.parent.phone.trim() && !validatePhoneNumber(formData.parent.phone)) {
                      setErrors(prev => ({ ...prev, "parent.phone": validationMessages.phoneInvalid }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.phone"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="+39 333 1234567"
                />
                {errors["parent.phone"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["parent.phone"]}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Codice Fiscale *
                </label>
                <input
                  type="text"
                  value={formData.parent.codiceFiscale}
                  onChange={(e) => updateFormData("parent", "codiceFiscale", e.target.value.toUpperCase())}
                  onBlur={() => {
                    if (formData.parent.codiceFiscale.trim() && !validateCodiceFiscale(formData.parent.codiceFiscale)) {
                      setErrors(prev => ({ ...prev, "parent.codiceFiscale": validationMessages.codiceFiscaleInvalid }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none uppercase ${
                    errors["parent.codiceFiscale"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="RSSGPP80A01H501Z"
                  maxLength={16}
                />
                {errors["parent.codiceFiscale"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["parent.codiceFiscale"]}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Indirizzo *
                </label>
                <input
                  type="text"
                  value={formData.parent.address}
                  onChange={(e) => updateFormData("parent", "address", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.address"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Via Roma, 123"
                />
                {errors["parent.address"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["parent.address"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Città *
                </label>
                <input
                  type="text"
                  value={formData.parent.city}
                  onChange={(e) => updateFormData("parent", "city", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.city"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Milano"
                />
                {errors["parent.city"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["parent.city"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  CAP *
                </label>
                <input
                  type="text"
                  value={formData.parent.cap}
                  onChange={(e) => updateFormData("parent", "cap", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["parent.cap"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="20100"
                  maxLength={5}
                />
                {errors["parent.cap"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["parent.cap"]}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Emergency Contact */}
        {currentStep === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">
              Contatto di Emergenza
            </h2>
            <p className="text-brand-gray mb-6">
              Inserisci un contatto alternativo in caso di emergenza
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.emergency.name}
                  onChange={(e) => updateFormData("emergency", "name", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["emergency.name"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="Maria Bianchi"
                />
                {errors["emergency.name"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["emergency.name"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Relazione con l&apos;atleta *
                </label>
                <select
                  value={formData.emergency.relationship}
                  onChange={(e) => updateFormData("emergency", "relationship", e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["emergency.relationship"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                >
                  <option value="">Seleziona...</option>
                  {relationships.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
                {errors["emergency.relationship"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["emergency.relationship"]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-brand-dark mb-2">
                  Telefono *
                </label>
                <input
                  type="tel"
                  value={formData.emergency.phone}
                  onChange={(e) => updateFormData("emergency", "phone", e.target.value)}
                  onBlur={() => {
                    if (formData.emergency.phone.trim() && !validatePhoneNumber(formData.emergency.phone)) {
                      setErrors(prev => ({ ...prev, "emergency.phone": validationMessages.phoneInvalid }));
                    }
                  }}
                  className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none ${
                    errors["emergency.phone"]
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 focus:border-brand-green bg-gray-50 focus:bg-white"
                  }`}
                  placeholder="+39 333 7654321"
                />
                {errors["emergency.phone"] && (
                  <p className="mt-1 text-sm text-red-500">{errors["emergency.phone"]}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review and Confirm */}
        {currentStep === 5 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">
              Riepilogo e Conferma
            </h2>
            <p className="text-brand-gray mb-6">
              Verifica i dati inseriti e conferma l&apos;iscrizione
            </p>

            {/* Summary Cards */}
            <div className="space-y-4 mb-8">
              {/* Package */}
              <div className="bg-gradient-to-r from-brand-green/10 to-brand-orange/10 rounded-2xl p-5">
                <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
                  <span>📦</span> Pacchetto Selezionato
                </h4>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-dark">
                    {selectedPackage?.title}
                  </span>
                  <span className="text-2xl font-black text-brand-orange">
                    {selectedPackage?.price}
                  </span>
                </div>
              </div>

              {/* Camper */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
                  <span>🏀</span> Atleta
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-brand-gray">Nome:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.camper.firstName} {formData.camper.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Data di nascita:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.camper.dateOfBirth}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Taglia:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.camper.tshirtSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Esperienza:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {experienceLevels.find(l => l.value === formData.camper.experience)?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parent */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
                  <span>👤</span> Genitore/Tutore
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-brand-gray">Nome:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.parent.firstName} {formData.parent.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Email:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.parent.email}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Telefono:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.parent.phone}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <h4 className="font-bold text-brand-dark flex items-center gap-2 mb-3">
                  <span>🚨</span> Contatto Emergenza
                </h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-brand-gray">Nome:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.emergency.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Relazione:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.emergency.relationship}
                    </span>
                  </div>
                  <div>
                    <span className="text-brand-gray">Telefono:</span>
                    <span className="font-semibold text-brand-dark ml-2">
                      {formData.emergency.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4 mb-6">
              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.acceptTerms ? "border-brand-green bg-brand-green/5" : "border-gray-200 hover:border-brand-green"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => updateFormData("acceptTerms", "", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <div>
                  <span className="font-semibold text-brand-dark">
                    Accetto i Termini e Condizioni *
                  </span>
                  <p className="text-sm text-brand-gray mt-1">
                    Ho letto e accetto i termini e le condizioni del camp.
                  </p>
                </div>
              </label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-500">{errors.acceptTerms}</p>
              )}

              <label className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                formData.acceptPrivacy ? "border-brand-green bg-brand-green/5" : "border-gray-200 hover:border-brand-green"
              }`}>
                <input
                  type="checkbox"
                  checked={formData.acceptPrivacy}
                  onChange={(e) => updateFormData("acceptPrivacy", "", e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
                />
                <div>
                  <span className="font-semibold text-brand-dark">
                    Accetto la Privacy Policy *
                  </span>
                  <p className="text-sm text-brand-gray mt-1">
                    Autorizzo il trattamento dei dati personali secondo la normativa vigente.
                  </p>
                </div>
              </label>
              {errors.acceptPrivacy && (
                <p className="text-sm text-red-500">{errors.acceptPrivacy}</p>
              )}
            </div>
          </div>
        )}

        {/* Step 6: Payment */}
        {currentStep === 6 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-brand-dark mb-2">
              Pagamento
            </h2>
            <p className="text-brand-gray mb-6">
              Completa il pagamento per confermare la tua iscrizione
            </p>

            <StripeCheckout
              packageType={formData.package}
              registrationData={{
                id: registrationId || undefined,
                participantName: `${formData.camper.firstName} ${formData.camper.lastName}`,
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
                Nota: Il tuo posto sarà riservato ma non confermato fino al pagamento
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