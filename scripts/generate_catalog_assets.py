import os
import urllib.request
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps

PRODUCTS_DIR = r"c:\Users\91976\OneDrive\Desktop\Rhinoflex nutrition\client\public\products"
FONT_BAHN = r"C:\Windows\Fonts\bahnschrift.ttf"
FONT_ARIAL = r"C:\Windows\Fonts\arial.ttf"
FONT_ARIAL_BOLD = r"C:\Windows\Fonts\arialbd.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_grid_background(draw, width, height, cell_size=40, line_color=(240, 243, 246)):
    for x in range(0, width, cell_size):
        draw.line([(x, 0), (x, height)], fill=line_color, width=1)
    for y in range(0, height, cell_size):
        draw.line([(0, y), (width, y)], fill=line_color, width=1)

def draw_header(draw, title, subtitle):
    f_title = get_font(FONT_BAHN, 42)
    f_sub = get_font(FONT_ARIAL, 18)
    
    # Title
    t_len = draw.textlength(title, font=f_title)
    draw.text(((1200 - t_len) / 2, 50), title, fill=(15, 23, 42), font=f_title)
    # Subtitle
    s_len = draw.textlength(subtitle, font=f_sub)
    draw.text(((1200 - s_len) / 2, 105), subtitle, fill=(100, 116, 139), font=f_sub)
    
    # Clean divider
    draw.line([(450, 140), (750, 140)], fill=(203, 213, 225), width=2)

