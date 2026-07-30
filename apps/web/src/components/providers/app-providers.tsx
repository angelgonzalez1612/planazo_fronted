"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { SignupModal } from "@/components/signup-modal";

interface CityContextValue {
  city: string;
  setCity: (city: string) => void;
}

const CityContext = createContext<CityContextValue | null>(null);

export function useCity() {
  const ctx = useContext(CityContext);
  if (!ctx) throw new Error("useCity must be used within AppProviders");
  return ctx;
}

interface FavoritesContextValue {
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within AppProviders");
  return ctx;
}

const SIGNUP_PROMPT_KEY = "planazo_signup_shown";

type AuthReason = "guardar" | "comentar" | "cuenta";

const AUTH_COPY: Record<AuthReason, { title: string; subtitle: string; successTitle: string; successSubtitle: string }> = {
  guardar: {
    title: "Inicia sesión para guardar tus planes",
    subtitle: "Crea tu cuenta gratis y no vuelvas a perder de vista un plan que te gustó.",
    successTitle: "📩 Revisa tu correo",
    successSubtitle: "Te enviamos una liga para confirmar tu cuenta y guardar este plan.",
  },
  comentar: {
    title: "Inicia sesión para dejar tu opinión",
    subtitle: "Crea tu cuenta gratis para comentar y ayudar a otros a decidir su próximo plan.",
    successTitle: "📩 Revisa tu correo",
    successSubtitle: "Te enviamos una liga para confirmar tu cuenta y publicar tu comentario.",
  },
  cuenta: {
    title: "Crea tu cuenta gratis",
    subtitle: "Guarda planes, comenta y entérate antes que nadie de lo nuevo en CDMX.",
    successTitle: "📩 Revisa tu correo",
    successSubtitle: "Te enviamos una liga para confirmar tu cuenta y activarla.",
  },
};

interface SignupPromptContextValue {
  /** Opens the newsletter modal — but only the first time in this browser session. Never blocks the triggering action. */
  triggerSignupPrompt: () => void;
  /**
   * Opens a "sign in / create account" modal — every time, since saving/commenting
   * genuinely has nothing to attach to without a real account yet. If the visitor
   * submits an email, `onSuccess` runs so the action they originally tried actually completes.
   */
  triggerAuthPrompt: (reason: AuthReason, onSuccess?: () => void) => void;
}

const SignupPromptContext = createContext<SignupPromptContextValue | null>(null);

export function useSignupPrompt() {
  const ctx = useContext(SignupPromptContext);
  if (!ctx) throw new Error("useSignupPrompt must be used within AppProviders");
  return ctx;
}

interface ModalState {
  open: boolean;
  title?: string;
  subtitle?: string;
  successTitle?: string;
  successSubtitle?: string;
  onSuccess?: () => void;
}

export function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  const [city, setCityState] = useState("CDMX");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<ModalState>({ open: false });

  useEffect(() => {
    // Reading localStorage must happen post-mount (it doesn't exist during SSR) —
    // this one-time hydration is exactly the "sync with an external system" case
    // effects are for, not derived state.
    try {
      const savedCity = localStorage.getItem("planazo_city");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedCity) setCityState(savedCity);
      const savedFavs = localStorage.getItem("planazo_favs");

      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    } catch {
      // localStorage unavailable (private mode, SSR edge cases) — fall back to defaults
    }
  }, []);

  function setCity(next: string) {
    setCityState(next);
    try {
      localStorage.setItem("planazo_city", next);
    } catch {
      // ignore
    }
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem("planazo_favs", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  function triggerSignupPrompt() {
    try {
      if (sessionStorage.getItem(SIGNUP_PROMPT_KEY)) return;
      sessionStorage.setItem(SIGNUP_PROMPT_KEY, "1");
    } catch {
      // sessionStorage unavailable — still show it this once, just won't be remembered
    }
    setModal({ open: true });
  }

  function triggerAuthPrompt(reason: AuthReason, onSuccess?: () => void) {
    setModal({ open: true, ...AUTH_COPY[reason], onSuccess });
  }

  function closeModal() {
    setModal({ open: false });
  }

  return (
    <CityContext.Provider value={{ city, setCity }}>
      <FavoritesContext.Provider
        value={{ isFavorite: (id) => Boolean(favorites[id]), toggleFavorite }}
      >
        <SignupPromptContext.Provider value={{ triggerSignupPrompt, triggerAuthPrompt }}>
          {children}
          <SignupModal
            open={modal.open}
            onClose={closeModal}
            title={modal.title}
            subtitle={modal.subtitle}
            successTitle={modal.successTitle}
            successSubtitle={modal.successSubtitle}
            onSubmitEmail={modal.onSuccess}
          />
        </SignupPromptContext.Provider>
      </FavoritesContext.Provider>
    </CityContext.Provider>
  );
}
