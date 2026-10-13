const bcrypt = require('bcryptjs');
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');
const {
  pool,
  User,
  Category,
  Product,
  Coupon,
} = require('../models/pgAdapter');

const makeImg = (filename, alt) => ({
  url: filename.startsWith('/') ? filename : `/products/${filename}`,
  alt: alt || 'OMASTRA Product',
  isPrimary: true,
});

const CATEGORIES = [
  { name: 'Whey Protein', description: 'Fast-absorbing whey for muscle recovery and growth.', sortOrder: 1 },
  { name: 'Plant Protein', description: 'Clean, complete protein from plant sources.', sortOrder: 2 },
  { name: 'Creatine', description: 'Science-backed creatine for strength and power.', sortOrder: 3 },
  { name: 'Pre-Workout', description: 'Energy and focus to power your sessions.', sortOrder: 4 },
  { name: 'Electrolytes', description: 'Stay hydrated and perform at your best.', sortOrder: 5 },
  { name: 'Protein Snacks', description: 'Nutritious snacks to hit your protein goals.', sortOrder: 6 },
  { name: 'Wellness', description: 'Daily supplements for overall health.', sortOrder: 7 },
];

async function seed() {
  console.log('🌱 Seeding PostgreSQL database "omastra"...');

  try {
    // 1. Clean existing tables
    await pool.query('TRUNCATE TABLE reviews, inventory_logs, orders, wishlists, carts, products, categories, coupons, users CASCADE');
    console.log('✓ Cleared existing records');

    // 2. Admin User
    const adminPasswordHash = await bcrypt.hash('Admin@123456', 12);
    const admin = await User.create({
      id: uuidv4(),
      name: 'OMASTRA Admin',
      email: 'admin@omastra.in',
      password: adminPasswordHash,
      role: 'admin',
      isActive: true,
      addresses: [
        {
          label: 'HQ',
          fullName: 'OMASTRA Admin',
          phone: '+91 98765 43210',
          line1: '123 Health Ave',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
          isDefault: true,
        },
      ],
    });
    console.log(`✓ Admin user created: ${admin.email}`);

    // Demo Customer
    const customerPasswordHash = await bcrypt.hash('Customer@123', 12);
    const customer = await User.create({
      id: uuidv4(),
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      password: customerPasswordHash,
      role: 'customer',
      isActive: true,
      phone: '+91 98765 00000',
      addresses: [
        {
          label: 'Home',
          fullName: 'Rahul Sharma',
          phone: '+91 98765 00000',
          line1: '45 Green Park, Road 2',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001',
          isDefault: true,
        },
      ],
    });
    console.log(`✓ Customer user created: ${customer.email}`);

    // 3. Categories
    const catMap = {};
    for (const cat of CATEGORIES) {
      const slug = slugify(cat.name, { lower: true, strict: true });
      const created = await Category.create({
        id: uuidv4(),
        name: cat.name,
        slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      });
      catMap[cat.name] = created.id;
    }
    console.log(`✓ ${CATEGORIES.length} categories created`);

    // 4. Products
    const productsData = [
      {
        name: 'OMASTRA Whey Pro — Classic Blend',
        slug: 'omastra-whey-pro-classic-blend',
        category: catMap['Whey Protein'],
        shortDescription: 'A high-quality whey concentrate + isolate blend for everyday training.',
        description: '<p>OMASTRA Whey Pro is formulated for high digestibility and muscle recovery.</p>',
        images: [makeImg('whey-pro.jpg', 'OMASTRA Whey Pro — Classic Blend')],
        variants: [
          { sku: 'WP-CHOC-1KG', flavor: 'Chocolate Fudge', size: '1 kg', servings: 33, price: 1799, originalPrice: 2199, stock: 120, isActive: true },
          { sku: 'WP-VAN-1KG', flavor: 'Vanilla Bean', size: '1 kg', servings: 33, price: 1799, originalPrice: 2199, stock: 90, isActive: true },
          { sku: 'WP-CHOC-2KG', flavor: 'Chocolate Fudge', size: '2 kg', servings: 66, price: 3299, originalPrice: 3999, stock: 60, isActive: true },
        ],
        nutritionFacts: { servingSize: '30g', servingsPerPack: 33, calories: 120, protein: 24, carbohydrates: 3, fat: 2 },
        ingredients: 'Whey Protein Concentrate, Whey Protein Isolate, Cocoa, Natural Flavours',
        dietaryInfo: ['vegetarian'],
        tags: ['whey', 'protein', 'muscle'],
        isFeatured: true,
        isBestSeller: true,
        status: 'active',
        averageRating: 4.8,
        reviewCount: 142,
      },
      {
        name: 'OMASTRA Whey Isolate 90',
        slug: 'omastra-whey-isolate-90',
        category: catMap['Whey Protein'],
        shortDescription: 'Ultra-filtered whey isolate with 90% protein purity.',
        description: '<p>Cross-flow microfiltration delivers pure protein with virtually zero lactose.</p>',
        images: [makeImg('whey-isolate.jpg', 'OMASTRA Whey Isolate 90')],
        variants: [
          { sku: 'WI90-CHOC-1KG', flavor: 'Dark Chocolate', size: '1 kg', servings: 30, price: 2499, originalPrice: 2999, stock: 75, isActive: true },
          { sku: 'WI90-STRAW-1KG', flavor: 'Strawberry Cream', size: '1 kg', servings: 30, price: 2499, originalPrice: 2999, stock: 50, isActive: true },
        ],
        nutritionFacts: { servingSize: '33g', servingsPerPack: 30, calories: 110, protein: 27, carbohydrates: 2, fat: 0.5 },
        dietaryInfo: ['vegetarian', 'low-fat'],
        tags: ['isolate', 'lean', 'protein'],
        isFeatured: true,
        isBestSeller: false,
        status: 'active',
        averageRating: 4.9,
        reviewCount: 88,
      },
      {
        name: 'OMASTRA PlantFuel — Pea & Brown Rice',
        slug: 'omastra-plantfuel-pea-brown-rice',
        category: catMap['Plant Protein'],
        shortDescription: 'A complete amino acid profile from pea and brown rice proteins.',
        description: '<p>100% plant-based clean protein with digestive enzymes.</p>',
        images: [makeImg('plant-fuel.jpg', 'OMASTRA PlantFuel — Pea & Brown Rice')],
        variants: [
          { sku: 'PF-CHOC-1KG', flavor: 'Cacao & Coconut', size: '1 kg', servings: 28, price: 2199, stock: 80, isActive: true },
          { sku: 'PF-VAN-1KG', flavor: 'Vanilla Almond', size: '1 kg', servings: 28, price: 2199, stock: 65, isActive: true },
        ],
        nutritionFacts: { servingSize: '36g', servingsPerPack: 28, calories: 130, protein: 22, carbohydrates: 6, fat: 3 },
        dietaryInfo: ['vegan', 'gluten-free', 'dairy-free'],
        tags: ['vegan', 'plant', 'protein'],
        isFeatured: true,
        isBestSeller: true,
        status: 'active',
        averageRating: 4.7,
        reviewCount: 96,
      },
      {
        name: 'OMASTRA Creatine Monohydrate',
        slug: 'omastra-creatine-monohydrate',
        category: catMap['Creatine'],
        shortDescription: 'Pure micronised creatine monohydrate. 5g per serving. No fillers.',
        description: '<p>The most researched supplement in sports science for strength and power.</p>',
        images: [makeImg('creatine.jpg', 'OMASTRA Creatine Monohydrate')],
        variants: [
          { sku: 'CR-UNFL-250G', flavor: 'Unflavoured', size: '250g', servings: 50, price: 699, originalPrice: 899, stock: 200, isActive: true },
          { sku: 'CR-UNFL-500G', flavor: 'Unflavoured', size: '500g', servings: 100, price: 1299, originalPrice: 1599, stock: 150, isActive: true },
        ],
        nutritionFacts: { servingSize: '5g', servingsPerPack: 50, calories: 0, protein: 0 },
        dietaryInfo: ['vegan', 'gluten-free'],
        tags: ['creatine', 'strength', 'power'],
        isFeatured: true,
        isBestSeller: true,
        status: 'active',
        averageRating: 4.9,
        reviewCount: 310,
      },
      {
        name: 'OMASTRA NitroPre — Pre-Workout Igniter',
        slug: 'omastra-nitropre-pre-workout-igniter',
        category: catMap['Pre-Workout'],
        shortDescription: 'Clean energy, laser focus, and optimal muscle pump without the crash.',
        description: '<p>With L-Citrulline, Beta-Alanine, and natural caffeine.</p>',
        images: [makeImg('nitropre.jpg', 'OMASTRA NitroPre — Pre-Workout Igniter')],
        variants: [
          { sku: 'PRE-FRUIT-300G', flavor: 'Fruit Punch', size: '300g', servings: 30, price: 1499, originalPrice: 1899, stock: 110, isActive: true },
          { sku: 'PRE-BLUE-300G', flavor: 'Blue Razz', size: '300g', servings: 30, price: 1499, originalPrice: 1899, stock: 95, isActive: true },
        ],
        dietaryInfo: ['vegetarian'],
        tags: ['preworkout', 'energy', 'focus'],
        isFeatured: true,
        status: 'active',
        averageRating: 4.8,
        reviewCount: 165,
      },
      {
        name: 'OMASTRA HydroCharge Electrolytes',
        slug: 'omastra-hydrocharge-electrolytes',
        category: catMap['Electrolytes'],
        shortDescription: 'Rapid cellular hydration with 5 key minerals and coconut water powder.',
        description: '<p>Prevent cramps, maintain peak stamina, and rehydrate faster.</p>',
        images: [makeImg('hydrocharge.jpg', 'OMASTRA HydroCharge Electrolytes')],
        variants: [
          { sku: 'ELEC-LEMON-200G', flavor: 'Lemon Lime', size: '200g', servings: 40, price: 599, originalPrice: 799, stock: 180, isActive: true },
          { sku: 'ELEC-ORANGE-200G', flavor: 'Tangy Orange', size: '200g', servings: 40, price: 599, originalPrice: 799, stock: 140, isActive: true },
        ],
        dietaryInfo: ['vegan', 'sugar-free'],
        tags: ['hydration', 'electrolytes', 'endurance'],
        isFeatured: true,
        status: 'active',
        averageRating: 4.7,
        reviewCount: 74,
      },
      {
        name: 'OMASTRA Daily Omega-3 + D3',
        slug: 'omastra-daily-omega-3-d3',
        category: catMap['Wellness'],
        shortDescription: 'High-EPA and DHA triple strength fish oil plus Vitamin D3.',
        description: '<p>Supports heart, joint mobility, brain function, and immune health.</p>',
        images: [makeImg('omega-3.jpg', 'OMASTRA Daily Omega-3 + D3')],
        variants: [
          { sku: 'OM3-60CAPS', flavor: 'Natural Lemon', size: '60 Softgels', servings: 60, price: 899, originalPrice: 1199, stock: 220, isActive: true },
        ],
        dietaryInfo: ['gluten-free'],
        tags: ['wellness', 'omega3', 'heart'],
        isFeatured: true,
        status: 'active',
        averageRating: 4.9,
        reviewCount: 205,
      },
      {
        name: 'OMASTRA Crunchy Protein Bar',
        slug: 'omastra-crunchy-protein-bar',
        category: catMap['Protein Snacks'],
        shortDescription: '20g protein, zero added sugar, delicious layered crunch.',
        description: '<p>The ultimate on-the-go protein fix for work, travel, or post-workout snacking.</p>',
        images: [makeImg('protein-bar.jpg', 'OMASTRA Crunchy Protein Bar')],
        variants: [
          { sku: 'BAR-CHOC-BOX6', flavor: 'Fudge Brownie', size: 'Box of 6', servings: 6, price: 699, originalPrice: 899, stock: 150, isActive: true },
          { sku: 'BAR-PEANUT-BOX6', flavor: 'Peanut Butter Crunch', size: 'Box of 6', servings: 6, price: 699, originalPrice: 899, stock: 130, isActive: true },
        ],
        dietaryInfo: ['vegetarian'],
        tags: ['snack', 'bar', 'protein'],
        isFeatured: true,
        status: 'active',
        averageRating: 4.6,
        reviewCount: 112,
      },
    ];

    for (const p of productsData) {
      await Product.create({
        id: uuidv4(),
        ...p,
      });
    }
    console.log(`✓ ${productsData.length} products seeded`);

    // 5. Coupons
    const coupons = [
      { code: 'OMASTRA10', type: 'percent', value: 10, minSpend: 999, maxDiscount: 500, description: '10% off on orders above ₹999' },
      { code: 'POWER20', type: 'percent', value: 20, minSpend: 2499, maxDiscount: 1000, description: '20% off on orders above ₹2,499' },
      { code: 'FLAT200', type: 'flat', value: 200, minSpend: 1499, description: 'Flat ₹200 off on orders above ₹1,499' },
    ];
    for (const c of coupons) {
      await Coupon.create({
        id: uuidv4(),
        ...c,
        isActive: true,
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });
    }
    console.log(`✓ ${coupons.length} coupons seeded`);

    console.log('\n🎉 PostgreSQL database seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
