

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
    product_id: number; // Giả sử đây là kiểu số
    colors: number[]; // Mảng chứa các màu
    sizes: number[]; // Mảng chứa các kích thước
    quantities: Record<string, number>; // Đối tượng chứa số lượng
    prices: Record<string, number>; // Đối tượng chứa giá
    status: string; // Trạng thái
    images: Record<string, string>; // Đối tượng chứa hình ảnh
}
