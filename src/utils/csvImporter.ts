import { cleanSEODescription, cleanSEOTitle, cleanSEOKeywords } from './textCleaner';
import { stripHTML } from './textCleaner';

export interface CSVProduct {
  [key: string]: string;
}

export const parseCSV = (csvContent: string): CSVProduct[] => {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];
  
  const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const headers = rawHeaders.map(normalizeHeader);
  
  return lines.slice(1)
    .filter(line => line.trim())
    .map(line => {
      const values = parseCSVLine(line);
      const product: CSVProduct = {};
      
      headers.forEach((header, index) => {
        product[header] = values[index]?.replace(/^"|"$/g, '').trim() || '';
      });
      
      return product;
    })
    .filter(product => product.name && product.name.trim()); // Only include products with names
};

// Enhanced header normalization with more image field variations
const normalizeHeader = (header: string): string => {
  const normalized = header.toLowerCase().trim();
  
  // Map common variations to canonical names
  const headerMapping: { [key: string]: string } = {
    'product name': 'name',
    'productname': 'name',
    'title': 'name',
    'item name': 'name',
    'product title': 'name',
    'desc': 'description',
    'product description': 'description',
    'details': 'description',
    'cost': 'price',
    'amount': 'price',
    'value': 'price',
    'product price': 'price',
    'cat': 'category',
    'type': 'category',
    'product category': 'category',
    'group': 'category',
    // Enhanced image field mapping
    'img': 'images',
    'image': 'images',
    'photo': 'images',
    'picture': 'images',
    'product images': 'images',
    'image url': 'images',
    'image urls': 'images',
    'photo url': 'images',
    'picture url': 'images',
    'main image': 'images',
    'primary image': 'images',
    'gallery': 'images',
    'image_url': 'images',
    'imageurl': 'images',
    'image1': 'images',
    'image_1': 'images',
    'stock': 'inStock',
    'in stock': 'inStock',
    'available': 'inStock',
    'inventory': 'inStock',
    'is featured': 'featured',
    'highlight': 'featured',
    'promoted': 'featured',
    'seo title': 'seoTitle',
    'meta title': 'seoTitle',
    'page title': 'seoTitle',
    'seo description': 'seoDescription',
    'meta description': 'seoDescription',
    'seo keywords': 'seoKeywords',
    'meta keywords': 'seoKeywords',
    'keywords': 'seoKeywords',
    'tags': 'seoKeywords',
    'weight': 'weight',
    'shipping weight': 'weight',
    'product weight': 'weight',
    'weight (kg)': 'weight',
    'weight kg': 'weight',
    'weight_kg': 'weight',
    'wt': 'weight'
  };
  
  return headerMapping[normalized] || normalized;
};

const parseCSVLine = (line: string): string[] => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
};

// Enhanced category mapping with more keywords
const categoryMapping: { [key: string]: string } = {
  'train': 'wooden-trains',
  'trains': 'wooden-trains',
  'railway': 'wooden-trains',
  'locomotive': 'wooden-trains',
  'engine': 'wooden-trains',
  'carriage': 'wooden-trains',
  'wagon': 'wooden-trains',
  'choo': 'wooden-trains',
  'chug': 'wooden-trains',
  'steam': 'wooden-trains',
  'freight': 'wooden-trains',
  'passenger': 'wooden-trains',
  'rail': 'wooden-trains',
  'track': 'wooden-trains',
  'baby': 'wooden-baby-toys',
  'rattle': 'wooden-baby-toys',
  'teething': 'wooden-baby-toys',
  'infant': 'wooden-baby-toys',
  'toddler': 'wooden-baby-toys',
  'newborn': 'wooden-baby-toys',
  'tractor': 'wooden-tractors-boats',
  'boat': 'wooden-tractors-boats',
  'ship': 'wooden-tractors-boats',
  'farm': 'wooden-tractors-boats',
  'sailing': 'wooden-tractors-boats',
  'yacht': 'wooden-tractors-boats',
  'fishing': 'wooden-tractors-boats',
  'john': 'wooden-tractors-boats', // for "John Deere" style tractors
  'deere': 'wooden-tractors-boats',
  'kitchen': 'wooden-kitchenware',
  'cooking': 'wooden-kitchenware',
  'food': 'wooden-kitchenware',
  'utensil': 'wooden-kitchenware',
  'cutting': 'wooden-kitchenware',
  'board': 'wooden-kitchenware',
  'spoon': 'wooden-kitchenware',
  'bowl': 'wooden-kitchenware',
  'plate': 'wooden-kitchenware',
  'cup': 'wooden-kitchenware',
  'pot': 'wooden-kitchenware',
  'pan': 'wooden-kitchenware',
  'plane': 'wooden-planes-helicopters',
  'airplane': 'wooden-planes-helicopters',
  'helicopter': 'wooden-planes-helicopters',
  'aircraft': 'wooden-planes-helicopters',
  'jet': 'wooden-planes-helicopters',
  'biplane': 'wooden-planes-helicopters',
  'fighter': 'wooden-planes-helicopters',
  'bomber': 'wooden-planes-helicopters',
  'glider': 'wooden-planes-helicopters',
  'truck': 'wooden-trucks',
  'vehicle': 'wooden-trucks',
  'construction': 'wooden-trucks',
  'fire': 'wooden-trucks',
  'dump': 'wooden-trucks',
  'lorry': 'wooden-trucks',
  'van': 'wooden-trucks',
  'pickup': 'wooden-trucks',
  'semi': 'wooden-trucks',
  'trailer': 'wooden-trucks',
  'garbage': 'wooden-trucks',
  'cement': 'wooden-trucks',
  'mixer': 'wooden-trucks',
  'car': 'wooden-cars',
  'cars': 'wooden-cars',
  'racing': 'wooden-cars',
  'race': 'wooden-cars',
  'sports': 'wooden-cars',
  'sedan': 'wooden-cars',
  'coupe': 'wooden-cars',
  'convertible': 'wooden-cars',
  'roadster': 'wooden-cars',
  'formula': 'wooden-cars',
  'rally': 'wooden-cars',
  'speed': 'wooden-cars',
  'puzzle': 'wooden-other-toys',
  'blocks': 'wooden-other-toys',
  'game': 'wooden-other-toys',
  'toy': 'wooden-other-toys',
  'building': 'wooden-other-toys',
  'stacking': 'wooden-other-toys',
  'sorting': 'wooden-other-toys',
  'educational': 'wooden-other-toys',
  'learning': 'wooden-other-toys',
  'shape': 'wooden-other-toys',
  'color': 'wooden-other-toys'
};

