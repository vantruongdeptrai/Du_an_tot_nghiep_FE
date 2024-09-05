import { InputWithLabel, Sidebar } from "../../components";
import { AiOutlineSave } from "react-icons/ai";
import { SubmitHandler, useForm } from "react-hook-form"; // Import React Hook Form
import { permissionInput } from "../../api/permissions/types";
import usePermission from "../../hooks/permissions";
import { useNavigate } from "react-router-dom";
import permissionSchema from "../../api/permissions/permissionSchema";
import { zodResolver } from "@hookform/resolvers/zod"

const CreatePermission = () => {
    // Khởi tạo các hàm của React Hook Form
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<permissionInput>({
        resolver: zodResolver(permissionSchema)
    });

    const { addPermission } = usePermission();
    const nav = useNavigate();
    // Hàm xử lý khi form được submit
    const onSubmit: SubmitHandler<permissionInput> = (data) => {
        addPermission(data);
        nav("/permissions");
    };
    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
                <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
                    <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                Add new permission
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
                                    <InputWithLabel label="Permission name">
                                        <input
                                            {...register("name")}
                                            placeholder="Enter a permission name..."
                                            type="text"
                                            className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                        />

                                    </InputWithLabel>
                                    {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                                </div>
                                <div className="mt-4 flex flex-col gap-5">
                                    <button
                                        type="submit"
                                        className="focus:outline-none text-white bg-black hover:border hover:border-white focus:ring-1 focus:ring-white font-medium rounded-none text-sm px-5 py-2.5 me-2 mb-2"
                                    >
                                        Thêm mới
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
export default CreatePermission;


