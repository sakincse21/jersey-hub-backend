export enum ISize {
    S= 'S',
    M= 'M',
    L= 'L',
    XL= 'XL',
    XXL= 'XXL'
}
export interface IVariant {
  size: ISize;
  stock: number;
}

export interface IProduct {
  name: string;
  slug: string;
  description: string;
  league: string;
  team: string;
  price: number;
  images: string[];
  variants: IVariant[];
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}