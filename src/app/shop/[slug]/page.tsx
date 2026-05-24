import Link from "next/link";
import { notFound } from "next/navigation";
import {
  fetchVendureProductBySlug,
  fetchVendureProducts,
  formatMoney,
} from "@/lib/vendure";

interface Ctx { params: { slug: string } }

export const dynamic = "force-dynamic";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "8615000000000";

export default async function ProductDetailPage({ params }: Ctx) {
  const product = await fetchVendureProductBySlug(params.slug);
  if (!product) notFound();

  const related = (await fetchVendureProducts(8))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const waMessage = encodeURIComponent(
    `Hello LingYun — I'd like to order "${product.name}" (${formatMoney(product.priceNow, product.currencyCode)}).`,
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <article className="relative pb-24 pt-16">
      <div className="container-page max-w-5xl">
        <Link
          href="/shop"
          className="text-[11px] uppercase tracking-[0.3em]"
          style={{ color: "var(--c-primary-soft)" }}
        >
          ← Back to Shop
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div
            className="relative aspect-[4/3] overflow-hidden rounded-lg border"
            style={{ borderColor: "var(--c-border)" }}
          >
            {product.featuredAssetUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.featuredAssetUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div
                className="relative h-full w-full"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, var(--c-glow), transparent 60%), radial-gradient(circle at 70% 70%, rgba(139,26,26,0.2), transparent 60%), var(--c-bg-soft)",
                }}
              >
                <div className="absolute inset-0 bagua opacity-25 animate-spinSlow" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="han text-[8rem]"
                    style={{
                      color: "var(--c-primary-soft)",
                      textShadow: "0 0 40px var(--c-glow)",
                    }}
                  >
                    {product.name.charAt(0)}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            {product.collectionNames.length > 0 && (
              <div
                className="text-[11px] uppercase tracking-[0.3em]"
                style={{ color: "var(--c-primary-soft)" }}
              >
                {product.collectionNames.join(" · ")}
              </div>
            )}
            <h1 className="mt-3 font-display text-3xl leading-tight">
              <span className="gold-text">{product.name}</span>
            </h1>
            <div className="divider-gold mt-5" />

            <div className="mt-6 flex items-baseline gap-4">
              <span className="font-display text-4xl gold-text">
                {formatMoney(product.priceNow, product.currencyCode)}
              </span>
              {product.priceWas && product.priceWas > product.priceNow && (
                <span className="text-lg line-through opacity-50">
                  {formatMoney(product.priceWas, product.currencyCode)}
                </span>
              )}
            </div>

            {product.description && (
              <div
                className="prose-lingyun mt-8 text-base"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {product.variants.length > 1 && (
              <div className="mt-8">
                <div
                  className="text-[11px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--c-primary-soft)" }}
                >
                  Options
                </div>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {product.variants.map((v) => (
                    <li
                      key={v.id}
                      className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                      style={{ borderColor: "var(--c-border)" }}
                    >
                      <span>{v.name}</span>
                      <span className="gold-text">
                        {formatMoney(v.price, v.currencyCode)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Order on WhatsApp
              </a>
              <Link href="/divination" className="btn-ghost">
                Free 60-second BaZi
              </Link>
            </div>

            <p className="mt-6 text-xs" style={{ color: "var(--c-text-soft)" }}>
              ✨ Every order is privately confirmed by a master on WhatsApp.
              Sessions are scheduled within 24 hours.
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="container-page mt-24 max-w-6xl">
          <div className="divider-gold mb-10" />
          <h2 className="text-center font-display text-2xl gold-text">You May Also Like</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="card-mystic group block"
              >
                <div
                  className="text-[10px] uppercase tracking-[0.25em]"
                  style={{ color: "var(--c-primary-soft)" }}
                >
                  {p.collectionNames[0] ?? "Consultation"}
                </div>
                <h3 className="mt-2 font-display text-lg leading-snug">{p.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-xl gold-text">
                    {formatMoney(p.priceNow, p.currencyCode)}
                  </span>
                  {p.priceWas && p.priceWas > p.priceNow && (
                    <span className="text-xs line-through opacity-50">
                      {formatMoney(p.priceWas, p.currencyCode)}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
