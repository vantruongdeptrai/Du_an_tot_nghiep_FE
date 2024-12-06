import { InputWithLabel, Sidebar } from "../../components";
import { AiOutlineSave } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import useCoupon from "../../hooks/coupons";
import { CouponInput } from "../../api/coupons/type";
import couponSchema from "../../api/coupons/schemaCoupon";
import axios from "axios"; // Import axios for API request

const CreateCoupon = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CouponInput>({
    resolver: zodResolver(couponSchema),
  });

  const nav = useNavigate();

  const onSubmit: SubmitHandler<CouponInput> = async (data) => {
    try {
      console.log("Dữ liệu gửi:", data);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/coupons",
        data
      );
      nav("/coupons");
    } catch (error) {
      console.error("Lỗi khi thêm mã giảm giá:", error);
    }
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thêm mã giảm giá mới
              </h2>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* left div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Thông tin cơ bản
              </h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Coupon Name */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Mã giảm giá">
                    <input
                      {...register("name")}
                      placeholder="Nhập tên mã giảm giá ..."
                      type="text"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                  {errors.name && (
                    <span className="text-sm text-red-500">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                {/* Discount Amount */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Phần trăm giảm giá">
                    <input
                      {...register("discount_amount", { valueAsNumber: true })}
                      placeholder="Nhập phần trăm giảm giá..."
                      type="number"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                  {errors.discount_amount && (
                    <span className="text-sm text-red-500">
                      {errors.discount_amount.message}
                    </span>
                  )}
                </div>

                {/* Coupon Description */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Mô tả mã giảm giá">
                    <input
                      {...register("description")}
                      placeholder="Nhập mô tả mã giảm giá..."
                      type="text"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                  {errors.description && (
                    <span className="text-sm text-red-500">
                      {errors.description.message}
                    </span>
                  )}
                </div>

                {/* Min Order Value */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Giá trị đơn hàng tối thiểu">
                    <input
                      {...register("min_order_value", { valueAsNumber: true })}
                      placeholder="Nhập giá trị đơn hàng tối thiểu ..."
                      type="number"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                  {errors.min_order_value && (
                    <span className="text-sm text-red-500">
                      {errors.min_order_value.message}
                    </span>
                  )}
                </div>

                {/* Usage Limit */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Giới hạn số lần được dùng">
                    <input
                      {...register("usage_limit", { valueAsNumber: true })}
                      placeholder="Nhập giới hạn số lần dùng"
                      type="number"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                  {errors.usage_limit && (
                    <span className="text-sm text-red-500">
                      {errors.usage_limit.message}
                    </span>
                  )}
                </div>

                {/* Max Order Value */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Giảm giá tối đa">
                    <input
                      {...register("max_order_value", { valueAsNumber: true })}
                      placeholder="Nhập giá trị giảm giá tối đa ..."
                      type="number"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                  {errors.max_order_value && (
                    <span className="text-sm text-red-500">
                      {errors.max_order_value.message}
                    </span>
                  )}
                </div>

                {/* Active Status */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Đang hoạt động">
                    <input
                      {...register("is_active")}
                      type="checkbox"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-4 h-4"
                    />
                  </InputWithLabel>
                </div>

                {/* Start Date */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Ngày bắt đầu">
                    <input
                      {...register("start_date")}
                      type="date"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                </div>

                {/* End Date */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Ngày kết thúc">
                    <input
                      {...register("end_date")}
                      type="date"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                </div>

                <div className="mt-4 flex flex-col gap-5">
                  <button
                    type="submit"
                    className="focus:outline-none text-white bg-black hover:border hover:border-white focus:ring-1 focus:ring-white font-medium rounded-none text-sm px-5 py-2.5 me-2 mb-2"
                  >
                    Thêm mã giảm giá
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

export default CreateCoupon;
