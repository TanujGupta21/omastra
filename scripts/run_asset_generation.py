import os
import shutil
from generate_catalog_assets import (
    create_product_infographic,
    create_back_panel,
    create_lifestyle_composite,
    PRODUCTS_DIR
)

ARTIFACTS_DIR = r"C:\Users\91976\.gemini\antigravity-ide\brain\f61c5f72-d665-45ec-8bde-9758dd4a6337"

print("--- 1. Generating OMASTRA Plant Fuel Assets ---")
create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "plant-fuel.png"),
    title="OMASTRA PLANT FUEL — NUTRITION & AMINOS",
    subtitle="100% ORGANIC YELLOW PEA & SPROUTED BROWN RICE COMPLETE PROTEIN",
    callouts=[
        {"x": 80, "y": 280, "title": "22G COMPLETE PROTEIN", "sub": "Clinical high-yield vegan protein isolate", "align": "left", "line_to": (460, 360)},
        {"x": 1120, "y": 280, "title": "4.2G NATURAL BCAAs", "sub": "Optimal 2:1:1 recovery ratio", "align": "right", "line_to": (740, 360)},
        {"x": 80, "y": 500, "title": "MCT COCONUT OIL", "sub": "Smooth, non-chalky creamy texture", "align": "left", "line_to": (430, 540)},
        {"x": 1120, "y": 500, "title": "DIGESTIVE ENZYMES", "sub": "Enhanced gut bioavailability & zero bloat", "align": "right", "line_to": (770, 540)},
        {"x": 80, "y": 720, "title": "ZERO ADDED SUGARS", "sub": "Naturally sweetened with Stevia leaf", "align": "left", "line_to": (450, 750)},
        {"x": 1120, "y": 720, "title": "100% VEGAN & NON-GMO", "sub": "Dairy-free, gluten-free, soy-free", "align": "right", "line_to": (750, 750)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "plant-fuel-infographic.jpg")
)

create_back_panel(
    title="PLANT FUEL — VANILLA BEAN BLEND",
    subtitle="ORGANIC PEA & SPROUTED BROWN RICE PROTEIN POWDER",
    serving_info="Serving Size: 1 Scoop (36g) | Servings Per Container: 28",
    facts_rows=[
        ("Calories", "130", "*"),
        ("Total Fat", "2.5g", "3%"),
        ("  Saturated Fat", "1.0g", "5%"),
        ("  MCT Medium Chain Triglycerides", "1.5g", "**"),
        ("Total Carbohydrates", "4g", "1%"),
        ("  Dietary Fiber", "2g", "7%"),
        ("  Total Sugars", "0.5g", "*"),
        ("Protein (Vegan Isolate)", "22g", "44%"),
        ("Sodium", "180mg", "8%"),
        ("Potassium", "140mg", "3%"),
        ("Iron", "4.5mg", "25%"),
        ("DigeZyme® Plant Enzyme Complex", "100mg", "**"),
    ],
    ingredients_text="Organic Canadian Yellow Pea Protein Isolate, Sprouted Brown Rice Protein, Coconut MCT Oil Powder, Natural Vanilla Bean Flavor, DigeZyme® Plant Enzyme Blend, Stevia Leaf Extract.",
    allergen_text="None. 100% Vegan, Dairy-Free, Gluten-Free, Soy-Free, Nut-Free.",
    output_path=os.path.join(PRODUCTS_DIR, "plant-fuel-back.jpg")
)

