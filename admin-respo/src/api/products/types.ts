interface ProductVariants {
    price: string | null; // Giá trị price có thể là string hoặc null
}
export type Product = {
    id?: string;
    product_variant_id?: string;
    name: string;
    image: string;
    price: string;
    description: string;
    category_id: number;
    sale_price: string;
    sale_start: string;
    sale_end: string;
    new_product: number;
    best_seller_product: number;
    featured_product: number;
    image_url: string;
    is_variants: number;
    product_variants: ProductVariants[];
};

export type ProductInput = {
    id?: string;

    name: string;
    quantity: string;
    image: string;
    price: string;
    description: string;
    category_id: string;
    sale_price: string;
    sale_start: string;
    sale_end: string;
    new_product: string;
    best_seller_product: string;
    featured_product: string;
    image_url: string;
    is_variants: string;
};

export type ProductVariant = {
    product_id?: number; // Giả sử đây là kiểu số
    colors: number[]; // Mảng chứa các màu
    sizes: number[]; // Mảng chứa các kích thước
    quantities: Record<string, number>; // Đối tượng chứa số lượng
    prices: Record<string, number>; // Đối tượng chứa giá
    status: string; // Trạng thái
    images: Record<string, File>;
};
