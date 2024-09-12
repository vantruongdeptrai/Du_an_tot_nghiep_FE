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
    price: number;
    description: string;
    category: Category[]
}
