import { useEffect, useState } from "react";
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
// import { zodResolver } from "@hookform/resolvers/zod";
// import productSchema from "../../api/products/productSchema";

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
        setValue,
    } = useForm<ProductInput>({
        resolver: zodResolver(productSchema)
    });

    const { register: registerVariant, handleSubmit: handleSubmitVariant } = useForm();

    // useEffect(() => {
    //     if (hasVariants) {
    //         setValue("price", ""); // Reset giá trị `price` khi chọn "Có biến thể"
    //     }
    // }, [hasVariants, setValue]);

    const onSubmitBasic: SubmitHandler<ProductInput> = async (data) => {
        const price = Number(data.price);
        const sale_price = Number(data.sale_price);

        if(price < sale_price) {
            toast.error("Price must be greater than sale_price");
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

    // Hàm xử lý khi submit form biến thể sản phẩm
    const onSubmitVariant: SubmitHandler<ProductVariant> = async () => {
        const variantsData: ProductVariant = {
            product_id: Number(productId), // ID sản phẩm
            colors: selectedVariants.map(({ colorId }) => Number(colorId)), // Tạo mảng ID màu
            sizes: selectedVariants.map(({ sizeId }) => Number(sizeId)), // Tạo mảng ID kích cỡ
            quantities: {}, // Khởi tạo quantities
            prices: {}, // Khởi tạo prices
            images: {}, // Khởi tạo images
            status: "1", // Trạng thái
        };

        // Duyệt qua từng variant để cập nhật quantities, prices, và images
        selectedVariants.forEach(({ sizeId, colorId }) => {
            const variantKey = `${colorId}-${sizeId}`;
            const { price = 0, image = "", quantity = 0 } = variantDetails[variantKey] || {};

            variantsData.quantities[variantKey] = Number(quantity); // Thêm số lượng
            variantsData.prices[variantKey] = Number(price); // Thêm giá
            variantsData.images[variantKey] = image || ""; // Thêm URL hình ảnh
        });

        if (!productId) {
            toast.error("Cần thêm sản phẩm trước khi thêm biến thể!");
            return;
        }

        // Tạo biến thể sản phẩm
        await createProductVariant(variantsData);
        console.log(variantsData);

        toast.success("Tạo biến thể thành công!");
        nav("/products");
    };

    // State lưu trữ biến thể đã chọn và chi tiết biến thể
    const [selectedVariants, setSelectedVariants] = useState<{ sizeId: string; colorId: string }[]>([]);
    const [variantDetails, setVariantDetails] = useState<{
        [key: string]: { price: string; image: string; quantity: string };
    }>({});

    // Hàm xử lý khi chọn hoặc bỏ chọn biến thể
    const handleVariantChange = (sizeId: string, colorId: string) => {
        setSelectedVariants((prevSelected) => {
            if (prevSelected.some((variant) => variant.sizeId === sizeId && variant.colorId === colorId)) {
                return prevSelected.filter((variant) => !(variant.sizeId === sizeId && variant.colorId === colorId));
            } else {
                return [...prevSelected, { sizeId, colorId }];
            }
        });
    };

    // Cập nhật thông tin của biến thể
    const handleVariantDetailChange = (key: string, field: string, value: string) => {
        setVariantDetails((prevDetails) => ({
            ...prevDetails,
            [key]: {
                ...prevDetails[key],
                [field]: value,
            },
        }));
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
                    <form className="mt-5" onSubmit={handleSubmitBasic(onSubmitBasic)}>
                        <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
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
                                                {!hasVariants ? (
                                                    <input
                                                        className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                                        type="number"
                                                        placeholder="Nhập giá cơ bản sản phẩm..."
                                                        {...registerBasic("price")}
                                                    />
                                                ) : (
                                                    <input
                                                        disabled
                                                        className={`dark:bg-blackPrimary bg-[#ccc] dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                                                        type="number"
                                                        placeholder="Nhập giá cơ bản sản phẩm..."
                                                    />
                                                )}
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
                                                {...registerBasic("is_variants")}
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
                        <form className="mt-5" onSubmit={handleSubmitVariant(onSubmitVariant)}>
                            <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 gap-x-10  max-xl:gap-y-10">
                                <div>
                                    <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                                        Thêm Biến Thể Sản Phẩm
                                    </h3>
                                    <div className="mt-4 flex flex-col gap-5">
                                        {/* Tổ hợp Size-Color */}
                                        <div className="">
                                            <InputWithLabel label="Chọn size và màu sắc">
                                                <div className="flex flex-wrap gap-28">
                                                    {sizes.map((size) =>
                                                        colors.map((color) => {
                                                            const variantKey = `${color.id}-${size.id}`;
                                                            return (
                                                                <div key={variantKey} className="">
                                                                    <label className="checkbox-label">
                                                                        <input
                                                                            type="checkbox"
                                                                            value={variantKey}
                                                                            checked={selectedVariants.some(
                                                                                (variant) =>
                                                                                    variant.sizeId === size.id &&
                                                                                    variant.colorId === color.id
                                                                            )}
                                                                            onChange={() =>
                                                                                handleVariantChange(size.id, color.id)
                                                                            }
                                                                        />
                                                                        {`${size.name}-${color.name}`}
                                                                    </label>

                                                                    {selectedVariants.some(
                                                                        (variant) =>
                                                                            variant.sizeId === size.id &&
                                                                            variant.colorId === color.id
                                                                    ) && (
                                                                        <div className="variant-details mt-2">
                                                                            <h4>{`Chi tiết cho ${variantKey}`}</h4>
                                                                            <InputWithLabel label="Giá">
                                                                                <input
                                                                                    type="number"
                                                                                    placeholder="Nhập giá"
                                                                                    value={
                                                                                        variantDetails[variantKey]
                                                                                            ?.price || ""
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleVariantDetailChange(
                                                                                            variantKey,
                                                                                            "price",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </InputWithLabel>
                                                                            <InputWithLabel label="Hình ảnh">
                                                                                <input
                                                                                    type="text"
                                                                                    placeholder="Nhập URL hình ảnh"
                                                                                    value={
                                                                                        variantDetails[variantKey]
                                                                                            ?.image || ""
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleVariantDetailChange(
                                                                                            variantKey,
                                                                                            "image",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </InputWithLabel>
                                                                            <InputWithLabel label="Số lượng">
                                                                                <input
                                                                                    type="number"
                                                                                    placeholder="Nhập số lượng"
                                                                                    value={
                                                                                        variantDetails[variantKey]
                                                                                            ?.quantity || ""
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleVariantDetailChange(
                                                                                            variantKey,
                                                                                            "quantity",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </InputWithLabel>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </InputWithLabel>
                                        </div>
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
