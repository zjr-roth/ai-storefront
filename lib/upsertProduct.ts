// lib/upsertProduct.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type ProductData = {
  title: string;
  price: number | string;
  image_url?: string;
  buy_url?: string;
  description?: string;
};

/**
 * Upserts a product to the database using the existing /api/products/add logic
 * Deduplicates by site_id + buy_url
 */
export async function upsertProduct(product: ProductData, site_id: string): Promise<{
  status: 'added' | 'updated' | 'unchanged' | 'error';
  product_id?: string;
  error?: string;
}> {
  try {
    // Ensure required fields are present
    if (!product.title || !product.price) {
      return {
        status: 'error',
        error: 'Missing required fields (title or price)'
      };
    }

    // Convert price to number if it's a string
    const numericPrice = typeof product.price === 'string'
      ? parseFloat(product.price)
      : product.price;

    // Base URL for API calls
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Call the existing products/add endpoint
    const response = await fetch(`${baseUrl}/api/products/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site_id,
        title: product.title,
        price: numericPrice,
        image_url: product.image_url,
        buy_url: product.buy_url || '',
        description: product.description
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();

    // Determine status based on the response
    if (result.message === 'Product added') {
      return {
        status: 'added',
        product_id: result.product?.id
      };
    } else if (result.message === 'Product updated') {
      return {
        status: 'updated',
        product_id: result.product?.id
      };
    } else if (result.message === 'Product already exists') {
      return {
        status: 'unchanged',
        product_id: result.product_id
      };
    }

    // Default fallback (should rarely happen)
    return {
      status: 'error',
      error: 'Unknown response from API'
    };

  } catch (error: any) {
    console.error('Error in upsertProduct:', error);
    return {
      status: 'error',
      error: error.message || 'Unknown error'
    };
  }
}