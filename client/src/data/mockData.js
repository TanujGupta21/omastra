// ── OMASTRA Product & Category Catalog ───────────────────────────────
export const MOCK_CATEGORIES = [
  {
    _id: 'cat-whey',
    name: 'Whey Protein',
    slug: 'whey-protein',
    description: 'Fast-absorbing whey for muscle recovery and lean growth.',
    image: '/products/whey-pro.png',
    tagline: 'Fast-absorbing muscle recovery',
    count: '2 Formulas',
  },
  {
    _id: 'cat-plant',
    name: 'Plant Protein',
    slug: 'plant-protein',
    description: 'Clean, complete amino acid profile from pea and brown rice sources.',
    image: '/products/plant-fuel.png',
    tagline: 'Clean pea & rice protein fuel',
    count: '1 Formula',
  },
  {
    _id: 'cat-creatine',
    name: 'Creatine',
    slug: 'creatine',
    description: 'Science-backed micronised creatine monohydrate for strength and power.',
    image: '/products/creatine.png',
    tagline: 'Pure strength & power output',
    count: '1 Formula',
  },
  {
    _id: 'cat-pre',
    name: 'Pre-Workout',
    slug: 'pre-workout',
    description: 'Targeted formulation for explosive energy, endurance, and mental focus.',
    image: '/products/nitropre.png',
    tagline: 'Clean sustained energy & focus',
    count: '1 Formula',
  },
  {
    _id: 'cat-electrolytes',
    name: 'Electrolytes',
    slug: 'electrolytes',
    description: 'Optimal hydration and mineral replenishment for training and recovery.',
    image: '/products/hydrocharge.png',
    tagline: 'Rapid cellular hydration',
    count: '1 Formula',
  },
  {
    _id: 'cat-snacks',
    name: 'Protein Snacks',
    slug: 'protein-snacks',
    description: 'Convenient high-protein nutrition on the go with zero added sugars.',
    image: '/products/protein-bar.png',
    tagline: '20g protein clean snack bar',
    count: '1 Formula',
  },
  {
    _id: 'cat-wellness',
    name: 'Wellness',
    slug: 'wellness',
    description: 'Essential daily micronutrients for longevity, joints, and cellular health.',
    image: '/products/omega-3.png',
    tagline: 'Triple-strength EPA & DHA',
    count: '1 Formula',
  },
];

