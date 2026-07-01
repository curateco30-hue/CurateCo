import { AlertTriangle, PackageX } from "lucide-react";
import { getCurrentAdminOrRedirect } from "@/lib/queries/admin";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Inventory — CurateCo Admin" };

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminInventoryPage() {
  const { supabase } = await getCurrentAdminOrRedirect();

  const { data } = await supabase
    .from("products")
    .select("id, name, stock, brands(business_name)")
    .lte("stock", LOW_STOCK_THRESHOLD)
    .order("stock", { ascending: true });

  const products = (data ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    stock: p.stock,
    brand_name: (p.brands as unknown as { business_name: string } | null)?.business_name ?? "—",
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-medium text-[#1A1A1A]">Inventory Alerts</h1>
        <p className="text-sm text-text-secondary">
          Products running low or completely out of stock across the platform.
        </p>
      </div>

      {products.length === 0 ? (
        <Card className="p-16 text-center text-sm text-text-muted">
          Every product is well stocked.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const isOut = product.stock === 0;
            return (
              <Card
                key={product.id}
                className={`flex items-center gap-3 p-5 ${
                  isOut ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"
                }`}
              >
                {isOut ? (
                  <PackageX className="size-5 shrink-0 text-red-600" />
                ) : (
                  <AlertTriangle className="size-5 shrink-0 text-amber-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-[#1A1A1A]">{product.name}</p>
                  <p className="text-xs text-text-muted">{product.brand_name}</p>
                  <p className={`mt-1 text-xs ${isOut ? "text-red-700" : "text-amber-700"}`}>
                    {isOut ? "Out of stock — hidden from listings" : `${product.stock} left`}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
