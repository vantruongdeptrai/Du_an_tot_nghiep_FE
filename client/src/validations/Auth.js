import { z } from "zod";

const registerSchema = z
    .object({
        name: z.string().trim().min(1, "Name is required!"),
        email: z.string().trim().email("Email is not valid!"),
        password: z.string().min(8, "Password must be at least 8 characters long!"),
        password_confirmation: z.string().min(8, "Password confirm must be at least 8 characters long!"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords don't match",
        path: ["password_confirmation"], // Đặt thông báo lỗi ở trường xác nhận mật khẩu
    });

const loginSchema = z.object({
    email: z.string().trim().email("Email is not valid!"),
    password: z.string().min(8, "Password must be at least 8 characters long!"),
});

export { registerSchema, loginSchema };
