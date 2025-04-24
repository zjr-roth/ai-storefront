(async () => {
  console.log("[injector.js] ✅ script loaded — adaptive-injector.js");

  // DEBUG MODE
  const DEBUG = true;
  const debugLog = (message, ...args) => {
    if (DEBUG) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  };

  // 1) Core utilities
  const domain = window.location.hostname;
  const isLocal = domain === "localhost" || domain.startsWith("127.");
  const baseUrl = isLocal ? "http://localhost:3000" : `https://${domain}`;

  debugLog("Environment:", { domain, isLocal, baseUrl });

  // Utility to make full URLs from relative ones
  const getFullUrl = (url) => {
    if (!url) return null;
    try {
      return new URL(url, window.location.href).href;
    } catch (e) {
      return url;
    }
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
    debugLog("Cleaning price:", priceStr);

    // Extract numeric part (more robust)
    const numericPart = priceStr.replace(/[^\d.]/g, '');
    if (!numericPart || isNaN(parseFloat(numericPart))) return null;

    debugLog("Cleaned price to:", numericPart);
    return numericPart;
  };

  // Function to record manifest fetch events
  const recordManifestFetch = async () => {
    // Get site_id from localStorage
    const siteId = localStorage.getItem("site_id");

    debugLog("recordManifestFetch called with siteId:", siteId);

    if (!siteId) {
      console.warn("[injector.js] Cannot record manifest fetch: site_id not found in localStorage");
      return;
    }

    try {
      console.log("[injector.js] Recording manifest fetch event for site_id:", siteId);
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
  debugLog("Checking for existing site_id in localStorage");
  let siteId = localStorage.getItem("site_id");
  if (!siteId) {
    debugLog("No site_id found, registering site");
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
  } else {
    debugLog("Using existing site_id:", siteId);
  }

  // 3) Page type detection
  // Special handler for test-store.html
  const isTestStorePage = () => {
    return window.location.pathname.includes('test-store.html');
  };

  // Check if normal product page
  const isProductPage = () => {
    // Use simpler selectors that work in all browsers
    const hasAddToCart = !!document.querySelector('a.buy-button') ||
                         !!document.querySelector('button.add-to-cart') ||
                         !!document.querySelector('[class*="buy-now"]');

    const hasPrice = !!document.querySelector('.price') ||
                     !!document.querySelector('[itemprop="price"]');

    debugLog("Product page detection:", { hasAddToCart, hasPrice });
    return hasAddToCart || hasPrice;
  };

  if (isTestStorePage()) {
    debugLog("Detected test-store.html, treating as product page");
  } else if (!isProductPage()) {
    console.log("[injector.js] This doesn't appear to be a product page, skipping");
    return;
  } else {
    debugLog("Detected product page, continuing with extraction");
  }

  // INCREDIBLY VERBOSE DOM INSPECTION
  debugLog("==== FULL DOM INSPECTION ====");
  // Check for product-list element
  const productList = document.getElementById('product-list');
  if (productList) {
    debugLog("Found #product-list element:", productList);
    debugLog("product-list children count:", productList.children.length);

    // Log entire HTML of product-list to see structure
    debugLog("product-list HTML:", productList.outerHTML.substring(0, 500) + '...');

    // Check all div children
    const divChildren = productList.getElementsByTagName('div');
    debugLog(`Found ${divChildren.length} div children in product-list`);

    for (let i = 0; i < divChildren.length; i++) {
      const div = divChildren[i];
      debugLog(`Div child ${i} class="${div.className}", id="${div.id}"`);

      // Check for specific elements inside each div
      const h1 = div.getElementsByTagName('h1');
      const p = div.getElementsByTagName('p');
      const price = div.querySelector('.price');
      const img = div.getElementsByTagName('img');
      const buyButton = div.querySelector('.buy-button');

      debugLog(`Div ${i} contents: h1=${h1.length}, p=${p.length}, .price=${!!price}, img=${img.length}, .buy-button=${!!buyButton}`);
    }
  } else {
    debugLog("NO #product-list element found!");
  }

  // Check for any elements with 'product' class using traditional DOM methods
  const productElements = document.getElementsByClassName('product');
  debugLog(`Found ${productElements.length} elements with class='product'`);

  if (productElements.length > 0) {
    // Log each product element
    for (let i = 0; i < productElements.length; i++) {
      debugLog(`product[${i}] HTML:`, productElements[i].outerHTML.substring(0, 300) + '...');
    }
  }

  // Try vanilla DOM selectors for common product elements
  const allH1s = document.getElementsByTagName('h1');
  const allPrices = document.getElementsByClassName('price');
  const allBuyButtons = document.getElementsByClassName('buy-button');

  debugLog(`DOM Summary: h1=${allH1s.length}, .price=${allPrices.length}, .buy-button=${allBuyButtons.length}`);
  debugLog("==== END DOM INSPECTION ====");

  // DIRECT TEST-STORE EXTRACTION FUNCTION - NOW WITH EXTREME DEBUGGING
  const extractTestStoreProducts = () => {
    debugLog("Using test-store direct extraction method");
    const products = [];

    // APPROACH 1: Try document.querySelectorAll first to debug issue
    debugLog("APPROACH 1: Using document.querySelectorAll('.product')");
    try {
      const queryProducts = document.querySelectorAll('.product');
      debugLog(`querySelectorAll('.product') returned ${queryProducts ? queryProducts.length : 'null'} items`);

      if (queryProducts && queryProducts.length > 0) {
        debugLog("SUCCESS: Found products with querySelectorAll!");
        Array.from(queryProducts).forEach((element, index) => {
          debugLog(`Processing product ${index} from querySelectorAll`);

          // Get title (verbose debugging)
          let title = null;
          const titleEl = element.querySelector('h1');
          if (titleEl) {
            title = titleEl.textContent.trim();
            debugLog(`Found title: "${title}"`);
          } else {
            debugLog("NO h1 found in product element!");
          }

          // Get price (verbose debugging)
          let price = null;
          const priceEl = element.querySelector('.price');
          if (priceEl) {
            const priceText = priceEl.textContent.trim();
            debugLog(`Found price text: "${priceText}"`);
            price = cleanPrice(priceText);
            debugLog(`Cleaned price: ${price}`);
          } else {
            debugLog("NO .price element found!");
          }

          // Get other data
          const imgEl = element.querySelector('img');
          const image_url = imgEl ? getFullUrl(imgEl.getAttribute('src')) : null;

          const descEls = element.querySelectorAll('p:not(.price)');
          let description = null;
          if (descEls.length > 0) {
            description = descEls[0].textContent.trim();
          }

          const buyEl = element.querySelector('.buy-button');
          const buy_url = buyEl ? getFullUrl(buyEl.getAttribute('href')) : window.location.href;

          // Add to products if valid
          if (title && price) {
            debugLog(`Adding valid product: ${title}`);
            products.push({
              title,
              price,
              image_url,
              description,
              buy_url
            });
          } else {
            debugLog(`Skipping invalid product - missing ${!title ? 'title' : 'price'}`);
          }
        });
      }
    } catch (error) {
      debugLog("ERROR in querySelectorAll approach:", error);
    }

    // APPROACH 2: Direct DOM traversal via product-list
    if (products.length === 0) {
      debugLog("APPROACH 2: Using direct DOM traversal via #product-list");
      const productList = document.getElementById('product-list');

      if (productList) {
        debugLog(`Found product-list with ${productList.children.length} children`);

        for (let i = 0; i < productList.children.length; i++) {
          const element = productList.children[i];
          debugLog(`Examining product-list child ${i}: ${element.tagName}, class="${element.className}"`);

          // Try to extract product data
          let title = null;
          const h1s = element.getElementsByTagName('h1');
          if (h1s.length > 0) {
            title = h1s[0].textContent.trim();
            debugLog(`Found title: "${title}"`);
          } else {
            debugLog("NO h1 elements found in this child");
          }

          // Get price elements
          let price = null;
          const pElements = element.getElementsByTagName('p');
          let priceFound = false;

          for (let j = 0; j < pElements.length; j++) {
            const p = pElements[j];
            debugLog(`Examining p tag ${j}: class="${p.className}", text="${p.textContent.trim()}"`);

            if (p.className === 'price' || p.textContent.includes('$')) {
              priceFound = true;
              const priceText = p.textContent.trim();
              debugLog(`Found price text: "${priceText}"`);
              price = cleanPrice(priceText);
              debugLog(`Cleaned price: ${price}`);
              break;
            }
          }

          if (!priceFound) {
            debugLog("NO price element found!");
          }

          // Get image and other data
          const imgElements = element.getElementsByTagName('img');
          const image_url = imgElements.length > 0 ? getFullUrl(imgElements[0].getAttribute('src')) : null;

          // Find description (any p that's not price)
          let description = null;
          for (let j = 0; j < pElements.length; j++) {
            if (pElements[j].className !== 'price' && !pElements[j].textContent.includes('$')) {
              description = pElements[j].textContent.trim();
              break;
            }
          }

          // Find buy button
          let buy_url = window.location.href;
          const aElements = element.getElementsByTagName('a');
          for (let j = 0; j < aElements.length; j++) {
            if (aElements[j].className === 'buy-button') {
              buy_url = getFullUrl(aElements[j].getAttribute('href'));
              break;
            }
          }

          // Add to products if valid
          if (title && price) {
            debugLog(`Adding valid product: ${title}`);
            products.push({
              title,
              price,
              image_url,
              description,
              buy_url
            });
          } else {
            debugLog(`Skipping invalid product - missing ${!title ? 'title' : 'price'}`);
          }
        }
      } else {
        debugLog("NO #product-list element found!");
      }
    }

    // APPROACH 3: Direct getElementsByClassName
    if (products.length === 0) {
      debugLog("APPROACH 3: Using direct getElementsByClassName('product')");
      const productElements = document.getElementsByClassName('product');

      debugLog(`Found ${productElements.length} elements with class='product'`);
      for (let i = 0; i < productElements.length; i++) {
        const element = productElements[i];

        // Log the raw HTML to see what we're working with
        debugLog(`Product ${i} HTML: ${element.outerHTML.substring(0, 300)}...`);

        // Try to extract product data
        const h1s = element.getElementsByTagName('h1');
        let title = null;
        if (h1s.length > 0) {
          title = h1s[0].textContent.trim();
          debugLog(`Found title: "${title}"`);
        } else {
          debugLog(`NO h1 tag in product ${i}`);
        }

        // Try to find price with extreme flexibility
        let price = null;
        const pTags = element.getElementsByTagName('p');
        debugLog(`Found ${pTags.length} p tags in product ${i}`);

        for (let j = 0; j < pTags.length; j++) {
          const p = pTags[j];
          debugLog(`P tag ${j} class="${p.className}", text="${p.textContent}"`);

          // Check if this looks like a price (has $ or is designated as price)
          if (p.className === 'price' || p.textContent.includes('$')) {
            const priceText = p.textContent.trim();
            debugLog(`Found price text: "${priceText}"`);
            price = cleanPrice(priceText);
            debugLog(`Cleaned price: ${price}`);
            break;
          }
        }

        // If still no price, check for any element with $ sign
        if (!price) {
          debugLog("No price found in p tags, checking full innerHTML for $ signs");
          const innerHTML = element.innerHTML;
          const dollarIndex = innerHTML.indexOf('$');

          if (dollarIndex !== -1) {
            // Extract text around the $ sign
            const startIndex = Math.max(0, dollarIndex - 10);
            const endIndex = Math.min(innerHTML.length, dollarIndex + 10);
            const priceSection = innerHTML.substring(startIndex, endIndex);

            debugLog(`Found $ sign, surrounding text: "${priceSection}"`);

            // Try to extract price from this section
            const match = priceSection.match(/\$(\d+(\.\d+)?)/);
            if (match) {
              price = match[1];
              debugLog(`Extracted price from innerHTML: ${price}`);
            }
          }
        }

        // Get image and other data
        const imgElements = element.getElementsByTagName('img');
        let image_url = null;
        if (imgElements.length > 0) {
          image_url = getFullUrl(imgElements[0].getAttribute('src'));
          debugLog(`Found image: ${image_url}`);
        } else {
          debugLog("NO img found in product");
        }

        // Find description (any p that's not price)
        let description = null;
        for (let j = 0; j < pTags.length; j++) {
          if (pTags[j].className !== 'price' && !pTags[j].textContent.includes('$')) {
            description = pTags[j].textContent.trim();
            break;
          }
        }

        // Find buy button
        const aElements = element.getElementsByTagName('a');
        let buy_url = window.location.href;
        let buyButtonFound = false;

        for (let j = 0; j < aElements.length; j++) {
          debugLog(`A tag ${j} class="${aElements[j].className}", href="${aElements[j].getAttribute('href')}"`);
          if (aElements[j].className === 'buy-button') {
            buyButtonFound = true;
            buy_url = getFullUrl(aElements[j].getAttribute('href'));
            debugLog(`Found buy button: ${buy_url}`);
            break;
          }
        }

        if (!buyButtonFound) {
          debugLog("NO buy button found");
        }

        // Add to products if valid
        if (title && price) {
          debugLog(`Adding valid product: ${title}`);
          products.push({
            title,
            price,
            image_url,
            description,
            buy_url
          });
        } else {
          debugLog(`Skipping invalid product - missing ${!title ? 'title' : 'price'}`);
        }
      }
    }

    // FALLBACK: Try to manually parse the entire page HTML
    if (products.length === 0) {
      debugLog("FALLBACK: Trying to manually parse HTML");
      const pageHTML = document.documentElement.outerHTML;

      // Find sections that look like products
      const productDivRegex = /<div[^>]*class=["']product["'][^>]*>([\s\S]*?)<\/div>/gi;
      let match;
      let matchCount = 0;

      while ((match = productDivRegex.exec(pageHTML)) !== null) {
        matchCount++;
        debugLog(`Found product div match ${matchCount}`);

        const productHTML = match[1];
        debugLog(`Product HTML: ${productHTML.substring(0, 300)}...`);

        // Extract title
        const titleMatch = /<h1[^>]*>(.*?)<\/h1>/i.exec(productHTML);
        let title = null;
        if (titleMatch) {
          title = titleMatch[1].trim();
          debugLog(`Extracted title: "${title}"`);
        }

        // Extract price
        const priceMatch = /<p[^>]*class=["']price["'][^>]*>(.*?)<\/p>/i.exec(productHTML);
        let price = null;
        if (priceMatch) {
          const priceText = priceMatch[1].trim();
          debugLog(`Extracted price text: "${priceText}"`);
          price = cleanPrice(priceText);
        } else {
          // Try finding a $ sign
          const dollarMatch = /\$(\d+(\.\d+)?)/i.exec(productHTML);
          if (dollarMatch) {
            price = dollarMatch[1];
            debugLog(`Extracted price from $ sign: ${price}`);
          }
        }

        // Extract image
        const imgMatch = /<img[^>]*src=["'](.*?)["'][^>]*>/i.exec(productHTML);
        const image_url = imgMatch ? getFullUrl(imgMatch[1]) : null;

        // Extract buy link
        const buyMatch = /<a[^>]*class=["']buy-button["'][^>]*href=["'](.*?)["'][^>]*>/i.exec(productHTML);
        const buy_url = buyMatch ? getFullUrl(buyMatch[1]) : window.location.href;

        // Extract description (any p that's not price)
        let description = null;
        const descRegex = /<p[^>]*(?!class=["']price["'])[^>]*>(.*?)<\/p>/i;
        const descMatch = descRegex.exec(productHTML);
        if (descMatch) {
          description = descMatch[1].trim();
        }

        // Add product if valid
        if (title && price) {
          debugLog(`Adding valid product from HTML parse: ${title}`);
          products.push({
            title,
            price,
            image_url,
            description,
            buy_url
          });
        }
      }

      debugLog(`Found ${matchCount} potential products via HTML parsing, ${products.length} valid`);
    }

    return products;
  };

  // 4) Extract all products
  debugLog("Starting product extraction");
  let products = [];

  if (isTestStorePage()) {
    // Special handling for test store
    products = extractTestStoreProducts();
  } else {
    // Regular website extraction would go here
    // For now, omitted since we're focusing on the test page
    // ...
  }

  console.log(`[injector.js] Extracted ${products.length} products from the page`);
  debugLog("Extracted products:", products);

  // 5) Sync each extracted product
  let syncedProducts = 0;
  let skippedProducts = 0;
  let failedProducts = 0;

  for (const product of products) {
    // Only sync if required fields exist
    if (!product.title || !product.price) {
      console.warn("[injector.js] ⏭ Skip sync — missing required fields:", product);
      skippedProducts++;
      continue;
    }

    // Build payload for this product
    const payload = {
      site_id: siteId,
      title: product.title,
      price: parseFloat(product.price),
      ...(product.image_url && { image_url: product.image_url }),
      ...(product.buy_url && { buy_url: product.buy_url }),
      ...(product.description && { description: product.description }),
    };

    console.log("[injector.js] Syncing product:", product.title);
    debugLog("Payload:", payload);

    try {
      const res = await fetch(`${baseUrl}/api/products/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      debugLog(`Response for ${product.title}:`, responseText);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}: ${responseText}`);
      }

      let json;
      try {
        json = JSON.parse(responseText);
      } catch (e) {
        debugLog("Failed to parse JSON response:", responseText);
        throw new Error("Invalid JSON response");
      }

      console.log(`[injector.js] Product sync result for "${product.title}":`, json);
      syncedProducts++;
    } catch (err) {
      console.error(`[injector.js] ❌ Sync failed for product "${product.title}":`, err.message);
      failedProducts++;
      // Continue processing other products
      continue;
    }
  }

  console.log(`[injector.js] Product sync summary: ${syncedProducts} synced, ${skippedProducts} skipped, ${failedProducts} failed`);

  // 6) Fetch & inject agent manifest
  try {
    const agentsUrl = isLocal
      ? "http://localhost:3000/.well-known/agents.json"
      : `https://${domain}/.well-known/agents.json`;

    console.log("[injector.js] Fetching agents from:", agentsUrl);
    debugLog("Fetching agents.json from:", agentsUrl);

    const ajRes = await fetch(agentsUrl);
    if (!ajRes.ok) {
      const errorText = await ajRes.text();
      debugLog("agents.json fetch error:", errorText);
      throw new Error(`Failed to fetch agents.json: ${ajRes.status} - ${errorText}`);
    }

    let ajData;
    try {
      ajData = await ajRes.json();
    } catch (e) {
      debugLog("Failed to parse agents.json response:", await ajRes.text());
      throw new Error("Invalid JSON response from agents.json");
    }

    const { manifest_url } = ajData;
    if (!manifest_url) {
      throw new Error("No manifest_url in agents.json");
    }

    console.log("[injector.js] Manifest URL:", manifest_url);
    debugLog("Fetching manifest from:", manifest_url);

    const manRes = await fetch(manifest_url);
    if (!manRes.ok) {
      const errorText = await manRes.text();
      debugLog("Manifest fetch error:", errorText);
      throw new Error(`Failed to fetch manifest: ${manRes.status} - ${errorText}`);
    }

    let manifestData;
    try {
      manifestData = await manRes.json();
    } catch (e) {
      debugLog("Failed to parse manifest response:", await manRes.text());
      throw new Error("Invalid JSON response from manifest");
    }

    const { products: manifestProducts } = manifestData;

    // Record the manifest fetch event after successful fetch
    debugLog("Recording manifest fetch event");
    await recordManifestFetch();

    if (!manifestProducts || !Array.isArray(manifestProducts) || manifestProducts.length === 0) {
      console.warn("[injector.js] No products found in manifest");
      return;
    }

    console.log("[injector.js] Manifest products:", manifestProducts.length);
    debugLog("Manifest products:", manifestProducts);

    const injected = [];
    manifestProducts.forEach((p) => {
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

    // LAST RESORT: Force add all products from manifest to also sync them back to Supabase
    // This is a fallback if we can't extract products from the page
    if (products.length === 0 && manifestProducts.length > 0) {
      debugLog("LAST RESORT: No products extracted from page, attempting to sync from manifest");

      for (const p of manifestProducts) {
        if (!p.title || !p.price) continue;

        const payload = {
          site_id: siteId,
          title: p.title,
          price: parseFloat(p.price),
          ...(p.image_url && { image_url: p.image_url }),
          ...(p.buy_url && { buy_url: p.buy_url }),
          ...(p.description && { description: p.description }),
        };

        debugLog(`Syncing manifest product ${p.title} back to Supabase`);

        try {
          const res = await fetch(`${baseUrl}/api/products/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            syncedProducts++;
            debugLog(`Successfully synced ${p.title} from manifest`);
          }
        } catch (err) {
          debugLog(`Failed to sync ${p.title} from manifest:`, err);
        }
      }

      debugLog(`Synced ${syncedProducts} products from manifest as fallback`);
    }

    // Debug UI - show on test pages
    const box = document.createElement("div");
    box.style = "position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.8);color:lime;font:12px monospace;padding:8px;border-radius:6px;z-index:9999;max-width:400px;max-height:300px;overflow:auto;";
    box.innerHTML = `[injector.js] Summary:<br>
- ${syncedProducts} products synced to database<br>
- ${skippedProducts} products skipped<br>
- ${failedProducts} products failed<br>
- ${injected.length} products from manifest injected<br>
<br>Products found: ${products.map(p => p.title).join(', ')}`;
    document.body.appendChild(box);

  } catch (err) {
    console.warn("[injector.js] ❌ Injection error:", err.message);
    debugLog("Injection error details:", err);

    // Debug UI for error
    const box = document.createElement("div");
    box.style = "position:fixed;bottom:10px;right:10px;background:rgba(0,0,0,0.8);color:red;font:12px monospace;padding:8px;border-radius:6px;z-index:9999;";
    box.innerText = `[injector.js] Error: ${err.message}`;
    document.body.appendChild(box);
  }
})();