import type { CatalogCategory } from "@/lib/smm-catalog";

export interface CheckoutDraft {
  categoryId: CatalogCategory["id"];
  quantity: number;
  customerName: string;
  customerEmail: string;
}

const STORAGE_KEY = "smm_checkout_draft_v1";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

export function saveCheckoutDraft(draft: CheckoutDraft) {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function readCheckoutDraft(): CheckoutDraft | null {
  if (!canUseStorage()) {
    return null;
  }

  const rawDraft = window.sessionStorage.getItem(STORAGE_KEY);

  if (!rawDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as Partial<CheckoutDraft>;

    if (
      typeof parsedDraft.categoryId !== "string" ||
      typeof parsedDraft.quantity !== "number" ||
      typeof parsedDraft.customerName !== "string" ||
      typeof parsedDraft.customerEmail !== "string"
    ) {
      return null;
    }

    return parsedDraft as CheckoutDraft;
  } catch (error) {
    console.error("Failed to read checkout draft:", error);
    return null;
  }
}

export function clearCheckoutDraft() {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}
