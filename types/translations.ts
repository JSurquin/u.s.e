import { Language } from "./products";

export interface CategoryTranslations {
  all: string;
  food: string;
  hygiene: string;
  household: string;
  fashion: string;
  tech: string;
  digital: string;
  [key: string]: string;
}

export interface FoodSubcategoryTranslations {
  drinks: string;
  snacks: string;
  fastfood: string;
  coffee: string;
  chocolate: string;
  cereals: string;
  soda: string;
  chips: string;
  condiments: string;
  desserts: string;
  icecream: string;
  alcohol: string;
  energydrinks: string;
  soup: string;
  cheese: string;
  pasta: string;
  [key: string]: string;
}

export interface HygieneSubcategoryTranslations {
  skincare: string;
  toothpaste: string;
  deodorants: string;
  makeup: string;
  shampoo: string;
  soap: string;
  [key: string]: string;
}

export interface HouseholdSubcategoryTranslations {
  cleaning: string;
  laundry: string;
  paper: string;
  furniture: string;
  kitchenware: string;
  candles: string;
  [key: string]: string;
}

export interface FashionSubcategoryTranslations {
  clothing: string;
  sportswear: string;
  shoes: string;
  luxury: string;
  accessories: string;
  jewelry: string;
  [key: string]: string;
}

export interface TechSubcategoryTranslations {
  smartphones: string;
  computers: string;
  audio: string;
  appliances: string;
  gaming: string;
  cameras: string;
  [key: string]: string;
}

export interface DigitalSubcategoryTranslations {
  search: string;
  cloud: string;
  email: string;
  social: string;
  streaming: string;
  messaging: string;
  maps: string;
  music: string;
  productivity: string;
  payment: string;
  dating: string;
  education: string;
  [key: string]: string;
}

export type SubcategoryTranslations = {
  all: string;
  food: FoodSubcategoryTranslations;
  hygiene: HygieneSubcategoryTranslations;
  household: HouseholdSubcategoryTranslations;
  fashion: FashionSubcategoryTranslations;
  tech: TechSubcategoryTranslations;
  digital: DigitalSubcategoryTranslations;
  [key: string]:
    | string
    | { [key: string]: string }
    | FoodSubcategoryTranslations
    | HygieneSubcategoryTranslations
    | HouseholdSubcategoryTranslations
    | FashionSubcategoryTranslations
    | TechSubcategoryTranslations
    | DigitalSubcategoryTranslations;
};

export interface SortTranslations {
  label: string;
  options: {
    relevance: string;
    alphabetical: string;
    popular: string;
  };
}

export interface Translation {
  title: string;
  description: string;
  search: string;
  searchButton: string;
  filters: string;
  clearFilters: string;
  categories: CategoryTranslations;
  subcategories: SubcategoryTranslations;
  sort: SortTranslations;
  noResults: string;
  backToHome: string;
  popular: string;
  new: string;
  recommended: string;
  compare: string;
  discover: string;
  resultsCount: string;
  loading: string;
  alternatives: string;
  americanProducts: string;
  notes: string;
}

export type Translations = Record<Language, Translation>;
