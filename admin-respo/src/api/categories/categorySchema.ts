import { z } from "zod";
const categorySchema = z.object({
    name: z.string().min(1, 'Category name is required'),
    slug: z.string().min(1, 'Category slug is required')
});

export default categorySchema