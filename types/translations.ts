import { Language } from "./products";

export interface CategoryTranslations {
  title: string;
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

export interface SubcategoryTranslations {
  title: string;
  all: string;
  food: {
    cereals: string;
    snacks: string;
    drinks: string;
    coffee: string;
    chocolate: string;
    soda: string;
    chips: string;
    condiments: string;
    chocolate_confectionery: string;
    desserts: string;
    icecream: string;
    alcohol: string;
    energydrinks: string;
    fastfood: string;
    [key: string]: string;
  };
  hygiene: {
    skincare: string;
    toothpaste: string;
    deodorant: string;
    makeup: string;
    shampoo: string;
    soap: string;
    haircare: string;
    bodycare: string;
    feminine: string;
    baby: string;
    perfume: string;
    razors: string;
    dental: string;
    [key: string]: string;
  };
  household: {
    cleaning: string;
    laundry: string;
    paper: string;
    kitchen: string;
    bathroom: string;
    garden: string;
    tools: string;
    furniture: string;
    decoration: string;
    lighting: string;
    storage: string;
    organization: string;
    [key: string]: string;
  };
  fashion: {
    clothing: string;
    shoes: string;
    accessories: string;
    jewelry: string;
    bags: string;
    watches: string;
    sunglasses: string;
    underwear: string;
    sportswear: string;
    workwear: string;
    formalwear: string;
    casualwear: string;
    [key: string]: string;
  };
  tech: {
    phones: string;
    computers: string;
    tablets: string;
    cameras: string;
    audio: string;
    gaming: string;
    smart: string;
    accessories: string;
    software: string;
    services: string;
    repair: string;
    recycling: string;
    [key: string]: string;
  };
  digital: {
    streaming: string;
    social: string;
    search: string;
    email: string;
    cloud: string;
    payment: string;
    maps: string;
    music: string;
    video: string;
    news: string;
    shopping: string;
    travel: string;
    [key: string]: string;
  };
  [key: string]: string | { [key: string]: string };
}

export interface SortTranslations {
  label: string;
  options: {
    relevance: string;
    alphabetical: string;
    popular: string;
  };
}

export interface DigitalTranslations {
  title: string;
  description: string;
  privacy: {
    title: string;
    description: string;
  };
  terms: {
    title: string;
    description: string;
  };
  contact: {
    title: string;
    description: string;
  };
}

export interface AboutTranslations {
  title: string;
  description: string;
  privacy: {
    title: string;
    description: string;
  };
  economy: {
    title: string;
    description: string;
  };
  quality: {
    title: string;
    description: string;
  };
}

export interface Translation {
  title: string;
  description: string;
  allProducts: string;
  searchPlaceholder: string;
  activeFilters: string;
  allCategories: string;
  allSubcategories: string;
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
  error: string;
  search: string;
  searchButton: string;
  footer: {
    rights: string;
    terms: string;
    privacy: string;
    contact: string;
  };
  nav: {
    about: string;
    digital: string;
  };
  about: AboutTranslations;
  digital: DigitalTranslations;
}

export interface Translations {
  fr: Translation;
  en: Translation;
}
