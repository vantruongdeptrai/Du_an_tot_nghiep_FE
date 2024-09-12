import { InputWithLabel, Sidebar } from "../../components";
import { AiOutlineSave } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form"; // Import React Hook Form
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { OperatingCostInput } from "../../api/operating_cost/type";
import operatingCostSchema from "../../api/operating_cost/schemaOperatingCost";
import useOperatingCost from "../../hooks/operating_cost";
import { useEffect } from "react";

const EditOperatingCost = () => {
    // Khởi tạo các hàm của React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<OperatingCostInput>({
        resolver: zodResolver(operatingCostSchema),
    });

    const { operatingCost ,editOperatingCost } = useOperatingCost();
    const nav = useNavigate();
    // Hàm xử lý khi form được submit
    const onSubmit: SubmitHandler<OperatingCostInput> = (data) => {
        editOperatingCost(data);
        nav("/operating-costs");
    };

    useEffect(() => {
        if(operatingCost) {
            setValue("cost_type", operatingCost.cost_type)
            setValue("amount", operatingCost.amount)
            setValue("description", operatingCost.description)
        }
    }, [operatingCost, setValue])
    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
                <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
                    <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                Edit operating cost
                            </h2>
                        </div>
                        <div className="flex gap-x-2 max-[370px]:flex-col max-[370px]:gap-2 max-[370px]:items-center">
                            <button className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-48 py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2">
                                <AiOutlineSave className="dark:text-whiteSecondary text-blackPrimary text-xl" />
                                <span className="dark:text-whiteSecondary text-blackPrimary font-medium">
                                    Save draft
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Add Category section here  */}
                    <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
                        {/* left div */}
                        <div>
                            <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                Basic information
                            </h3>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mt-4 flex flex-col gap-5">
                                    <InputWithLabel label="Cost Type">
                                        <input
                                            {...register("cost_type")}
                                            placeholder="Enter a permission name..."
                                            type="text"
                                            className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                        />
                                    </InputWithLabel>
                                    {errors.cost_type && <span className="text-sm text-red-500">{errors.cost_type.message}</span>}
                                </div>
                                <div className="mt-4 flex flex-col gap-5">
                                    <InputWithLabel label="Amount">
                                        <input
                                            {...register("amount")}
                                            placeholder="Enter Discount Amount..."
                                            type="number"
                                            defaultValue={0}
                                            className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                        />
                                    </InputWithLabel>
                                    {errors.amount && <span className="text-sm text-red-500">{errors.amount.message}</span>}
                                </div>
                                <div className="mt-4 flex flex-col gap-5">
                                    <InputWithLabel label="Description">
                                        <input
                                            {...register("description")}
                                            placeholder="Enter a counpn description..."
                                            type="text"
                                            className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                        />
                                    </InputWithLabel>
                                    {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
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
export default EditOperatingCost;
