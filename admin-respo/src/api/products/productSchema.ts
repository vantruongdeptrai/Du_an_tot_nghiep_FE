import { z } from "zod";

// Định nghĩa schema cho sản phẩm
const productSchema = z.object({
    // ID sản phẩm: phải là một chuỗi không rỗng
    id: z.string().min(1, 'Product ID is required'),

    // Tên sản phẩm: phải là một chuỗi không rỗng
    name: z.string().min(1, 'Product name is required'),

    // Giá sản phẩm: phải là một chuỗi không rỗng và đại diện cho số lớn hơn hoặc bằng 0
    price: z.string().min(1, "Price is required").refine(value => !isNaN(Number(value)) && Number(value) >= 0, {
        message: 'Price must be a valid number and greater than or equal to 0',
    }),

    // Mô tả sản phẩm: có thể là một chuỗi, không bắt buộc
    description: z.string().optional(),

    // Giá khuyến mãi: phải là một chuỗi không rỗng và đại diện cho số lớn hơn hoặc bằng 0
    sale_price: z.string().min(1, "Sale price is required").refine(value => !isNaN(Number(value)) && Number(value) >= 0, {
        message: 'Sale price must be a valid number and greater than or equal to 0',
    }),

    // Ngày bắt đầu khuyến mãi: phải là một chuỗi
    sale_start: z.string().optional(),

    // Ngày kết thúc khuyến mãi: phải là một chuỗi
    sale_end: z.string().optional(),

    // Có biến thể hay không: phải là một số nguyên (0 hoặc 1)
    is_variants: z.number().int().min(0).max(1, 'is_variants must be 0 or 1'),
});

export default productSchema;
