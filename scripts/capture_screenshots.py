import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

SCREENSHOTS_DIR = r"c:\Users\91976\OneDrive\Desktop\Rhinoflex nutrition\screenshots"
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

options = ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1600,1050')
options.add_argument('--disable-dev-shm-usage')

print("Launching Chrome WebDriver...")
driver = webdriver.Chrome(options=options)
driver.set_window_size(1600, 1050)

try:
    # 1. Homepage Hero
    print("Capturing 01-homepage-hero.png...")
    driver.get("http://localhost:5173/")
    time.sleep(2.5)
    driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "01-homepage-hero.png"))

    # 2. Categories Section
    print("Capturing 02-categories-showcase.png...")
    driver.execute_script("window.scrollTo(0, 950);")
    time.sleep(1.5)
    driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "02-categories-showcase.png"))

    # 3. Shop Catalog Page
    print("Capturing 03-shop-catalog.png...")
    driver.get("http://localhost:5173/shop")
    time.sleep(2.5)
    driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "03-shop-catalog.png"))

    # 4. Product Detail Page (Whey Pro - Front View & Gallery)
    print("Capturing 04-product-details-gallery.png...")
    driver.get("http://localhost:5173/products/omastra-whey-pro-classic-blend")
    time.sleep(2.5)
    driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "04-product-details-gallery.png"))

    # 5. Product Gallery - Benefits Infographic thumbnail
    print("Capturing 05-product-infographic-view.png...")
    try:
        # Click the 3rd thumbnail (Benefits)
        thumbs = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='Benefits'], button[aria-label*='Image 3']")
        if thumbs:
            thumbs[0].click()
            time.sleep(1.0)
            driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "05-product-infographic-view.png"))
        else:
            print("Thumbnail button for Benefits not found, trying by index...")
            buttons = driver.find_elements(By.TAG_NAME, "button")
            for b in buttons:
                if 'Benefits' in b.text:
                    b.click()
                    time.sleep(1.0)
                    driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "05-product-infographic-view.png"))
                    break
    except Exception as e:
        print("Error capturing infographic thumbnail:", e)

    # 6. Product Gallery - Supplement Facts Back thumbnail
    print("Capturing 06-product-back-panel-view.png...")
    try:
        thumbs = driver.find_elements(By.CSS_SELECTOR, "button[aria-label*='Back'], button[aria-label*='Image 4']")
        if thumbs:
            thumbs[0].click()
            time.sleep(1.0)
            driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "06-product-back-panel-view.png"))
    except Exception as e:
        print("Error capturing back panel view:", e)

    # 7. Plant Fuel Product Page (Vegan Pouch & Multi-Image Gallery)
    print("Capturing 07-plantfuel-product-page.png...")
    driver.get("http://localhost:5173/products/omastra-plantfuel-vegan-protein")
    time.sleep(2.5)
    driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "07-plantfuel-product-page.png"))

    # 8. Cart Page with Items
    print("Capturing 08-cart-page.png...")
    # Add to cart first
    try:
        add_btn = driver.find_element(By.XPATH, "//button[contains(., 'Add to Cart')]")
        add_btn.click()
        time.sleep(1.0)
    except:
        pass
    driver.get("http://localhost:5173/cart")
    time.sleep(2.0)
    driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "08-cart-page.png"))

    # 9. Checkout Page with COD Option
    print("Capturing 09-checkout-page.png...")
    driver.get("http://localhost:5173/checkout")
    time.sleep(2.0)
    driver.save_screenshot(os.path.join(SCREENSHOTS_DIR, "09-checkout-page.png"))

    print("\nALL SCREENSHOTS CAPTURED SUCCESSFULLY!")

finally:
    driver.quit()
