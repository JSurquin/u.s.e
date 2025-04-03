export interface Product {
  title: string;
  description: string;
  us: string;
  eu: string;
  note?: string;
  category: string;
  subcategory: string;
}

export interface ProductsData {
  [language: string]: {
    products: {
      [category: string]: {
        [subcategory: string]: {
          title: string;
          description: string;
          us: string;
          eu: string;
          note?: string;
        };
      };
    };
  };
}
