-- =========================================================================
-- Default template_settings — seeded once so every template-driven page
-- has config to read on first render. Edited later via /admin/templates.
-- =========================================================================

insert into public.template_settings (template_name, settings)
values (
  'storefront',
  '{
    "hero": {
      "overlayOpacity": 0.5,
      "gradientDirection": "to-b",
      "minHeightDesktop": "70vh",
      "minHeightMobile": "50vh",
      "headingFontSize": "48px",
      "headingStyle": "display-medium"
    },
    "brandNameFormat": { "prefix": "Curated by", "suffix": "" },
    "intro": {
      "label": "About",
      "textAlign": "left",
      "maxCharHint": 300
    },
    "featuredVideo": {
      "sectionTitle": "Featured Pick",
      "placeholderText": "This curator hasn''t added a featured video yet."
    },
    "productCollection": {
      "sectionHeading": "My Tastes",
      "gridColumns": 3,
      "cardStyle": "minimal"
    },
    "footer": { "text": "Delivery handled by DHL or GIG Logistics.", "links": [] },
    "global": {
      "fontSizeScale": "default",
      "spacing": "comfortable",
      "addToCartLabel": "Add to Cart"
    }
  }'::jsonb
)
on conflict (template_name) do nothing;

insert into public.template_settings (template_name, settings)
values (
  'product_listing',
  '{
    "headline": "Discover Products",
    "subheadline": "Browse certified-brand pieces ready to add to your store.",
    "video": {
      "sectionTitle": "Curated By Voices Like Yours",
      "videoCount": 3,
      "description": "See how fellow curators are styling these pieces."
    },
    "filterBar": { "label": "Filter", "visibleFilters": ["category", "price", "brand"] },
    "productCard": {
      "imageAspectRatio": "1:1",
      "showBrandName": true,
      "showCommissionCap": true,
      "commissionCapLabel": "Commission Cap"
    },
    "addToStoreLabel": "Add to Store",
    "emptyStateMessage": "No approved products yet — check back soon.",
    "loadMoreLabel": "Load More"
  }'::jsonb
)
on conflict (template_name) do nothing;

insert into public.template_settings (template_name, settings)
values (
  'product_detail',
  '{
    "gallery": { "style": "carousel" },
    "whyCurated": {
      "sectionTitle": "Why I Curated This",
      "backgroundColor": "#F7E8EC",
      "borderStyle": "left-accent",
      "fontStyle": "italic"
    },
    "sizeLabel": "Size",
    "colorLabel": "Color",
    "stockLabel": "In Stock",
    "addToCartLabel": "Add to Cart",
    "shippingNote": "Delivery handled by DHL or GIG Logistics.",
    "relatedProducts": { "show": true, "sectionHeading": "You May Also Like" }
  }'::jsonb
)
on conflict (template_name) do nothing;
