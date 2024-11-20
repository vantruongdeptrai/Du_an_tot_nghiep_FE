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
      console.log(data);

      console.log("Request Data:", data);
      const response = await axios.post(
        "http://127.0.0.1:8000/api/coupons",
        data
      );
      nav("/coupons");
    } catch (error) {
      console.error("Error adding coupon:", error);
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
                Add new coupon
              </h2>
            </div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
            {/* left div */}
            <div>
              <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Basic information
              </h3>
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Coupon Name */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Coupon Name">
                    <input
                      {...register("name")}
                      placeholder="Enter a coupon name..."
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
                  <InputWithLabel label="Discount Amount">
                    <input
                      {...register("discount_amount", { valueAsNumber: true })}
                      placeholder="Enter Discount Amount..."
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
                  <InputWithLabel label="Coupon Description">
                    <input
                      {...register("description")}
                      placeholder="Enter a coupon description..."
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
                  <InputWithLabel label="Min Order Value">
                    <input
                      {...register("min_order_value", { valueAsNumber: true })}
                      placeholder="Enter Min Order Value..."
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
                  <InputWithLabel label="Usage Limit">
                    <input
                      {...register("usage_limit", { valueAsNumber: true })}
                      placeholder="Enter Usage Limit..."
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

                {/* Active Status */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Is Active">
                    <input
                      {...register("is_active")}
                      type="checkbox"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-4 h-4"
                    />
                  </InputWithLabel>
                </div>

                {/* Start Date */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Start Date">
                    <input
                      {...register("start_date")}
                      type="date"
                      className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400"
                    />
                  </InputWithLabel>
                </div>

                {/* End Date */}
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="End Date">
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
                    Add Coupon
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
