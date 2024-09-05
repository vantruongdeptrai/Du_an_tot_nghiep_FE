import { ImageUpload, InputWithLabel, Sidebar, SimpleInput } from "../../components";
import { categoryInput } from "../../api/categories/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import categorySchema from "../../api/categories/categorySchema";
import  useCategory from "../../hooks/category";
import { zodResolver } from "@hookform/resolvers/zod"
const CreateCategory = () => {
    // Khởi tạo các hàm của React Hook Form
    const {
        register,
        handleSubmit,
        formState:{errors},
    } = useForm<categoryInput>({
        resolver: zodResolver(categorySchema)
    });
    const {createCategory} = useCategory();
    const nav = useNavigate();
    // Hàm xử lý khi form được submit
    const onSubmit: SubmitHandler<categoryInput> = (data) => {
        createCategory(data);
        nav("/categories");
    };
    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
                <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
                    <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                Add new category
                            </h2>
                        </div>
                    </div>

                    {/* Add Category section here  */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
                            {/* left div */}
                            <div>
                                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                    Basic information
                                </h3>

                                <div className="mt-4 flex flex-col gap-5">
                                    <InputWithLabel label="Category name">
                                        <SimpleInput {...register("name")} type="text" placeholder="Enter a category name..." />
                                        {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}
                                    </InputWithLabel>

                                    <InputWithLabel label="Category slug">
                                        <SimpleInput {...register("slug")} type="text" placeholder="Enter a category slug..." />
                                        {errors.slug && <span className="text-sm text-red-500">{errors.slug.message}</span>}
                                    </InputWithLabel>
                                </div>
                            </div>
                            {/* right div */}
                            <div>
                                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                    Category image
                                </h3>

                                <ImageUpload />
                            </div>
                            <div className="mt-4 flex flex-col gap-5">
                                <button
                                    type="submit"
                                    className="focus:outline-none text-white bg-black hover:border hover:border-white focus:ring-1 focus:ring-white font-medium rounded-none text-sm px-5 py-2.5 me-2 mb-2"
                                >
                                    Thêm mới
                                </button>
                            </div>
                        </div>
                    </form>
                    
                </div>
            </div>
        </div>
    );
};
export default CreateCategory;
