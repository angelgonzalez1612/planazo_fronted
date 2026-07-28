import Link from "next/link";
import { slugify } from "@planazo/shared";
import type { Category, Comment, Guide, Plan } from "@/data/types";
import { categoryHref } from "@/lib/data";
import { formatReviewCount } from "@/lib/format";
import { SiteHeader } from "@/components/site-header";
import { SiteFooterFull } from "@/components/site-footer-full";
import { AdSlot } from "@/components/ad-slot";
import { PlanCardCarousel } from "@/components/plan-card-carousel";
import { SaveButton } from "@/components/plan-detail/save-button";
import { ShareButtons } from "@/components/plan-detail/share-buttons";
import { CommentBox } from "@/components/plan-detail/comment-box";
import { PlanGallery } from "@/components/plan-detail/plan-gallery";
import { ContactCta } from "@/components/plan-detail/contact-cta";
import { Breadcrumb } from "@/components/breadcrumb";

export function PlanDetailView({
  plan,
  categoryIcon,
  categoryLabel,
  categories,
  comments,
  similar,
  guides,
}: {
  plan: Plan;
  categoryIcon: string;
  categoryLabel: string;
  categories: Category[];
  comments: Comment[];
  similar: Plan[];
  guides: Guide[];
}) {
  const dateLabel = plan.kind === "evento" ? plan.dateLabel : undefined;
  const place = plan.kind === "lugar" ? plan : undefined;
  // Planazo publica, no vende ni reserva — el CTA principal debe ser el canal
  // de contacto real que el propio lugar/evento publicó, no una promesa falsa.
  const contactAction = plan.social?.whatsapp
    ? { label: "Contactar por WhatsApp", href: `https://wa.me/${plan.social.whatsapp.replace(/[^0-9]/g, "")}` }
    : plan.social?.instagram
      ? { label: "Ver en Instagram", href: `https://instagram.com/${plan.social.instagram.replace("@", "")}` }
      : undefined;

  const mapsHref = place?.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${place.coordinates.lat},${place.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(plan.address)}`;

  return (
    <>
      <SiteHeader />

      <Breadcrumb items={[{ label: categoryLabel, href: categoryHref(plan.category) }, { label: plan.name }]} />

      <div className="mx-auto max-w-[1280px] px-4 py-3.5 pb-12 sm:pb-16 md:px-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-[12.5px] font-bold text-brand-deep">
              {categoryIcon} {categoryLabel}
            </span>
            <h1 className="text-wrap-balance mt-3.5 font-heading text-[clamp(28px,4vw,44px)] leading-[1.06] font-extrabold tracking-tight">
              {plan.name}
            </h1>
            <p className="mt-3 flex flex-wrap gap-4 text-[15px] text-ink-soft">
              <span>📍 {plan.address}</span>
              {dateLabel && <span>📅 {dateLabel}</span>}
            </p>

            {plan.tags && plan.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {plan.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/etiqueta/${slugify(tag)}`}
                    className="rounded-full border border-border bg-card px-3 py-1 text-[12.5px] font-semibold text-ink-soft transition-colors hover:border-peach hover:text-brand-deep"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {guides.length > 0 && (
              <p className="mt-3 flex flex-wrap items-center gap-1.5 text-[13.5px] text-ink-soft">
                Aparece en:
                {guides.map((guide, i) => (
                  <span key={guide.id}>
                    <Link href={`/guias/${guide.slug}`} className="font-semibold text-brand hover:underline">
                      {guide.categoryLabel}
                    </Link>
                    {i < guides.length - 1 && ","}
                  </span>
                ))}
              </p>
            )}

            <PlanGallery gallery={plan.gallery} cover={plan.cover} />

            <ShareButtons title={plan.name} />

            <h2 className="mt-8 mb-3 font-heading text-[22px] font-bold tracking-tight">Sobre el plan</h2>
            <p className="max-w-[68ch] text-base leading-relaxed text-[#3A332E]">{plan.description}</p>

            <AdSlot size="728 × 90" className="mt-6 h-[90px]" />

            {place?.openingHours && place.openingHours.length > 0 && (
              <>
                <h2 className="mt-8 mb-3 font-heading text-[22px] font-bold tracking-tight">Horario</h2>
                <ul className="flex flex-col gap-1.5 text-[15px]">
                  {place.openingHours.map((h) => (
                    <li key={h.day} className="flex items-center justify-between gap-4 border-b border-[#F2EEEA] py-2">
                      <span className="text-ink-soft">{h.day}</span>
                      <span className="font-semibold">{h.closed ? "Cerrado" : `${h.opens} – ${h.closes}`}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {place?.services && place.services.length > 0 && (
              <>
                <h2 className="mt-8 mb-3 font-heading text-[22px] font-bold tracking-tight">Servicios</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                  {place.services.map((service) => (
                    <span key={service} className="flex items-center gap-2 text-[15px]">
                      <span className="text-positive">✓</span>
                      {service}
                    </span>
                  ))}
                </div>
              </>
            )}

            {place?.promotions && place.promotions.length > 0 && (
              <>
                <h2 className="mt-8 mb-3 font-heading text-[22px] font-bold tracking-tight">Promociones</h2>
                <div className="flex flex-col gap-3">
                  {place.promotions.map((promo) => (
                    <div
                      key={promo.title}
                      className="flex items-start gap-3 rounded-xl border border-peach bg-cream p-4"
                    >
                      <span className="mt-0.5 text-lg leading-none">🏷️</span>
                      <div>
                        <p className="font-heading text-[15px] font-bold tracking-tight text-brand-deep">
                          {promo.title}
                        </p>
                        <p className="mt-1 text-sm text-[#3A332E]">{promo.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <h2 className="mt-8 mb-3 font-heading text-[22px] font-bold tracking-tight">Cómo llegar</h2>
            <div className="relative flex aspect-[16/6] flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-peach to-cream p-4 text-center">
              <span className="text-xs font-semibold text-brand-deep">Mapa: {plan.address}</span>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-bold text-white hover:bg-brand"
              >
                📍 Ver en Google Maps
              </a>
            </div>

            <h2 className="mt-8 mb-3 font-heading text-[22px] font-bold tracking-tight">Opiniones</h2>
            <CommentBox initialComments={comments} />
          </div>

          <aside className="flex flex-col gap-4">
            <div className="sticky top-[88px] rounded-2xl border border-border p-5">
              <p className="text-[13px] font-bold tracking-wide text-ink-soft uppercase">Precio</p>
              <p className="mt-1.5 font-heading text-[26px] font-extrabold tracking-tight">
                {plan.price !== null ? (
                  <>
                    ${plan.price} <span className="text-[15px] font-semibold text-ink-soft">MXN</span>
                  </>
                ) : (
                  "Gratis"
                )}
              </p>
              <p className="mt-2.5 flex items-center gap-1.5 text-sm text-ink-soft">
                <span className="text-brand">★</span>
                {plan.rating} <span className="text-[#B5ADA6]">({formatReviewCount(plan.reviewCount)} reseñas)</span>
              </p>

              {plan.social && (plan.social.instagram || plan.social.whatsapp) && (
                <div className="mt-3.5 flex items-center gap-2 border-t border-[#F2EEEA] pt-3.5">
                  {plan.social.instagram && (
                    <a
                      href={`https://instagram.com/${plan.social.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-soft hover:text-brand"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" strokeWidth="2" />
                        <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
                        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
                      </svg>
                      {plan.social.instagram}
                    </a>
                  )}
                  {plan.social.whatsapp && (
                    <a
                      href={`https://wa.me/${plan.social.whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[13.5px] font-semibold text-ink-soft hover:text-positive"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 2a10 10 0 0 0-8.6 15.02L2 22l5.12-1.35A10 10 0 1 0 12 2Z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                </div>
              )}

              {contactAction && <ContactCta label={contactAction.label} href={contactAction.href} />}
              <SaveButton planId={plan.id} />
            </div>
            <AdSlot size="300 × 400" className="aspect-[3/4]" />
            <AdSlot size="300 × 250" className="aspect-[6/5]" />
          </aside>
        </div>

        {similar.length > 0 && (
          <>
            <h2 className="mt-12 mb-4.5 font-heading text-2xl font-bold tracking-tight">Planes parecidos</h2>
            <PlanCardCarousel plans={similar} icon={categoryIcon} categoryLabel={categoryLabel} />
          </>
        )}
      </div>

      <SiteFooterFull categories={categories} />
    </>
  );
}