const determineCategory = (productName: string, description: string = ''): string => {
  const text = (productName + ' ' + description).toLowerCase();
  
  // Check for train keywords first with highest priority
  const trainKeywords = ['train', 'trains', 'railway', 'locomotive', 'engine', 'carriage', 'wagon', 'choo', 'steam', 'freight', 'passenger', 'rail', 'track'];
  for (const keyword of trainKeywords) {
    if (text.includes(keyword)) {
      console.log(`🚂 Train detected: "${keyword}" found in "${text}"`);
      return 'wooden-trains';
    }
  }
  
  // Check for baby toys (second priority)
  const babyKeywords = ['baby', 'rattle', 'teething', 'infant', 'toddler', 'newborn'];
  for (const keyword of babyKeywords) {
    if (text.includes(keyword)) {
      console.log(`👶 Baby toy detected: "${keyword}" found in "${text}"`);
      return 'wooden-baby-toys';
    }
  }
  
  // Then check all other categories
  for (const [keyword, category] of Object.entries(categoryMapping)) {
    if (text.includes(keyword)) {
      return category;
    }
  }
  
  return 'wooden-other-toys'; // Default category
};

// Enhanced image processing function
const processImages = (imageStr: string, productName: string): string[] => {
  if (!imageStr || !imageStr.trim()) {
    return ['/FB_IMG_1640827671355.jpg'];
  }


  // Handle multiple separators: |, ;, comma, newline
  const separators = /[|;,\n]/;
  let images = imageStr.split(separators)
    .map(img => img.trim())
    .filter(img => img && img.length > 0);


  // Validate and clean image URLs
  images = images.map(img => {
    // Remove quotes if present
    img = img.replace(/^["']|["']$/g, '');
    
    // Handle different URL formats - be more permissive, including data URLs
    if (!img.startsWith('http') && !img.startsWith('data:') && !img.startsWith('/') && !img.startsWith('blob:')) {
      // If it's just a filename, assume it's in the images directory
      if (!img.includes('/')) {
        img = '/FB_IMG_1640827671355.jpg';
      }
    }
    
    return img;
  });
  
  // Filter out obviously invalid URLs but be more lenient, allow data URLs
  images = images.filter(img => img && (img.length > 5 || img.startsWith('data:')));

  // If no valid images found, use default
  if (images.length === 0) {
    images = ['https://i.ibb.co/dw3x0Kmm/image.jpg'];
  }

  return images;
};

// Auto-generate SEO content based on product data
const generateSEO = (name: string, description: string, category: string, price: number) => {
  const categoryNames: { [key: string]: string } = {
    'wooden-trains': 'Wooden Train',
    'wooden-baby-toys': 'Baby Toy',
    'wooden-tractors-boats': 'Wooden Vehicle',
    'wooden-kitchenware': 'Kitchen Toy',
    'wooden-planes-helicopters': 'Aviation Toy',
    'wooden-trucks': 'Wooden Truck',
    'wooden-other-toys': 'Wooden Toy'
  };

  const categoryName = categoryNames[category] || 'Wooden Toy';
  
  // Generate SEO title
  const seoTitle = `${name} | ${categoryName} | Handcrafted in New Zealand`;
  
  // Generate SEO description
  const seoDescription = `${name} - ${description.substring(0, 100)}${description.length > 100 ? '...' : ''} Handcrafted from sustainable timber. Price: $${price} NZD. Free NZ shipping over $150.`;
  
  // Generate SEO keywords based on product name and category
  const baseKeywords = [
    'wooden toys',
    'handcrafted',
    'New Zealand made',
    'sustainable timber',
    'children toys',
    'safe toys'
  ];
  
  const categoryKeywords: { [key: string]: string[] } = {
    'wooden-trains': ['wooden trains', 'railway toys', 'train sets', 'locomotive toys'],
    'wooden-baby-toys': ['baby toys', 'safe baby toys', 'teething toys', 'infant toys'],
    'wooden-tractors-boats': ['wooden vehicles', 'farm toys', 'boat toys', 'tractor toys'],
    'wooden-kitchenware': ['play kitchen', 'wooden kitchen toys', 'cooking toys', 'kitchen sets'],
    'wooden-planes-helicopters': ['wooden planes', 'aviation toys', 'helicopter toys', 'aircraft toys'],
    'wooden-trucks': ['wooden trucks', 'construction toys', 'vehicle toys', 'truck toys'],
    'wooden-other-toys': ['educational toys', 'wooden puzzles', 'building toys', 'creative toys']
  };
  
  const specificKeywords = categoryKeywords[category] || [];
  const nameKeywords = name.toLowerCase().split(' ').filter(word => word.length > 2);
  
  const allKeywords = [...baseKeywords, ...specificKeywords, ...nameKeywords];
  const seoKeywords = [...new Set(allKeywords)].slice(0, 10).join(', ');
  
  return {
    seoTitle: cleanSEOTitle(seoTitle),
    seoDescription: cleanSEODescription(seoDescription),
    seoKeywords: cleanSEOKeywords(seoKeywords)
  };
};

export const convertCSVToProducts = (csvProducts: CSVProduct[]) => {
  console.log(`Converting ${csvProducts.length} CSV products to Product objects`);
  
  return csvProducts.map((csvProduct, index) => {
    // Extract price - handle different formats
    let price = 0;
    const priceStr = csvProduct.price || csvProduct.Price || csvProduct.PRICE || '0';
    const priceMatch = priceStr.match(/[\d.]+/);
    if (priceMatch) {
      price = parseFloat(priceMatch[0]);
    }

    // Get product name
    const name = csvProduct.name || csvProduct.Name || csvProduct.NAME || `Product ${index + 1}`;
    
    // Get description
    let description = csvProduct.description || csvProduct.Description || csvProduct.DESCRIPTION || `Handcrafted wooden ${name.toLowerCase()}`;
    
    // Clean HTML from description
    description = stripHTML(description);
    
    // Ensure description is not empty after cleaning
    if (!description || description.trim().length === 0) {
      description = `Handcrafted wooden ${name.toLowerCase()} made with love in New Zealand using sustainable materials.`;
    }
    
    // Determine category
    let category = csvProduct.category || csvProduct.Category || csvProduct.CATEGORY;
    if (!category) {
      category = determineCategory(name, description);
    } else {
    }
    
    // Enhanced image processing
    const imageStr = csvProduct.images || csvProduct.Images || csvProduct.IMAGES || 
                    csvProduct.image || csvProduct.Image || csvProduct.IMAGE ||
                    csvProduct.photo || csvProduct.Photo || csvProduct.PHOTO ||
                    csvProduct.picture || csvProduct.Picture || csvProduct.PICTURE ||
                    csvProduct.img || csvProduct.Img || csvProduct.IMG || '';
    
    const images = processImages(imageStr, name);

    // Handle stock status
    const stockStr = csvProduct.inStock || csvProduct.InStock || csvProduct.stock || csvProduct.Stock || 'true';
    const inStock = stockStr.toLowerCase() === 'true' || stockStr.toLowerCase() === 'yes' || stockStr === '1';

    // Handle featured status
    const featuredStr = csvProduct.featured || csvProduct.Featured || csvProduct.FEATURED || 'false';
    const featured = featuredStr.toLowerCase() === 'true' || featuredStr.toLowerCase() === 'yes' || featuredStr === '1';

    // Handle weight
    let weight = 0.5; // Default weight in kg
    const weightStr = csvProduct.weight || csvProduct.Weight || csvProduct.WEIGHT || '';
    if (weightStr && weightStr.trim()) {
      const weightMatch = weightStr.match(/[\d.]+/);
      if (weightMatch) {
        weight = parseFloat(weightMatch[0]);
      }
    }

    // Auto-generate SEO if not provided
    const providedSEO = {
      seoTitle: csvProduct.seoTitle || csvProduct.SEOTitle || '',
      seoDescription: csvProduct.seoDescription || csvProduct.SEODescription || '',
      seoKeywords: csvProduct.seoKeywords || csvProduct.SEOKeywords || ''
    };

    const autoSEO = generateSEO(name, description, category, price);

    const result = {
      id: `product-${Date.now()}-${index}`,
      name: name,
      description: description,
      price: price,
      category: category,
      images: images,
      inStock: inStock,
      featured: featured,
      weight: weight,
      seoTitle: providedSEO.seoTitle || autoSEO.seoTitle,
      seoDescription: providedSEO.seoDescription || autoSEO.seoDescription,
      seoKeywords: providedSEO.seoKeywords || autoSEO.seoKeywords,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log(`Converted product ${index + 1}: ${result.name} (${result.category})`);
    return result;
  });
};