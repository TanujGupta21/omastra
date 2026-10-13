const { pool } = require('../models/pgAdapter');

const productImages = {
  'omastra-whey-pro-classic-blend': {
    url: '/products/whey-pro.png',
    alt: 'OMASTRA Whey Pro — Classic Blend',
  },
  'omastra-whey-isolate-90': {
    url: '/products/whey-isolate.png',
    alt: 'OMASTRA Whey Isolate 90',
  },
  'omastra-plantfuel-pea-brown-rice': {
    url: '/products/plant-fuel.png',
    alt: 'OMASTRA PlantFuel — Pea & Brown Rice',
  },
  'omastra-creatine-monohydrate': {
    url: '/products/creatine.png',
    alt: 'OMASTRA Creatine Monohydrate',
  },
  'omastra-nitropre-pre-workout-igniter': {
    url: '/products/nitropre.png',
    alt: 'OMASTRA NitroPre — Pre-Workout Igniter',
  },
  'omastra-hydrocharge-electrolytes': {
    url: '/products/hydrocharge.png',
    alt: 'OMASTRA HydroCharge Electrolytes',
  },
  'omastra-daily-omega-3-d3': {
    url: '/products/omega-3.png',
    alt: 'OMASTRA Daily Omega-3 + D3',
  },
  'omastra-crunchy-protein-bar': {
    url: '/products/protein-bar.png',
    alt: 'OMASTRA Crunchy Protein Bar',
  },
};

async function updateImages() {
  console.log('🔄 Updating product images in PostgreSQL...');
  try {
    for (const [slug, img] of Object.entries(productImages)) {
      const imagesJson = JSON.stringify([
        {
          url: img.url,
          alt: img.alt,
          isPrimary: true,
        },
      ]);
      const res = await pool.query(
        'UPDATE products SET images = $1 WHERE slug = $2 RETURNING id, name, slug',
        [imagesJson, slug]
      );
      if (res.rows.length > 0) {
        console.log(`✓ Updated [${res.rows[0].name}] -> ${img.url}`);
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
