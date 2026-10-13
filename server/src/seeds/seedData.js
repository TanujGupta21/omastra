/**
 * OMASTRA Seed Script
 * Run: node src/seeds/seedData.js
 * Creates: 1 admin, categories, 15+ fictional demo products
 * NOTE: All products, prices, and claims are fictional demonstration data.
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

const PLACEHOLDER_BASE = 'https://placehold.co/600x600/1B1F1B/C6FF3D?text=';

const makeImg = (label) => ({
  url: `${PLACEHOLDER_BASE}${encodeURIComponent(label)}`,
  alt: label,
  isPrimary: true,
});

const categories = [
  { name: 'Whey Protein', description: 'Fast-absorbing whey for muscle recovery and growth.', sortOrder: 1 },
  { name: 'Plant Protein', description: 'Clean, complete protein from plant sources.', sortOrder: 2 },
  { name: 'Creatine', description: 'Science-backed creatine for strength and power.', sortOrder: 3 },
  { name: 'Pre-Workout', description: 'Energy and focus to power your sessions.', sortOrder: 4 },
  { name: 'Electrolytes', description: 'Stay hydrated and perform at your best.', sortOrder: 5 },
  { name: 'Protein Snacks', description: 'Nutritious snacks to hit your protein goals.', sortOrder: 6 },
  { name: 'Wellness', description: 'Daily supplements for overall health.', sortOrder: 7 },
];

const seedProducts = (catMap) => [
  // ─── Whey Protein ───
  {
    name: 'OMASTRA Whey Pro — Classic Blend',
    shortDescription: 'A high-quality whey concentrate + isolate blend for everyday training.',
    description: `<p>OMASTRA Whey Pro is a thoughtfully formulated whey blend suitable for all fitness levels. Each serving delivers substantial protein to support muscle repair after training sessions.</p>
<p><strong>Demo Note:</strong> Exact nutrition values below are fictional placeholders. Replace with verified lab-tested data before launch.</p>`,
    category: catMap['Whey Protein'],
    images: [makeImg('Whey Pro')],
    variants: [
      { sku: 'WP-CHOC-1KG', flavor: 'Chocolate Fudge', size: '1 kg', servings: 33, price: 1799, originalPrice: 2199, stock: 120 },
      { sku: 'WP-VAN-1KG',  flavor: 'Vanilla Bean',   size: '1 kg', servings: 33, price: 1799, originalPrice: 2199, stock: 90 },
      { sku: 'WP-CHOC-2KG', flavor: 'Chocolate Fudge', size: '2 kg', servings: 66, price: 3299, originalPrice: 3999, stock: 60 },
    ],
    nutritionFacts: {
      servingSize: '30g', servingsPerPack: 33, calories: 120,
      protein: 24, carbohydrates: 3, sugars: 1.5, fat: 2, saturatedFat: 0.8, sodium: 150,
    },
    ingredients: '[PLACEHOLDER — to be filled with verified ingredient list]',
    allergens: 'Contains milk, soy. Manufactured in a facility that handles wheat and tree nuts.',
    directions: 'Mix 1 scoop (30g) with 200–250 ml water or milk. Consume within 30 minutes of training.',
    storage: 'Store in a cool, dry place. Keep lid tightly closed.',
    dietaryInfo: ['vegetarian'],
    tags: ['whey', 'protein', 'muscle'],
    isFeatured: true, isBestSeller: true, status: 'active',
  },
  {
    name: 'OMASTRA Whey Isolate 90',
    shortDescription: 'Ultra-filtered whey isolate with 90% protein purity.',
    description: '<p>OMASTRA Whey Isolate 90 is processed through cross-flow microfiltration to deliver a high protein-per-serving ratio with minimal fat and lactose.</p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Whey Protein'],
    images: [makeImg('Isolate 90')],
    variants: [
      { sku: 'WI90-CHOC-1KG', flavor: 'Dark Chocolate', size: '1 kg', servings: 30, price: 2499, originalPrice: 2999, stock: 75 },
      { sku: 'WI90-STRAW-1KG', flavor: 'Strawberry Cream', size: '1 kg', servings: 30, price: 2499, originalPrice: 2999, stock: 50 },
    ],
    nutritionFacts: { servingSize: '33g', servingsPerPack: 30, calories: 110, protein: 27, carbohydrates: 2, fat: 0.5 },
    ingredients: '[PLACEHOLDER]', allergens: 'Contains milk.',
    directions: 'Mix 1 scoop with 200 ml cold water.',
    dietaryInfo: ['vegetarian', 'low-fat'],
    tags: ['isolate', 'lean', 'protein'],
    isFeatured: true, status: 'active',
  },
  // ─── Plant Protein ───
  {
    name: 'OMASTRA PlantFuel — Pea & Brown Rice',
    shortDescription: 'A complete amino acid profile from pea and brown rice proteins.',
    description: '<p>PlantFuel combines pea protein isolate with brown rice protein to deliver a complementary amino acid profile without any animal-derived ingredients.</p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Plant Protein'],
    images: [makeImg('PlantFuel')],
    variants: [
      { sku: 'PF-CHOC-1KG', flavor: 'Cacao & Coconut', size: '1 kg', servings: 28, price: 2199, stock: 80 },
      { sku: 'PF-VAN-1KG', flavor: 'Vanilla Almond', size: '1 kg', servings: 28, price: 2199, stock: 65 },
    ],
    nutritionFacts: { servingSize: '36g', servingsPerPack: 28, calories: 130, protein: 22, carbohydrates: 6, fat: 3 },
    ingredients: '[PLACEHOLDER]', allergens: 'Free from dairy, gluten. Manufactured in a shared facility.',
    directions: 'Mix 1 scoop with 250–300 ml water, plant milk, or add to smoothies.',
    dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
    tags: ['vegan', 'plant', 'protein'],
    isFeatured: true, isBestSeller: true, status: 'active',
  },
  // ─── Creatine ───
  {
    name: 'OMASTRA Creatine Monohydrate',
    shortDescription: 'Pure micronised creatine monohydrate. No fillers, no flavouring.',
    description: '<p>Creatine monohydrate is one of the most researched supplements in sports nutrition. OMASTRA Creatine delivers a straightforward 5g dose per serving with no added sugar, colour, or flavouring.</p><p><em>Demo product — placeholder data. Do not interpret as a medical claim.</em></p>',
    category: catMap['Creatine'],
    images: [makeImg('Creatine')],
    variants: [
      { sku: 'CR-UNFL-300G', flavor: 'Unflavoured', size: '300 g', servings: 60, price: 699, originalPrice: 899, stock: 200 },
      { sku: 'CR-UNFL-500G', flavor: 'Unflavoured', size: '500 g', servings: 100, price: 1099, stock: 150 },
    ],
    nutritionFacts: { servingSize: '5g', servingsPerPack: 60, calories: 0, protein: 0, carbohydrates: 0, fat: 0,
      additional: [{ label: 'Creatine Monohydrate', value: '5 g' }] },
    ingredients: 'Creatine Monohydrate (Micronised). [PLACEHOLDER — confirm with lab]',
    allergens: 'Unflavoured. [PLACEHOLDER — verify manufacturing allergens]',
    directions: 'Take 1 scoop (5g) daily. Mix with water or add to your protein shake.',
    dietaryInfo: ['vegan', 'gluten-free'],
    tags: ['creatine', 'strength', 'power'],
    isFeatured: true, isBestSeller: true, status: 'active',
  },
  // ─── Pre-Workout ───
  {
    name: 'OMASTRA FireUp Pre-Workout',
    shortDescription: 'Energising pre-workout with caffeine, beta-alanine, and citrulline.',
    description: '<p>FireUp is formulated to support focus and stamina during training sessions. Each serving includes caffeine, citrulline malate, and beta-alanine at commonly researched doses.</p><p><strong>Not recommended for individuals sensitive to caffeine. Consult a healthcare professional before use.</strong></p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Pre-Workout'],
    images: [makeImg('FireUp')],
    variants: [
      { sku: 'FU-WATER-200G', flavor: 'Watermelon Rush', size: '200 g', servings: 20, price: 1299, originalPrice: 1599, stock: 100 },
      { sku: 'FU-BLUE-200G', flavor: 'Blue Razz', size: '200 g', servings: 20, price: 1299, originalPrice: 1599, stock: 80 },
    ],
    nutritionFacts: { servingSize: '10g', servingsPerPack: 20, calories: 10, protein: 0, carbohydrates: 2, fat: 0,
      additional: [
        { label: 'Caffeine', value: '150 mg' },
        { label: 'Citrulline Malate', value: '4000 mg' },
        { label: 'Beta-Alanine', value: '1600 mg' },
      ]},
    ingredients: '[PLACEHOLDER — to be provided by manufacturer]',
    allergens: '[PLACEHOLDER]', directions: 'Mix 1 scoop with 200 ml water 20–30 mins before training. Do not exceed 1 serving per day.',
    dietaryInfo: ['vegetarian'],
    tags: ['pre-workout', 'energy', 'focus'],
    isFeatured: true, status: 'active',
  },
  {
    name: 'OMASTRA SteadyFuel Stim-Free Pre',
    shortDescription: 'Caffeine-free pre-workout for evening sessions.',
    description: '<p>SteadyFuel delivers citrulline, beta-alanine, and electrolytes without stimulants, making it suitable for late-day training or those avoiding caffeine.</p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Pre-Workout'],
    images: [makeImg('SteadyFuel')],
    variants: [
      { sku: 'SF-PINE-200G', flavor: 'Pineapple Coconut', size: '200 g', servings: 20, price: 1199, stock: 60 },
    ],
    nutritionFacts: { servingSize: '10g', servingsPerPack: 20, calories: 8, protein: 0, carbohydrates: 2, fat: 0 },
    ingredients: '[PLACEHOLDER]', allergens: '[PLACEHOLDER]',
    directions: 'Mix 1 scoop with 200–250 ml cold water before training.',
    dietaryInfo: ['vegan', 'caffeine-free'],
    tags: ['pre-workout', 'stim-free'],
    status: 'active',
  },
  // ─── Electrolytes ───
  {
    name: 'OMASTRA HydraForce Electrolyte Mix',
    shortDescription: 'Balanced electrolyte formula for hydration and recovery.',
    description: '<p>HydraForce provides sodium, potassium, magnesium, and calcium to support hydration during and after exercise. No artificial sweeteners in the regular formulation.</p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Electrolytes'],
    images: [makeImg('HydraForce')],
    variants: [
      { sku: 'HF-LIME-250G', flavor: 'Lime & Mint', size: '250 g', servings: 50, price: 799, stock: 150 },
      { sku: 'HF-MANGO-250G', flavor: 'Raw Mango', size: '250 g', servings: 50, price: 799, stock: 130 },
      { sku: 'HF-LIME-SACH', flavor: 'Lime & Mint', size: 'Sachets (20s)', servings: 20, price: 399, stock: 200 },
    ],
    nutritionFacts: { servingSize: '5g', servingsPerPack: 50, calories: 10, protein: 0, carbohydrates: 2, sodium: 300,
      additional: [
        { label: 'Potassium', value: '200 mg' },
        { label: 'Magnesium', value: '40 mg' },
      ]},
    ingredients: '[PLACEHOLDER]', allergens: 'No common allergens. [PLACEHOLDER — confirm]',
    directions: 'Dissolve 1 scoop (5g) in 500 ml water.',
    dietaryInfo: ['vegan', 'gluten-free'],
    tags: ['hydration', 'electrolytes', 'recovery'],
    isFeatured: true, isBestSeller: true, status: 'active',
  },
  // ─── Protein Snacks ───
  {
    name: 'OMASTRA Protein Bar — Choco Almond',
    shortDescription: 'A chewy protein bar with real almonds and dark chocolate coating.',
    description: '<p>OMASTRA Protein Bars are a convenient way to meet your protein goals on the go. Each bar delivers around 20g of protein.</p><p><em>Demo product — placeholder values. Exact nutritional data must be confirmed by a certified food lab before retail.</em></p>',
    category: catMap['Protein Snacks'],
    images: [makeImg('Protein Bar')],
    variants: [
      { sku: 'PB-CHOALM-1', flavor: 'Choco Almond', size: 'Single (60g)', servings: 1, price: 99, originalPrice: 129, stock: 500 },
      { sku: 'PB-CHOALM-12', flavor: 'Choco Almond', size: 'Box of 12', servings: 12, price: 999, originalPrice: 1299, stock: 100 },
    ],
    nutritionFacts: { servingSize: '60g', servingsPerPack: 1, calories: 220, protein: 20, carbohydrates: 22, sugars: 8, fat: 7 },
    ingredients: '[PLACEHOLDER — to be confirmed by food safety authority before launch]',
    allergens: 'Contains milk, soy, almonds, wheat.',
    directions: 'Ready to eat.',
    dietaryInfo: ['vegetarian', 'high-protein'],
    tags: ['snack', 'bar', 'protein'],
    isBestSeller: true, status: 'active',
  },
  {
    name: 'OMASTRA Roasted Chana — Masala',
    shortDescription: 'High-protein roasted chickpeas, seasoned with chaat masala.',
    description: '<p>A traditional Indian snack reimagined as a high-protein, low-fat option. No added preservatives.</p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Protein Snacks'],
    images: [makeImg('Roasted Chana')],
    variants: [
      { sku: 'RC-MASALA-100G', flavor: 'Chaat Masala', size: '100 g', price: 149, stock: 300 },
      { sku: 'RC-MASALA-250G', flavor: 'Chaat Masala', size: '250 g', price: 299, originalPrice: 349, stock: 200 },
    ],
    nutritionFacts: { servingSize: '30g', servingsPerPack: 3, calories: 110, protein: 8, carbohydrates: 15, fat: 3 },
    ingredients: '[PLACEHOLDER]', allergens: 'Contains chickpeas. [PLACEHOLDER]',
    directions: 'Ready to eat.',
    dietaryInfo: ['vegan', 'gluten-free', 'high-protein'],
    tags: ['snack', 'chickpea', 'indian'],
    status: 'active',
  },
  // ─── Wellness ───
  {
    name: 'OMASTRA Daily Omega 3',
    shortDescription: 'High-potency fish oil capsules for heart, brain, and joint health.',
    description: '<p>OMASTRA Daily Omega 3 provides EPA and DHA from deep-sea fish oil. These are essential fatty acids that the body cannot synthesise on its own.</p><p><strong>Not a medicine. Consult a healthcare professional before use if you have a medical condition.</strong></p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Wellness'],
    images: [makeImg('Omega 3')],
    variants: [
      { sku: 'OM3-60CAP', size: '60 Capsules', price: 699, originalPrice: 899, stock: 200 },
      { sku: 'OM3-120CAP', size: '120 Capsules', price: 1199, originalPrice: 1499, stock: 150 },
    ],
    nutritionFacts: { servingSize: '2 capsules', servingsPerPack: 30,
      additional: [
        { label: 'Fish Oil', value: '2000 mg' },
        { label: 'EPA', value: '600 mg [PLACEHOLDER]' },
        { label: 'DHA', value: '400 mg [PLACEHOLDER]' },
      ]},
    ingredients: 'Fish Oil Concentrate, Gelatin (capsule shell), Glycerin, Water.',
    allergens: 'Contains fish. Not suitable for vegetarians/vegans.',
    directions: 'Take 2 capsules daily with meals.',
    dietaryInfo: ['gluten-free'],
    tags: ['omega', 'fish-oil', 'wellness'],
    isFeatured: true, status: 'active',
  },
  {
    name: 'OMASTRA Multivitamin — Men\'s Formula',
    shortDescription: 'A comprehensive daily multivitamin designed for active men.',
    description: '<p>OMASTRA Multivitamin covers common micronutrient gaps for active individuals. Formulated with 20+ vitamins and minerals.</p><p><strong>Not a substitute for a balanced diet. Consult a healthcare professional if needed.</strong></p><p><em>Demo product.</em></p>',
    category: catMap['Wellness'],
    images: [makeImg('Multivitamin')],
    variants: [
      { sku: 'MV-MEN-30TAB', size: '30 Tablets', price: 549, stock: 180 },
      { sku: 'MV-MEN-60TAB', size: '60 Tablets', price: 949, originalPrice: 1099, stock: 140 },
    ],
    nutritionFacts: { servingSize: '1 tablet', servingsPerPack: 30,
      additional: [{ label: 'Vitamin C', value: '80 mg [PLACEHOLDER]' }, { label: 'Zinc', value: '10 mg [PLACEHOLDER]' }] },
    ingredients: '[PLACEHOLDER — to be confirmed]',
    allergens: '[PLACEHOLDER]',
    directions: 'Take 1 tablet daily with a meal.',
    dietaryInfo: ['vegetarian'],
    tags: ['vitamins', 'wellness', 'immunity'],
    status: 'active',
  },
  {
    name: 'OMASTRA Ashwagandha KSM-66',
    shortDescription: 'Standardised KSM-66 ashwagandha root extract for stress and recovery.',
    description: '<p>KSM-66 is a widely studied ashwagandha extract standardised to withanolide content. OMASTRA uses this premium ingredient to support stress adaptation and recovery.</p><p><strong>Not a medicine. Traditional use only. Consult a healthcare professional before use.</strong></p><p><em>Demo product.</em></p>',
    category: catMap['Wellness'],
    images: [makeImg('Ashwagandha')],
    variants: [
      { sku: 'ASH-60CAP', size: '60 Capsules', price: 799, originalPrice: 999, stock: 160 },
    ],
    nutritionFacts: { servingSize: '1 capsule', servingsPerPack: 60,
      additional: [{ label: 'Ashwagandha Extract (KSM-66)', value: '300 mg [PLACEHOLDER]' }] },
    ingredients: 'Ashwagandha Root Extract (KSM-66), Vegetable Cellulose (capsule).',
    allergens: 'Free from common allergens. [PLACEHOLDER — confirm]',
    directions: 'Take 1 capsule twice daily with meals or as directed.',
    dietaryInfo: ['vegan', 'gluten-free'],
    tags: ['ashwagandha', 'adaptogen', 'wellness'],
    isFeatured: true, status: 'active',
  },
  {
    name: 'OMASTRA Vitamin D3 + K2',
    shortDescription: 'Optimal bone and immune support with D3 and K2 synergy.',
    description: '<p>Vitamin D3 and K2 work together to support calcium absorption and direct it to bones. Particularly important for individuals in regions with limited sun exposure.</p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Wellness'],
    images: [makeImg('D3+K2')],
    variants: [
      { sku: 'D3K2-60CAP', size: '60 Capsules', price: 499, stock: 220 },
    ],
    nutritionFacts: { servingSize: '1 capsule', servingsPerPack: 60,
      additional: [{ label: 'Vitamin D3', value: '2000 IU [PLACEHOLDER]' }, { label: 'Vitamin K2 (MK-7)', value: '75 mcg [PLACEHOLDER]' }] },
    ingredients: '[PLACEHOLDER]', allergens: '[PLACEHOLDER]',
    directions: 'Take 1 capsule daily with a fat-containing meal.',
    dietaryInfo: ['vegetarian'],
    tags: ['vitamin-d', 'bone', 'immunity'],
    status: 'active',
  },
  {
    name: 'OMASTRA Magnesium Glycinate',
    shortDescription: 'Highly bioavailable magnesium for sleep, muscle, and nerve function.',
    description: '<p>Magnesium glycinate is a chelated form with better absorption than oxide forms. Supports muscle relaxation and sleep quality.</p><p><em>Demo product — placeholder data.</em></p>',
    category: catMap['Wellness'],
    images: [makeImg('Magnesium')],
    variants: [
      { sku: 'MAG-60CAP', size: '60 Capsules', price: 649, stock: 190 },
    ],
    nutritionFacts: { servingSize: '2 capsules', servingsPerPack: 30,
      additional: [{ label: 'Elemental Magnesium', value: '200 mg [PLACEHOLDER]' }] },
    ingredients: '[PLACEHOLDER]', allergens: '[PLACEHOLDER]',
    directions: 'Take 2 capsules before bed.',
    dietaryInfo: ['vegan', 'gluten-free'],
    tags: ['magnesium', 'sleep', 'recovery'],
    status: 'active',
  },
];

const coupons = [
  {
    code: 'WELCOME10',
    type: 'percent',
    value: 10,
    minSpend: 500,
    maxDiscount: 300,
    description: '10% off your first order (up to ₹300)',
    isActive: true,
  },
  {
    code: 'FLAT100',
    type: 'flat',
    value: 100,
    minSpend: 999,
    description: '₹100 flat off on orders above ₹999',
    isActive: true,
  },
];

async function seed() {
  console.log('🌱 Starting OMASTRA seed...');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'OMASTRA Admin',
      email: process.env.ADMIN_EMAIL || 'admin@omastra.in',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin',
    });
    console.log(`👤 Admin created: ${admin.email}`);

    // Create categories
    const createdCats = await Category.insertMany(
      categories.map((c) => ({
        ...c,
        slug: slugify(c.name, { lower: true, strict: true }),
      }))
    );
    const catMap = {};
    createdCats.forEach((c) => { catMap[c.name] = c._id; });
    console.log(`📂 ${createdCats.length} categories created`);

    // Create products
    const productData = seedProducts(catMap).map((p) => ({
      ...p,
      slug: slugify(p.name, { lower: true, strict: true }),
    }));
    const createdProducts = await Product.insertMany(productData);
    console.log(`📦 ${createdProducts.length} products created`);

    // Create coupons
    await Coupon.insertMany(coupons);
    console.log(`🏷️  ${coupons.length} coupons created`);

    console.log('\n✅ Seed complete!');
    console.log(`   Admin email: ${admin.email}`);
    console.log(`   Admin password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
    console.log('   ⚠️  Change admin credentials before going to production!\n');
  } catch (err) {
    console.error('❌ Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