create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "plant-fuel.png"),
    title="COMPLETE AMINO ACID PROFILE",
    subtitle="SYNERGISTIC PEA & RICE PROTEIN BALANCED AMINO SPECTRUM (PER 100G)",
    callouts=[
        {"x": 80, "y": 300, "title": "LEUCINE (BCAA) — 8.4G", "sub": "Primary trigger for muscle protein synthesis", "align": "left", "line_to": (460, 380)},
        {"x": 1120, "y": 300, "title": "ISOLEUCINE (BCAA) — 4.8G", "sub": "Cellular glucose uptake & endurance", "align": "right", "line_to": (740, 380)},
        {"x": 80, "y": 520, "title": "VALINE (BCAA) — 5.2G", "sub": "Accelerates recovery and prevents fatigue", "align": "left", "line_to": (430, 560)},
        {"x": 1120, "y": 520, "title": "GLUTAMINE — 16.8G", "sub": "Intestinal gut integrity & nitrogen balance", "align": "right", "line_to": (770, 560)},
        {"x": 80, "y": 740, "title": "ARGININE — 8.6G", "sub": "High nitric oxide precursor for vascularity", "align": "left", "line_to": (450, 770)},
        {"x": 1120, "y": 740, "title": "COMPLETE 9 EAAs", "sub": "Exceeds WHO adult amino acid requirements", "align": "right", "line_to": (750, 770)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "plant-fuel-aminos.jpg")
)

create_lifestyle_composite(
    photo_path="smoothie_counter.jpg",
    product_img_path=os.path.join(PRODUCTS_DIR, "plant-fuel.png"),
    tag_text="OMASTRA PLANT FUEL · DAILY POST-WORKOUT SHAKE",
    headline_text="SILKY SMOOTH VEGAN PROTEIN. ZERO CHALKINESS.",
    output_path=os.path.join(PRODUCTS_DIR, "plant-fuel-lifestyle.jpg")
)

print("--- 2. Generating OMASTRA HydroCharge Assets ---")
create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "hydrocharge.png"),
    title="OMASTRA HYDROCHARGE — 6-ELECTROLYTE MATRIX",
    subtitle="RAPID CELLULAR HYDRATION WITH HIMALAYAN PINK SALT & CHELATED MINERALS",
    callouts=[
        {"x": 80, "y": 280, "title": "HIMALAYAN PINK SALT", "sub": "500mg bioavailable trace mineral sodium", "align": "left", "line_to": (460, 360)},
        {"x": 1120, "y": 280, "title": "MAGNESIUM GLYCINATE", "sub": "120mg chelated magnesium for cramp prevention", "align": "right", "line_to": (740, 360)},
        {"x": 80, "y": 500, "title": "POTASSIUM CITRATE", "sub": "200mg optimal intracellular fluid balance", "align": "left", "line_to": (430, 540)},
        {"x": 1120, "y": 500, "title": "COCONUT WATER POWDER", "sub": "Freeze-dried real coconut electrolytes", "align": "right", "line_to": (770, 540)},
        {"x": 80, "y": 720, "title": "ZERO SUGAR & ZERO DYES", "sub": "No artificial colors, clean refreshing taste", "align": "left", "line_to": (450, 750)},
        {"x": 1120, "y": 720, "title": "RAPID OSMOTIC DELIVERY", "sub": "Fast absorption during workouts & cardio", "align": "right", "line_to": (750, 750)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "hydrocharge-infographic.jpg")
)

create_back_panel(
    title="HYDROCHARGE — ZESTY LEMON LIME",
    subtitle="ADVANCED ELECTROLYTE REPLENISHMENT DRINK MIX",
    serving_info="Serving Size: 1 Scoop (6g) | Servings Per Container: 30",
    facts_rows=[
        ("Calories", "5", "*"),
        ("Total Carbohydrates", "1g", "<1%"),
        ("  Sugars", "0g", "0%"),
        ("Sodium (Himalayan Pink Salt)", "500mg", "22%"),
        ("Potassium (as Potassium Citrate)", "200mg", "4%"),
        ("Magnesium (as Bisglycinate Chelate)", "120mg", "29%"),
        ("Calcium (as Calcium Citrate)", "80mg", "6%"),
        ("Chloride", "770mg", "33%"),
        ("Phosphorus", "40mg", "3%"),
        ("Organic Coconut Water Powder", "500mg", "**"),
        ("Zinc (as Zinc Picolinate)", "5mg", "45%"),
    ],
    ingredients_text="Himalayan Pink Salt, Potassium Citrate, Magnesium Bisglycinate Chelate, Calcium Citrate, Freeze-Dried Organic Coconut Water Powder, Natural Lemon Lime Flavors, Malic Acid, Stevia Leaf.",
    allergen_text="Contains Coconut. Manufactured in a certified allergen-free facility.",
    output_path=os.path.join(PRODUCTS_DIR, "hydrocharge-back.jpg")
)

