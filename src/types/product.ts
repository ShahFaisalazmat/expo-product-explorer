export type ProductCategory = 'All' | 'Audio' | 'Wearables' | 'Peripherals' | 'Accessories';

export interface Product {
  id: string;
  name: string;
  numericPrice: number;
  formattedPrice: string;
  category: ProductCategory;
  rating: number; // e.g. 4.8
  reviewsCount: number;
  inStock: boolean;
  tagline: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  warrantyMonths: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export type SortOption = 'rating' | 'priceAsc' | 'priceDesc';

export interface BudgetRuleMatch {
  product: Product;
  fitsBudget: boolean;
  savings: number;
  explanation: string;
}
