import { z } from "zod";
const permissionSchema = z.object({
    name: z.string().trim().min(1, "Permission is required!")
});

export default permissionSchema