create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "hydrocharge.png"),
    title="OSMOTIC HYDRATION SCIENCE",
    subtitle="SUPERIOR INTRACELLULAR REHYDRATION VS PLAIN WATER",
    callouts=[
        {"x": 80, "y": 300, "title": "3X FASTER ABSORPTION", "sub": "Sodium-glucose co-transport mechanism", "align": "left", "line_to": (460, 380)},
        {"x": 1120, "y": 300, "title": "ANTI-CRAMPING MATRIX", "sub": "Prevents muscle twitching during high heat", "align": "right", "line_to": (740, 380)},
        {"x": 80, "y": 520, "title": "NEURAL COGNITIVE CLARITY", "sub": "Eliminates brain fog caused by dehydration", "align": "left", "line_to": (430, 560)},
        {"x": 1120, "y": 520, "title": "ENDURANCE PROLONGATION", "sub": "Sustains output across 90+ min training", "align": "right", "line_to": (770, 560)},
        {"x": 80, "y": 740, "title": "CLEAN DAILY USAGE", "sub": "Ideal for gym, fasting, sauna & morning energy", "align": "left", "line_to": (450, 770)},
        {"x": 1120, "y": 740, "title": "NON-GMO & VEGAN", "sub": "Pure bioavailable elemental mineral salts", "align": "right", "line_to": (750, 770)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "hydrocharge-hydration.jpg")
)

create_lifestyle_composite(
    photo_path="citrus_drink.jpg",
    product_img_path=os.path.join(PRODUCTS_DIR, "hydrocharge.png"),
    tag_text="OMASTRA HYDROCHARGE · INTRA-WORKOUT HYDRATION",
    headline_text="CRISP ZESTY LEMON LIME. ZERO SUGAR REHYDRATION.",
    output_path=os.path.join(PRODUCTS_DIR, "hydrocharge-lifestyle.jpg")
)

print("--- 3. Generating OMASTRA Protein Crunch Bar Assets ---")
shutil.copyfile("protein_bar_texture.jpg", os.path.join(PRODUCTS_DIR, "protein-bar-texture.jpg"))

create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "protein-bar.png"),
    title="OMASTRA PROTEIN CRUNCH BAR",
    subtitle="20G PROTEIN · 3G NET CARBS · REAL ROASTED PEANUT BUTTER",
    callouts=[
        {"x": 80, "y": 280, "title": "20G PURE PROTEIN", "sub": "Whey & milk protein isolate crisp core", "align": "left", "line_to": (460, 360)},
        {"x": 1120, "y": 280, "title": "3G NET CARBS", "sub": "Keto-friendly and low glycemic impact", "align": "right", "line_to": (740, 360)},
        {"x": 80, "y": 500, "title": "ONLY 1.5G SUGAR", "sub": "Guilt-free gourmet snack on the go", "align": "left", "line_to": (430, 540)},
        {"x": 1120, "y": 500, "title": "10G PREBIOTIC FIBER", "sub": "Supports digestive health and satiety", "align": "right", "line_to": (770, 540)},
        {"x": 80, "y": 720, "title": "ZERO MALTITOL", "sub": "No stomach upset or sugar alcohol spikes", "align": "left", "line_to": (450, 750)},
        {"x": 1120, "y": 720, "title": "DARK CHOCOLATE COAT", "sub": "Rich real cocoa with crunchy crisps", "align": "right", "line_to": (750, 750)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "protein-bar-infographic.jpg")
)

