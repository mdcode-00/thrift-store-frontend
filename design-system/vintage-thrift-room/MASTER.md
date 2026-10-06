# Design System Master File

> This file is the single source of truth for the Vintage Thrift Room frontend.
> Page-specific design files may override these rules when they exist.

---

## Project

**Name:** Vintage Thrift Room

**Type:** Vintage / Thrift Fashion E-Commerce

**Visual Direction:** Warm vintage fashion boutique, editorial clothing catalog, thrift-room atmosphere.

**Reference Direction:**
Use the supplied visual reference as inspiration for the overall composition, color mood,
photography treatment, spacing, product presentation, and editorial feeling.

Do NOT copy the reference website literally.
Create an original implementation.

---

# 1. Design Philosophy

The interface should feel:

- Vintage
- Warm
- Editorial
- Premium but approachable
- Thrift / curated
- Fashion-focused
- Calm
- Authentic
- Photography-led

The design should feel like browsing a carefully curated vintage clothing room.

Avoid making the website look like:

- Generic SaaS
- AI dashboard
- Modern fintech
- Gaming UI
- Luxury black-and-gold fashion template
- Neon fashion store
- Glassmorphism website
- Excessively rounded modern UI

---

# 2. Color Palette

Use a warm earthy palette.

| Role            | Hex     | CSS Variable        |
| --------------- | ------- | ------------------- |
| Background      | #F5F0E9 | --color-background  |
| Surface         | #FBF8F3 | --color-surface     |
| Primary Brown   | #6B4A38 | --color-primary     |
| Dark Brown      | #3E2B22 | --color-foreground  |
| Secondary Brown | #8A654D | --color-secondary   |
| Warm Tan        | #B79A7D | --color-accent      |
| Soft Beige      | #DED1C2 | --color-muted       |
| Border          | #D5C7B8 | --color-border      |
| White           | #FFFFFF | --color-white       |
| Error           | #B42318 | --color-destructive |

### Color Rules

The dominant page background should be warm cream/off-white.

Brown should be the primary brand color.

Use tan and beige as supporting accents.

Do NOT use bright red, pink, neon colors, purple, or blue as dominant brand colors.

Do NOT use large colorful gradients.

Keep the visual palette muted and earthy.

---

# 3. Typography

## Headings

Use an elegant editorial serif.

Preferred:

**Playfair Display**

Alternative:

**Cormorant Garamond**

Headings should feel editorial and vintage without becoming difficult to read.

## Body

Use:

**DM Sans**

Alternative:

**Inter**

Body text should remain highly readable and clean.

### Typography Rules

Use serif typography for:

- Main hero heading
- Section headings
- Editorial statements
- Collection titles

Use sans-serif typography for:

- Navigation
- Product names
- Prices
- Buttons
- Filters
- Forms
- Product metadata

Avoid using decorative fonts for large amounts of body text.

---

# 4. Layout

Use a clean editorial e-commerce layout.

Maximum content width:

1200px - 1400px.

Use generous horizontal spacing on desktop.

The design should feel spacious without wasting excessive vertical space.

Avoid excessive rounded containers.

Prefer:

- 4px - 10px border radius
- Thin borders
- Subtle shadows
- Editorial spacing

Product imagery should be visually dominant.

---

# 5. Homepage Structure

The primary homepage pattern is:

1. Announcement bar
2. Header / Navigation
3. Hero fashion editorial
4. Latest Products
5. Trust / Benefits
6. Categories
7. Exclusive Offer
8. Featured Products
9. Seasonal Collection
10. Customer Reviews
11. Newsletter
12. Footer

The homepage should feel like a curated fashion catalog.

Do NOT use a scroll-triggered storytelling/chapter structure.

Do NOT require the user to scroll through animations to understand the page.

The content must remain understandable with animations disabled.

---

# 6. Header

Desktop:

- Logo on the left
- Main navigation centered or nearby
- Search
- Account
- Wishlist
- Cart

Use Lucide icons.

Navigation should be simple and editorial.

Avoid oversized navigation bars.

Mobile:

- Logo
- Search
- Cart
- Menu button

Use a proper mobile navigation drawer/menu.

---

# 7. Hero

The hero should be photography-led.

Preferred composition:

Large lifestyle fashion photograph

- Editorial headline
- Short supporting text
- Primary CTA

Example:

WEAR YOUR CONFIDENCE

Curated vintage pieces for your everyday wardrobe.

[ SHOP COLLECTION ]

The hero should resemble an editorial fashion campaign rather than a SaaS landing page.

Do not use:

- Huge gradients
- Animated background effects
- Parallax layers
- 3D effects
- Glass panels

---

# 8. Product Cards

Create a reusable ProductCard component.

Each card may contain:

- Product image
- Product name
- Current price
- Original price when applicable
- Discount
- Rating when available
- Wishlist button
- Add-to-cart action
- Product badge

Product imagery should have a clean rectangular presentation.

Avoid excessive card decoration.

Use subtle hover effects.

Example behavior:

Image:
subtle zoom or image transition

Content:
small color/opacity transition

Wishlist:
visible on hover desktop
always accessible on mobile

Do NOT use layout-shifting hover animations.

---

# 9. Product Grid

Desktop:

4 products per row where appropriate.

Tablet:

2-3 products per row.

Mobile:

2 products per row for compact catalog sections.

For detailed product listings, use 1-2 columns depending on available width.

Maintain consistent image aspect ratios.

---

# 10. Categories

Category cards should use large fashion photography.

Example categories:

- Women's
- Men's
- Outerwear
- Dresses
- Shirts
- Denim
- Accessories

Category cards should feel like editorial magazine tiles.

Use restrained text overlays only when readability remains high.

---

# 11. Exclusive Offer

Use a split editorial layout:

Text/content on one side.

Large lifestyle/product image on the other.

Use warm brown as the primary promotional color.

Avoid flashy promotional gradients.

---

# 12. Seasonal Collection

Use large editorial imagery.

Possible layout:

Large featured image

- Secondary image
- Collection title
- CTA

The section should feel curated rather than like an advertisement banner.

---

# 13. Reviews

Use simple review cards.

Show:

- Rating
- Review
- Customer name
- Optional avatar

Do not make reviews visually dominant.

---

# 14. Buttons

Primary:

```css
background: var(--color-primary);
color: white;
border-radius: 6px;
padding: 12px 22px;
font-weight: 600;
transition: all 200ms ease;
cursor: pointer;
```
