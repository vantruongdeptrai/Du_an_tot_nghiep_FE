import { z } from "zod";
const productSchema = z.object({
    name: z.string().min(1, 'Product name is required'),
    price: z.number().min(1, 'Number price is required'),
    description: z.string(),
});

export default productSchema