create_back_panel(
    title="PROTEIN CRUNCH BAR — DARK CHOCOLATE PB",
    subtitle="HIGH PROTEIN SNACK BAR (BOX OF 12 BARS)",
    serving_info="Serving Size: 1 Bar (60g) | Servings Per Box: 12",
    facts_rows=[
        ("Calories", "210", "*"),
        ("Total Fat", "8g", "10%"),
        ("  Saturated Fat", "2.5g", "13%"),
        ("Total Carbohydrates", "15g", "5%"),
        ("  Dietary Fiber", "10g", "36%"),
        ("  Total Sugars", "1.5g", "*"),
        ("Protein (Whey & Milk Isolate)", "20g", "40%"),
        ("Sodium", "140mg", "6%"),
        ("Calcium", "150mg", "12%"),
        ("Iron", "1.8mg", "10%"),
        ("Potassium", "180mg", "4%"),
    ],
    ingredients_text="Protein Blend (Whey Protein Isolate, Milk Protein Isolate), Soluble Corn Fiber, Roasted Peanuts, Natural Dark Chocolate Coating (Cocoa Butter, Raw Cocoa Mass, Stevia), Peanut Butter, Vegetable Glycerin.",
    allergen_text="Contains Milk and Peanuts. Manufactured in a facility that also processes tree nuts.",
    output_path=os.path.join(PRODUCTS_DIR, "protein-bar-back.jpg")
)

create_lifestyle_composite(
    photo_path="protein_bar_texture.jpg",
    product_img_path=os.path.join(PRODUCTS_DIR, "protein-bar.png"),
    tag_text="OMASTRA PROTEIN CRUNCH · ON-THE-GO NUTRITION",
    headline_text="20G PROTEIN. TRIPLE-LAYERED CRUNCH. ZERO GUILT.",
    output_path=os.path.join(PRODUCTS_DIR, "protein-bar-lifestyle.jpg")
)

print("--- 4. Generating OMASTRA Triple Strength Omega-3 Assets ---")
create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "omega-3.png"),
    title="OMASTRA TRIPLE STRENGTH OMEGA-3",
    subtitle="1000MG MOLECULARLY DISTILLED FISH OIL · 550MG EPA / 350MG DHA",
    callouts=[
        {"x": 80, "y": 280, "title": "550MG HIGH POTENCY EPA", "sub": "Clinical support for heart & joint mobility", "align": "left", "line_to": (460, 360)},
        {"x": 1120, "y": 280, "title": "350MG PURIFIED DHA", "sub": "Essential brain cognitive function & vision", "align": "right", "line_to": (740, 360)},
        {"x": 80, "y": 500, "title": "MOLECULARLY DISTILLED", "sub": "Zero heavy metals, mercury, PCBs or toxins", "align": "left", "line_to": (430, 540)},
        {"x": 1120, "y": 500, "title": "BURP-LESS LEMON OIL", "sub": "Natural enteric lemon coating, no fishy odor", "align": "right", "line_to": (770, 540)},
        {"x": 80, "y": 720, "title": "WILD PELAGIC FISH", "sub": "Sustainably harvested anchovy and sardine", "align": "left", "line_to": (450, 750)},
        {"x": 1120, "y": 720, "title": "NATURAL VITAMIN E", "sub": "10 IU d-alpha tocopherol for fresh stability", "align": "right", "line_to": (750, 750)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "omega-3-infographic.jpg")
)

