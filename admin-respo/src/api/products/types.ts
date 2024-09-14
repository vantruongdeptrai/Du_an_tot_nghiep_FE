import { Category } from "../categories/types";

export type Product = {
    id?: string;
    name: string;
    image: string;
    price: number;
    description: string;
    category: Category[]
}

export type ProductInput = {
    id?: string;
    name: string;
    image: string;
    price: string;
    description: string;
    category_id: Category[];
    saleprice:string;
    salestart:string;
    saleend:string;
    new_product:boolean;
    best_seller_product:boolean;
    featured_product:boolean;
}
