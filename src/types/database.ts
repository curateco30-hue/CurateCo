// Hand-authored to match supabase/migrations/*.sql until a live project
// exists. Once Supabase is provisioned, regenerate with:
//   npx supabase gen types typescript --project-id <id> > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type OrderStatus = "new" | "brand_accepted" | "awaiting_pickup" | "picked_up" | "delivered" | "cancelled";
export type ProductStatus = "pending" | "approved" | "rejected";
export type ProfileRole = "curator" | "brand" | "admin" | "customer";
export type TemplateName = "storefront" | "product_listing" | "product_detail";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: ProfileRole;
          full_name: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
          role: ProfileRole;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      curators: {
        Row: {
          id: string;
          profile_id: string | null;
          brand_name: string;
          brand_color: string;
          profile_photo_url: string | null;
          bank_name: string | null;
          account_number: string | null;
          account_name: string | null;
          wallet_balance: number;
          pending_commission: number;
          taste_vector: Json | null;
          style_tags: string[] | null;
          curation_score: number | null;
          is_active: boolean;
          is_suspended: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["curators"]["Row"]> & {
          brand_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["curators"]["Row"]>;
        Relationships: [];
      };
      curator_stores: {
        Row: {
          id: string;
          curator_id: string;
          store_slug: string;
          intro_headline_prefix: string;
          intro_text: string | null;
          featured_video_url: string | null;
          featured_video_product_id: string | null;
          is_active: boolean;
          total_views: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["curator_stores"]["Row"]> & {
          curator_id: string;
          store_slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["curator_stores"]["Row"]>;
        Relationships: [];
      };
      brands: {
        Row: {
          id: string;
          profile_id: string | null;
          business_name: string;
          logo_url: string | null;
          description: string | null;
          bank_name: string | null;
          account_number: string | null;
          account_name: string | null;
          is_active: boolean;
          is_suspended: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["brands"]["Row"]> & {
          business_name: string;
        };
        Update: Partial<Database["public"]["Tables"]["brands"]["Row"]>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          brand_id: string;
          name: string;
          description: string | null;
          base_price: number;
          curateco_commission_pct: number;
          max_curator_commission_cap_pct: number;
          selling_price: number;
          sizes: string[] | null;
          colors: string[] | null;
          stock: number;
          images: string[] | null;
          status: ProductStatus;
          rejection_reason: string | null;
          is_visible: boolean;
          style_tags: string[] | null;
          embedding: number[] | null;
          trend_score: number | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["products"]["Row"]> & {
          brand_id: string;
          name: string;
          base_price: number;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Row"]>;
        Relationships: [];
      };
      curator_store_products: {
        Row: {
          id: string;
          store_id: string;
          product_id: string;
          curator_commission_pct: number;
          why_curated_note: string | null;
          product_views: number;
          added_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["curator_store_products"]["Row"]> & {
          store_id: string;
          product_id: string;
          curator_commission_pct: number;
        };
        Update: Partial<Database["public"]["Tables"]["curator_store_products"]["Row"]>;
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          store_id: string | null;
          curator_id: string | null;
          brand_id: string | null;
          customer_name: string;
          customer_phone: string;
          customer_alt_phone: string | null;
          customer_email: string | null;
          delivery_address: string;
          status: OrderStatus;
          total_amount: number | null;
          curator_commission_amount: number | null;
          curateco_commission_amount: number | null;
          brand_payout_amount: number | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["orders"]["Row"]> & {
          customer_name: string;
          customer_phone: string;
          delivery_address: string;
        };
        Update: Partial<Database["public"]["Tables"]["orders"]["Row"]>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          store_product_id: string | null;
          quantity: number;
          size: string | null;
          color: string | null;
          unit_price: number | null;
          curator_commission_pct: number | null;
          subtotal: number | null;
        };
        Insert: Partial<Database["public"]["Tables"]["order_items"]["Row"]> & {
          order_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["order_items"]["Row"]>;
        Relationships: [];
      };
      carts: {
        Row: {
          id: string;
          store_id: string | null;
          customer_email: string | null;
          items: Json;
          abandoned_email_sent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["carts"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["carts"]["Row"]>;
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          event_type: string;
          store_id: string | null;
          product_id: string | null;
          curator_id: string | null;
          session_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["analytics_events"]["Row"]> & {
          event_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["analytics_events"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          recipient_profile_id: string | null;
          type: string;
          title: string;
          message: string | null;
          is_read: boolean;
          metadata: Json | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          type: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
      support_messages: {
        Row: {
          id: string;
          sender_name: string;
          sender_email: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["support_messages"]["Row"]> & {
          sender_name: string;
          sender_email: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["support_messages"]["Row"]>;
        Relationships: [];
      };
      template_settings: {
        Row: {
          id: string;
          template_name: TemplateName;
          settings: Json;
          updated_by: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["template_settings"]["Row"]> & {
          template_name: TemplateName;
          settings: Json;
        };
        Update: Partial<Database["public"]["Tables"]["template_settings"]["Row"]>;
        Relationships: [];
      };
    };
    Views: {
      curator_public_profile: {
        Row: {
          id: string;
          profile_id: string | null;
          brand_name: string;
          brand_color: string;
          profile_photo_url: string | null;
          style_tags: string[] | null;
          curation_score: number | null;
          created_at: string;
        };
        Relationships: [];
      };
      brand_public_profile: {
        Row: {
          id: string;
          business_name: string;
          logo_url: string | null;
          description: string | null;
          is_active: boolean;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      current_curator_id: { Args: Record<string, never>; Returns: string };
      current_brand_id: { Args: Record<string, never>; Returns: string };
    };
  };
}
