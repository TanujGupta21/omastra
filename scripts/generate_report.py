import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

def create_omastra_report():
    doc = docx.Document()
    
    # ---------------- PAGE SETUP ----------------
    for s in doc.sections:
        s.top_margin = Inches(0.8)
        s.bottom_margin = Inches(0.8)
        s.left_margin = Inches(0.8)
        s.right_margin = Inches(0.8)
        s.page_width = Inches(8.27)   # A4
        s.page_height = Inches(11.69) # A4
        
        # Add Double Page Border (Matching reference PDF)
        pgBorders = OxmlElement('w:pgBorders')
        pgBorders.set(qn('w:offsetFrom'), 'page')
        for b_name in ['top', 'left', 'bottom', 'right']:
            b = OxmlElement(f'w:{b_name}')
            b.set(qn('w:val'), 'triple') # 'triple' renders as thick-thin double border
            b.set(qn('w:sz'), '12')      # 1.5 pt
            b.set(qn('w:space'), '24')   # distance from edge
            b.set(qn('w:color'), '000000')
            pgBorders.append(b)
        s._sectPr.append(pgBorders)

    # Base font setup
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Times New Roman'
    normal_style.font.size = Pt(11)
    normal_style.font.color.rgb = RGBColor(0, 0, 0)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # Helpers
    def add_para(text, bold=False, italic=False, underline=False, align=WD_ALIGN_PARAGRAPH.JUSTIFY, space_after=4, space_before=0, font_size=11):
        p = doc.add_paragraph()
        p.alignment = align
        p.paragraph_format.space_after = Pt(space_after)
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.line_spacing = 1.15
        run = p.add_run(text)
        run.bold = bold
        run.italic = italic
        run.underline = underline
        run.font.name = 'Times New Roman'
        run.font.size = Pt(font_size)
        return p

    def add_ch_title(title_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(12)
        run = p.add_run(title_text)
        run.bold = True
        run.underline = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(15)
        return p

    def add_sec_title(title_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        run = p.add_run(title_text)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(12)
        return p

    def add_subsec_title(title_text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        run = p.add_run(title_text)
        run.bold = True
        run.font.name = 'Times New Roman'
        run.font.size = Pt(11)
        return p

    def set_cell_props(cell, fill_hex=None, bold=False, align=WD_ALIGN_PARAGRAPH.LEFT, font_size=9.5, italic=False):
        if fill_hex:
            shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
            cell._tc.get_or_add_tcPr().append(shading_elm)
        cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
        for p in cell.paragraphs:
            p.alignment = align
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.line_spacing = 1.05
            for r in p.runs:
                r.bold = bold
                r.italic = italic
                r.font.name = 'Times New Roman'
                r.font.size = Pt(font_size)

    def set_table_borders(table, color="B0B0B0", sz="4", val="single"):
        tblPr = table._tbl.tblPr
        borders_elm = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(borders_elm)

    def add_code_block(title, description, code_lines):
        p_t = doc.add_paragraph()
        p_t.paragraph_format.space_before = Pt(8)
        p_t.paragraph_format.space_after = Pt(2)
        r_t = p_t.add_run(title)
        r_t.bold = True
        r_t.italic = True
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(11)

        p_d = doc.add_paragraph()
        p_d.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p_d.paragraph_format.space_before = Pt(0)
        p_d.paragraph_format.space_after = Pt(4)
        r_d = p_d.add_run(description)
        r_d.font.name = 'Times New Roman'
        r_d.font.size = Pt(10)

        # 1x1 table for code box
        tbl = doc.add_table(rows=1, cols=1)
        tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = tbl.cell(0, 0)
        cell.width = Inches(6.6)
        
        # Shading #F8F9FA, border #CCCCCC
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="F8F9FA"/>')
        cell._tc.get_or_add_tcPr().append(shd)
        
        tcBorders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>'
            f'<w:left w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>'
            f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>'
            f'<w:right w:val="single" w:sz="6" w:space="0" w:color="CCCCCC"/>'
            f'</w:tcBorders>'
        )
        cell._tc.get_or_add_tcPr().append(tcBorders)

        p_c = cell.paragraphs[0]
        p_c.paragraph_format.space_before = Pt(3)
        p_c.paragraph_format.space_after = Pt(3)
        p_c.paragraph_format.line_spacing = 1.05
        
        for idx, line in enumerate(code_lines):
            r = p_c.add_run(line + ('\n' if idx < len(code_lines) - 1 else ''))
            r.font.name = 'Consolas'
            r.font.size = Pt(8.5)
            r.font.color.rgb = RGBColor(30, 30, 30)

        p_spacer = doc.add_paragraph()
        p_spacer.paragraph_format.space_after = Pt(6)

    def add_fig_image(img_path, caption_text, width_inches=5.8):
        if os.path.exists(img_path):
            p = doc.add_paragraph()
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(6)
            p.paragraph_format.space_after = Pt(4)
            run = p.add_run()
            run.add_picture(img_path, width=Inches(width_inches))
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(8)
            r_cap = p_cap.add_run(caption_text)
            r_cap.bold = True
            r_cap.italic = True
            r_cap.font.name = 'Times New Roman'
            r_cap.font.size = Pt(10)
        else:
            p = doc.add_paragraph(f"[{caption_text} - Image not found at {img_path}]")
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    # Assets paths
    assets_dir = r"c:\Users\91976\OneDrive\Desktop\Rhinoflex nutrition\report_assets"
    diagrams_dir = r"c:\Users\91976\OneDrive\Desktop\Rhinoflex nutrition\omastra_diagrams"
    screens_dir = r"c:\Users\91976\OneDrive\Desktop\Rhinoflex nutrition\screenshots"

    logo_col = os.path.join(assets_dir, "p1_img1_46.jpeg")
    logo_mu = os.path.join(assets_dir, "p1_img2_47.jpeg")
    cert_hdr = os.path.join(assets_dir, "p2_img1_82.jpeg")

    print("Building Document Sections...")

    # =========================================================================
    # PAGE 1: TITLE PAGE
    # =========================================================================
    if os.path.exists(logo_col):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(4)
        p_logo.paragraph_format.space_after = Pt(4)
        p_logo.add_run().add_picture(logo_col, width=Inches(1.25))

    add_para("Rajiv Gandhi College of Arts, Commerce & Science, Vashi", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12.5, space_after=1)
    add_para("{Permanently Affiliated to University of Mumbai}", align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=1)
    add_para("Re-Accredited by NAAC, Grade ‘B’", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=1)
    add_para("Hindi Linguistic Minority Institute", align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=1)
    add_para("Sector 10 A, Vashi, Navi Mumbai – 400703", align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=6)

    add_para("DEPARTMENT OF COMPUTER SCIENCE", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=1)
    add_para("&", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=1)
    add_para("INFORMATION TECHNOLOGY", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=8)

    add_para("A PROJECT REPORT", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=13, space_after=2)
    add_para("on", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=2)
    add_para("OMASTRA — A Full-Stack E-Commerce Web Application for Sports Nutrition Retail", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12.5, space_after=8)

    add_para("Submitted to", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=4)

    if os.path.exists(logo_mu):
        p_mu = doc.add_paragraph()
        p_mu.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_mu.paragraph_format.space_before = Pt(2)
        p_mu.paragraph_format.space_after = Pt(4)
        p_mu.add_run().add_picture(logo_mu, width=Inches(1.0))

    add_para("University of Mumbai", bold=True, italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=2)
    add_para("in partial fulfilment for the award of the degree", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=1)
    add_para("of", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=1)
    add_para("BACHELOR OF SCIENCE", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=1)
    add_para("in", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=1)
    add_para("COMPUTER SCIENCE", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=4)

    add_para("by", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=1)
    add_para("Mr. Om Sawant", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=3)
    add_para("under the guidance of", italic=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=10.5, space_after=1)
    add_para("Asst. Prof. Sherin V", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11.5, space_after=4)
    add_para("A.Y. 2026 – 27", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=0)

    doc.add_page_break()

    # =========================================================================
    # PAGE 2: CERTIFICATE
    # =========================================================================
    if os.path.exists(cert_hdr):
        p_hdr = doc.add_paragraph()
        p_hdr.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_hdr.paragraph_format.space_before = Pt(0)
        p_hdr.paragraph_format.space_after = Pt(10)
        p_hdr.add_run().add_picture(cert_hdr, width=Inches(6.6))

    add_para("DEPARTMENT OF COMPUTER SCIENCE &", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=1)
    add_para("INFORMATION TECHNOLOGY", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=12, space_after=14)

    p_c = doc.add_paragraph()
    p_c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_c.paragraph_format.space_after = Pt(18)
    r_c = p_c.add_run("CERTIFICATE")
    r_c.bold = True
    r_c.underline = True
    r_c.font.name = 'Times New Roman'
    r_c.font.size = Pt(14)

    add_para("This is to certify that the project entitled", align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11, space_after=4)
    add_para("“OMASTRA — A Full-Stack E-Commerce Web Application", bold=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11.5, space_after=2)
    add_para("for Sports Nutrition Retail”", bold=True, underline=True, align=WD_ALIGN_PARAGRAPH.CENTER, font_size=11.5, space_after=14)

    cert_text = (
        "Is successfully completed by Mr. Om Sawant, Seat no. _______________, under the guidance of "
        "Asst. Prof. Sherin V during the academic year 2026-27 as per the syllabus, and the partial fulfillment "
        "for the award of the degree of Bachelor of Science in Computer Science of University of Mumbai."
    )
    add_para(cert_text, align=WD_ALIGN_PARAGRAPH.JUSTIFY, font_size=11, space_after=40)

    # Signature layout table
    sig_tbl = doc.add_table(rows=3, cols=2)
    sig_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    for r in sig_tbl.rows:
        for c in r.cells:
            c.width = Inches(3.2)
            for p in c.paragraphs:
                p.paragraph_format.space_after = Pt(1)
                p.paragraph_format.space_before = Pt(1)

    sig_tbl.cell(0, 0).paragraphs[0].add_run("________________________\nAsst. Prof. Sherin V\nProject Guide").bold = True
    sig_tbl.cell(0, 0).paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    sig_tbl.cell(0, 1).paragraphs[0].add_run("________________________\nAsst. Prof. Anita Yadav\nCo-ordinator").bold = True
    sig_tbl.cell(0, 1).paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

    sig_tbl.cell(1, 0).paragraphs[0].add_run("\n\n").bold = True
    sig_tbl.cell(1, 1).paragraphs[0].add_run("\n\n").bold = True

    sig_tbl.cell(2, 0).paragraphs[0].add_run("________________________\nExternal Examiner").bold = True
    sig_tbl.cell(2, 0).paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER
    sig_tbl.cell(2, 1).paragraphs[0].add_run("________________________\nPrincipal").bold = True
    sig_tbl.cell(2, 1).paragraphs[0].alignment = WD_ALIGN_PARAGRAPH.CENTER

    doc.add_page_break()

    # =========================================================================
    # PAGE 3: DECLARATION
    # =========================================================================
    add_ch_title("DECLARATION")

    decl_1 = (
        "I, Om Sawant, hereby declare that the project report entitled \"OMASTRA — A Full-Stack E-Commerce Web "
        "Application for Sports Nutrition Retail\" submitted during the academic year 2026-27, under the guidance "
        "of Asst. Prof. Sherin V, in partial fulfilment of the requirements for the award of the degree of "
        "Bachelor of Science in Computer Science (B.Sc. CS) from Sainath Education Trust’s Rajiv Gandhi College of Arts, "
        "Commerce & Science, Vashi."
    )
    add_para(decl_1, space_after=14)

    decl_2 = (
        "I further declare that all the source code, design artifacts, database schema, and documentation presented "
        "in this report are based on a project that I have personally designed and developed, and that this project has "
        "not been submitted, in part or in full, to any other University or Institution for the award of any degree or diploma."
    )
    add_para(decl_2, space_after=180)

    p_sig = doc.add_paragraph()
    p_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_sig = p_sig.add_run("Om Sawant")
    r_sig.bold = True
    r_sig.font.name = 'Times New Roman'
    r_sig.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # PAGE 4: ACKNOWLEDGEMENT
    # =========================================================================
    add_ch_title("ACKNOWLEDGEMENT")

    ack_1 = (
        "I would like to take this opportunity to express our profound gratitude and deep regards to our esteemed "
        "Principal, Dr. B. S. Pandey, for providing a scholarly environment and for their exemplary leadership."
    )
    add_para(ack_1, space_after=12)

    ack_2 = (
        "I am also thankful to the Co-ordinator of the Department of Information Technology and Computer Science, "
        "Asst. Prof. Anita Yadav, for her valuable support and for providing us with the necessary infrastructure "
        "and a conducive environment to carry out our project work."
    )
    add_para(ack_2, space_after=12)

    ack_3 = (
        "I would like to express our deepest gratitude and sincere thanks to our project guide, Asst. Prof. Sherin V, "
        "for her invaluable guidance, constant encouragement, insightful suggestions and support throughout the course "
        "of this project. Her expertise and support were instrumental in the successful completion of this work."
    )
    add_para(ack_3, space_after=12)

    ack_4 = (
        "Finally, I would like to thank my parents and friends for their unwavering support and encouragement throughout this journey."
    )
    add_para(ack_4, space_after=140)

    p_ack_sig = doc.add_paragraph()
    p_ack_sig.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    r_asig = p_ack_sig.add_run("Om Sawant")
    r_asig.bold = True
    r_asig.font.name = 'Times New Roman'
    r_asig.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================================
    # PAGE 5: ABSTRACT
    # =========================================================================
    add_ch_title("ABSTRACT")

    abs_1 = (
        "OMASTRA is a full-stack e-commerce web application built for the online retail of premium sports nutrition and "
        "fitness supplements. The platform is designed to give a modern sports nutrition brand or retailer a complete, "
        "self-hosted online storefront — covering product discovery, interactive multi-angle supplement inspection, "
        "flavour/size variant selection, shopping cart management, coupon-based discounts, checkout, order fulfilment, "
        "and a full administrative command center — without depending on a third-party marketplace or SaaS storefront builder."
    )
    add_para(abs_1, space_after=10)

    abs_2 = (
        "The system follows the classic three-tier web architecture. The presentation tier is a single-page application "
        "built with React 18, Vite 5, and Tailwind CSS, offering a responsive customer storefront (home, shop with faceted "
        "search/filter/sort, Amazon-style 5-angle product gallery, persistent cart, wishlist, and a frictionless multi-step "
        "checkout) as well as a protected administrator dashboard for managing products, categories, orders, coupons, "
        "customers, and reviews. The application tier is a Node.js and Express REST API that exposes versioned endpoints "
        "secured with JSON Web Token (JWT) based authentication with HttpOnly cookies, role-based authorization "
        "(USER/ADMIN), rate limiting, and defensive security middleware (Helmet, CORS, Mongo sanitize). The data tier "
        "uses MongoDB with the Mongoose ODM, modelling users, products, categories, orders, coupons, and reviews as separate "
        "collections with well-defined schemas, validation rules, and relational references."
    )
    add_para(abs_2, space_after=10)

    abs_3 = (
        "A key focus of the project is a realistic checkout and payment flow: customers may choose Cash on Delivery (COD) "
        "or complete online payment through the integrated Razorpay payment gateway (supporting UPI, Credit/Debit cards, "
        "and Net Banking), backed by rigorous server-side cryptographic signature verification (HMAC-SHA256) ensuring that "
        "payment confirmations cannot be forged from the client. The order pipeline performs live stock verification, atomic "
        "condition-checked stock decrements to prevent race-condition overselling, coupon validation and usage limit tracking, "
        "and dispatches automated order confirmations through transactional email."
    )
    add_para(abs_3, space_after=10)

    abs_4 = (
        "The administrative side of the application provides real-time analytics — revenue, order volume, customer trends, "
        "and low-stock alerts computed using MongoDB aggregation pipelines and rendered via Recharts, alongside full CRUD "
        "management of the supplement catalogue, promotional coupons, customer accounts, and customer reviews. This report "
        "documents the complete software development life cycle followed while building OMASTRA — from requirement analysis "
        "and system design (DFDs, ER diagram, UML diagrams) through implementation, testing, and deployment — presenting the "
        "concrete source code, architecture, and design decisions used in the finished application."
    )
    add_para(abs_4, space_after=6)

    doc.add_page_break()

    # =========================================================================
    # PAGES 6-7: TABLE OF CONTENTS
    # =========================================================================
    p_toc_head = doc.add_paragraph()
    p_toc_head.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc_head.paragraph_format.space_before = Pt(8)
    p_toc_head.paragraph_format.space_after = Pt(8)
    r_th = p_toc_head.add_run("Table of Contents")
    r_th.bold = True
    r_th.underline = True
    r_th.font.name = 'Times New Roman'
    r_th.font.size = Pt(14)

    toc_data = [
        ("Sr. No.", "Table of Contents", "Page No."),
        ("1", "Introduction\n  1.1 Project Overview\n  1.2 Problem Statement\n  1.3 Objectives\n  1.4 Scope and Limitations\n  1.5 Development Methodology", "1 – 2"),
        ("2", "System Analysis\n  2.1 Existing System\n  2.2 Limitations of Existing System\n  2.3 Proposed System\n  2.4 Feasibility Study\n  2.5 Advantages & Observations\n  2.6 Comparison with Alternatives\n  2.7 Risk Analysis", "3 – 5"),
        ("3", "System Requirement Specifications\n  3.1 Hardware Requirements\n  3.2 Software Requirements\n  3.3 Functional Requirements\n  3.4 Non-Functional Requirements\n  3.5 Assumptions and Dependencies\n  3.6 Data Dictionary", "6 – 10"),
        ("4", "System Design\n  4.1 System Architecture\n  4.2 Data Flow Diagram – Level 0\n  4.3 Data Flow Diagram – Level 1\n  4.4 Use Case Diagram\n  4.5 Activity Diagram\n  4.6 Entity-Relationship (E-R) Diagram\n  4.7 Class Diagram\n  4.8 Sequence Diagram\n  4.9 Deployment Diagram\n  4.10 Gantt Chart", "11 – 20"),
        ("5", "Implementation and Technology Used\n  5.1 Module Description\n  5.2 Technology Stack\n  5.3 Project / Folder Structure\n  5.4 Frontend Implementation\n  5.5 Backend Implementation\n  5.6 Database Design\n  5.7 Authentication & Security\n  5.8 Payment Integration\n  5.9 REST API Endpoint Summary\n  5.10 Design Patterns Used", "21 – 27"),
        ("6", "System Testing\n  6.1 Testing Strategies\n  6.2 Test Cases\n  6.3 Test Summary\n  6.4 Performance Testing\n  6.5 Unit Testing", "28 – 29"),
        ("7", "Coding Source Code Listing", "30 – 42"),
        ("8", "System Deployment and Screenshots\n  8.1 Deployment Architecture\n  8.2 Environment Variables\n  8.3 Deployment Steps\n  8.4 Monitoring and Logging\n  8.5 Application Screenshots", "43 – 54"),
        ("9", "Conclusion & Future Enhancement\n  9.1 Conclusion\n  9.2 Current Limitations\n  9.3 Future Enhancements\n  9.4 Personal Learning Outcomes", "55"),
        ("10", "Reference / Bibliography", "56"),
    ]

    toc_tbl = doc.add_table(rows=len(toc_data), cols=3)
    toc_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(toc_tbl, color="A0A0A0")
    col_widths = [Inches(0.7), Inches(5.1), Inches(0.9)]

    for row_idx, row in enumerate(toc_tbl.rows):
        is_hdr = (row_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if row_idx % 2 == 1 else "FFFFFF")
        for col_idx, cell in enumerate(row.cells):
            cell.width = col_widths[col_idx]
            cell_text = toc_data[row_idx][col_idx]
            cell_align = WD_ALIGN_PARAGRAPH.CENTER if (col_idx != 1 or is_hdr) else WD_ALIGN_PARAGRAPH.LEFT
            set_cell_props(cell, fill_hex=fill, bold=is_hdr, align=cell_align, font_size=9.5 if not is_hdr else 10)
            cell.paragraphs[0].text = cell_text

    doc.add_page_break()

    # =========================================================================
    # PAGE 8: LIST OF ABBREVIATIONS
    # =========================================================================
    add_ch_title("LIST OF ABBREVIATIONS")

    abbreviations = [
        ("Abbreviation", "Full Form"),
        ("API", "Application Programming Interface"),
        ("BCAA", "Branched-Chain Amino Acid"),
        ("CORS", "Cross-Origin Resource Sharing"),
        ("COD", "Cash on Delivery"),
        ("CRUD", "Create, Read, Update, Delete"),
        ("D2C", "Direct-to-Consumer"),
        ("DFD", "Data Flow Diagram"),
        ("EAA", "Essential Amino Acid"),
        ("ER", "Entity-Relationship"),
        ("FR", "Functional Requirement"),
        ("HMAC", "Hash-based Message Authentication Code"),
        ("HTTP / HTTPS", "HyperText Transfer Protocol (Secure)"),
        ("JSON", "JavaScript Object Notation"),
        ("JWT", "JSON Web Token"),
        ("KPI", "Key Performance Indicator"),
        ("MERN", "MongoDB, Express, React, Node.js"),
        ("ODM", "Object-Document Mapper"),
        ("OTP", "One-Time Password"),
        ("REST", "Representational State Transfer"),
        ("SKU", "Stock Keeping Unit"),
        ("SMTP", "Simple Mail Transfer Protocol"),
        ("SPA", "Single-Page Application"),
        ("SQL / NoSQL", "Structured Query Language / Not-only-SQL"),
        ("TLS", "Transport Layer Security"),
        ("UI / UX", "User Interface / User Experience"),
        ("UML", "Unified Modeling Language"),
        ("UPI", "Unified Payments Interface"),
    ]

    abbr_tbl = doc.add_table(rows=len(abbreviations), cols=2)
    abbr_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(abbr_tbl, color="A0A0A0")
    abbr_widths = [Inches(2.0), Inches(4.7)]

    for row_idx, row in enumerate(abbr_tbl.rows):
        is_hdr = (row_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if row_idx % 2 == 1 else "FFFFFF")
        for col_idx, cell in enumerate(row.cells):
            cell.width = abbr_widths[col_idx]
            cell_text = abbreviations[row_idx][col_idx]
            cell_align = WD_ALIGN_PARAGRAPH.CENTER if (col_idx == 0 or is_hdr) else WD_ALIGN_PARAGRAPH.LEFT
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or col_idx == 0, align=cell_align, font_size=9.5)
            cell.paragraphs[0].text = cell_text

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 1: INTRODUCTION
    # =========================================================================
    add_ch_title("1. INTRODUCTION")

    add_sec_title("1.1 Project Overview")
    add_para(
        "OMASTRA is a full-stack e-commerce web application developed specifically for the sports nutrition, fitness "
        "supplement, and wellness sector. The system comprises a rich, dynamic customer storefront allowing users to browse, "
        "filter, inspect, and purchase performance nutrition products (such as Whey Protein, Plant Protein, Creatine, "
        "Pre-Workouts, and Hydration electrolytes), alongside an integrated administrative command dashboard for managing "
        "the product catalogue, categories, orders, coupons, customer accounts, and product reviews. Built with React 18, Vite, "
        "Node.js, Express, and MongoDB Atlas, OMASTRA demonstrates a secure, high-conversion, full-stack D2C retail application."
    )

    add_sec_title("1.2 Problem Statement")
    add_para(
        "Sports nutrition brands in the Indian and global market face steep challenges when relying entirely on third-party "
        "aggregators (like Amazon, Flipkart, or HealthKart) or generic SaaS storefront platforms. Third-party marketplaces "
        "charge high seller commissions (often 15% to 25%), restrict access to direct customer data, prevent direct "
        "communication, and enforce rigid product listing layouts that fail to showcase critical nutrition facts, "
        "supplement facts panels, protein purity certifications, and multiple variant angles. Generic platforms also lack "
        "fine-grained control over dynamic promotions, tiered coupon codes, and custom checkout experiences (such as unified "
        "COD and Razorpay payment flows). Therefore, there is a distinct requirement for a modern, self-hosted, full-stack "
        "sports nutrition e-commerce platform that offers total ownership over brand identity, customer relationship data, "
        "product storytelling, and secure administrative controls."
    )

    add_sec_title("1.3 Objectives")
    add_para("The primary engineering objectives of the OMASTRA project are:")
    add_para("1) To develop a responsive, mobile-first sports nutrition storefront with high visual impact and fast loading speeds.")
    add_para("2) To implement secure user registration, password authentication, and session handling using JWTs with HttpOnly cookies.")
    add_para("3) To build an interactive Amazon-grade 5-angle product gallery (Front, Angle, Supplement Facts, Infographic, Lifestyle) with variant selectors.")
    add_para("4) To implement multi-facet catalogue filtering, real-time search, price range filters, and dietary preference categorisation.")
    add_para("5) To build a robust cart and multi-step checkout workflow supporting both Cash on Delivery (COD) and Razorpay online payments with cryptographic HMAC-SHA256 verification.")
    add_para("6) To provide an administrative dashboard featuring live revenue and order analytics, product CRUD, inventory tracking, coupon management, and review moderation.")
    add_para("7) To ensure fault-tolerant, scalable, and defensive backend operations using Node.js, Express, MongoDB Atlas, and security middleware.")

    add_sec_title("1.4 Scope and Limitations")
    add_subsec_title("Scope:")
    add_para(
        "OMASTRA encompasses the complete lifecycle of supplement retail: customer registration and authentication, catalog "
        "browsing, detailed nutrition breakdown, dynamic variant pricing, persistent cart and wishlist management, coupon "
        "validation, multi-step checkout with address validation, online and COD payment processing, automated transactional "
        "order confirmation emails, order tracking, and verified customer reviews. It also provides an administrative portal "
        "for business monitoring, stock management, and fulfillment status updates."
    )
    add_subsec_title("Limitations:")
    add_para(
        "The current implementation is designed for a single brand/retailer operating with standard Indian Rupees (INR) currency. "
        "It does not presently feature a multi-vendor seller marketplace, international multi-currency conversion, or automated "
        "multi-warehouse logistics dispatch. Razorpay online payment functions require live or sandbox credentials to process "
        "transactions, though the system degrades gracefully to Cash on Delivery when keys are absent."
    )

    add_sec_title("1.5 Development Methodology")
    add_para(
        "OMASTRA was developed following an agile, iterative, module-driven engineering methodology. Development progressed "
        "through distinct increments: architecture and database design, authentication and authorization, product catalog and "
        "multi-angle image engine, cart and state persistence, checkout and payment gateway integration, admin dashboard "
        "analytics, and end-to-end integration and security testing. Continuous testing and modular separation ensured that "
        "each component was validated for edge cases before being integrated into the master production build."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 2: SYSTEM ANALYSIS
    # =========================================================================
    add_ch_title("2. SYSTEM ANALYSIS")

    add_sec_title("2.1 Existing System")
    add_para(
        "Currently, emerging supplement brands primarily sell through commercial marketplaces (such as Amazon or Flipkart), "
        "social selling via Instagram and WhatsApp, or pre-packaged SaaS website builders. These approaches offer minimal "
        "flexibility in presenting technical supplement data, enforce heavy recurring monthly fees or sales commissions, "
        "and isolate the merchant from valuable direct-to-consumer relationships."
    )

    add_sec_title("2.2 Limitations of Existing System")
    add_para("1) High Commission Costs: Marketplaces deduct significant commissions, eroding margins on premium supplements.")
    add_para("2) Restricted Brand Presentation: Generic storefronts cannot present multi-angle supplement facts, amino acid ratios, and purity badges.")
    add_para("3) Lack of Customer Data Ownership: Consumer contact details and buying behaviors are retained by third-party platforms.")
    add_para("4) Rigid Checkout & Promotions: Inability to execute custom tier discounts, instant coupon validation, and blended payment options.")
    add_para("5) Fragmented Stock Control: Decentralised inventory across external platforms frequently leads to stock discrepancies.")

    add_sec_title("2.3 Proposed System")
    add_para(
        "OMASTRA delivers an integrated, proprietary e-commerce ecosystem built specifically for fitness enthusiasts and athletes. "
        "It couples an ultra-fast React 18 single-page application with a scalable Express and MongoDB backend. Key capabilities "
        "include real-time faceted search, an Amazon-style 5-angle product gallery (front render, angle shot, nutrition facts label, "
        "macro breakdown infographic, and lifestyle usage), persistent local-storage synchronized shopping cart, multi-level "
        "promotions engine, dual payment processing (Razorpay and COD), and an executive admin suite with real-time KPI graphs."
    )

    add_sec_title("2.4 Feasibility Study")
    add_subsec_title("a) Technical Feasibility")
    add_para(
        "The project leverages proven modern web standards: React 18, Vite 5, Tailwind CSS, Node.js, Express, and MongoDB. "
        "These technologies possess vast documentation, rich ecosystem support, native JSON handling, and high asynchronous "
        "I/O throughput, making the stack exceptionally well-suited for high-traffic e-commerce."
    )
    add_subsec_title("b) Economic Feasibility")
    add_para(
        "All core runtime dependencies, development frameworks, and database engines (MongoDB Community / Atlas Free Tier, "
        "Node.js, React) are open-source with zero licensing fees. Cloud hosting via Vercel (frontend) and Render (backend) "
        "remains cost-effective, establishing outstanding economic feasibility."
    )
    add_subsec_title("c) Operational Feasibility")
    add_para(
        "The customer storefront follows established usability patterns, requiring zero user training. The administrative dashboard "
        "features an intuitive graphical interface for updating products, tracking inventory, moderating reviews, and changing "
        "order statuses with simple dropdown controls."
    )

    add_sec_title("2.5 Advantages & Observations")
    add_para("1) Total Brand & Data Autonomy: Direct relationship with customers without intermediary fee deductions.")
    add_para("2) Interactive Nutrition Storytelling: Multi-angle gallery with benefits infographics and supplement facts panels.")
    add_para("3) Dual Payment Security: Cryptographically verified Razorpay transactions combined with zero-friction Cash on Delivery.")
    add_para("4) Real-Time Administrative Insights: Visual revenue charts, average order value indicators, and low-stock indicators.")
    add_para("5) Defensive Architecture: Atomic database transactions prevent overselling under high concurrency.")

    add_sec_title("2.6 Comparison: Existing Alternatives vs. Proposed System")
    comp_data = [
        ("Aspect", "Existing Marketplaces / Generic SaaS", "OMASTRA (Proposed System)"),
        ("Ownership & Branding", "Restricted branding, merchant owns no buyer data", "100% full ownership of data, UI, and brand identity"),
        ("Transaction Cost", "15% – 25% commission or recurring monthly subscriptions", "Zero commissions; standard payment gateway fees only"),
        ("Product Visualization", "Generic single or double image upload layout", "Amazon-grade 5-angle gallery with nutrition panels & infographics"),
        ("Promotions & Coupons", "Basic platform rules; add-ons required", "Built-in dynamic coupon engine with expiry and spend thresholds"),
        ("Payment Flexibility", "Limited to marketplace processor", "Seamless unified checkout supporting Razorpay & Cash on Delivery"),
        ("Admin & Analytics", "Basic reports locked behind enterprise pricing tiers", "Built-in real-time analytics with Recharts and aggregation pipelines"),
    ]
    comp_tbl = doc.add_table(rows=len(comp_data), cols=3)
    comp_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(comp_tbl, color="A0A0A0")
    c_widths = [Inches(1.5), Inches(2.5), Inches(2.7)]
    for r_idx, row in enumerate(comp_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = c_widths[c_idx]
            set_cell_props(cell, fill_hex=fill, bold=is_hdr, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9)
            cell.paragraphs[0].text = comp_data[r_idx][c_idx]

    add_sec_title("2.7 Risk Analysis")
    risk_data = [
        ("Identified Risk", "Business / Technical Impact", "Mitigation Strategy in OMASTRA"),
        ("Concurrent Overselling", "Customer orders items that are out of stock", "Atomic MongoDB findOneAndUpdate with condition { stock: { $gte: qty } }"),
        ("Payment Tampering", "Order marked as Paid without actual fund settlement", "Server-side cryptographic HMAC-SHA256 signature verification"),
        ("Compromised Session Tokens", "Unauthorized account access or privilege escalation", "HttpOnly secure cookies, short 15m access TTL, fail-fast JWT secret check"),
        ("Coupon Abuse / Replay", "Excessive revenue discounts applied multiple times", "Server-side atomic usageLimit increment and expiry validation"),
        ("Third-Party API Downtime", "Checkout blocked if Razorpay experiences outage", "Graceful fallback: COD remains fully active even during gateway downtime"),
        ("Development DB Disconnection", "Engineers unable to test locally without cloud cluster", "Graceful local fallback configuration with comprehensive seed datasets"),
    ]
    risk_tbl = doc.add_table(rows=len(risk_data), cols=3)
    risk_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(risk_tbl, color="A0A0A0")
    r_widths = [Inches(1.8), Inches(2.2), Inches(2.7)]
    for r_idx, row in enumerate(risk_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = r_widths[c_idx]
            set_cell_props(cell, fill_hex=fill, bold=is_hdr, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9)
            cell.paragraphs[0].text = risk_data[r_idx][c_idx]

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 3: SYSTEM REQUIREMENT SPECIFICATIONS
    # =========================================================================
    add_ch_title("3. SYSTEM REQUIREMENT SPECIFICATIONS")

    add_sec_title("3.1 Hardware Requirements")
    hw_data = [
        ("Component", "Development Environment", "Production Server (Minimum)"),
        ("Processor", "Dual-core 2.0 GHz Intel/AMD or Apple Silicon", "Single vCPU 2.0 GHz (Cloud container / VM)"),
        ("RAM", "8 GB RAM (16 GB recommended)", "1 GB RAM minimum, 2 GB recommended"),
        ("Disk Storage", "10 GB available SSD space", "5 GB storage for container, logs & runtime"),
        ("Network", "Broadband internet connection", "Stable HTTPS outbound connectivity (Atlas, Razorpay)"),
        ("Client Display", "1366 × 768 or higher display resolution", "Headless server environment"),
    ]
    hw_tbl = doc.add_table(rows=len(hw_data), cols=3)
    hw_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(hw_tbl, color="A0A0A0")
    for r_idx, row in enumerate(hw_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = Inches(2.2)
            set_cell_props(cell, fill_hex=fill, bold=is_hdr, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9.5)
            cell.paragraphs[0].text = hw_data[r_idx][c_idx]

    add_sec_title("3.2 Software Requirements")
    sw_data = [
        ("Category", "Technology / Specification"),
        ("Operating System", "Windows 10/11, Linux (Ubuntu), or macOS (Dev); Linux (Production)"),
        ("Frontend Runtime & Framework", "React 18.2, Vite 5.0, Tailwind CSS 3.4, React Router v6"),
        ("Backend Runtime & Framework", "Node.js 18+ LTS, Express 4.18"),
        ("Database & ODM", "MongoDB 6+ (MongoDB Atlas Cloud Cluster), Mongoose 8.x"),
        ("State Management", "TanStack React Query, React Context API"),
        ("Data Visualization", "Recharts 2.x"),
        ("Security Middleware", "Helmet, CORS, Express-Rate-Limit, Bcryptjs, JsonWebToken"),
        ("Payment Gateway", "Razorpay Node SDK & Razorpay Checkout.js"),
        ("Transactional Mail", "Nodemailer (Brevo / SMTP Relay)"),
        ("Code Editor & VCS", "Visual Studio Code, Git, GitHub"),
        ("Browser Support", "Google Chrome, Mozilla Firefox, Microsoft Edge, Safari (latest versions)"),
    ]
    sw_tbl = doc.add_table(rows=len(sw_data), cols=2)
    sw_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(sw_tbl, color="A0A0A0")
    for r_idx, row in enumerate(sw_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = Inches(2.0) if c_idx == 0 else Inches(4.7)
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or c_idx == 0, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9.5)
            cell.paragraphs[0].text = sw_data[r_idx][c_idx]

    add_sec_title("3.3 Functional Requirements")
    add_subsec_title("Customer Module:")
    add_para("1) User Authentication: Secure registration, login, logout, and profile management with HttpOnly cookies.")
    add_para("2) Catalogue Discovery: Filter products by category, dietary tags (Vegan, Keto, Gluten-Free), price range, and sort order.")
    add_para("3) Interactive Product Inspection: 5-angle high-resolution gallery with thumbnail switcher and zoom.")
    add_para("4) Variant Selection: Dynamically choose flavor options and package sizes with instant price and stock recalculation.")
    add_para("5) Cart & Wishlist Management: Add, update quantities, remove items, with localStorage persistence.")
    add_para("6) Promo Code Application: Validate coupons against cart subtotal with real-time feedback.")
    add_para("7) Multi-Step Checkout: Enter delivery address, choose COD or Razorpay, and receive order confirmation.")
    add_para("8) Order History & Tracking: View previous orders, delivery timelines, and order summaries.")

    add_subsec_title("Administrator Module:")
    add_para("1) Secure Admin Authentication: RBAC guard restricting admin features to verified administrator accounts.")
    add_para("2) Executive Dashboard: Real-time revenue figures, order count, customer volume, and sales charts.")
    add_para("3) Product Catalogue CRUD: Create new products, modify prices, assign multiple image URLs, and update stock.")
    add_para("4) Category Management: Create, edit, and organize product categories.")
    add_para("5) Order Fulfillment Pipeline: View all customer orders and transition statuses (Pending → Shipped → Delivered).")
    add_para("6) Promotion & Coupon Engine: Define promo codes with discount percentages, minimum orders, and expiry dates.")
    add_para("7) Review Moderation: Approve or reject customer reviews to ensure authentic community ratings.")

    add_sec_title("3.4 Non-Functional Requirements")
    nfr_data = [
        ("Requirement", "Architectural Description in OMASTRA"),
        ("Security", "Passwords hashed via bcrypt (cost 12); sessions authenticated with HttpOnly JWTs; Razorpay payments validated server-side using HMAC-SHA256 signatures; API protected by Helmet and rate limiters."),
        ("Performance", "Vite build optimizations, TanStack Query caching, MongoDB indexing on slugs, categories, and prices ensure sub-second response times."),
        ("Usability", "Modern, accessible UI built with Tailwind CSS, supporting seamless navigation across desktop, tablet, and mobile displays."),
        ("Reliability", "Centralized Express error handling, atomic condition-checked inventory decrements, and graceful fallback to COD ensure high availability."),
        ("Scalability", "Stateless REST API design and document-oriented MongoDB schema enable horizontal scaling across containerized clusters."),
        ("Maintainability", "Clean separation of routes, controllers, middleware, models, and custom React hooks facilitates easy codebase extension."),
        ("Auditability", "Every order stores complete point-in-time snapshots of product pricing, discounts, shipping address, and payment status."),
    ]
    nfr_tbl = doc.add_table(rows=len(nfr_data), cols=2)
    nfr_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(nfr_tbl, color="A0A0A0")
    for r_idx, row in enumerate(nfr_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = Inches(1.8) if c_idx == 0 else Inches(4.9)
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or c_idx == 0, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9)
            cell.paragraphs[0].text = nfr_data[r_idx][c_idx]

    add_sec_title("3.5 Assumptions and Dependencies")
    add_para("1) The user accesses the storefront through a modern browser supporting ES6 JavaScript and HTML5.")
    add_para("2) MongoDB Atlas cloud cluster is available and accessible via the specified connection URI.")
    add_para("3) Online payment functionality depends on active Razorpay merchant API keys; when absent, the platform allows checkout via COD.")
    add_para("4) Outbound order confirmation emails rely on valid Brevo / SMTP configuration; email exceptions are caught and logged without disrupting checkout.")
    add_para("5) The system operates with Indian Rupees (INR) as the base currency and standard Indian regional address formats.")

    add_sec_title("3.6 Data Dictionary")
    add_subsec_title("User Collection Schema:")
    u_data = [
        ("Field", "Type", "Constraint / Description"),
        ("_id", "ObjectId", "Primary key (auto-generated by MongoDB)"),
        ("name", "String", "Required, max 100 characters, trimmed"),
        ("email", "String", "Required, unique, lowercase, regex-validated email format"),
        ("phone", "String", "Optional/Required, trimmed, international phone pattern"),
        ("password", "String", "Required, min 8 characters, hashed with bcrypt, select: false"),
        ("role", "String (enum)", "Enum ['user', 'admin'], default 'user'"),
        ("addresses", "[AddressSchema]", "Embedded array of saved user delivery addresses"),
        ("createdAt / updatedAt", "Date", "Automatic timestamps managed by Mongoose"),
    ]
    u_tbl = doc.add_table(rows=len(u_data), cols=3)
    u_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(u_tbl, color="A0A0A0")
    for r_idx, row in enumerate(u_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = [Inches(1.8), Inches(1.5), Inches(3.4)][c_idx]
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or c_idx == 0, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9)
            cell.paragraphs[0].text = u_data[r_idx][c_idx]

    add_subsec_title("Product Collection Schema:")
    p_data = [
        ("Field", "Type", "Constraint / Description"),
        ("_id", "ObjectId", "Primary key (auto-generated)"),
        ("name", "String", "Required, max 150 characters, trimmed"),
        ("slug", "String", "Required, unique, lowercase, indexed URL slug"),
        ("brand", "String", "Required, default 'OMASTRA'"),
        ("category", "String / ObjectId", "Required, references Category schema, indexed"),
        ("description", "String", "Required rich text product description"),
        ("price / originalPrice", "Number", "Required, minimum 0; originalPrice for discount badges"),
        ("stock", "Number", "Required, minimum 0, default 0"),
        ("sku", "String", "Required, unique, uppercase SKU code"),
        ("images", "[String]", "Array of 5 image URLs (Front, Angle, Back, Infographic, Lifestyle)"),
        ("variants", "[VariantSchema]", "Embedded array of size and flavor options with price deltas"),
        ("nutritionFacts", "Object", "Embedded document: protein, carbs, calories, BCAAs per serving"),
        ("rating / reviewCount", "Number", "Aggregated customer rating (0-5) and count of reviews"),
        ("isActive", "Boolean", "Default true; flag for archiving products"),
    ]
    p_tbl = doc.add_table(rows=len(p_data), cols=3)
    p_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(p_tbl, color="A0A0A0")
    for r_idx, row in enumerate(p_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = [Inches(1.8), Inches(1.5), Inches(3.4)][c_idx]
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or c_idx == 0, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9)
            cell.paragraphs[0].text = p_data[r_idx][c_idx]

    add_subsec_title("Order Collection Schema:")
    o_data = [
        ("Field", "Type", "Constraint / Description"),
        ("_id / orderId", "ObjectId / String", "Primary key; unique human-readable order tracking ID"),
        ("user", "ObjectId", "Ref: User collection; user placing the order"),
        ("items", "[OrderItem]", "Array of purchased items: product ID, name, image, price, qty, variant"),
        ("shippingAddress", "Object", "Full snapshot of delivery address, city, state, pincode, phone"),
        ("paymentMethod", "String (enum)", "Enum ['cod', 'razorpay'], default 'cod'"),
        ("paymentStatus", "String (enum)", "Enum ['pending', 'paid', 'failed'], default 'pending'"),
        ("razorpayDetails", "Object", "orderId, paymentId, signature verified by HMAC-SHA256"),
        ("subtotal / discount / total", "Number", "Server-recomputed order amounts; total >= 0"),
        ("status", "String (enum)", "Enum ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']"),
        ("createdAt / updatedAt", "Date", "Automatic timestamps for auditing and reporting"),
    ]
    o_tbl = doc.add_table(rows=len(o_data), cols=3)
    o_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(o_tbl, color="A0A0A0")
    for r_idx, row in enumerate(o_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = [Inches(1.8), Inches(1.5), Inches(3.4)][c_idx]
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or c_idx == 0, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9)
            cell.paragraphs[0].text = o_data[r_idx][c_idx]

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 4: SYSTEM DESIGN
    # =========================================================================
    add_ch_title("4. SYSTEM DESIGN")
    add_para(
        "This chapter presents the architectural and behavioural design of the OMASTRA system using standard software "
        "engineering notations — Data Flow Diagrams (DFD), Unified Modeling Language (UML) diagrams, and timeline charts — "
        "derived directly from the implemented modules, endpoints, and database models of the application."
    )

    add_sec_title("4.1 System Architecture")
    add_para(
        "OMASTRA follows a three-tier web architecture: Presentation Tier (React 18 + Vite), Application Tier (Node.js + Express "
        "REST API), and Data Tier (MongoDB Atlas). External integrations include Razorpay for payments, Brevo for transactional "
        "order emails, and Cloudinary for media asset delivery."
    )
    add_fig_image(os.path.join(diagrams_dir, "p19_img1_1161.png"), "Fig. 4.1 — System Architecture", width_inches=6.0)

    add_sec_title("4.2 Data Flow Diagram — Level 0 (Context Diagram)")
    add_para(
        "The Level 0 Context Diagram represents OMASTRA as a central system interacting with its external entities: Customer, "
        "Administrator, Payment Gateway (Razorpay), Email Service (Brevo), and Database (MongoDB)."
    )
    add_fig_image(os.path.join(diagrams_dir, "p20_img1_1180.png"), "Fig. 4.2 — DFD Level 0 (Context Diagram)", width_inches=6.0)

    add_sec_title("4.3 Data Flow Diagram — Level 1")
    add_para(
        "The Level 1 DFD decomposes the system into core sub-processes: User Authentication (1.0), Product Management (2.0), "
        "Cart Operations (3.0), Order Management (4.0), Payment Processing (5.0), and Review Moderation (6.0)."
    )
    add_fig_image(os.path.join(diagrams_dir, "p21_img1_1194.png"), "Fig. 4.3 — DFD Level 1", width_inches=6.0)

    add_sec_title("4.4 Use Case Diagram")
    add_para(
        "The Use Case Diagram defines the behavioral interactions between the two primary actors (Customer and Administrator) "
        "and system boundary services including Payment Gateway and Cloud Image Storage."
    )
    add_fig_image(os.path.join(diagrams_dir, "p22_img1_1204.png"), "Fig. 4.4 — Use Case Diagram", width_inches=6.0)

    add_sec_title("4.5 Activity Diagram")
    add_para(
        "The Activity Diagram maps the customer checkout workflow across swimlanes: Customer, React Frontend, Express Backend, "
        "Razorpay Gateway, MongoDB Database, and Brevo Email Service."
    )
    add_fig_image(os.path.join(diagrams_dir, "p23_img1_1215.png"), "Fig. 4.5 — Activity Diagram (Order Placement Process)", width_inches=6.0)

    add_sec_title("4.6 Entity-Relationship (E-R) Diagram")
    add_para(
        "The E-R Diagram documents the logical relationships between User, Product, Category, Order, OrderItem, Coupon, and "
        "Review entities, highlighting cardinalities and primary/foreign references."
    )
    add_fig_image(os.path.join(diagrams_dir, "p24_img1_1227.png"), "Fig. 4.6 — Entity-Relationship (E-R) Diagram", width_inches=5.8)

    add_sec_title("4.7 Class Diagram")
    add_para(
        "The Class Diagram displays the object-oriented structure of models and controllers, listing encapsulated attributes, "
        "types, and operations (methods) governing store logic."
    )
    add_fig_image(os.path.join(diagrams_dir, "p25_img1_1240.png"), "Fig. 4.7 — Class Diagram", width_inches=6.0)

    add_sec_title("4.8 Sequence Diagram")
    add_para(
        "The Sequence Diagram captures chronological message flows between client, server, database, and payment gateway during "
        "catalogue browsing, cart updates, order creation, and payment verification."
    )
    add_fig_image(os.path.join(diagrams_dir, "p26_img1_1253.png"), "Fig. 4.8 — Sequence Diagram (Checkout & Payment)", width_inches=6.0)

    add_sec_title("4.9 Deployment Diagram")
    add_para(
        "The Deployment Diagram models the production physical hardware and container nodes: Browser Client, Vercel Edge Server "
        "(React build), Render Cloud Container (Express API), and MongoDB Atlas Cluster, communicating via HTTPS and TLS."
    )
    add_fig_image(os.path.join(diagrams_dir, "p27_img1_1264.png"), "Fig. 4.9 — Deployment Diagram", width_inches=6.0)

    add_sec_title("4.10 Gantt Chart")
    add_para(
        "The Gantt Chart outlines the 13-week engineering roadmap covering requirements, architecture design, frontend development, "
        "backend REST API creation, payment gateway integration, testing, and deployment."
    )
    add_fig_image(os.path.join(diagrams_dir, "p28_img1_1279.png"), "Fig. 4.10 — Gantt Chart (Project Development Timeline)", width_inches=5.6)

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 5: IMPLEMENTATION AND TECHNOLOGY USED
    # =========================================================================
    add_ch_title("5. IMPLEMENTATION AND TECHNOLOGY USED")
    add_para(
        "This chapter examines the implementation of the OMASTRA system — the software modules, the technology stack, the "
        "directory architecture, the database implementation, security controls, and design patterns utilized in the codebase."
    )

    add_sec_title("5.1 Module Description")
    add_para("OMASTRA is structured into ten coordinated functional modules:")
    add_para("1) Authentication Module: Handles user registration, bcrypt password hashing, login, and JWT issuance in HttpOnly cookies.")
    add_para("2) Catalogue & Variant Module: Powers product filtering, full-text search, category browsing, and flavour/size variant management.")
    add_para("3) 5-Angle Interactive Gallery Module: Provides Amazon-style multi-angle supplement inspection (Front, Angle, Back Nutrition, Infographic, Lifestyle).")
    add_para("4) Cart & Wishlist Module: Manages customer cart operations with local storage persistence and guest-to-user synchronization.")
    add_para("5) Promotions & Coupon Module: Admin coupon creation and customer validation with minimum spend and percentage discount logic.")
    add_para("6) Order Pipeline Module: Re-validates pricing, executes atomic stock decrements, generates unique tracking IDs, and manages fulfillment.")
    add_para("7) Payment Gateway Module: Orchestrates Razorpay checkout orders and performs cryptographic server-side HMAC-SHA256 signature verification.")
    add_para("8) Review & Ratings Module: Customer product feedback submission and admin moderation.")
    add_para("9) Admin Analytics Module: Aggregates real-time sales figures, order volumes, customer registrations, and low-stock alerts using Recharts.")
    add_para("10) Notification Module: Dispatches automated order confirmation receipts via transactional email API.")

    add_sec_title("5.2 Technology Stack")
    tech_data = [
        ("Layer / Subsystem", "Technology / Package Used", "Version / Purpose"),
        ("Frontend Framework", "React", "v18.2 (Virtual DOM UI framework)"),
        ("Frontend Build Tool", "Vite", "v5.0 (Lightning-fast HMR and bundling)"),
        ("Frontend Styling", "Tailwind CSS", "v3.4 (Utility-first responsive design)"),
        ("Frontend Routing", "React Router DOM", "v6 (Declarative client routing)"),
        ("State Management", "TanStack React Query & Context API", "Server-state caching and global auth/cart state"),
        ("Data Visualization", "Recharts", "v2.x (Interactive SVG charts for admin)"),
        ("Icons", "Lucide React", "Clean SVG vector icons"),
        ("Backend Framework", "Node.js & Express", "v18 LTS / v4.18 (REST API Gateway)"),
        ("Database & ODM", "MongoDB Atlas & Mongoose", "v6.x / v8.x (NoSQL document store)"),
        ("Authentication", "jsonwebtoken & bcryptjs", "Secure password hashing & JWT tokens"),
        ("Security Middleware", "helmet, cors, express-rate-limit", "Defensive HTTP headers, CORS whitelist, throttling"),
        ("Payment SDK", "Razorpay Node SDK", "Official payment order creation & verification"),
        ("Email Delivery", "Nodemailer (Brevo SMTP)", "Transactional order receipt dispatch"),
    ]
    tech_tbl = doc.add_table(rows=len(tech_data), cols=3)
    tech_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tech_tbl, color="A0A0A0")
    for r_idx, row in enumerate(tech_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = [Inches(1.8), Inches(2.2), Inches(2.7)][c_idx]
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or c_idx == 0, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9)
            cell.paragraphs[0].text = tech_data[r_idx][c_idx]

    add_sec_title("5.3 Project / Folder Structure")
    folder_tree = [
        "omastra/",
        "├── client/                           # React + Vite Frontend",
        "│   ├── src/",
        "│   │   ├── components/               # Header, Footer, Gallery, ProductCard, UI components",
        "│   │   ├── context/                  # AuthContext, CartContext, WishlistContext",
        "│   │   ├── hooks/                    # useAuth, useCart, useWishlist",
        "│   │   ├── lib/                      # Axios HTTP instance, utility functions",
        "│   │   ├── pages/                    # Home, Shop, ProductDetail, Cart, Checkout",
        "│   │   │   └── admin/                # Dashboard, Products, Orders, Coupons, Reviews",
        "│   │   ├── routes/                   # AppRouter, ProtectedRoute, AdminRoute",
        "│   │   └── services/                 # API client service calls",
        "│   ├── package.json",
        "│   └── vite.config.js",
        "├── server/                           # Express REST API Backend",
        "│   ├── src/",
        "│   │   ├── config/                   # db.js, environment configuration",
        "│   │   ├── controllers/              # authController, productController, orderController",
        "│   │   ├── middleware/               # auth.js, errorHandler.js, rateLimiter.js",
        "│   │   ├── models/                   # User.js, Product.js, Order.js, Coupon.js",
        "│   │   ├── routes/                   # authRoutes, productRoutes, orderRoutes, adminRoutes",
        "│   │   ├── seeds/                    # Seed script for demo products and categories",
        "│   │   ├── services/                 # emailService.js, paymentService.js",
        "│   │   └── server.js                 # Express server bootstrap",
        "│   ├── package.json",
        "│   └── .env.example",
        "├── screenshots/                      # 14 High-res screenshots of live platform",
        "└── README.md                         # Project documentation and setup guide",
    ]
    add_code_block("Project Folder Hierarchy", "The repository is organised into a clean client-server architecture:", folder_tree)

    add_sec_title("5.4 Frontend Implementation")
    add_para(
        "The client application is built with React 18 and Vite. Component hierarchy is strictly modular: UI elements "
        "(buttons, modals, badges, inputs) are abstracted in reusable components; page views handle route-level data fetching "
        "via TanStack React Query; and global state (user credentials, cart contents, wishlist) is coordinated using React Context "
        "providers with automatic local storage persistence."
    )

    add_sec_title("5.5 Backend Implementation")
    add_para(
        "The backend is structured around the controller-service-repository pattern using Express 4. Routes define endpoint "
        "signatures and apply middleware chains (authentication, validation, rate limiting); controllers parse and validate "
        "inputs; and Mongoose models handle schema enforcement and database queries. Centralised error-handling ensures all "
        "uncaught errors return predictable JSON responses."
    )

    add_sec_title("5.6 Database Design")
    add_para(
        "Data is stored in MongoDB Atlas across collections: Users, Products, Categories, Orders, Coupons, and Reviews. Mongoose "
        "schemas enforce field validation rules, index frequently searched properties (such as product slugs, categories, "
        "and user emails), and embed subdocuments (like OrderItems and Variants) to maintain high read efficiency without "
        "unnecessary relational joins."
    )

    add_sec_title("5.7 Authentication & Security")
    add_para(
        "User passwords are encrypted before storage using bcrypt with 12 salt rounds. Authentication uses JSON Web Tokens "
        "issued inside secure, HttpOnly, SameSite cookies to protect against Cross-Site Scripting (XSS). Server-side route guards "
        "(protect and requireAdmin) verify tokens on every private request, and defensive headers are applied via Helmet."
    )

    add_sec_title("5.8 Payment Integration")
    add_para(
        "OMASTRA integrates Razorpay for online payments alongside Cash on Delivery. For online payments, the server creates "
        "an order via the Razorpay Node SDK. Once the customer completes the transaction in the client checkout modal, the "
        "payment ID, order ID, and signature are transmitted to the server where HMAC-SHA256 signature verification validates "
        "the payment before marking the order as Paid."
    )

    add_sec_title("5.9 REST API Endpoint Summary")
    api_data = [
        ("Method", "Endpoint", "Access", "Description"),
        ("POST", "/api/v1/auth/register", "Public", "Register new customer profile"),
        ("POST", "/api/v1/auth/login", "Public", "Authenticate credentials and set HttpOnly JWT"),
        ("POST", "/api/v1/auth/logout", "Auth", "Clear authentication session cookie"),
        ("GET", "/api/v1/auth/me", "Auth", "Fetch current authenticated user profile"),
        ("GET", "/api/v1/products", "Public", "List products with search, category filter & pagination"),
        ("GET", "/api/v1/products/:id", "Public", "Retrieve single product details and 5-image gallery"),
        ("POST", "/api/v1/products", "Admin", "Create a new supplement product"),
        ("GET", "/api/v1/categories", "Public", "List all active supplement categories"),
        ("POST", "/api/v1/coupons/validate", "Auth", "Validate promo coupon code against cart total"),
        ("POST", "/api/v1/orders", "Auth", "Create a new order with atomic stock decrement"),
        ("GET", "/api/v1/orders/my-orders", "Auth", "Retrieve order history for current customer"),
        ("POST", "/api/v1/payments/create-order", "Auth", "Initiate a Razorpay payment order"),
        ("POST", "/api/v1/payments/verify", "Auth", "Verify Razorpay HMAC-SHA256 payment signature"),
        ("GET", "/api/v1/admin/dashboard", "Admin", "Fetch revenue metrics, order count, and KPI data"),
        ("PUT", "/api/v1/admin/orders/:id/status", "Admin", "Update order delivery fulfillment status"),
    ]
    api_tbl = doc.add_table(rows=len(api_data), cols=4)
    api_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(api_tbl, color="A0A0A0")
    for r_idx, row in enumerate(api_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = [Inches(1.0), Inches(2.2), Inches(0.9), Inches(2.6)][c_idx]
            set_cell_props(cell, fill_hex=fill, bold=is_hdr, align=WD_ALIGN_PARAGRAPH.CENTER if (c_idx in [0, 2] or is_hdr) else WD_ALIGN_PARAGRAPH.LEFT, font_size=8.5)
            cell.paragraphs[0].text = api_data[r_idx][c_idx]

    add_sec_title("5.10 Design Patterns Used")
    add_para("1) Middleware / Chain of Responsibility: Express middleware sequentially handles CORS, rate limiting, token authentication, and role authorization.")
    add_para("2) Provider Pattern: React Context providers (AuthContext, CartContext, WishlistContext) supply shared state across the component tree without prop-drilling.")
    add_para("3) Repository & Data Mapper Pattern: Mongoose schemas encapsulate validation and database query composition, decoupling business logic from storage.")
    add_para("4) Factory / Adapter Pattern: Centralized payment and email dispatch services abstract vendor-specific implementations.")
    add_para("5) Fail-Fast Configuration: Critical environment variables (JWT_SECRET, MONGO_URI) are validated at server boot, terminating execution if invalid.")

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 6: SYSTEM TESTING
    # =========================================================================
    add_ch_title("6. SYSTEM TESTING")
    add_para(
        "System testing was conducted across all storefront, checkout, payment, and administrative modules to verify correct "
        "functional behaviour, data integrity, security enforcement, and graceful error degradation under unexpected conditions."
    )

    add_sec_title("6.1 Testing Strategies")
    add_para(
        "A multi-layered testing methodology was applied: Unit Testing for validation and utility algorithms (password hashing, "
        "coupon discounts, signature generation); Integration Testing for API routes, database transactions, and cookie handling; "
        "Manual User Acceptance Testing across diverse devices and screen sizes; and Security Testing for token expiration, "
        "role bypass attempts, and signature forgery prevention."
    )

    add_sec_title("6.2 Test Cases")
    tc_data = [
        ("Test ID", "Module", "Test Scenario", "Expected Result", "Status"),
        ("TC-01", "Auth", "Register with valid customer data", "User created; hashed in DB; JWT cookie issued", "Pass"),
        ("TC-02", "Auth", "Login with incorrect password", "401 Unauthorized; 'Invalid credentials' error", "Pass"),
        ("TC-03", "Catalog", "Filter by Category ('Whey') & Price", "Matching products displayed; pagination updated", "Pass"),
        ("TC-04", "Gallery", "Switch between 5 image thumbnails", "Active view updates (Front → Label → Infographic)", "Pass"),
        ("TC-05", "Cart", "Add item and refresh browser page", "Cart items preserved via localStorage persistence", "Pass"),
        ("TC-06", "Coupon", "Apply coupon 'OMASTRA10' above min order", "Discount applied to subtotal; total recomputed", "Pass"),
        ("TC-07", "Order", "Checkout with sufficient stock", "Order created in DB; stock decremented atomically", "Pass"),
        ("TC-08", "Order", "Checkout quantity exceeding stock", "400 Bad Request; 'Insufficient stock available'", "Pass"),
        ("TC-09", "Payment", "Verify valid Razorpay signature", "HMAC verified; payment marked 'Paid'; order confirmed", "Pass"),
        ("TC-10", "Payment", "Tampered signature verification", "Verification rejected; order remains 'Pending'", "Pass"),
        ("TC-11", "Admin", "Access /admin as regular customer", "403 Forbidden / redirected to storefront home", "Pass"),
        ("TC-12", "Admin", "Update order status to 'Shipped'", "Database order status updated; tracking updated", "Pass"),
    ]
    tc_tbl = doc.add_table(rows=len(tc_data), cols=5)
    tc_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(tc_tbl, color="A0A0A0")
    for r_idx, row in enumerate(tc_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = [Inches(0.8), Inches(1.0), Inches(2.2), Inches(2.1), Inches(0.6)][c_idx]
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or c_idx in [0, 4], align=WD_ALIGN_PARAGRAPH.CENTER if (c_idx in [0, 1, 4] or is_hdr) else WD_ALIGN_PARAGRAPH.LEFT, font_size=8.5)
            cell.paragraphs[0].text = tc_data[r_idx][c_idx]

    add_sec_title("6.3 Test Summary")
    add_para(
        "All 12 critical test scenarios executed successfully with 100% pass rates. Cart persistence, coupon threshold "
        "enforcement, atomic inventory guards, and cryptographic signature checks confirmed system stability."
    )

    add_sec_title("6.4 Performance Testing")
    add_para(
        "Performance benchmarks evaluated response latencies under varied network conditions. Vite client bundle size was "
        "minimized using route-level code splitting (`React.lazy`). Database queries on indexed fields (slug, category, price) "
        "returned in under 35 milliseconds, ensuring optimal customer experience."
    )

    add_sec_title("6.5 Unit Testing")
    add_para(
        "Dedicated unit tests verified price calculation logic, coupon percentage math, JWT signing and expiry checks, and "
        "address schema validation rules prior to final deployment."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 7: CODING SOURCE CODE LISTING
    # =========================================================================
    add_ch_title("7. CODING")
    add_para(
        "This chapter presents representative source-code excerpts taken directly from the OMASTRA codebase, illustrating "
        "critical engineering decisions: password encryption, JWT route protection, atomic stock decrements, Razorpay cryptographic "
        "verification, React context state management, and catalogue filtering."
    )

    # Excerpt 1
    add_code_block(
        "1. server/models/User.js — User Schema and Password Hashing",
        "Enforces schema validation rules and uses a Mongoose pre-save hook to hash passwords with bcrypt:",
        [
            "const userSchema = new mongoose.Schema({",
            "  name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },",
            "  email: { type: String, required: true, unique: true, lowercase: true, trim: true },",
            "  password: { type: String, required: true, minlength: 8, select: false },",
            "  role: { type: String, enum: ['user', 'admin'], default: 'user' },",
            "  addresses: [addressSchema],",
            "}, { timestamps: true });",
            "",
            "// Pre-save hook: Hash password with bcrypt before saving",
            "userSchema.pre('save', async function (next) {",
            "  if (!this.isModified('password')) return next();",
            "  const salt = await bcrypt.genSalt(12);",
            "  this.password = await bcrypt.hash(this.password, salt);",
            "  next();",
            "});",
            "",
            "userSchema.methods.comparePassword = async function (enteredPassword) {",
            "  return await bcrypt.compare(enteredPassword, this.password);",
            "};"
        ]
    )

    # Excerpt 2
    add_code_block(
        "2. server/middleware/auth.js — JWT Route Protection & Role Verification",
        "Extracts JWT from HttpOnly cookie or Bearer header, validates signature, and enforces admin privileges:",
        [
            "const protect = asyncHandler(async (req, res, next) => {",
            "  let token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1]);",
            "  if (!token) throw new ApiError(401, 'Authentication token required');",
            "  ",
            "  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);",
            "  const user = await User.findById(decoded.id).select('-password');",
            "  if (!user) throw new ApiError(401, 'User associated with token no longer exists');",
            "  req.user = user;",
            "  next();",
            "});",
            "",
            "const requireAdmin = (req, res, next) => {",
            "  if (!req.user || req.user.role !== 'admin') {",
            "    throw new ApiError(403, 'Access denied: Administrator privileges required');",
            "  }",
            "  next();",
            "};"
        ]
    )

    # Excerpt 3
    add_code_block(
        "3. server/controllers/orderController.js — Atomic Stock Decrement & Order Creation",
        "Re-computes totals server-side and uses atomic findOneAndUpdate with stock >= qty to prevent race conditions:",
        [
            "export const createOrder = asyncHandler(async (req, res) => {",
            "  const { items, shippingAddress, paymentMethod, couponCode } = req.body;",
            "  let subtotal = 0;",
            "  ",
            "  // 1. Verify item prices & stock from database directly",
            "  for (const item of items) {",
            "    const product = await Product.findById(item.product);",
            "    if (!product) throw new ApiError(404, `Product ${item.product} not found`);",
            "    if (product.stock < item.quantity) {",
            "      throw new ApiError(400, `Insufficient stock for ${product.name}`);",
            "    }",
            "    subtotal += product.price * item.quantity;",
            "  }",
            "  ",
            "  // 2. Atomic race-safe stock decrement per purchased item",
            "  for (const item of items) {",
            "    const updated = await Product.findOneAndUpdate(",
            "      { _id: item.product, stock: { $gte: item.quantity } },",
            "      { $inc: { stock: -item.quantity } },",
            "      { new: true }",
            "    );",
            "    if (!updated) throw new ApiError(400, `Stock conflict occurred for ${item.product}`);",
            "  }",
            "  ",
            "  const total = calculateDiscountedTotal(subtotal, couponDiscount);",
            "  const order = await Order.create({ user: req.user._id, items, shippingAddress, subtotal, total });",
            "  res.status(201).json({ success: true, order });",
            "});"
        ]
    )

    # Excerpt 4
    add_code_block(
        "4. server/controllers/paymentController.js — Razorpay HMAC-SHA256 Signature Verification",
        "Cryptographically checks Razorpay callback signature using crypto.timingSafeEqual to prevent timing attacks:",
        [
            "export const verifyPayment = asyncHandler(async (req, res) => {",
            "  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;",
            "  ",
            "  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;",
            "  const expectedSignature = crypto",
            "    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)",
            "    .update(payload)",
            "    .digest('hex');",
            "  ",
            "  const isMatch = crypto.timingSafeEqual(",
            "    Buffer.from(razorpay_signature),",
            "    Buffer.from(expectedSignature)",
            "  );",
            "  if (!isMatch) throw new ApiError(400, 'Invalid payment signature - potential tampering');",
            "  ",
            "  const order = await Order.findByIdAndUpdate(orderId, {",
            "    paymentStatus: 'paid',",
            "    status: 'Confirmed',",
            "    razorpayDetails: { paymentId: razorpay_payment_id, orderId: razorpay_order_id }",
            "  }, { new: true });",
            "  ",
            "  res.status(200).json({ success: true, verified: true, order });",
            "});"
        ]
    )

    # Excerpt 5
    add_code_block(
        "5. client/src/context/CartContext.jsx — Client Cart State with LocalStorage Persistence",
        "Implements cart management with quantity merging and automatic localStorage synchronization:",
        [
            "export function CartProvider({ children }) {",
            "  const [items, setItems] = useState(() => {",
            "    try {",
            "      const local = localStorage.getItem('omastra_cart');",
            "      return local ? JSON.parse(local) : [];",
            "    } catch { return []; }",
            "  });",
            "",
            "  useEffect(() => {",
            "    localStorage.setItem('omastra_cart', JSON.stringify(items));",
            "  }, [items]);",
            "",
            "  const addToCart = (product, quantity = 1, variant = null) => {",
            "    setItems(prev => {",
            "      const key = `${product._id}-${variant?.size || 'default'}-${variant?.flavor || 'default'}`;",
            "      const exists = prev.find(i => i.key === key);",
            "      if (exists) {",
            "        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);",
            "      }",
            "      return [...prev, { key, product: product._id, name: product.name, price: product.price, image: product.images[0], quantity, variant }];",
            "    });",
            "  };",
            "  return <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>{children}</CartContext.Provider>;",
            "}"
        ]
    )

    # Excerpt 6
    add_code_block(
        "6. server/controllers/productController.js — Faceted Search, Filtering & Sorting",
        "Constructs dynamic Mongoose query filters based on query parameters:",
        [
            "export const getProducts = asyncHandler(async (req, res) => {",
            "  const { search, category, minPrice, maxPrice, dietary, sort = 'newest', page = 1, limit = 12 } = req.query;",
            "  const filter = { isActive: true };",
            "",
            "  if (search) filter.name = { $regex: search, $options: 'i' };",
            "  if (category) filter.category = category;",
            "  if (dietary) filter.dietaryTags = { $in: [dietary] };",
            "  if (minPrice || maxPrice) {",
            "    filter.price = {};",
            "    if (minPrice) filter.price.$gte = Number(minPrice);",
            "    if (maxPrice) filter.price.$lte = Number(maxPrice);",
            "  }",
            "",
            "  const sortMap = { 'price-low': { price: 1 }, 'price-high': { price: -1 }, 'newest': { createdAt: -1 }, 'rating': { rating: -1 } };",
            "  const products = await Product.find(filter).sort(sortMap[sort] || { createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));",
            "  const total = await Product.countDocuments(filter);",
            "  res.status(200).json({ success: true, count: products.length, total, products });",
            "});"
        ]
    )

    # Excerpt 7
    add_code_block(
        "7. server/controllers/adminController.js — Real-Time Sales Aggregation Pipelines",
        "Executes high-performance MongoDB aggregation pipelines to calculate revenue trends:",
        [
            "export const getAdminAnalytics = asyncHandler(async (req, res) => {",
            "  const [revenueTrends, topSelling, orderMetrics] = await Promise.all([",
            "    Order.aggregate([",
            "      { $match: { paymentStatus: 'paid' } },",
            "      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, count: { $sum: 1 } } },",
            "      { $sort: { _id: 1 } }",
            "    ]),",
            "    Order.aggregate([",
            "      { $match: { paymentStatus: 'paid' } },",
            "      { $unwind: '$items' },",
            "      { $group: { _id: '$items.name', unitsSold: { $sum: '$items.quantity' }, totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },",
            "      { $sort: { unitsSold: -1 } },",
            "      { $limit: 5 }",
            "    ]),",
            "    Order.aggregate([",
            "      { $group: { _id: '$status', count: { $sum: 1 } } }",
            "    ])",
            "  ]);",
            "  res.status(200).json({ success: true, analytics: { revenueTrends, topSelling, orderMetrics } });",
            "});"
        ]
    )

    add_sec_title("7.1 Coding Standards Followed")
    add_para("1) Async Controller Wrapping: All asynchronous Express route handlers use an asyncHandler wrapper, forwarding unhandled exceptions to centralized middleware.")
    add_para("2) Standardized Error Responses: Errors are raised via custom ApiError classes with specific HTTP status codes and structured JSON bodies.")
    add_para("3) Strict Server-Side Verification: Client-supplied order prices, totals, and permissions are never blindly trusted and are always recomputed against the database.")
    add_para("4) React Hook Decoupling: Network calls and business state are separated into custom hooks (useAuth, useCart) and typed API service modules.")

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 8: SYSTEM DEPLOYMENT AND SCREENSHOTS
    # =========================================================================
    add_ch_title("8. SYSTEM DEPLOYMENT AND SCREENSHOTS")

    add_sec_title("8.1 Deployment Architecture")
    add_para(
        "OMASTRA is deployed across a cloud-native hosting topology: the React frontend is hosted on Vercel Edge Network "
        "providing global CDN distribution and SSL; the Express backend is deployed on Render's containerized infrastructure; "
        "and data is persisted in a distributed MongoDB Atlas cluster with automatic replication and encrypted backups."
    )

    add_sec_title("8.2 Environment Variables (server/.env)")
    env_data = [
        ("Variable", "Purpose / Description"),
        ("PORT", "Port on which the Express server listens (default: 5000)"),
        ("NODE_ENV", "Deployment runtime mode ('development' or 'production')"),
        ("CLIENT_URL", "Allowed origin domain for CORS credentials headers (e.g. https://omastra.vercel.app)"),
        ("MONGO_URI", "MongoDB Atlas connection string with replica set parameters"),
        ("JWT_ACCESS_SECRET", "Cryptographic secret for signing access tokens (min 32 characters)"),
        ("JWT_REFRESH_SECRET", "Cryptographic secret for signing refresh tokens"),
        ("RAZORPAY_KEY_ID", "Razorpay merchant public key ID for initiating payments"),
        ("RAZORPAY_KEY_SECRET", "Razorpay merchant secret used for HMAC-SHA256 signature verification"),
        ("SMTP_HOST / SMTP_PORT", "SMTP mail server host (smtp-relay.brevo.com) and port (587)"),
        ("SMTP_USER / SMTP_PASS", "Authenticated credentials for Brevo transactional email delivery"),
        ("CLOUDINARY_CLOUD_NAME", "Cloudinary storage bucket name for product images"),
    ]
    env_tbl = doc.add_table(rows=len(env_data), cols=2)
    env_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(env_tbl, color="A0A0A0")
    for r_idx, row in enumerate(env_tbl.rows):
        is_hdr = (r_idx == 0)
        fill = "D9E1F2" if is_hdr else ("F9FAFC" if r_idx % 2 == 1 else "FFFFFF")
        for c_idx, cell in enumerate(row.cells):
            cell.width = Inches(2.2) if c_idx == 0 else Inches(4.5)
            set_cell_props(cell, fill_hex=fill, bold=is_hdr or c_idx == 0, align=WD_ALIGN_PARAGRAPH.CENTER if is_hdr else WD_ALIGN_PARAGRAPH.LEFT, font_size=9)
            cell.paragraphs[0].text = env_data[r_idx][c_idx]

    add_sec_title("8.3 Deployment Steps")
    add_para("1) Provision MongoDB Atlas cluster and whitelist authorized application server IP addresses.")
    add_para("2) Configure environment secrets in Render backend dashboard and deploy server repository.")
    add_para("3) Configure client VITE_API_URL and VITE_RAZORPAY_KEY_ID environment variables in Vercel.")
    add_para("4) Trigger automated Git-based CI/CD builds on Vercel and verify DNS routing.")
    add_para("5) Execute database seed script to populate initial categories, products, and admin accounts.")

    add_sec_title("8.4 Monitoring and Logging")
    add_para(
        "Application telemetry is monitored using Morgan HTTP request logging, Winston structured logging, and health check "
        "endpoints (/api/health). Uptime monitoring alerts developers in the event of database connection drops or API latency spikes."
    )

    add_sec_title("8.5 Application Screenshots")
    add_para("The following figures illustrate the live screens of the deployed OMASTRA platform:")

    # Screenshots
    shots = [
        ("01-homepage-hero.png", "Fig. 8.1 — Storefront Home Page (Hero Section & Flagship Showcase)", [
            "Hero headline with performance branding and primary Call-To-Action buttons.",
            "Visual composition highlighting OMASTRA Whey Pro blend.",
            "Trust metrics: Authentic Batch Certified, 24g Protein Per Scoop, Lab Tested.",
            "Sticky navigation header with search trigger, cart badge, and auth menu."
        ]),
        ("02-categories-showcase.png", "Fig. 8.2 — Category Showcase ('Find Your Fuel')", [
            "Curated visual grid covering 6 core sports nutrition categories.",
            "Direct filtering links for Whey Protein, Plant Protein, Creatine, Pre-Workout, and BCAAs.",
            "Smooth hover zoom effects and responsive card layout."
        ]),
        ("03-shop-catalog.png", "Fig. 8.3 — Shop / Product Catalogue Page with Faceted Filtering", [
            "Multi-facet sidebar filter: Category selection, price sliders, dietary tags.",
            "Sorting controls: Price (Low to High / High to Low), Customer Rating, and Newest Arrivals.",
            "Card display with high-resolution image, discount badge, pricing, and instant add-to-cart."
        ]),
        ("04-product-details-gallery.png", "Fig. 8.4 — Product Detail Page (Front Bottle Render & Variants)", [
            "Amazon-style vertical 5-thumbnail gallery with active front view render.",
            "Dynamic variant selector for size (1kg, 2kg, 4kg) and flavours (Double Rich Chocolate, etc.).",
            "Authenticity verification seal, key macro pills (24g Protein, 5.5g BCAAs), and Add-to-Cart."
        ]),
        ("05-product-infographic-view.png", "Fig. 8.5 — Interactive Gallery (Benefits & Macro Infographic View)", [
            "Interactive thumbnail switched to the Protein Breakdown and Benefits Infographic.",
            "Visual charts displaying BCAA to EAA ratios, absorption rates, and muscle recovery data.",
            "Clear educational presentation designed to build customer purchase confidence."
        ]),
        ("06-product-back-panel-view.png", "Fig. 8.6 — Interactive Gallery (Supplement Facts & Nutrition Label)", [
            "Interactive thumbnail switched to the Back Nutrition and Supplement Facts panel.",
            "Full transparency table listing serving size, micro-nutrients, allergens, and ingredients.",
            "Clean high-legibility formatting meeting FSSAI regulatory display standards."
        ]),
        ("07-plantfuel-product-page.png", "Fig. 8.7 — PlantFuel 100% Organic Vegan Protein Product Page", [
            "Category demonstration showing PlantFuel organic pea and brown rice protein pouch.",
            "Dedicated organic dietary certification badges and allergen-free guarantees.",
            "Full 5-thumbnail image carousel with active high-definition preview."
        ]),
        ("08-cart-page.png", "Fig. 8.8 — Shopping Cart Page with Live Order Summary", [
            "Itemized list of added supplement products with thumbnail, variant details, and unit price.",
            "Interactive quantity steppers with real-time recalculation of subtotals.",
            "Promo coupon application input with instant feedback and order summary card."
        ]),
        ("09-checkout-page.png", "Fig. 8.9 — Multi-Step Frictionless Checkout Page", [
            "Contact information and delivery address form with validation.",
            "Payment method selection: Cash on Delivery (COD) and Razorpay Online Payment.",
            "Final order review panel displaying item list, applied discounts, and total payable amount."
        ]),
        ("10-track-order.png", "Fig. 8.10 — Order Tracking Page", [
            "Public order status tracking page by unique Order ID.",
            "Visual order milestone progress bar (Pending → Confirmed → Shipped → Delivered).",
            "Order details summary and direct link back to continue shopping."
        ]),
        ("11-admin-dashboard.png", "Fig. 8.11 — Admin Dashboard (Overview & Analytics)", [
            "Executive KPI counters: Total Revenue, Total Orders, Active Customers, Low Stock Alerts.",
            "Interactive sales trend charts with selectable time windows.",
            "Top-selling supplement products table and recent orders activity feed."
        ]),
        ("12-admin-orders.png", "Fig. 8.12 — Admin Order Management Portal", [
            "Complete order list with status filters (Pending, Confirmed, Shipped, Delivered).",
            "Customer contact details, total price, and payment method indicators.",
            "Status update controls enabling instant fulfillment pipeline transitions."
        ]),
        ("13-admin-coupons.png", "Fig. 8.13 — Admin Promotional Coupon Management", [
            "Active coupon listing displaying discount rates, minimum order criteria, and expiration dates.",
            "Coupon creation and editing modal for instant promotional campaign rollout.",
            "Usage count tracking per coupon to prevent excessive discount redemptions."
        ]),
        ("14-admin-reviews.png", "Fig. 8.14 — Admin Review Moderation Queue", [
            "Verified customer review moderation queue.",
            "Detailed ratings breakdown, customer comments, and product associations.",
            "Approve and reject action buttons to ensure authentic storefront social proof."
        ]),
    ]

    for filename, caption, points in shots:
        img_p = os.path.join(screens_dir, filename)
        add_fig_image(img_p, caption, width_inches=6.0)
        p_sub = doc.add_paragraph()
        p_sub.paragraph_format.space_before = Pt(0)
        p_sub.paragraph_format.space_after = Pt(2)
        r_sub = p_sub.add_run("Key elements shown on this screen:")
        r_sub.bold = True
        r_sub.font.name = 'Times New Roman'
        r_sub.font.size = Pt(10)
        
        for pt in points:
            p_pt = doc.add_paragraph(style='List Bullet')
            p_pt.paragraph_format.space_before = Pt(0)
            p_pt.paragraph_format.space_after = Pt(2)
            p_pt.paragraph_format.line_spacing = 1.1
            r_pt = p_pt.add_run(pt)
            r_pt.font.name = 'Times New Roman'
            r_pt.font.size = Pt(9.5)

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 9: CONCLUSION & FUTURE ENHANCEMENT
    # =========================================================================
    add_ch_title("9. CONCLUSION & FUTURE ENHANCEMENT")

    add_sec_title("9.1 Conclusion")
    add_para(
        "OMASTRA successfully establishes a comprehensive, high-performance, full-stack sports nutrition e-commerce platform. "
        "By uniting a modern React 18 single-page storefront with a resilient Express REST API and MongoDB Atlas database, the "
        "system satisfies all functional and non-functional requirements. The implementation delivers an intuitive user experience "
        "through faceted catalogue discovery, an Amazon-style 5-angle product gallery, persistent cart management, dynamic "
        "promotions, and dual checkout with cryptographically verified Razorpay transactions. The administrative portal equips store "
        "operators with real-time analytics, inventory management, and fulfillment tracking, demonstrating a robust, production-grade "
        "software engineering endeavor."
    )

    add_sec_title("9.2 Current Limitations")
    add_para("1) Single-Tenant Architecture: Designed exclusively for a single brand rather than multi-seller marketplace vendors.")
    add_para("2) Manual Fulfillment Statuses: Delivery transitions are updated by administrators rather than through live third-party courier APIs.")
    add_para("3) Base Currency: Prices and transactions are fixed to Indian Rupees (INR) without multi-currency auto-conversion.")
    add_para("4) Basic Product Recommendations: Product recommendations rely on category matching rather than machine-learning collaborative filtering.")

    add_sec_title("9.3 Future Enhancements")
    add_para("1) Logistics API Integration: Integrate Shiprocket or Delhivery APIs for automated shipment tracking and courier airway bill (AWB) generation.")
    add_para("2) AI Recommendation Engine: Implement personalized 'frequently bought together' recommendation models based on purchase history.")
    add_para("3) Progressive Web App (PWA) & Mobile Native: Package the client as a high-performance PWA with push notification support.")
    add_para("4) Subscription Re-Ordering: Introduce automated weekly/monthly recurring supplement subscription refills.")
    add_para("5) Loyalty & Reward Points: Deploy an athlete tier system awarding reward points redeemable at checkout.")

    add_sec_title("9.4 Personal Learning Outcomes")
    add_para(
        "Building OMASTRA provided comprehensive practical experience across the full software engineering lifecycle: architecting "
        "three-tier applications, writing clean React hooks and Context providers, modeling document databases with Mongoose, "
        "securing REST endpoints with HttpOnly JWTs, preventing race-condition overselling using atomic database operations, "
        "integrating payment gateways with cryptographic HMAC verification, and deploying cloud-native distributed web systems."
    )

    doc.add_page_break()

    # =========================================================================
    # CHAPTER 10: REFERENCE / BIBLIOGRAPHY
    # =========================================================================
    add_ch_title("10. REFERENCE / BIBLIOGRAPHY")

    add_sec_title("Technical Documentation")
    add_para("1) React Documentation — https://react.dev")
    add_para("2) Vite Build Tool Documentation — https://vitejs.dev")
    add_para("3) Node.js Documentation — https://nodejs.org/en/docs")
    add_para("4) Express.js Framework Documentation — https://expressjs.com")
    add_para("5) MongoDB Manual & Aggregation Pipeline Documentation — https://www.mongodb.com/docs")
    add_para("6) Mongoose ODM Guide — https://mongoosejs.com/docs/guide.html")
    add_para("7) JSON Web Tokens Standard (RFC 7519) — https://jwt.io/introduction")
    add_para("8) Razorpay Payment Gateway API Documentation — https://razorpay.com/docs")
    add_para("9) Tailwind CSS Documentation — https://tailwindcss.com/docs")
    add_para("10) TanStack Query (React Query) Documentation — https://tanstack.com/query/latest")
    add_para("11) Recharts Charting Library — https://recharts.org")

    add_sec_title("Books and Academic References")
    add_para("1. Sommerville, I., \"Software Engineering\", 10th Edition, Pearson Education, 2015.")
    add_para("2. Elmasri, R. and Navathe, S., \"Fundamentals of Database Systems\", 7th Edition, Pearson, 2016.")
    add_para("3. Booch, G., Rumbaugh, J., and Jacobson, I., \"The Unified Modeling Language User Guide\", 2nd Edition, Addison-Wesley, 2005.")
    add_para("4. Banker, K., Bakkum, P., Verch, S., Garrett, D., and Hawkins, T., \"MongoDB in Action\", 2nd Edition, Manning Publications, 2016.")
    add_para("5. Martin, R. C., \"Clean Code: A Handbook of Agile Software Craftsmanship\", Prentice Hall, 2008.")

    add_sec_title("Development Tools Used")
    add_para("1. Visual Studio Code — Source Code Editor")
    add_para("2. Git & GitHub — Version Control and Repository Management")
    add_para("3. Postman / Thunder Client — REST API Testing and Endpoint Validation")
    add_para("4. MongoDB Compass — Local and Cloud Database Inspection")
    add_para("5. Google Chrome DevTools — Frontend Performance Profiling and Responsive Testing")

    # Add Running Footer with page numbers and horizontal separator
    for s_idx, s in enumerate(doc.sections):
        footer = s.footer
        p_f = footer.paragraphs[0]
        p_f.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p_f.paragraph_format.space_before = Pt(6)
        p_f.paragraph_format.space_after = Pt(0)
        
        # Add top border XML to footer paragraph for thin rule
        pPr = p_f._p.get_or_add_pPr()
        pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:top w:val="single" w:sz="4" w:space="4" w:color="CCCCCC"/></w:pBdr>')
        pPr.append(pBdr)
        
        # Dynamic Page Numbering in Word
        f_run = p_f.add_run()
        f_run.font.name = 'Times New Roman'
        f_run.font.size = Pt(9.5)
        f_run.font.color.rgb = RGBColor(100, 100, 100)
        
        fldSimple = parse_xml(f'<w:fldSimple {nsdecls("w")} w:instr="PAGE"/>')
        f_run._r.append(fldSimple)
        
        f_run2 = p_f.add_run(" | Page")
        f_run2.font.name = 'Times New Roman'
        f_run2.font.size = Pt(9.5)
        f_run2.font.color.rgb = RGBColor(100, 100, 100)

    out_path = r"c:\Users\91976\OneDrive\Desktop\Rhinoflex nutrition\OMASTRA_Project_Report.docx"
    doc.save(out_path)
    print(f"OMASTRA_Project_Report.docx created successfully at {out_path}!")

if __name__ == "__main__":
    create_omastra_report()
