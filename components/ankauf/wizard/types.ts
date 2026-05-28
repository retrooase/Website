export type SellType =
  | "einzeln"
  | "mehrere"
  | "sammlung"
  | "defekt"
  | "pokemon"
  | "zubehoer";

export type WizardData = {
  // Step 1
  sellType: SellType | null;
  // Step 2
  name: string;
  email: string;
  phone: string;
  plz: string;
  // Step 3
  productName: string;
  category: string;
  platform: string;
  condition: string;
  completeness: string;
  description: string;
  desiredPrice: string;
  quantity: string;
  // Step 4
  photos: File[];
  // Step 5
  acceptTerms: boolean;
  acceptPrivacy: boolean;
};

export type WizardErrors = Record<string, string>;