export const MOCK_PRODUCTS = [
  {
    _id: 'omastra-whey-pro-classic-blend',
    id: 'omastra-whey-pro-classic-blend',
    name: 'OMASTRA Whey Pro — Classic Blend',
    slug: 'omastra-whey-pro-classic-blend',
    category: { _id: 'cat-whey', name: 'Whey Protein', slug: 'whey-protein' },
    image: '/products/whey-pro.png',
    images: [
      { url: '/products/whey-pro.png', alt: 'OMASTRA Whey Pro Classic Blend', isPrimary: true },
    ],
    variants: [
      { sku: 'WP-CHOC-1KG', flavor: 'Chocolate Fudge', size: '1 kg', servings: 33, price: 1799, originalPrice: 2199, stock: 120 },
      { sku: 'WP-VAN-1KG',  flavor: 'Vanilla Bean',   size: '1 kg', servings: 33, price: 1799, originalPrice: 2199, stock: 90 },
      { sku: 'WP-CHOC-2KG', flavor: 'Chocolate Fudge', size: '2 kg', servings: 66, price: 3299, originalPrice: 3999, stock: 60 },
    ],
    price: 1799,
    originalPrice: 2199,
    stock: 120,
    averageRating: 4.8,
    reviewCount: 124,
    dietaryInfo: ['vegetarian'],
    tags: ['whey', 'protein', 'muscle-building', 'bestseller'],
    shortDescription: 'A high-quality whey concentrate + isolate blend for everyday training. 24g protein per serving.',
    description: '<p>OMASTRA Whey Pro delivers 24g of ultra-filtered protein per scoop, combining fast-digesting whey concentrate and isolate to stimulate muscle protein synthesis after strenuous workouts.</p><p>Formulated without amino spiking, maltodextrin, or hidden fillers. Fully disclosed label with lab-verified purity.</p>',
    nutritionFacts: {
      servingSize: '30g',
      servingsPerPack: 33,
      calories: 120,
      protein: 24,
      carbohydrates: 3,
      sugars: 1.5,
      fat: 2,
      saturatedFat: 0.8,
      sodium: 150,
    },
    ingredients: 'Whey Protein Concentrate (80%), Whey Protein Isolate (90%), Natural Cocoa Powder, Sunflower Lecithin, Stevia Extract, Digestive Enzyme Blend (DigeZyme®).',
    allergens: 'Contains Milk and Soy derivatives.',
    directions: 'Mix 1 level scoop (30g) in 200–250ml of cold water or skimmed milk. Consume immediately post-workout or between meals.',
    isFeatured: true,
    isBestSeller: true,
    status: 'active',
  },
  {
    _id: 'omastra-whey-isolate-90',
    id: 'omastra-whey-isolate-90',
    name: 'OMASTRA Whey Isolate 90',
    slug: 'omastra-whey-isolate-90',
    category: { _id: 'cat-whey', name: 'Whey Protein', slug: 'whey-protein' },
    image: '/products/whey-isolate.png',
    images: [
      { url: '/products/whey-isolate.png', alt: 'OMASTRA Whey Isolate 90', isPrimary: true },
    ],
    variants: [
      { sku: 'WI90-CHOC-1KG', flavor: 'Dark Chocolate', size: '1 kg', servings: 30, price: 2499, originalPrice: 2999, stock: 75 },
      { sku: 'WI90-STRAW-1KG', flavor: 'Strawberry Cream', size: '1 kg', servings: 30, price: 2499, originalPrice: 2999, stock: 50 },
    ],
    price: 2499,
    originalPrice: 2999,
    stock: 75,
    averageRating: 4.9,
    reviewCount: 88,
    dietaryInfo: ['vegetarian', 'low-fat', 'sugar-free'],
    tags: ['isolate', 'lean-muscle', 'pure-protein', 'low-carb'],
    shortDescription: 'Ultra-filtered cross-flow whey isolate with 90% protein purity, minimal lactose, and 0g sugar.',
    description: '<p>OMASTRA Whey Isolate 90 is cross-flow micro-filtered to preserve delicate bioactive peptide fractions while eliminating excess carbs, fats, and lactose. Ideal for cutting phases and lactose-sensitive athletes.</p>',
    nutritionFacts: {
      servingSize: '33g',
      servingsPerPack: 30,
      calories: 110,
      protein: 27,
      carbohydrates: 1,
      sugars: 0,
      fat: 0.5,
      sodium: 90,
    },
    ingredients: 'Cross-Flow Microfiltered Whey Protein Isolate (90%), Natural Flavours, Cocoa, Sunflower Lecithin, Stevia Leaf Extract.',
    allergens: 'Contains Milk. Gluten-free.',
    directions: 'Mix 1 scoop with 200ml cold water in a shaker cup. Shake for 15 seconds.',
    isFeatured: true,
    status: 'active',
  },
  {
    _id: 'omastra-creatine-monohydrate',
    id: 'omastra-creatine-monohydrate',
    name: 'OMASTRA Creatine Monohydrate',
    slug: 'omastra-creatine-monohydrate',
    category: { _id: 'cat-creatine', name: 'Creatine', slug: 'creatine' },
    image: '/products/creatine.png',
    images: [
      { url: '/products/creatine.png', alt: 'OMASTRA Creatine Monohydrate', isPrimary: true },
    ],
    variants: [
      { sku: 'CR-UNFL-250G', flavor: 'Unflavoured', size: '250g', servings: 50, price: 699, originalPrice: 899, stock: 150 },
      { sku: 'CR-UNFL-500G', flavor: 'Unflavoured', size: '500g', servings: 100, price: 1199, originalPrice: 1499, stock: 95 },
    ],
    price: 699,
    originalPrice: 899,
    stock: 150,
    averageRating: 4.9,
    reviewCount: 215,
    dietaryInfo: ['vegan', 'gluten-free', 'sugar-free'],
    tags: ['creatine', 'strength', 'power', 'bestseller'],
    shortDescription: '100% pure 200-mesh micronised creatine monohydrate. 5g per serving with zero additives.',
    description: '<p>Clinically proven to saturate intramuscular phosphocreatine stores, supporting explosive power, maximal force production, and accelerated intra-set recovery during high-intensity training.</p>',
    nutritionFacts: {
      servingSize: '5g',
      servingsPerPack: 50,
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      sodium: 0,
    },
    ingredients: '100% Micronised Creatine Monohydrate (200 Mesh).',
    allergens: 'None. Free from dairy, gluten, soy, nuts.',
    directions: 'Mix 1 scoop (5g) with water, juice, or your post-workout shake once daily. Drink plenty of water throughout the day.',
    isFeatured: true,
    isBestSeller: true,
    status: 'active',
  },
  {
    _id: 'omastra-nitropre-pre-workout-igniter',
    id: 'omastra-nitropre-pre-workout-igniter',
    name: 'OMASTRA NitroPre — Pre-Workout Igniter',
    slug: 'omastra-nitropre-pre-workout-igniter',
    category: { _id: 'cat-pre', name: 'Pre-Workout', slug: 'pre-workout' },
    image: '/products/nitropre.png',
    images: [
      { url: '/products/nitropre.png', alt: 'OMASTRA NitroPre Pre-Workout Igniter', isPrimary: true },
    ],
    variants: [
      { sku: 'NP-PUNCH-300G', flavor: 'Fruit Punch', size: '300g', servings: 30, price: 1299, originalPrice: 1599, stock: 80 },
      { sku: 'NP-BLUE-300G', flavor: 'Blue Raspberry', size: '300g', servings: 30, price: 1299, originalPrice: 1599, stock: 65 },
    ],
    price: 1299,
    originalPrice: 1599,
    stock: 80,
    averageRating: 4.7,
    reviewCount: 94,
    dietaryInfo: ['vegetarian', 'sugar-free'],
    tags: ['pre-workout', 'energy', 'pumps', 'focus'],
    shortDescription: 'High-yield nitric oxide pump matrix with 4000mg L-Citrulline, 200mg Caffeine, and 1600mg Beta-Alanine.',
    description: '<p>NitroPre delivers explosive mental focus and intense vascular pumps without the jittery crash. Scientifically dosed with pure L-Citrulline, Beta-Alanine, and Natural Anhydrous Caffeine.</p>',
    nutritionFacts: {
      servingSize: '10g',
      servingsPerPack: 30,
      calories: 12,
      protein: 0,
      carbohydrates: 1,
      sugars: 0,
      fat: 0,
      sodium: 45,
    },
    ingredients: 'L-Citrulline Malate (2:1), Beta-Alanine, Caffeine Anhydrous, L-Tyrosine, Taurine, Natural Flavor, Sucralose, Malic Acid.',
    allergens: 'Manufactured in a facility processing dairy and soy.',
    directions: 'Mix 1 scoop with 200–250ml cold water 20–30 minutes before training. Do not exceed 1 scoop in 24 hours.',
    isFeatured: true,
    status: 'active',
  },
  {
    _id: 'omastra-plantfuel-vegan-protein',
    id: 'omastra-plantfuel-vegan-protein',
    name: 'OMASTRA PlantFuel — Pea & Brown Rice',
    slug: 'omastra-plantfuel-vegan-protein',
    category: { _id: 'cat-plant', name: 'Plant Protein', slug: 'plant-protein' },
    image: '/products/plant-fuel.png',
    images: [
      { url: '/products/plant-fuel.png', alt: 'OMASTRA PlantFuel Pea & Brown Rice', isPrimary: true },
    ],
    variants: [
      { sku: 'PF-CHOC-1KG', flavor: 'Cacao & Coconut', size: '1 kg', servings: 28, price: 2199, originalPrice: 2599, stock: 70 },
      { sku: 'PF-VAN-1KG', flavor: 'Vanilla Bean', size: '1 kg', servings: 28, price: 2199, originalPrice: 2599, stock: 45 },
    ],
    price: 2199,
    originalPrice: 2599,
    stock: 70,
    averageRating: 4.8,
    reviewCount: 62,
    dietaryInfo: ['vegan', 'gluten-free', 'sugar-free'],
    tags: ['plant-protein', 'vegan', 'dairy-free', 'clean'],
    shortDescription: 'Complete plant protein blend delivering 22g protein, 4.2g BCAAs, and natural MCT coconut fats.',
    description: '<p>Synergistic combination of organic Canadian yellow pea protein and sprouted brown rice protein providing a balanced amino acid profile with smooth, non-chalky texture.</p>',
    nutritionFacts: {
      servingSize: '36g',
      servingsPerPack: 28,
      calories: 130,
      protein: 22,
      carbohydrates: 4,
      sugars: 0.5,
      fat: 2.5,
      sodium: 180,
    },
    ingredients: 'Pea Protein Isolate, Sprouted Brown Rice Protein, Raw Cacao Powder, Coconut MCT Oil Powder, Natural Flavours, Stevia Extract.',
    allergens: '100% Vegan. Gluten-free, dairy-free, soy-free.',
    directions: 'Blend 1 scoop with 250ml water or oat milk. Perfect in smoothies with banana or berries.',
    isFeatured: false,
    status: 'active',
  },
  {
    _id: 'omastra-hydrocharge-electrolyte-matrix',
    id: 'omastra-hydrocharge-electrolyte-matrix',
    name: 'OMASTRA HydroCharge — Electrolyte Matrix',
    slug: 'omastra-hydrocharge-electrolyte-matrix',
    category: { _id: 'cat-electrolytes', name: 'Electrolytes', slug: 'electrolytes' },
    image: '/products/hydrocharge.png',
    images: [
      { url: '/products/hydrocharge.png', alt: 'OMASTRA HydroCharge Electrolyte Matrix', isPrimary: true },
    ],
    variants: [
      { sku: 'HC-LEMON-30SERV', flavor: 'Zesty Lemon Lime', size: '30 Servings', servings: 30, price: 899, originalPrice: 1099, stock: 110 },
      { sku: 'HC-BERRY-30SERV', flavor: 'Wild Berry', size: '30 Servings', servings: 30, price: 899, originalPrice: 1099, stock: 85 },
    ],
    price: 899,
    originalPrice: 1099,
    stock: 110,
    averageRating: 4.9,
    reviewCount: 78,
    dietaryInfo: ['vegan', 'gluten-free', 'sugar-free'],
    tags: ['hydration', 'electrolytes', 'stamina', 'cramping'],
    shortDescription: 'Bioavailable 6-electrolyte matrix with Himalayan pink salt, magnesium glycinate, and coconut water powder.',
    description: '<p>Engineered for endurance athletes and intense gym sessions. Restores optimal osmotic balance, prevents cramping, and accelerates recovery without added sugar or synthetic dyes.</p>',
    nutritionFacts: {
      servingSize: '6g',
      servingsPerPack: 30,
      calories: 5,
      protein: 0,
      carbohydrates: 1,
      sugars: 0,
      fat: 0,
      sodium: 500,
    },
    ingredients: 'Himalayan Pink Salt, Potassium Citrate, Magnesium Bisglycinate, Calcium Citrate, Organic Coconut Water Powder, Stevia Leaf.',
    allergens: 'Contains Coconut. Free from dairy, gluten, soy.',
    directions: 'Add 1 stick pack or scoop to 500ml water and sip before, during, or after physical activity.',
    isFeatured: false,
    status: 'active',
  },
  {
    _id: 'omastra-protein-crunch-bar',
    id: 'omastra-protein-crunch-bar',
    name: 'OMASTRA Protein Crunch Bar (Box of 12)',
    slug: 'omastra-protein-crunch-bar',
    category: { _id: 'cat-snacks', name: 'Protein Snacks', slug: 'protein-snacks' },
    image: '/products/protein-bar.png',
    images: [
      { url: '/products/protein-bar.png', alt: 'OMASTRA Protein Crunch Bar Box of 12', isPrimary: true },
    ],
    variants: [
      { sku: 'PB-CHOCPB-12PK', flavor: 'Dark Chocolate Peanut Butter', size: '12 x 60g', servings: 12, price: 1499, originalPrice: 1799, stock: 65 },
    ],
    price: 1499,
    originalPrice: 1799,
    stock: 65,
    averageRating: 4.8,
    reviewCount: 52,
    dietaryInfo: ['vegetarian'],
    tags: ['snacks', 'protein-bar', 'on-the-go', 'low-sugar'],
    shortDescription: '20g protein per bar, 3g net carbs, real roasted peanut butter, and zero maltitol.',
    description: '<p>A crispy triple-layered protein bar coated in rich dark chocolate. High in prebiotic fiber with only 1.5g sugar. Guilt-free macro-friendly snacking on the go.</p>',
    nutritionFacts: {
      servingSize: '60g (1 Bar)',
      servingsPerPack: 12,
      calories: 210,
      protein: 20,
      carbohydrates: 15,
      sugars: 1.5,
      fat: 8,
      sodium: 140,
    },
    ingredients: 'Protein Blend (Whey Protein Isolate, Milk Protein Isolate), Roasted Peanuts, Soluble Corn Fiber, Cocoa Butter, Natural Dark Chocolate Coating, Stevia.',
    allergens: 'Contains Milk, Peanuts. May contain traces of tree nuts.',
    directions: 'Enjoy 1 bar as a post-training snack or anytime meal replacement.',
    isFeatured: false,
    status: 'active',
  },
  {
    _id: 'omastra-omega-3-triple-strength',
    id: 'omastra-omega-3-triple-strength',
    name: 'OMASTRA Triple Strength Omega-3',
    slug: 'omastra-omega-3-triple-strength',
    category: { _id: 'cat-wellness', name: 'Wellness', slug: 'wellness' },
    image: '/products/omega-3.png',
    images: [
      { url: '/products/omega-3.png', alt: 'OMASTRA Triple Strength Omega-3', isPrimary: true },
    ],
    variants: [
      { sku: 'O3-60CAPS', flavor: 'Lemon Coated Softgels', size: '60 Softgels', servings: 60, price: 999, originalPrice: 1299, stock: 120 },
    ],
    price: 999,
    originalPrice: 1299,
    stock: 120,
    averageRating: 4.9,
    reviewCount: 140,
    dietaryInfo: ['gluten-free', 'sugar-free'],
    tags: ['omega-3', 'joint-health', 'heart', 'recovery'],
    shortDescription: '1000mg total Omega-3 with 550mg EPA and 350mg DHA per softgel. Molecularly distilled with no fishy burps.',
    description: '<p>Sourced from wild pelagic small fish. Purified via molecular distillation to eliminate heavy metals and PCBs. Supports cardiovascular health, cognitive function, and joint mobility.</p>',
    nutritionFacts: {
      servingSize: '1 Softgel',
      servingsPerPack: 60,
      calories: 10,
      protein: 0,
      carbohydrates: 0,
      fat: 1.2,
      sodium: 0,
    },
    ingredients: 'Molecularly Distilled Fish Oil Concentrate, Bovine Gelatin, Glycerin, Purified Water, Natural Lemon Oil (anti-burp coating).',
    allergens: 'Contains Fish (Anchovy, Sardine).',
    directions: 'Take 1 to 2 softgels daily with a meal containing dietary fats.',
    isFeatured: false,
    status: 'active',
  },
];

