import { InputWithLabel, Sidebar } from "../../components";
import { AiOutlineSave } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form"; // Import React Hook Form
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import useCoupon from "../../hooks/coupons";
import { CouponInput } from "../../api/coupons/type";
import couponSchema from "../../api/coupons/schemaCoupon";
import { useEffect } from "react";
import axios from "axios";

const EditCoupon = () => {
  // Khởi tạo các hàm của React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema),
  });

  const { coupon, editCoupon } = useCoupon();
  const nav = useNavigate();

  // Hàm xử lý khi form được submit
  const onSubmit: SubmitHandler<CouponInput> = async (data) => {
    try {
      // Chuyển đổi 'is_active' từ chuỗi thành số hoặc boolean
      data.is_active = parseInt(data.is_active as string, 10); // Chuyển thành số (1 hoặc 0)

      // Gửi PUT request để cập nhật coupon
      const response = await axios.put(
        `http://127.0.0.1:8000/api/coupons/${coupon?.id}`, // Dùng coupon.id để lấy ID của mã giảm giá
        data
      );

      if (response.status === 200) {
        alert("Coupon updated successfully!");
        nav("/coupons");
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      alert("Failed to update coupon. Please try again.");
    }
  };

  // Lấy dữ liệu danh mục hiện tại để hiển thị giá trị ban đầu
  useEffect(() => {
    if (coupon) {
      setValue("name", coupon.name); // Gán giá trị ban đầu cho tên mã giảm giá
      setValue("description", coupon.description);
      setValue("discount_amount", coupon.discount_amount);
      setValue("min_order_value", coupon.min_order_value);
      setValue("usage_limit", coupon.usage_limit);
      setValue("is_active", coupon.is_active.toString()); // Đảm bảo is_active được gán là "1" hoặc "0" cho select
      setValue("start_date", coupon.start_date);
      setValue("end_date", coupon.end_date);
      setValue("max_order_value", coupon.max_order_value); // Gán giá trị cho max_order_value
    }
  }, [coupon, setValue]);

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Sửa mã giảm giá
              </h2>
            </div>
          </div>

          {/* Form sửa mã giảm giá */}
          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* left div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin cơ bản
              </h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Tên mã giảm giá">
                    <input
                      {...register("name")}
                      placeholder="Enter coupon name..."
                      type="text"
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                    />
                  </InputWithLabel>
                  {errors.name && (
                    <span className="text-sm text-red-500">
                      {errors.name.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Mức giảm giá (%)">
                    <input
                      {...register("discount_amount")}
                      placeholder="Enter Discount Amount..."
                      type="number"
                      defaultValue={0}
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                    />
                  </InputWithLabel>
                  {errors.discount_amount && (
                    <span className="text-sm text-red-500">
                      {errors.discount_amount.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Mô tả mã giảm giá">
                    <input
                      {...register("description")}
                      placeholder="Enter coupon description..."
                      type="text"
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                    />
                  </InputWithLabel>
                  {errors.description && (
                    <span className="text-sm text-red-500">
                      {errors.description.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Giới hạn sử dụng">
                    <input
                      {...register("usage_limit")}
                      placeholder="Enter usage limit..."
                      type="number"
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                    />
                  </InputWithLabel>
                  {errors.usage_limit && (
                    <span className="text-sm text-red-500">
                      {errors.usage_limit.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Giá trị đơn hàng tối thiểu">
                    <input
                      {...register("min_order_value")}
                      placeholder="Enter minimum order value..."
                      type="number"
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                    />
                  </InputWithLabel>
                  {errors.min_order_value && (
                    <span className="text-sm text-red-500">
                      {errors.min_order_value.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Giá trị đơn hàng tối đa">
                    <input
                      {...register("max_order_value")}
                      placeholder="Enter maximum order value..."
                      type="number"
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                    />
                  </InputWithLabel>
                  {errors.max_order_value && (
                    <span className="text-sm text-red-500">
                      {errors.max_order_value.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <label>Trạng thái</label>
                  <select
                    {...register("is_active")}
                    className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                  >
                    <option value="1">Kích hoạt</option>
                    <option value="0">Không kích hoạt</option>
                  </select>
                  {errors.is_active && (
                    <span className="text-sm text-red-500">
                      {errors.is_active.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Ngày bắt đầu">
                    <input
                      {...register("start_date")}
                      type="date"
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                    />
                  </InputWithLabel>
                  {errors.start_date && (
                    <span className="text-sm text-red-500">
                      {errors.start_date.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Ngày kết thúc">
                    <input
                      {...register("end_date")}
                      type="date"
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                    />
                  </InputWithLabel>
                  {errors.end_date && (
                    <span className="text-sm text-red-500">
                      {errors.end_date.message}
                    </span>
                  )}
                </div>
                <div className="mt-4 flex flex-col gap-5">
                  <button
                    type="submit"
                    className="focus:outline-none text-white bg-black hover:border hover:border-white focus:ring-1 focus:ring-white font-medium rounded-none text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    Cập nhật
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoupon;
