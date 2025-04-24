(async () => {
  console.log("[injector.js] ✅ script loaded — adaptive-injector.js");

  // 1) Core utilities
  const domain = window.location.hostname;
  const isLocal = domain === "localhost" || domain.startsWith("127.");
  const baseUrl = isLocal ? "http://localhost:3000" : `https://${domain}`;

  // Utility to make full URLs from relative ones
  const getFullUrl = (url) => {
    if (!url) return null;
    try {
      return new URL(url, window.location.href).href;
    } catch (e) {
      return url;
    }
  };

  // Advanced selector utility that tries multiple selectors
  const trySelectors = (selectors, extractFn) => {
    for (const selector of selectors) {
      try {
        const result = extractFn(selector);
        if (result) {
          console.log(`[injector.js] Found with selector: ${selector}`, result);
          return result;
        }
      } catch (err) {
        // Just continue to next selector
      }
    }
    return null;
  };

  // Extract text from element - handles various formats
  const getText = (element) => {
    if (!element) return null;

    // Direct text content (excluding child elements)
    let directText = '';
    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        directText += node.textContent.trim();
      }
    }

    if (directText) return directText;

    // Fallback to innerText (includes child elements)
    return element.innerText?.trim() || null;
  };

  // Clean up prices - handles various currency formats
  const cleanPrice = (priceStr) => {
    if (!priceStr) return null;

    // Handle various price formats
    const match = priceStr.match(/[\d,.]+/);
    if (!match) return null;

    // Clean the price string and convert to number
    return match[0].replace(/[^\d.]/g, '');
  };

  // Function to record manifest fetch events
  const recordManifestFetch = async () => {
    // Get site_id from localStorage
    const siteId = localStorage.getItem("site_id");

    if (!siteId) {
      console.warn("[injector.js] Cannot record manifest fetch: site_id not found in localStorage");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/metrics/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          site_id: siteId,
          event_type: 'manifest_fetched',
          payload: {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${await response.text()}`);
      }

      console.log("[injector.js] ✅ Recorded manifest fetch event");
    } catch (error) {
      console.error("[injector.js] ❌ Failed to record manifest fetch:", error.message);
      // Non-blocking - continue execution even if this fails
    }
  };

  // 2) Site registration
  let siteId = localStorage.getItem("site_id");
  if (!siteId) {
    try {
      const res = await fetch(`${baseUrl}/api/register-site`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      siteId = json.site_id;
      localStorage.setItem("site_id", siteId);
      console.log("[injector.js] Registered site ID:", siteId);
    } catch (err) {
      console.error("[injector.js] ❌ Site registration failed:", err.message);
      return; // bail early
    }
  }

  // 3) Smart product data extraction
  const isProductPage = () => {
    // Check if this looks like a product page
    const hasAddToCart = !!document.querySelector([
      'button[contains(., "add to cart")]',
      'button[contains(., "buy")]',
      'a[contains(., "add to cart")]',
      'a[contains(., "buy")]',
      '[class*="add-to-cart"]',
      '[class*="buy-now"]',
      '[id*="add-to-cart"]',
      '[id*="buy-now"]'
    ].join(','));

    const hasPrice = !!document.querySelector([
      '[class*="price"]',
      '[itemprop="price"]',
      'meta[property*="price"]'
    ].join(','));

    return hasAddToCart || hasPrice;
  };

  // Skip non-product pages
  if (!isProductPage()) {
    console.log("[injector.js] This doesn't appear to be a product page, skipping");
    return;
  }

  // Title extraction - try multiple common patterns
  const extractTitle = () => {
    // Meta tags - most reliable when available
    const metaTitleSelectors = [
      'meta[property="og:title"]',
      'meta[name="twitter:title"]',
      'meta[itemprop="name"]'
    ];
    const metaTitle = trySelectors(metaTitleSelectors, sel => {
      const element = document.querySelector(sel);
      return element?.getAttribute('content');
    });

    // Heading elements
    const headingSelectors = [
      'h1[itemprop="name"]',
      'h1.product-title',
      'h1.product-name',
      'h1.product_title',
      'h1.productTitle',
      '[class*="product-title"] h1',
      '[class*="product-name"] h1',
      '.product h1',
      '#product h1',
      'h1'
    ];
    const headingTitle = trySelectors(headingSelectors, sel => {
      const element = document.querySelector(sel);
      return getText(element);
    });

    // Return the first valid title found
    return metaTitle || headingTitle || document.title;
  };

  // Price extraction
  const extractPrice = () => {
    // Meta tags
    const metaPriceSelectors = [
      'meta[property="product:price:amount"]',
      'meta[property="og:price:amount"]',
      'meta[itemprop="price"]'
    ];
    const metaPrice = trySelectors(metaPriceSelectors, sel => {
      const element = document.querySelector(sel);
      return element?.getAttribute('content');
    });

    // Price elements in DOM
    const priceDomSelectors = [
      '[itemprop="price"]',
      '.price',
      '.product-price',
      '.price-value',
      '.current-price',
      '.sale-price',
      '[class*="price"]',
      '[class*="Price"]',
      '[id*="price"]',
      '[id*="Price"]',
      'span:contains("$")',
      'p:contains("$")'
    ];
    const domPrice = trySelectors(priceDomSelectors, sel => {
      const elements = document.querySelectorAll(sel);
      for (const el of elements) {
        const priceText = getText(el);
        if (priceText && /\d/.test(priceText)) { // Make sure it contains a digit
          return priceText;
        }
      }
      return null;
    });

    // Clean the price we found
    const rawPrice = metaPrice || domPrice;
    return cleanPrice(rawPrice);
  };

  // Image extraction
  const extractImage = () => {
    // Meta tags
    const metaImageSelectors = [
      'meta[property="og:image"]',
      'meta[property="og:image:secure_url"]',
      'meta[name="twitter:image"]',
      'meta[itemprop="image"]'
    ];
    const metaImage = trySelectors(metaImageSelectors, sel => {
      const element = document.querySelector(sel);
      return getFullUrl(element?.getAttribute('content'));
    });

    // Image elements in DOM
    const imageDomSelectors = [
      'img[itemprop="image"]',
      '.product-image img',
      '.product-main-image img',
      '.product-gallery img',
      '.carousel img',
      '#product-image',
      '[class*="product"] img',
      '[id*="product"] img',
      'img[id*="product"]',
      'img[class*="product"]',
      'img' // Last resort - just find any image
    ];
    const domImage = trySelectors(imageDomSelectors, sel => {
      const elements = document.querySelectorAll(sel);
      // Look for the largest image
      let bestImage = null;
      let bestSize = 0;

      for (const el of elements) {
        const src = el.getAttribute('src') || el.getAttribute('data-src');
        if (!src) continue;

        // Prefer larger images
        const width = parseInt(el.getAttribute('width') || 0);
        const height = parseInt(el.getAttribute('height') || 0);
        const size = width * height;

        if (!bestImage || size > bestSize) {
          bestImage = src;
          bestSize = size;
        }
      }

      return getFullUrl(bestImage);
    });

    return metaImage || domImage;
  };

  // Description extraction
  const extractDescription = () => {
    // Meta tags
    const metaDescSelectors = [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
      'meta[itemprop="description"]'
    ];
    const metaDesc = trySelectors(metaDescSelectors, sel => {
      const element = document.querySelector(sel);
      return element?.getAttribute('content');
    });

    // Description elements in DOM
    const descDomSelectors = [
      '[itemprop="description"]',
      '.product-description',
      '.description',
      '.product-details',
      '#product-description',
      '[class*="description"]',
      '[id*="description"]',
      'p:not(.price)'
    ];
    const domDesc = trySelectors(descDomSelectors, sel => {
      const element = document.querySelector(sel);
      return getText(element);
    });

    return metaDesc || domDesc;
  };

  // Buy URL extraction
  const extractBuyUrl = () => {
    // Buy button link
    const buyButtonSelectors = [
      'a.buy-button',
      'a.buy-now',
      'a.add-to-cart',
      'a[class*="buy"]',
      'a[class*="cart"]',
      'a[contains(., "Buy")]',
      'a[contains(., "Add to Cart")]'
    ];
    const buyLink = trySelectors(buyButtonSelectors, sel => {
      const element = document.querySelector(sel);
      return getFullUrl(element?.getAttribute('href'));
    });

    // Fallback to current URL
    return buyLink || window.location.href;
  };

  // Extract product data
  const title = extractTitle();
  const price = extractPrice();
  const image_url = extractImage();
  const description = extractDescription();
  const buy_url = extractBuyUrl();

  console.log("[injector.js] Extracted product data:", {
    title,
    price,
    image_url,
    description,
    buy_url
  });

  // 4) Only sync if required fields exist
  if (!title || !price) {
    console.warn("[injector.js] ⏭ Skip sync — missing required fields:", { title, price });
  } else {
    // Build payload
    const payload = {
      site_id: siteId,
      title,
      price: parseFloat(price),
      ...(image_url && { image_url }),
      ...(buy_url && { buy_url }),
      ...(description && { description }),
    };

    console.log("[injector.js] Syncing payload:", payload);

    try {
      const res = await fetch(`${baseUrl}/api/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      console.log("[injector.js] Product sync result:", json);
    } catch (err) {
      console.error("[injector.js] ❌ Sync failed:", err.message);
    }
  }

  // 5) Fetch & inject agent manifest
  try {
    const agentsUrl = isLocal
      ? "http://localhost:3000/.well-known/agents.json"
      : `https://${domain}/.well-known/agents.json`;

    console.log("[injector.js] Fetching agents from:", agentsUrl);

    const ajRes = await fetch(agentsUrl);
    if (!ajRes.ok) {
      throw new Error(`Failed to fetch agents.json: ${ajRes.status}`);
    }

    const { manifest_url } = await ajRes.json();
    if (!manifest_url) {
      throw new Error("No manifest_url in agents.json");
    }

    console.log("[injector.js] Manifest URL:", manifest_url);

    const manRes = await fetch(manifest_url);
    if (!manRes.ok) {
      throw new Error(`Failed to fetch manifest: ${manRes.status}`);
    }

    const { products } = await manRes.json();

    // Record the manifest fetch event after successful fetch
    await recordManifestFetch();

    if (!products || !Array.isArray(products) || products.length === 0) {
      console.warn("[injector.js] No products found in manifest");
      return;
    }

    console.log("[injector.js] Manifest products:", products);

    const injected = [];
    products.forEach((p) => {
      if (!p.title || !p.price) {
        console.warn("[injector.js] Skipping product missing required fields:", p);
        return;
      }

      const schema = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: p.title,
        ...(p.image_url && { image: [p.image_url] }),
        ...(p.description && { description: p.description }),
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: p.price,
          url: p.buy_url || window.location.href,
          availability: "https://schema.org/InStock"
        },
      };

      const tag = document.createElement("script");
      tag.type = "application/ld+json";
      tag.textContent = JSON.stringify(schema);
      document.head.appendChild(tag);
      injected.push(p.title);
      console.log(`[injector.js] Injected schema for: ${p.title}`);
    });

    // Debug UI - only show in development
    if (isLocal) {
      const box = document.createElement("div");
      box.style = "position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.8);color:lime;font:12px monospace;padding:8px;border-radius:6px;z-index:9999;";
      box.innerText = `[injector.js] Injected ${injected.length} product(s):\n${injected.join(", ")}`;
      document.body.appendChild(box);
    }

  } catch (err) {
    console.warn("[injector.js] ❌ Injection error:", err.message);

    // Debug UI for error - only in development
    if (isLocal) {
      const box = document.createElement("div");
      box.style = "position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.8);color:red;font:12px monospace;padding:8px;border-radius:6px;z-index:9999;";
      box.innerText = `[injector.js] Error: ${err.message}`;
      document.body.appendChild(box);
    }
  }
})();