// ── Search & Filter Helpers ──────────────────────────────────────────
export function filterMockProducts({
  search = '',
  category = '',
  minPrice = '',
  maxPrice = '',
  dietary = '',
  minRating = '',
  sort = 'featured',
} = {}) {
  let list = [...MOCK_PRODUCTS];

  if (category) {
    list = list.filter(
      (p) =>
        p.category?.slug === category ||
        p.category?._id === category ||
        p.category?.name?.toLowerCase() === category.toLowerCase()
    );
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (minPrice !== '') {
    list = list.filter((p) => p.price >= Number(minPrice));
  }

  if (maxPrice !== '') {
    list = list.filter((p) => p.price <= Number(maxPrice));
  }

  if (dietary) {
    const requested = dietary.split(',').filter(Boolean);
    list = list.filter((p) =>
      requested.every((d) => p.dietaryInfo?.includes(d))
    );
  }

  if (minRating !== '') {
    list = list.filter((p) => p.averageRating >= Number(minRating));
  }

  if (sort === 'price-low') {
    list.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    list.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    list.sort((a, b) => b.averageRating - a.averageRating);
  } else if (sort === 'newest') {
    list.reverse();
  }

  return list;
}

export function getMockProductBySlug(slug) {
  return MOCK_PRODUCTS.find((p) => p.slug === slug || p._id === slug || p.id === slug) || null;
}
