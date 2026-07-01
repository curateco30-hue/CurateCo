-- Needed so order status update emails (packed/picked up/delivered) can
-- actually reach the customer if they gave an email at checkout.
alter table public.orders
  add column if not exists customer_email text;
