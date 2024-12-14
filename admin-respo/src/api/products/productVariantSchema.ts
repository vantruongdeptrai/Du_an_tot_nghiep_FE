import { z } from "zod";

// Định nghĩa schema cho sản phẩm
const productVariantSchema = z.object({
    description: z.string().min(1, "Mô tả sản phẩm là bắt buộc."), // Mô tả sản phẩm là bắt buộc
    category_id: z.string().min(1, "Danh mục là bắt buộc."), // Danh mục là bắt buộc
    quantity: z
        .string()
        .min(1, "số lượng là bắt buộc")
        .transform((value) => Number(value))
        .refine((value) => value >= 0, {
            message: "Số lượng phải là số và lớn hơn hoặc bằng 0.",
        }),
    price: z
        .string()
        .min(1, "Vui lòng nhập giá sản phẩm biến thể.")
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
            message: "Số lượng phải là số và lớn hơn hoặc bằng 0.",
        }),
    sale_price: z
        .string()
        .min(1, "Vui lòng nhập giá sản phẩm biến thể.")
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
            message: "Số lượng phải là số và lớn hơn hoặc bằng 0.",
        }),
});

export default productVariantSchema;
