const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export function emailShell(heading: string, bodyHtml: string, ctaLabel?: string, ctaUrl?: string): string {
  return `
  <div style="background:#F5F0EA;padding:32px 16px;font-family:Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E8E0DA;">
      <div style="background:#63001F;padding:24px 32px;">
        <span style="color:#FFFFFF;font-size:20px;font-weight:700;letter-spacing:0.02em;">CurateCo</span>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#1A1A1A;">${heading}</h1>
        <div style="font-size:14px;line-height:1.6;color:#6B6B6B;">${bodyHtml}</div>
        ${
          ctaLabel && ctaUrl
            ? `<a href="${ctaUrl}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#63001F;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:14px;font-weight:600;">${ctaLabel}</a>`
            : ""
        }
      </div>
      <div style="padding:20px 32px;border-top:1px solid #E8E0DA;">
        <span style="font-size:12px;color:#9E9E9E;">CurateCo — Africa's Creator Commerce Platform</span>
      </div>
    </div>
  </div>`;
}

export const templates = {
  orderConfirmation: (customerName: string, orderRef: string, total: string) => ({
    subject: "Your CurateCo order is confirmed",
    html: emailShell(
      `Thanks for your order, ${customerName}`,
      `<p>Your order <strong>#${orderRef}</strong> (${total}) has been placed and your curator has been notified. Delivery is handled by DHL or GIG Logistics.</p>`,
    ),
  }),
  newOrderForCurator: (curatorName: string, orderRef: string, total: string) => ({
    subject: "You have a new order",
    html: emailShell(
      `New order, ${curatorName}`,
      `<p>Order <strong>#${orderRef}</strong> (${total}) just came in from your store.</p>`,
      "View Dashboard",
      `${APP_URL}/curator/dashboard`,
    ),
  }),
  newOrderForBrand: (businessName: string, orderRef: string, total: string) => ({
    subject: "New order for your products",
    html: emailShell(
      `New order, ${businessName}`,
      `<p>Order <strong>#${orderRef}</strong> (${total}) includes one of your products.</p>`,
      "View Orders",
      `${APP_URL}/brand/orders`,
    ),
  }),
  newOrderForAdmin: (orderRef: string, total: string) => ({
    subject: "New order placed on CurateCo",
    html: emailShell(`New order #${orderRef}`, `<p>Total: ${total}</p>`, "View Orders", `${APP_URL}/admin/orders`),
  }),
  productApproved: (businessName: string, productName: string) => ({
    subject: "Your product was approved",
    html: emailShell(
      `Good news, ${businessName}`,
      `<p><strong>${productName}</strong> has been approved and is now visible to curators.</p>`,
      "View Products",
      `${APP_URL}/brand/products`,
    ),
  }),
  productRejected: (businessName: string, productName: string, reason: string) => ({
    subject: "Your product needs changes",
    html: emailShell(
      `Update needed, ${businessName}`,
      `<p><strong>${productName}</strong> was not approved.</p><p>Reason: ${reason}</p>`,
      "View Products",
      `${APP_URL}/brand/products`,
    ),
  }),
  orderStatusChanged: (recipientName: string, orderRef: string, status: string, dashboardUrl: string) => ({
    subject: `Order #${orderRef.slice(0, 8).toUpperCase()} update`,
    html: emailShell(
      `Order update, ${recipientName}`,
      `<p>Order <strong>#${orderRef.slice(0, 8).toUpperCase()}</strong> is now <strong>${status}</strong>.</p>`,
      "View Order",
      dashboardUrl,
    ),
  }),
  lowStock: (businessName: string, productName: string, stock: number) => ({
    subject: `Low stock: ${productName}`,
    html: emailShell(
      `Running low, ${businessName}`,
      `<p><strong>${productName}</strong> has only ${stock} unit${stock === 1 ? "" : "s"} left. Restock soon to avoid it being hidden from curators.</p>`,
      "Update Stock",
      `${APP_URL}/brand/products`,
    ),
  }),
  newCuratorRegistered: (brandName: string) => ({
    subject: "New curator registered",
    html: emailShell("New curator", `<p><strong>${brandName}</strong> just joined as a curator.</p>`, "View Curators", `${APP_URL}/admin/curators`),
  }),
  newBrandRegistered: (businessName: string) => ({
    subject: "New brand registered",
    html: emailShell("New brand", `<p><strong>${businessName}</strong> just registered as a brand.</p>`, "View Brands", `${APP_URL}/admin/brands`),
  }),
  newProductUploaded: (businessName: string, productName: string) => ({
    subject: "New product awaiting approval",
    html: emailShell(
      "New product uploaded",
      `<p><strong>${businessName}</strong> uploaded <strong>${productName}</strong>, awaiting your review.</p>`,
      "Review Products",
      `${APP_URL}/admin/products`,
    ),
  }),
  newSupportMessage: (senderName: string) => ({
    subject: "New support message",
    html: emailShell(
      "New support message",
      `<p>A message was submitted by <strong>${senderName}</strong>.</p>`,
      "View Messages",
      `${APP_URL}/admin/support`,
    ),
  }),
  cartAbandonment: (storeName: string, storeSlug: string) => ({
    subject: "You left something behind",
    html: emailShell(
      "Still thinking it over?",
      `<p>Your picks from <strong>${storeName}</strong> are still waiting for you.</p>`,
      "Return to Store",
      `${APP_URL}/store/${storeSlug}`,
    ),
  }),
};
