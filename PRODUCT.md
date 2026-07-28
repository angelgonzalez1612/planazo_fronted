# Product

## Register

brand

## Users

Gente joven-adulta en CDMX que sale seguido — a comer, tomar café, bares, cultura, aire libre — y quiere decidir rápido qué hacer hoy o este finde. Llegan con una intención concreta ("qué hay en Roma Norte", "planes para el finde") o navegando sin rumbo buscando inspiración. Confían en Planazo porque está curado por gente que también sale, no por un algoritmo de reseñas anónimas.

## Product Purpose

Directorio + guía editorial de planes en CDMX (lugares, eventos, guías temáticas). No es un motor de reservaciones ni un Yelp de reseñas — es una fuente curada que responde "¿a dónde voy hoy?" con la voz de un amigo que conoce la ciudad, respaldada por datos reales (zona, precio, rating, horarios) sin inventar nada.

## Brand Personality

Editorial urbano, con calle. Casual, directo, con humor mexicano — como sopitas.com o dondeir.com. Hecho por gente que sale, no una guía corporativa de turismo. El naranja de marca (`#FF5A00`) es la voz que grita énfasis; el resto es neutros + fotografía real (regla 80/15/5 ya establecida en el código).

## Anti-references

- Turismo oficial/gubernamental: tono institucional, stock photos genéricas, tarjetas de "atractivos turísticos".
- SaaS/dashboard genérico: grids uniformes de tarjetas idénticas, iconografía corporativa — el look que ya se evita activamente en el CMS interno, pero aquí el riesgo es mayor por ser cara pública.
- Yelp/TripAdvisor: overload de estrellas y reseñas anónimas como protagonista visual.

## Design Principles

1. **Voz de amigo, no de folleto.** Copy directo y con personalidad (ya presente: "curado por gente que sale mucho") — nunca tono de comunicado de prensa turístico.
2. **Fotografía real por encima de íconos.** Las imágenes cargan el peso visual; los íconos son apoyo, no protagonismo.
3. **Ritmo editorial, no rejilla uniforme.** Mezclar tamaños y formatos (hero + mosaico, cards grandes + listas compactas) en vez de repetir el mismo card N veces — así se siente una portada curada, no un catálogo.
4. **El naranja es énfasis, no decoración de fondo.** Regla 80/15/5 ya committeada: neutros+foto dominan, negro suave da estructura, naranja marca lo que importa ahora mismo.
5. **Nunca inventar datos.** Precio, rating, horarios, zona — si el dato real no existe, se omite o se deja claro que falta; no se rellena con placeholders que parezcan reales.

## Accessibility & Inclusion

WCAG AA como mínimo (contraste ≥4.5:1 en texto de cuerpo, ≥3:1 en texto grande). `prefers-reduced-motion` ya respetado a nivel global en `globals.css` — todo movimiento nuevo debe mantener esa alternativa.
