const { pool } = require('../models/pgAdapter');

const productImages = {
  'omastra-whey-pro-classic-blend': [
    { url: '/products/whey-pro.png', alt: 'OMASTRA Whey Pro Classic Blend - Front View', label: 'Front', isPrimary: true },
    { url: '/products/whey-pro-angled.jpg', alt: 'OMASTRA Whey Pro - Angled 3/4 View', label: 'Angle' },
    { url: '/products/whey-pro-infographic.jpg', alt: 'OMASTRA Whey Pro - Nutrition & Benefits', label: 'Benefits' },
    { url: '/products/whey-pro-back.jpg', alt: 'OMASTRA Whey Pro - Supplement Facts Back Panel', label: 'Back' },
    { url: '/products/whey-pro-lifestyle.jpg', alt: 'OMASTRA Whey Pro - In-Action Lifestyle', label: 'Lifestyle' },
  ],
  'omastra-whey-isolate-90': [
    { url: '/products/whey-isolate.png', alt: 'OMASTRA Whey Isolate 90 - Front View', label: 'Front', isPrimary: true },
    { url: '/products/whey-isolate-angled.jpg', alt: 'OMASTRA Whey Isolate 90 - CFM Purity Specs', label: 'Specs' },
    { url: '/products/whey-isolate-infographic.jpg', alt: 'OMASTRA Whey Isolate 90 - Nutrition & Benefits', label: 'Benefits' },
    { url: '/products/whey-isolate-back.jpg', alt: 'OMASTRA Whey Isolate 90 - Supplement Facts Back Panel', label: 'Back' },
    { url: '/products/whey-isolate-lifestyle.jpg', alt: 'OMASTRA Whey Isolate 90 - In-Action Lifestyle', label: 'Lifestyle' },
  ],
  'omastra-plantfuel-pea-brown-rice': [
    { url: '/products/plant-fuel.png', alt: 'OMASTRA PlantFuel Vegan Protein - Front View', label: 'Front', isPrimary: true },
    { url: '/products/plant-fuel-aminos.jpg', alt: 'OMASTRA PlantFuel - Amino Acid Spectrum', label: 'Aminos' },
    { url: '/products/plant-fuel-infographic.jpg', alt: 'OMASTRA PlantFuel - Nutrition & Benefits', label: 'Benefits' },
    { url: '/products/plant-fuel-back.jpg', alt: 'OMASTRA PlantFuel - Nutrition Facts Back Panel', label: 'Back' },
    { url: '/products/plant-fuel-lifestyle.jpg', alt: 'OMASTRA PlantFuel - Daily Smoothie Lifestyle', label: 'Lifestyle' },
  ],
  'omastra-creatine-monohydrate': [
    { url: '/products/creatine.png', alt: 'OMASTRA Creatine Monohydrate - Front View', label: 'Front', isPrimary: true },
    { url: '/products/creatine-usage.jpg', alt: 'OMASTRA Creatine - Dosing Protocol & Micro-Mesh', label: 'Protocol' },
    { url: '/products/creatine-infographic.jpg', alt: 'OMASTRA Creatine - Nutrition & Power Benefits', label: 'Benefits' },
    { url: '/products/creatine-back.jpg', alt: 'OMASTRA Creatine - Supplement Facts Back Panel', label: 'Back' },
    { url: '/products/creatine-lifestyle.jpg', alt: 'OMASTRA Creatine - Dumbbell & Shaker Lifestyle', label: 'Lifestyle' },
  ],
  'omastra-nitropre-pre-workout-igniter': [
    { url: '/products/nitropre.png', alt: 'OMASTRA NitroPre Pre-Workout - Front View', label: 'Front', isPrimary: true },
    { url: '/products/nitropre-timing.jpg', alt: 'OMASTRA NitroPre - Performance Timing & Kinetics', label: 'Timing' },
    { url: '/products/nitropre-infographic.jpg', alt: 'OMASTRA NitroPre - Energy & Pump Matrix', label: 'Benefits' },
    { url: '/products/nitropre-back.jpg', alt: 'OMASTRA NitroPre - Supplement Facts Back Panel', label: 'Back' },
    { url: '/products/nitropre-lifestyle.jpg', alt: 'OMASTRA NitroPre - Locker Room Lifestyle', label: 'Lifestyle' },
  ],
  'omastra-hydrocharge-electrolytes': [
    { url: '/products/hydrocharge.png', alt: 'OMASTRA HydroCharge Electrolyte - Front View', label: 'Front', isPrimary: true },
    { url: '/products/hydrocharge-hydration.jpg', alt: 'OMASTRA HydroCharge - Osmotic Hydration Science', label: 'Hydration' },
    { url: '/products/hydrocharge-infographic.jpg', alt: 'OMASTRA HydroCharge - 6-Electrolyte Balance', label: 'Benefits' },
    { url: '/products/hydrocharge-back.jpg', alt: 'OMASTRA HydroCharge - Supplement Facts Back Panel', label: 'Back' },
    { url: '/products/hydrocharge-lifestyle.jpg', alt: 'OMASTRA HydroCharge - Ice & Citrus Lifestyle', label: 'Lifestyle' },
  ],
  'omastra-daily-omega-3-d3': [
    { url: '/products/omega-3.png', alt: 'OMASTRA Triple Strength Omega-3 - Front View', label: 'Front', isPrimary: true },
    { url: '/products/omega-3-purity.jpg', alt: 'OMASTRA Triple Strength Omega-3 - Molecular Purity Standard', label: 'Purity' },
    { url: '/products/omega-3-infographic.jpg', alt: 'OMASTRA Triple Strength Omega-3 - 550 EPA / 350 DHA High Potency', label: 'Benefits' },
    { url: '/products/omega-3-back.jpg', alt: 'OMASTRA Triple Strength Omega-3 - Supplement Facts Back Panel', label: 'Back' },
    { url: '/products/omega-3-lifestyle.jpg', alt: 'OMASTRA Triple Strength Omega-3 - Golden Softgels Lifestyle', label: 'Lifestyle' },
  ],
  'omastra-crunchy-protein-bar': [
    { url: '/products/protein-bar.png', alt: 'OMASTRA Protein Crunch Bar - Front View', label: 'Front', isPrimary: true },
    { url: '/products/protein-bar-texture.jpg', alt: 'OMASTRA Protein Crunch Bar - Triple Layer Architecture', label: 'Layers' },
    { url: '/products/protein-bar-infographic.jpg', alt: 'OMASTRA Protein Crunch Bar - Nutrition & Macros', label: 'Benefits' },
    { url: '/products/protein-bar-back.jpg', alt: 'OMASTRA Protein Crunch Bar - Nutritional Facts Back Panel', label: 'Back' },
    { url: '/products/protein-bar-lifestyle.jpg', alt: 'OMASTRA Protein Crunch Bar - On-The-Go Lifestyle', label: 'Lifestyle' },
  ],
};

async function updateImages() {
  console.log('🔄 Updating product images in PostgreSQL with full 5-image galleries...');
  try {
    for (const [slug, imagesList] of Object.entries(productImages)) {
      const imagesJson = JSON.stringify(imagesList);
      const res = await pool.query(
        'UPDATE products SET images = $1 WHERE slug = $2 RETURNING id, name, slug',
        [imagesJson, slug]
      );
      if (res.rows.length > 0) {
        console.log(`✓ Updated [${res.rows[0].name}] with ${imagesList.length} gallery images`);
      } else {
        console.warn(`⚠️ Product not found with slug: ${slug}`);
      }
    }
    console.log('🎉 All product images updated successfully!');
  } catch (err) {
    console.error('❌ Failed to update product images:', err);
  } finally {
    await pool.end();
  }
}

updateImages();
