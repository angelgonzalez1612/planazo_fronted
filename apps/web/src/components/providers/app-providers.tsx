"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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

export function AppProviders({
  children,
}: {
  children: ReactNode;
}) {
  const [city, setCityState] = useState("CDMX");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

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

  return (
    <CityContext.Provider value={{ city, setCity }}>
      <FavoritesContext.Provider
        value={{ isFavorite: (id) => Boolean(favorites[id]), toggleFavorite }}
      >
        {children}
      </FavoritesContext.Provider>
    </CityContext.Provider>
  );
}
