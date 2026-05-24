const VENDURE_SHOP_API =
  process.env.NEXT_PUBLIC_VENDURE_SHOP_API ?? "http://localhost:3002/shop-api";

export interface VendurePrice {
  amount: number;
  currencyCode: string;
}

export interface VendureProductSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  featuredAssetUrl: string | null;
  priceNow: number;
  priceWas: number | null;
  currencyCode: string;
  collectionNames: string[];
}

export interface VendureProductDetail extends VendureProductSummary {
  assets: string[];
  variants: Array<{
    id: string;
    name: string;
    sku: string;
    price: number;
    currencyCode: string;
    stockLevel: string;
  }>;
}

interface GraphQLError { message: string }
interface GraphQLResponse<T> { data?: T; errors?: GraphQLError[] }

async function vendureGql<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  try {
    const res = await fetch(VENDURE_SHOP_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as GraphQLResponse<T>;
    if (json.errors?.length) return null;
    return json.data ?? null;
  } catch {
    return null;
  }
}

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($options: ProductListOptions) {
    products(options: $options) {
      totalItems
      items {
        id
        slug
        name
        description
        featuredAsset { preview }
        collections { name slug }
        variants {
          id
          name
          priceWithTax
          currencyCode
        }
      }
    }
  }
`;

const PRODUCT_BY_SLUG_QUERY = /* GraphQL */ `
  query ProductBySlug($slug: String!) {
    product(slug: $slug) {
      id
      slug
      name
      description
      featuredAsset { preview }
      assets { preview }
      collections { name slug }
      variants {
        id
        name
        sku
        priceWithTax
        currencyCode
        stockLevel
      }
    }
  }
`;

interface RawAsset { preview: string }
interface RawVariant {
  id: string;
  name: string;
  sku?: string;
  priceWithTax: number;
  currencyCode: string;
  stockLevel?: string;
}
interface RawProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  featuredAsset: RawAsset | null;
  assets?: RawAsset[];
  collections: Array<{ name: string; slug: string }>;
  variants: RawVariant[];
}

function toMajor(amount: number) {
  return Math.round(amount) / 100;
}

function summarize(p: RawProduct): VendureProductSummary {
  const prices = p.variants.map((v) => v.priceWithTax);
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;
  const currencyCode = p.variants[0]?.currencyCode ?? "USD";
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    featuredAssetUrl: p.featuredAsset?.preview ?? null,
    priceNow: toMajor(min),
    priceWas: max > min ? toMajor(max) : null,
    currencyCode,
    collectionNames: p.collections.map((c) => c.name),
  };
}

export async function fetchVendureProducts(limit = 8): Promise<VendureProductSummary[]> {
  const data = await vendureGql<{ products: { items: RawProduct[] } }>(PRODUCTS_QUERY, {
    options: { take: limit, sort: { createdAt: "DESC" } },
  });
  if (!data?.products?.items) return [];
  return data.products.items.map(summarize);
}

export async function fetchVendureProductBySlug(slug: string): Promise<VendureProductDetail | null> {
  const data = await vendureGql<{ product: RawProduct | null }>(PRODUCT_BY_SLUG_QUERY, { slug });
  if (!data?.product) return null;
  const p = data.product;
  const summary = summarize(p);
  return {
    ...summary,
    assets: (p.assets ?? []).map((a) => a.preview),
    variants: p.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku ?? "",
      price: toMajor(v.priceWithTax),
      currencyCode: v.currencyCode,
      stockLevel: v.stockLevel ?? "IN_STOCK",
    })),
  };
}

export function formatMoney(amount: number, currencyCode = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `$${amount}`;
  }
}
