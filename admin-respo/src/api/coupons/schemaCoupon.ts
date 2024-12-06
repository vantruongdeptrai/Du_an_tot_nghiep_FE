import { z } from "zod";
const couponSchema = z.object({
    name: z.string().trim().min(1, "Coupon is required!"),
    discount_amount: z.preprocess(
        (value) => {
          if (value === "" || value === undefined) {
            return undefined;
          }
          
          return Number(value);
        },
        z
          .number()
          .min(1, "The discount amount must be greater than 0.")  
          .refine((value) => value > 0, "The discount amount must be greater than 0.")  
      )
        .refine((value) => value !== undefined, "Discount amount is required!"), 
      
    min_order_value: z.preprocess(
        (value) => {
            // Chuyển chuỗi rỗng thành undefined
            if (value === "" || value === undefined) {
                return undefined;
            }
            // Chuyển giá trị thành số nếu có thể
            return Number(value);
        },
        z.number().positive("Giá trị tối thiểu phải lớn hơn 0.")
    ),
    max_order_value: z.preprocess(
      (value) => {
          // Chuyển chuỗi rỗng thành undefined
          if (value === "" || value === undefined) {
              return undefined;
          }
          // Chuyển giá trị thành số nếu có thể
          return Number(value);
      },
      z.number().positive("Giá trị tối đa phải lớn hơn 0.")
  ),
    usage_limit: z.preprocess(
        (value) => {
            // Chuyển chuỗi rỗng thành undefined
            if (value === "" || value === undefined) {
                return undefined;
            }
            // Chuyển giá trị thành số nếu có thể
            return Number(value);
        },
        z.number().positive("The usage limit must be greater than 0.")
    ),
    description: z.string(),
    is_active: z.string(),
  start_date: z
    .string()
    .refine(
      (date) => !isNaN(new Date(date).getTime()),
      "Start date must be a valid date"
    ),
  end_date: z
    .string()
    .refine(
      (date) => !isNaN(new Date(date).getTime()),
      "End date must be a valid date"
    )
});

export default couponSchema;
