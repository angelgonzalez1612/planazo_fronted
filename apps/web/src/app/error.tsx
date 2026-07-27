"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Algo salió mal</h1>
      <p className="text-muted-foreground">
        No pudimos cargar esta página. Puede ser un problema temporal con la API.
      </p>
      <Button onClick={() => reset()}>Reintentar</Button>
    </main>
  );
}
