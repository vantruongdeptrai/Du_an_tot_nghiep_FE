import { z } from "zod";

const registerSchema = z
    .object({
        name: z.string().trim().min(1, "Họ tên bắt buộc!"),
        email: z.string().trim().email("Email không hợp lệ!"),
        password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự!"),
        password_confirmation: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự!"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Mật khẩu không hớp",
        path: ["password_confirmation"], // Đặt thông báo lỗi ở trường xác nhận mật khẩu
    });

const loginSchema = z.object({
    email: z.string().trim().email("Email không hợp lệ!"),
    password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự!"),
});

const forgotPasswordSchema = z.object({
    email: z.string().trim().email("Email không hợp lệ!"),
});

export { registerSchema, loginSchema, forgotPasswordSchema };
