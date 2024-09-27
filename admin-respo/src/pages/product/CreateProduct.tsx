import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useProduct from "../../hooks/product";
import useCategory from "../../hooks/category";
import { ProductInput, ProductVariant } from "../../api/products/types";
import { InputWithLabel, Sidebar } from "../../components";
import { useColors, useSizes } from "../../hooks/attribute";
import useProductVariant from "../../hooks/product_variants";
import { zodResolver } from "@hookform/resolvers/zod";
import productSchema from "../../api/products/productSchema";

const CreateProduct: React.FC = () => {
    const { categories } = useCategory();
    const { createProduct } = useProduct();
    const { createProductVariant } = useProductVariant();
    const { sizes } = useSizes();
    const { colors } = useColors();
    const nav = useNavigate();

    const [hasVariants, setHasVariants] = useState(false); // State để kiểm tra có biến thể hay không
    const [productId, setProductId] = useState("");

    const {
        register: registerBasic,
        formState: { errors },
        handleSubmit: handleSubmitBasic,
    } = useForm<ProductInput>({
        resolver: zodResolver(productSchema),
    });

    const { register: registerVariant, handleSubmit: handleSubmitVariant } = useForm();

    const onSubmitBasic: SubmitHandler<ProductInput> = async (data) => {
        const price = Number(data.price);
        const sale_price = Number(data.sale_price);
        const startDate = new Date(data.sale_start);
        const endDate = new Date(data.sale_end);

        if (price < 0 || sale_price < 0) {
            toast.error("Giá không được nhỏ hơn 0.");
            return;
        }
        if (price < sale_price) {
            toast.error("Giá cơ bản phải lớn hơn giá khuyến mãi.");
            return;
        }
        if (startDate > endDate) {
            toast.error("Ngày bắt đầu phải trước ngày kết thúc.");
            return;
        }

        const product = await createProduct(data);
        setProductId(product.product.id);

        if (hasVariants) {
            // Sau khi tạo sản phẩm, sẽ chuyển đến form tạo biến thể
            setHasVariants(true);
        } else {
            nav("/products");
        }
    };

    const onSubmitVariant: SubmitHandler<ProductVariant> = async (data) => {
        const variantsData = {
            product_id: `${productId}`, // ID sản phẩm từ form cơ bản
            color_id: data.color_id, // ID màu bạn chọn
            size_id: data.size_id, // ID kích cỡ bạn chọn
            quantity: data.quantity, // số lượng bạn nhập
            image: data.image, // URL hình ảnh bạn nhập
            price: data.price, // giá biến thể
            sku: data.sku,
            status: "1", // Hoặc giá trị bạn muốn
        };

        // Tạo biến thể sản phẩm
        await createProductVariant(variantsData);
        console.log(variantsData);
        if (!productId) {
            toast.error("Need Add Product Before You Add Variant!");
            return;
        }
        toast.success("Create Variants Success!");
        nav("/products"); // Điều hướng về danh sách sản phẩm
    };

    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="hover:bg-blackPrimary bg-whiteSecondary w-full">
                <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
                    <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
                        <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                            Add New Product
                        </h2>
                    </div>

                    {/* Form thông tin cơ bản */}
                    <form onSubmit={handleSubmitBasic(onSubmitBasic)}>
                        <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
                            <div>
                                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                    Basic information
                                </h3>
                                <div className="mt-4 flex flex-col gap-5">
                                    <InputWithLabel label="Tên sản phẩm">
                                        <input
                                            className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                            {...registerBasic("name")}
                                            type="text"
                                            placeholder="Nhập tên sản phẩm..."
                                        />
                                    </InputWithLabel>
                                    {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}

                                    <InputWithLabel label="Mô tả">
                                        <textarea
                                            className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-40 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 py-2"
                                            {...registerBasic("description")}
                                            placeholder="Nhập mô tả sản phẩm..."
                                            rows={4}
                                            cols={50}
                                        />
                                    </InputWithLabel>
                                    {errors.description && (
                                        <span className="text-sm text-red-500">{errors.description.message}</span>
                                    )}

                                    <InputWithLabel label="Danh mục">
                                        <select
                                            {...registerBasic("category_id")}
                                            className="w-full h-10 dark:bg-blackPrimary bg-white border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                                        >
                                            <option value="">Danh muc</option>
                                            {categories.map((cat, index) => (
                                                <option key={index} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </InputWithLabel>
                                </div>

                                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                                    Giá & Tồn kho
                                </h3>
                                <div className="mt-4 flex flex-col gap-5">
                                    <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                                        <div>
                                            <InputWithLabel label="Giá cơ bản">
                                                <input
                                                    className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                                    type="number"
                                                    placeholder="Nhập giá cơ bản sản phẩm..."
                                                    {...registerBasic("price")}
                                                />
                                            </InputWithLabel>
                                            {errors.price && (
                                                <span className="text-sm text-red-500">{errors.price.message}</span>
                                            )}
                                        </div>

                                        <div>
                                            <InputWithLabel label="Giá khuyến mãi">
                                                <input
                                                    type="number"
                                                    className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                                    placeholder="Nhập giá khuyến mãi..."
                                                    {...registerBasic("sale_price")}
                                                />
                                            </InputWithLabel>
                                            {errors.sale_price && (
                                                <span className="text-sm text-red-500">
                                                    {errors.sale_price.message}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                                        <InputWithLabel label="Ngày bắt đầu khuyến mãi">
                                            <input
                                                className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                                type="date"
                                                {...registerBasic("sale_start")}
                                            />
                                        </InputWithLabel>

                                        <InputWithLabel label="Ngày kết thúc khuyến mãi">
                                            <input
                                                className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                                type="date"
                                                {...registerBasic("sale_end")}
                                            />
                                        </InputWithLabel>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-8">
                            <>
                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Checkbox</h3>
                                <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                type="checkbox"
                                                {...registerBasic("new_product")}
                                            />
                                            <label
                                                htmlFor="vue-checkbox-list"
                                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                New Product
                                            </label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                type="checkbox"
                                                {...registerBasic("best_seller_product")}
                                            />
                                            <label
                                                htmlFor="react-checkbox-list"
                                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Best Seller Product
                                            </label>
                                        </div>
                                    </li>
                                    <li className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                type="checkbox"
                                                {...registerBasic("featured_product")}
                                            />
                                            <label
                                                htmlFor="angular-checkbox-list"
                                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Featured Product
                                            </label>
                                        </div>
                                    </li>
                                    <li className="w-full dark:border-gray-600">
                                        <div className="flex items-center ps-3">
                                            <input
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                                type="checkbox"
                                                checked={hasVariants}
                                                onChange={() => setHasVariants(!hasVariants)} // Thay đổi state khi nhấn checkbox
                                            />
                                            <label
                                                htmlFor="laravel-checkbox-list"
                                                className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                                            >
                                                Sản phẩm có Biến thể
                                            </label>
                                        </div>
                                    </li>
                                </ul>
                            </>
                        </div>

                        <div className="flex justify-center mt-10">
                            <button
                                type="submit"
                                className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
                            >
                                Thêm sản phẩm
                            </button>
                        </div>
                    </form>

                    {/* Form cho biến thể sản phẩm */}
                    {hasVariants && (
                        <form onSubmit={handleSubmitVariant(onSubmitVariant)}>
                            <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
                                <div>
                                    <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                                        Thêm Biến Thể Sản Phẩm
                                    </h3>
                                    <div className="mt-4 flex flex-col gap-5">
                                        <InputWithLabel label="Màu sắc">
                                            <select
                                                {...registerVariant("color_id")}
                                                className="w-full h-10 dark:bg-blackPrimary bg-white border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                                            >
                                                <option value="">Chọn màu sắc</option>
                                                {colors.map((color) => (
                                                    <option key={color.id} value={color.id}>
                                                        {color.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </InputWithLabel>

                                        <InputWithLabel label="Kích cỡ">
                                            <select
                                                {...registerVariant("size_id")}
                                                className="w-full h-10 dark:bg-blackPrimary bg-white border border-gray-600 dark:text-whiteSecondary text-blackPrimary outline-0 pl-3 pr-8 cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                                            >
                                                <option value="">Chọn kích cỡ</option>
                                                {sizes.map((size) => (
                                                    <option key={size.id} value={size.id}>
                                                        {size.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </InputWithLabel>

                                        <InputWithLabel label="Số lượng">
                                            <input
                                                type="number"
                                                {...registerVariant("quantity")}
                                                className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400`}
                                                placeholder="Nhập số lượng..."
                                            />
                                        </InputWithLabel>

                                        <InputWithLabel label="Hình ảnh">
                                            <input
                                                type="text"
                                                {...registerVariant("image")}
                                                className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400`}
                                                placeholder="Nhập URL hình ảnh..."
                                            />
                                        </InputWithLabel>

                                        <InputWithLabel label="Giá">
                                            <input
                                                type="number"
                                                {...registerVariant("price")}
                                                className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400`}
                                                placeholder="Nhập giá biến thể..."
                                            />
                                        </InputWithLabel>
                                        <InputWithLabel label="Sku">
                                            <input
                                                type="text"
                                                {...registerVariant("sku")}
                                                className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400`}
                                                placeholder="Nhập sku..."
                                            />
                                        </InputWithLabel>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-10">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded"
                                >
                                    Thêm Biến Thể
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;