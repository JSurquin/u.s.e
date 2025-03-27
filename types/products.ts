export type Language = "fr" | "en";

export interface Product {
  title: string;
  description: string;
  us: string;
  eu: string;
  note: string;
  popular?: boolean;
  new?: boolean;
  recommended?: boolean;
}

export type SubcategoryKey = string;
export type CategoryKey = string;
export type ProductsKey = string;

export interface SubcategoryData {
  [key: string]: Product;
}

export interface CategoryData {
  [key: string]: SubcategoryData;
}

export interface ProductsData {
  [key: string]: CategoryData;
}

export interface LanguageData {
  products: ProductsData;
}

export interface AllProductsData {
  [key: string]: LanguageData;
}
