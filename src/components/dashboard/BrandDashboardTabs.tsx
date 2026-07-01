"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Badge } from "@/components/ui/Badge";
import { OrdersTable, type OrderRow } from "@/components/dashboard/OrdersTable";
import { formatNaira } from "@/lib/utils";
import type { ProductStatus } from "@/types/database";

interface ProductRow {
  id: string;
  name: string;
  base_price: number;
  stock: number;
  status: ProductStatus;
}

interface BrandDashboardTabsProps {
  products: ProductRow[];
  orders: OrderRow[];
}

const LOW_STOCK_THRESHOLD = 5;

function BrandDashboardTabs({ products, orders }: BrandDashboardTabsProps) {
  const [tab, setTab] = useState("products");
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const outOfStock = products.filter((p) => p.stock === 0);

  return (
    <div>
      <Tabs
        tabs={[
          { label: "Products", value: "products", count: products.length },
          { label: "Orders", value: "orders", count: orders.length },
          { label: "Inventory", value: "inventory", count: lowStock.length + outOfStock.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === "products" && (
        <div className="mt-5">
          {products.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-muted">
              No products yet — upload your first one to get started.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A1A]">{product.name}</p>
                    <p className="text-xs text-text-muted">{formatNaira(product.base_price)}</p>
                  </div>
                  <Badge status={product.status} />
                </div>
              ))}
            </div>
          )}
          <Link
            href="/brand/products"
            className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
          >
            Manage all products →
          </Link>
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-5">
          <OrdersTable orders={orders.slice(0, 5)} emptyMessage="No orders yet." />
          <Link
            href="/brand/orders"
            className="mt-4 inline-block text-sm font-medium text-brand hover:underline"
          >
            View all orders →
          </Link>
        </div>
      )}

      {tab === "inventory" && (
        <div className="mt-5">
          {lowStock.length === 0 && outOfStock.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-muted">
              All products are well stocked.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {[...outOfStock, ...lowStock].map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="size-4 text-amber-600" />
                    <p className="text-sm font-medium text-[#1A1A1A]">{product.name}</p>
                  </div>
                  <p className="text-xs text-amber-700">
                    {product.stock === 0 ? "Out of stock" : `${product.stock} left`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { BrandDashboardTabs };