create_back_panel(
    title="TRIPLE STRENGTH OMEGA-3 FISH OIL",
    subtitle="HIGH CONCENTRATE EPA & DHA SOFTGELS (60 SOFTGELS)",
    serving_info="Serving Size: 1 Softgel | Servings Per Bottle: 60",
    facts_rows=[
        ("Calories", "10", "*"),
        ("Total Fat", "1.2g", "2%"),
        ("  Polyunsaturated Fat", "1.0g", "*"),
        ("Total Omega-3 Fatty Acids", "900mg", "**"),
        ("  EPA (Eicosapentaenoic Acid)", "550mg", "**"),
        ("  DHA (Docosahexaenoic Acid)", "350mg", "**"),
        ("  Other Omega-3 Fatty Acids", "50mg", "**"),
        ("Vitamin E (d-Alpha Tocopherol)", "10 IU", "33%"),
        ("Cholesterol", "<5mg", "1%"),
    ],
    ingredients_text="Molecularly Distilled Pelagic Fish Oil Concentrate (Anchovy, Sardine), Softgel Capsule (Bovine Gelatin, Purified Water, Vegetable Glycerin), Natural Lemon Oil Coating, d-Alpha Tocopherol.",
    allergen_text="Contains Fish (Anchovy, Sardine). Non-GMO, Gluten-Free.",
    output_path=os.path.join(PRODUCTS_DIR, "omega-3-back.jpg")
)

create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "omega-3.png"),
    title="MOLECULAR PURITY STANDARDS",
    subtitle="CERTIFIED HEAVY METAL FREE · THIRD-PARTY LAB VERIFIED",
    callouts=[
        {"x": 80, "y": 300, "title": "LEAD & MERCURY <0.01 PPM", "sub": "Well below European and USP thresholds", "align": "left", "line_to": (460, 380)},
        {"x": 1120, "y": 300, "title": "OXIDATION TOTALLY STABLE", "sub": "Peroxide value <5 meq/kg for maximum freshness", "align": "right", "line_to": (740, 380)},
        {"x": 80, "y": 520, "title": "ZERO DIOXINS & PCBs", "sub": "Double-vacuum molecular distillation process", "align": "left", "line_to": (430, 560)},
        {"x": 1120, "y": 520, "title": "JOINT & CARDIO RECOVERY", "sub": "Reduces exercise-induced DOMS inflammation", "align": "right", "line_to": (770, 560)},
        {"x": 80, "y": 740, "title": "LEMON ANTI-BURP SHELL", "sub": "Pleasant citrus aroma upon ingestion", "align": "left", "line_to": (450, 770)},
        {"x": 1120, "y": 740, "title": "DAILY WELLNESS DOSE", "sub": "1 softgel daily provides 100% daily omegas", "align": "right", "line_to": (750, 770)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "omega-3-purity.jpg")
)

create_lifestyle_composite(
    photo_path="omega_lifestyle.jpg",
    product_img_path=os.path.join(PRODUCTS_DIR, "omega-3.png"),
    tag_text="OMASTRA OMEGA-3 · DAILY CELLULAR WELLNESS",
    headline_text="CRYSTAL PURITY. TRIPLE STRENGTH EPA & DHA.",
    output_path=os.path.join(PRODUCTS_DIR, "omega-3-lifestyle.jpg")
)

print("--- 5. Generating Remaining Clean Protocol Assets ---")
create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "whey-isolate.png"),
    title="CFM CROSS-FLOW MICROFILTRATION",
    subtitle="90% ULTRA-PURE ISOLATE · 0G SUGAR · <0.5G FAT",
    callouts=[
        {"x": 80, "y": 280, "title": "27G PURE PROTEIN", "sub": "Highest protein concentration per scoop", "align": "left", "line_to": (460, 360)},
        {"x": 1120, "y": 280, "title": "ZERO LACTOSE BLOAT", "sub": "Gentle on sensitive digestive tracts", "align": "right", "line_to": (740, 360)},
        {"x": 80, "y": 500, "title": "COLD-FILTERED CFM", "sub": "Preserves native immunoglobulins & glycomacropeptides", "align": "left", "line_to": (430, 540)},
        {"x": 1120, "y": 500, "title": "6.1G BIOACTIVE BCAAs", "sub": "Rapid intra-muscular uptake in 20 minutes", "align": "right", "line_to": (770, 540)},
        {"x": 80, "y": 720, "title": "0G ADDED SUGAR", "sub": "Zero maltodextrin, zero fillers, zero gums", "align": "left", "line_to": (450, 750)},
        {"x": 1120, "y": 720, "title": "INSTANT SHAKER DISSOLVE", "sub": "Mixes completely clear with water in 10 seconds", "align": "right", "line_to": (750, 750)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "whey-isolate-angled.jpg")
)

