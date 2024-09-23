

export type Product = {
    id?: string;
    name: string;
    image: string;
    price: string;
    description: string;
    category_id: string;
    sale_price:string;
    sale_start:string;
    sale_end:string;
    new_product:boolean;
    best_seller_product:boolean;
    featured_product:boolean;
}

export type ProductInput = {
    id: string;
    name: string;
    image: string;
    price: string;
    description: string;
    category_id: number;
    sale_price:string;
    sale_start:string;
    sale_end:string;
    new_product:number;
    best_seller_product:number;
    featured_product:number;
}
