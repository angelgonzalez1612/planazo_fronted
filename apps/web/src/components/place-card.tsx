import Link from "next/link";
import Image from "next/image";
import type { Place } from "@planazo/types";
import { formatPriceLevel } from "@planazo/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlaceCard({ place }: { place: Place }) {
  const cover = place.photos[0];

  return (
    <Link href={`/lugares/${place.slug}`}>
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-4/3 w-full bg-muted">
          {cover && (
            <Image
              src={cover.url}
              alt={cover.alt ?? place.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span className="truncate">{place.name}</span>
            {place.priceLevel && (
              <span className="text-sm font-normal text-muted-foreground">
                {formatPriceLevel(place.priceLevel)}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-1.5 pb-4">
          {place.categories.slice(0, 3).map((category) => (
            <Badge key={category.id} variant="secondary">
              {category.name}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </Link>
  );
}
