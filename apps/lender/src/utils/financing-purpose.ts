export type FinancingPurpose =
  | "EARLY_PAYMENT"
  | "SUPPLIER_PAYMENT"
  | "INVENTORY_PURCHASE";

const PURPOSE_LABELS: Record<FinancingPurpose, string> = {
  EARLY_PAYMENT: "Early payment",
  SUPPLIER_PAYMENT: "Pay a supplier",
  INVENTORY_PURCHASE: "Purchase inventory",
};

export const purposeLabel = (purpose: FinancingPurpose) =>
  PURPOSE_LABELS[purpose] ?? purpose;
