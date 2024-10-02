import { z } from "zod";

// Định nghĩa schema cho sản phẩm
const productSchema = z.object({
    name: z.string().min(1, "Tên sản phẩm là bắt buộc."), // Tên sản phẩm là bắt buộc
    price: z
        .string()
        .min(1, "Price is required")
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
            message: "Price must be a valid number and greater than or equal to 0",
        }),
    description: z.string().min(1, "Mô tả sản phẩm là bắt buộc."), // Mô tả sản phẩm là bắt buộc
    category_id: z.string().min(1, "Danh mục là bắt buộc."), // Danh mục là bắt buộc
    sale_price: z
        .string()
        .min(1, "Sale price is required")
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
            message: "Sale price must be a valid number and greater than or equal to 0",
        }),
    sale_start: z.string().optional(), // Ngày bắt đầu khuyến mãi là không bắt buộc
    sale_end: z.string().optional(), // Ngày kết thúc khuyến mãi là không bắt buộc
    new_product: z.boolean().default(false), // Trường checkbox cho sản phẩm mới
    best_seller_product: z.boolean().default(false), // Trường checkbox cho sản phẩm bán chạy
    featured_product: z.boolean().default(false), // Trường checkbox cho sản phẩm nổi bật

});

export default productSchema;
