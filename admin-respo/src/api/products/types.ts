

export type Product = {
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
    is_variants: number;
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
    is_variants: number;
}

export type ProductVariant = {
    id?: string;
    product_id?: string;
    image: string;
    size_id: string;
    color_id: string;
    price: string;
    quantity: string;
    status: string;
    sku: string;
}
