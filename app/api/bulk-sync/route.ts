// app/api/bulk-sync/route.ts
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { createClient } from "@supabase/supabase-js";
import { upsertProduct, ProductData } from "@/lib/upsertProduct";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Helper to batch promises to avoid overwhelming external APIs
async function batchPromises<T, R>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<R>
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(fn));

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      }
    }
  }
  return results;
}

// Record metrics event
async function recordMetricsEvent(site_id: string, event_type: string, payload: any) {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";


    await fetch(`${baseUrl}/api/metrics/record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        site_id,
        event_type,
        payload
      })
    });
  } catch (error) {
    console.error("Failed to record metrics:", error);
    // Non-blocking - continue execution
  }
}

// Normalize Shopify product data to our format
function normalizeShopifyProduct(product: any): ProductData {
  return {
    title: product.title,
    price: product.variants?.[0]?.price || '0.00',
    image_url: product.images?.[0]?.src || product.image?.src,
    buy_url: product.handle ? `/products/${product.handle}` : '',
    description: product.body_html || product.description
  };
}

// Normalize generic product data
function normalizeGenericProduct(product: any): ProductData {
  return {
    title: product.title || product.name,
    price: product.price || '0.00',
    image_url: product.image_url || product.image || product.featured_image,
    buy_url: product.buy_url || product.url || product.handle,
    description: product.description
  };
}

// Fetch and parse JSON from URL
async function fetchJson(url: string): Promise<any> {
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      // Some Shopify stores require API key
      // 'X-Shopify-Access-Token': process.env.SHOPIFY_API_KEY
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Fetch and parse XML from URL
async function fetchXml(url: string): Promise<any> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const parser = new XMLParser();
  return parser.parse(text);
}

// Process feed URL (JSON)
async function processFeedUrl(url: string, site_id: string): Promise<{
  inserted: number;
  updated: number;
  unchanged: number;
  errors: number;
}> {
  try {
    const json = await fetchJson(url);
    let products: any[] = [];

    // Handle Shopify format
    if (json.products && Array.isArray(json.products)) {
      products = json.products.map(normalizeShopifyProduct);
    }
    // Handle array format
    else if (Array.isArray(json)) {
      products = json.map(normalizeGenericProduct);
    }
    // Unknown format
    else {
      throw new Error('Unrecognized feed format');
    }

    // Limit to 500 products for MVP
    products = products.slice(0, 500);

    // Process products in batches
    const results = await batchPromises(
      products,
      10, // Process 10 at a time
      async (product) => await upsertProduct(product, site_id)
    );

    // Count results
    const counts = {
      inserted: results.filter(r => r.status === 'added').length,
      updated: results.filter(r => r.status === 'updated').length,
      unchanged: results.filter(r => r.status === 'unchanged').length,
      errors: results.filter(r => r.status === 'error').length
    };

    return counts;
  } catch (error) {
    console.error('Error processing feed URL:', error);
    throw error;
  }
}

// Process sitemap URL (XML)
async function processSitemapUrl(url: string, site_id: string): Promise<{
  inserted: number;
  updated: number;
  unchanged: number;
  errors: number;
}> {
  try {
    const xml = await fetchXml(url);

    // Extract URLs from sitemap
    let urls: string[] = [];

    if (xml.urlset?.url) {
      // Standard sitemap format
      const urlEntries = Array.isArray(xml.urlset.url) ? xml.urlset.url : [xml.urlset.url];
      urls = urlEntries
        .map((entry: any) => entry.loc)
        .filter((loc: string) => loc.includes('/products/'));
    } else if (xml.sitemapindex?.sitemap) {
      // Sitemap index - we'll just take the first product sitemap for MVP
      const sitemaps = Array.isArray(xml.sitemapindex.sitemap)
        ? xml.sitemapindex.sitemap
        : [xml.sitemapindex.sitemap];

      for (const sitemap of sitemaps) {
        if (sitemap.loc.includes('product')) {
          const subSitemapXml = await fetchXml(sitemap.loc);
          if (subSitemapXml.urlset?.url) {
            const urlEntries = Array.isArray(subSitemapXml.urlset.url)
              ? subSitemapXml.urlset.url
              : [subSitemapXml.urlset.url];

            urls = urlEntries
              .map((entry: any) => entry.loc)
              .filter((loc: string) => loc.includes('/products/'));

            break; // Just process the first product sitemap
          }
        }
      }
    }

    // Limit to 500 URLs for MVP
    urls = urls.slice(0, 500);

    // For Shopify, append .json to product URLs
    const productJsonUrls = urls.map(url => {
      // Check if this is likely a Shopify product URL
      if (url.includes('.myshopify.com/') || url.includes('/products/')) {
        return url.endsWith('.json') ? url : `${url}.json`;
      }
      return url;
    });

    // Fetch product data in batches
    const products: ProductData[] = [];

    await batchPromises(
      productJsonUrls,
      10, // Process 10 at a time
      async (url) => {
        try {
          const json = await fetchJson(url);
          // Shopify product endpoint returns { product: {...} }
          if (json.product) {
            products.push(normalizeShopifyProduct(json.product));
          }
        } catch (error) {
          console.error(`Error fetching product from ${url}:`, error);
          // Continue with other products
        }
      }
    );

    // Process products
    const results = await batchPromises(
      products,
      10,
      async (product) => await upsertProduct(product, site_id)
    );

    // Count results
    const counts = {
      inserted: results.filter(r => r.status === 'added').length,
      updated: results.filter(r => r.status === 'updated').length,
      unchanged: results.filter(r => r.status === 'unchanged').length,
      errors: results.filter(r => r.status === 'error').length
    };

    return counts;
  } catch (error) {
    console.error('Error processing sitemap URL:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { site_id, feed_url, sitemap_url } = body;

    // Validate required fields
    if (!site_id) {
      return NextResponse.json({ error: "Missing site_id" }, { status: 400 });
    }

    if (!feed_url && !sitemap_url) {
      return NextResponse.json(
        { error: "Either feed_url or sitemap_url is required" },
        { status: 400 }
      );
    }

    // Validate site exists
    const { data: site, error: siteError } = await supabase
      .from("sites")
      .select("id")
      .eq("id", site_id)
      .single();

    if (siteError || !site) {
      return NextResponse.json(
        { error: "Invalid site_id: Site not found" },
        { status: 404 }
      );
    }

    // Process feed_url and/or sitemap_url
    let feedResult = { inserted: 0, updated: 0, unchanged: 0, errors: 0 };
    let sitemapResult = { inserted: 0, updated: 0, unchanged: 0, errors: 0 };

    if (feed_url) {
      feedResult = await processFeedUrl(feed_url, site_id);
    }

    if (sitemap_url) {
      sitemapResult = await processSitemapUrl(sitemap_url, site_id);
    }

    // Combine results
    const result = {
      inserted: feedResult.inserted + sitemapResult.inserted,
      updated: feedResult.updated + sitemapResult.updated,
      unchanged: feedResult.unchanged + sitemapResult.unchanged,
      errors: feedResult.errors + sitemapResult.errors,
      total:
        feedResult.inserted + feedResult.updated + feedResult.unchanged + feedResult.errors +
        sitemapResult.inserted + sitemapResult.updated + sitemapResult.unchanged + sitemapResult.errors
    };

    // Record metrics
    await recordMetricsEvent(site_id, "bulk_sync_finished", {
      inserted: result.inserted,
      updated: result.updated,
      unchanged: result.unchanged,
      errors: result.errors,
      total: result.total,
      feed_url: !!feed_url,
      sitemap_url: !!sitemap_url
    });

    // Update site's last_synced_at
    await supabase
      .from("sites")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("id", site_id);

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error in bulk sync:", error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}