def draw_callout_box(draw, x, y, title, subtitle, align='left', line_to=None):
    font_title = get_font(FONT_BAHN, 20)
    font_sub = get_font(FONT_ARIAL, 14)
    
    pad_x, pad_y = 18, 12
    box_w = 320
    box_h = 72
    
    box_x = x if align == 'left' else x - box_w
    box_y = y
    
    # White card with subtle border & shadow
    draw.rounded_rectangle([box_x, box_y, box_x + box_w, box_y + box_h], radius=12, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    
    # Title
    draw.text((box_x + pad_x, box_y + pad_y), title, fill=(15, 23, 42), font=font_title)
    # Subtitle
    draw.text((box_x + pad_x, box_y + pad_y + 26), subtitle, fill=(100, 116, 139), font=font_sub)
    
    # Pointer line
    if line_to:
        start_pt = (box_x + box_w, box_y + box_h // 2) if align == 'left' else (box_x, box_y + box_h // 2)
        draw.line([start_pt, line_to], fill=(148, 163, 184), width=2)
        r = 4
        draw.ellipse([line_to[0] - r, line_to[1] - r, line_to[0] + r, line_to[1] + r], fill=(15, 23, 42))

def create_product_infographic(product_img_path, title, subtitle, callouts, output_path):
    canvas = Image.new('RGB', (1200, 1200), (250, 251, 253))
    draw = ImageDraw.Draw(canvas)
    draw_grid_background(draw, 1200, 1200, 40)
    draw_header(draw, title, subtitle)
    
    # Paste centered product with shadow
    if os.path.exists(product_img_path):
        prod = Image.open(product_img_path).convert('RGBA')
        max_h = 700
        aspect = prod.width / prod.height
        new_h = max_h
        new_w = int(new_h * aspect)
        prod = prod.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        # Soft shadow
        shadow = Image.new('RGBA', (new_w + 80, new_h + 80), (0, 0, 0, 0))
        sh_draw = ImageDraw.Draw(shadow)
        sh_draw.ellipse([30, new_h - 40, new_w + 50, new_h + 40], fill=(0, 0, 0, 70))
        shadow = shadow.filter(ImageFilter.GaussianBlur(24))
        
        paste_x = (1200 - new_w) // 2
        paste_y = 230 + (700 - new_h) // 2
        canvas.paste(shadow, (paste_x - 40, paste_y - 20), shadow)
        canvas.paste(prod, (paste_x, paste_y), prod)
    
    # Draw callouts
    for c in callouts:
        draw_callout_box(draw, c['x'], c['y'], c['title'], c['sub'], c.get('align', 'left'), c.get('line_to'))
        
    canvas.save(output_path, 'JPEG', quality=95)
    print(f"Generated infographic: {output_path}")

def create_back_panel(title, subtitle, serving_info, facts_rows, ingredients_text, allergen_text, output_path):
    canvas = Image.new('RGB', (1200, 1200), (245, 247, 250))
    draw = ImageDraw.Draw(canvas)
    draw_grid_background(draw, 1200, 1200, 40)
    
    f_brand = get_font(FONT_BAHN, 32)
    f_title = get_font(FONT_BAHN, 36)
    f_sub = get_font(FONT_ARIAL, 18)
    f_body = get_font(FONT_ARIAL, 16)
    f_bold = get_font(FONT_ARIAL_BOLD, 16)
    f_small = get_font(FONT_ARIAL, 13)
    
    # White central card (Supplement Facts style)
    card_x, card_y, card_w, card_h = 160, 80, 880, 1040
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=20, fill=(255, 255, 255), outline=(210, 215, 225), width=2)
    
    # Brand bar
    draw.text((card_x + 40, card_y + 35), "OMASTRA PERFORMANCE LABS", fill=(100, 116, 139), font=get_font(FONT_BAHN, 16))
    draw.text((card_x + 40, card_y + 60), title, fill=(15, 23, 42), font=f_title)
    draw.text((card_x + 40, card_y + 105), subtitle, fill=(71, 85, 105), font=f_sub)
    draw.line([(card_x + 40, card_y + 140), (card_x + card_w - 40, card_y + 140)], fill=(15, 23, 42), width=5)
    
    # Supplement facts table header
    draw.text((card_x + 40, card_y + 155), "Supplement Facts", fill=(15, 23, 42), font=get_font(FONT_BAHN, 34))
    draw.text((card_x + 40, card_y + 195), serving_info, fill=(71, 85, 105), font=f_body)
    draw.line([(card_x + 40, card_y + 225), (card_x + card_w - 40, card_y + 225)], fill=(15, 23, 42), width=3)
    
    # Column headers
    draw.text((card_x + 40, card_y + 235), "Amount Per Serving", fill=(15, 23, 42), font=f_bold)
    draw.text((card_x + card_w - 180, card_y + 235), "% Daily Value*", fill=(15, 23, 42), font=f_bold)
    draw.line([(card_x + 40, card_y + 260), (card_x + card_w - 40, card_y + 260)], fill=(15, 23, 42), width=1)
    
    # Fact rows
    curr_y = card_y + 270
    for name, amt, dv in facts_rows:
        draw.text((card_x + 40, curr_y), name, fill=(15, 23, 42), font=f_bold if dv == '**' or 'Protein' in name or 'Calories' in name else f_body)
        draw.text((card_x + 460, curr_y), amt, fill=(15, 23, 42), font=f_body)
        draw.text((card_x + card_w - 140, curr_y), dv, fill=(15, 23, 42), font=f_bold if dv != '*' else f_body)
        draw.line([(card_x + 40, curr_y + 24), (card_x + card_w - 40, curr_y + 24)], fill=(241, 245, 249), width=1)
        curr_y += 30
        
    draw.line([(card_x + 40, curr_y + 5), (card_x + card_w - 40, curr_y + 5)], fill=(15, 23, 42), width=3)
    draw.text((card_x + 40, curr_y + 15), "* Percent Daily Values are based on a 2,000 calorie diet. ** Daily Value not established.", fill=(100, 116, 139), font=f_small)
    
    # Ingredients box
    curr_y += 45
    draw.text((card_x + 40, curr_y), "INGREDIENTS:", fill=(15, 23, 42), font=f_bold)
    curr_y += 24
    import textwrap
    wrapped_lines = textwrap.wrap(ingredients_text, width=82)
    for line in wrapped_lines:
        draw.text((card_x + 40, curr_y), line, fill=(51, 65, 85), font=f_body)
        curr_y += 20
    
    # Allergens & Quality seals
    curr_y += 20
    draw.text((card_x + 40, curr_y), "ALLERGEN WARNING: " + allergen_text, fill=(185, 28, 28), font=f_bold)
    
    curr_y += 45
    # Quality badges footer
    badges = ["100% LAB TESTED", "ZERO BANNED SUBSTANCES", "GMP CERTIFIED FACILITY", "PREMIUM GRADE"]
    b_x = card_x + 40
    for b in badges:
        draw.rounded_rectangle([b_x, curr_y, b_x + 185, curr_y + 36], radius=6, fill=(241, 245, 249), outline=(203, 213, 225), width=1)
        draw.text((b_x + 12, curr_y + 9), b, fill=(51, 65, 85), font=get_font(FONT_BAHN, 11))
        b_x += 195
        
    canvas.save(output_path, 'JPEG', quality=95)
    print(f"Generated back panel: {output_path}")

def create_lifestyle_composite(photo_path, product_img_path, tag_text, headline_text, output_path):
    canvas = Image.new('RGB', (1200, 1200), (255, 255, 255))
    if os.path.exists(photo_path):
        bg = Image.open(photo_path).convert('RGB')
        # Center crop to 1200x1200
        w, h = bg.size
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        bg = bg.crop((left, top, left + min_dim, top + min_dim)).resize((1200, 1200), Image.Resampling.LANCZOS)
        canvas.paste(bg, (0, 0))
    
    draw = ImageDraw.Draw(canvas)
    
    # Subtle dark gradient at top & bottom for high-end readability
    top_overlay = Image.new('RGBA', (1200, 200), (0, 0, 0, 0))
    t_draw = ImageDraw.Draw(top_overlay)
    for y in range(200):
        alpha = int(120 * (1 - y / 200))
        t_draw.line([(0, y), (1200, y)], fill=(0, 0, 0, alpha))
    canvas.paste(top_overlay, (0, 0), top_overlay)
    
    bot_overlay = Image.new('RGBA', (1200, 250), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(bot_overlay)
    for y in range(250):
        alpha = int(180 * (y / 250))
        b_draw.line([(0, y), (1200, y)], fill=(0, 0, 0, alpha))
    canvas.paste(bot_overlay, (0, 950), bot_overlay)
    
    # Tag at top
    f_tag = get_font(FONT_BAHN, 16)
    tag_w = draw.textlength(tag_text, font=f_tag) + 40
    tag_x = (1200 - tag_w) / 2
    draw.rounded_rectangle([tag_x, 40, tag_x + tag_w, 80], radius=20, fill=(0, 0, 0), outline=(255, 255, 255), width=1)
    draw.text((tag_x + 20, 50), tag_text, fill=(255, 255, 255), font=f_tag)
    
    # Bottom headline
    f_head = get_font(FONT_BAHN, 32)
    h_w = draw.textlength(headline_text, font=f_head)
    draw.text(((1200 - h_w) / 2, 1110), headline_text, fill=(255, 255, 255), font=f_head)
    
    canvas.save(output_path, 'JPEG', quality=95)
    print(f"Generated lifestyle: {output_path}")

print("Generator functions ready")
