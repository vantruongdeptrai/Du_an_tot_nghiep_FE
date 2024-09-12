import { z } from "zod";
const couponSchema = z.object({
    name: z.string().trim().min(1, "Coupon is required!"),
    discount_amount: z.preprocess(
        (value) => {
            // Chuyển chuỗi rỗng thành undefined
            if (value === "" || value === undefined) {
                return undefined;
            }
            // Chuyển giá trị thành số nếu có thể
            return Number(value);
        },
        z.number().positive("The discount amount must be greater than 0.")
    ),
    description: z.string(),
});

export default couponSchema;
