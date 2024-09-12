import { z } from "zod";
const operatingCostSchema = z.object({
    cost_type: z.string().min(1, 'Cost type is required'),
    description: z.string(),
    amount: z.preprocess(
        (value) => {
            // Chuyển chuỗi rỗng thành undefined
            if (value === "" || value === undefined) {
                return undefined;
            }
            // Chuyển giá trị thành số nếu có thể
            return Number(value);
        },
        z.number().positive("Amount must be greater than 0.")
    ),
});

export default operatingCostSchema