create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "creatine.png"),
    title="200-MESH CREATINE DOSING PROTOCOL",
    subtitle="MICRONIZED PHOSPHOCREATINE SATURATION & POWER KINETICS",
    callouts=[
        {"x": 80, "y": 280, "title": "5G CLINICAL SCOOP", "sub": "Exact daily dose proven in 500+ clinical studies", "align": "left", "line_to": (460, 360)},
        {"x": 1120, "y": 280, "title": "200-MESH PARTICLES", "sub": "10x finer than standard creatine for fast dissolve", "align": "right", "line_to": (740, 360)},
        {"x": 80, "y": 500, "title": "CELLULAR ATP RECHARGE", "sub": "Accelerates intra-set power production & reps", "align": "left", "line_to": (430, 540)},
        {"x": 1120, "y": 500, "title": "ZERO WATER BLOAT", "sub": "Direct intracellular hydration, not subcutaneous", "align": "right", "line_to": (770, 540)},
        {"x": 80, "y": 720, "title": "UNFLAVORED PURITY", "sub": "Mixes seamlessly into whey, juice or pre-workout", "align": "left", "line_to": (450, 750)},
        {"x": 1120, "y": 720, "title": "DAILY CONSISTENCY", "sub": "Take 1 scoop every day at any time for saturation", "align": "right", "line_to": (750, 750)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "creatine-usage.jpg")
)

create_product_infographic(
    product_img_path=os.path.join(PRODUCTS_DIR, "nitropre.png"),
    title="NITROPRE PERFORMANCE KINETICS",
    subtitle="TIMED NITRIC OXIDE PUMP & SUSTAINED ENERGY MATRIX",
    callouts=[
        {"x": 80, "y": 280, "title": "4000MG L-CITRULLINE", "sub": "Maximizes endothelial NO production & blood flow", "align": "left", "line_to": (460, 360)},
        {"x": 1120, "y": 280, "title": "1600MG BETA-ALANINE", "sub": "Buffers carnosine to eliminate muscle burn", "align": "right", "line_to": (740, 360)},
        {"x": 80, "y": 500, "title": "200MG PURE CAFFEINE", "sub": "Clean explosive alertness without the jitter crash", "align": "left", "line_to": (430, 540)},
        {"x": 1120, "y": 500, "title": "500MG L-TYROSINE", "sub": "Sharp laser focus and mind-muscle connection", "align": "right", "line_to": (770, 540)},
        {"x": 80, "y": 720, "title": "TAKE 20-30 MIN PRIOR", "sub": "Peaks in bloodstream at start of working sets", "align": "left", "line_to": (450, 750)},
        {"x": 1120, "y": 720, "title": "ZERO SUGAR FORMULA", "sub": "Clean pumps without glycemic crashes", "align": "right", "line_to": (750, 750)},
    ],
    output_path=os.path.join(PRODUCTS_DIR, "nitropre-timing.jpg")
)

# Copy newly generated assets to artifacts directory for permanence
for fname in os.listdir(PRODUCTS_DIR):
    if fname.endswith(".jpg"):
        src = os.path.join(PRODUCTS_DIR, fname)
        dst = os.path.join(ARTIFACTS_DIR, fname)
        shutil.copyfile(src, dst)

print("\nALL CATALOG ASSETS GENERATED & BACKED UP TO ARTIFACTS SUCCESSFULLY!")
