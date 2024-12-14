import { z } from "zod";
const couponSchema = z.object({
    name: z.string().trim().min(1, "Vui lòng nhập tên mã giảm giá"),
    discount_amount: z
        .string()
        .min(1, "Vui lòng nhập chiết khấu phần trăm")
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 1 && Number(value) <= 100, {
            message: "Phần trăm chiết khấu phải nằm trong khoảng từ 1 đến 100.",
        }),

    min_order_value: z
        .string()
        .min(1, "Vui lòng nhập giá trị tối thiểu.")
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 10000, {
            message: "Giá trị tối thiểu phải lớn hơn 10.000Vnđ.",
        }),
    max_order_value: z
        .string()
        .min(1, "Vui lòng nhập giá trị tối đa.")
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 10000, {
            message: "Giá trị tối đa phải lớn hơn 10.000Vnđ.",
        }),
    usage_limit: z
        .string()
        .min(1, "Vui lòng nhập giới hạn sử dụng mã.")
        .refine((value) => !isNaN(Number(value)) && Number(value) >= 0, {
            message: "Nhập giới hạn sử dụng mã phải lớn hơn 0.",
        }),
    description: z.string(),
    is_active: z.string(),
    start_date: z.string().refine((date) => !isNaN(new Date(date).getTime()), "Ngày bắt đầu phải là ngày hợp lệ."),
    end_date: z.string().refine((date) => !isNaN(new Date(date).getTime()), "Ngày kết thúc phải là ngày hợp lệ."),
});

export default couponSchema;
