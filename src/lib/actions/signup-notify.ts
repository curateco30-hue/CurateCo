"use server";

import { notifyNewCuratorRegistered, notifyNewBrandRegistered } from "@/lib/actions/notify";

export async function notifyCuratorSignup(brandName: string) {
  await notifyNewCuratorRegistered(brandName);
}

export async function notifyBrandSignup(businessName: string) {
  await notifyNewBrandRegistered(businessName);
}
