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
    const safeCategories = Array.isArray(categories) ? categories : [];
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

    // useEffect(() => {
    //     if (hasVariants) {
    //         setValue("price", ""); // Reset giá trị `price` khi chọn "Có biến thể"
    //     }
    // }, [hasVariants, setValue]);

    const onSubmitBasic: SubmitHandler<ProductInput> = async (data) => {
        try {
            if (hasVariants) {
                if (selectedVariants.length === 0) {
                    toast.error("Vui lòng thêm ít nhất một biến thể cho sản phẩm!");
                    return;
                }
                // Sau khi tạo sản phẩm, sẽ chuyển đến form tạo biến thể
                const product = await createProduct(data, selectedFile || undefined);
                console.log(data);

                setProductId(product.product.id);
                setHasVariants(true);
            } else {
                toast.error("Vui lòng thêm biến thể cho sản phẩm!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Hàm xử lý khi submit form biến thể sản phẩm
    const onSubmitVariant: SubmitHandler<ProductVariant> = async () => {
        const files: File[] = []; // Mảng chứa tất cả các file ảnh
        const variantsData: ProductVariant = {
            product_id: Number(productId), // ID sản phẩm
            colors: selectedVariants.map(({ colorId }) => Number(colorId)), // Tạo mảng ID màu
            sizes: selectedVariants.map(({ sizeId }) => Number(sizeId)), // Tạo mảng ID kích cỡ
            quantities: {}, // Khởi tạo quantities
            prices: {}, // Khởi tạo prices
            sale_prices: {},
            sale_starts: {},
            sale_ends: {},
            images: {},
            status: "1", // Trạng thái
        };

        let hasError = false;

        // Duyệt qua từng variant để cập nhật quantities, prices, và images
        selectedVariants.forEach(({ sizeId, colorId }) => {
            const variantKey = `${colorId}-${sizeId}`;
            const {
                price = 0,
                quantity = 0,
                sale_price = 0,
                sale_start = "",
                sale_end = "",
            } = variantDetails[variantKey] || {};
            const priceNum = Number(price);
            const quantityNum = Number(quantity);
            const salePriceNum = Number(sale_price);
            const startDate = new Date(sale_start);
            const endDate = new Date(sale_end);
            if (!priceNum || !quantityNum || !salePriceNum) {
                toast.error("Vui lòng điền đầy đủ thông tin và giá trị hợp lệ!");
                hasError = true;
                return;
            }
            if (priceNum <= 0) {
                toast.error(`Biến thể ${variantKey}: Vui lòng nhập giá hợp lệ!`);
                hasError = true;
                return;
            }

            if (quantityNum <= 0) {
                toast.error(`Biến thể ${variantKey}: Vui lòng nhập số lượng hợp lệ!`);
                hasError = true;
                return;
            }
            if (salePriceNum <= 0) {
                toast.error(`Biến thể ${variantKey}: Vui lòng nhập giá khuyến mại hợp lệ!`);
                hasError = true;
                return;
            }

            // if (!sale_start || !sale_end) {
            //     toast.error(`Biến thể ${variantKey}: Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc khuyến mãi!`);
            //     hasError = true;
            //     return;
            // }

            if (endDate < startDate) {
                toast.error(`Biến thể ${variantKey}: Ngày kết thúc phải sau ngày bắt đầu!`);
                hasError = true;
                return;
            }

            variantsData.quantities[variantKey] = Number(quantity); // Thêm số lượng
            variantsData.prices[variantKey] = Number(price); // Thêm giá
            variantsData.sale_prices[variantKey] = Number(sale_price);
            variantsData.sale_starts[variantKey] = sale_start;
            variantsData.sale_ends[variantKey] = sale_end;
            const file = selectedFileVariants[variantKey]; // Lấy file tương ứng với biến thể

            if (file) {
                files.push(file); // Thêm file vào mảng files
                // Thêm URL tạm thời cho từng file vào trường images
                variantsData.images[variantKey] = file; // Thêm file vào images
            }
        });

        if (!productId) {
            toast.error("Cần thêm sản phẩm trước khi thêm biến thể!");
            return;
        }

        if (hasError) {
            return;
        }

        // Tạo biến thể sản phẩm
        // Tạo biến thể sản phẩm

        // Kiểm tra nếu có file ảnh được chọn
        await createProductVariant(variantsData, files);
        console.log("Variant Data:", variantsData);
        console.log(files);

        toast.success("Tạo biến thể thành công!");
        nav("/products");
    };

    // State lưu trữ biến thể đã chọn và chi tiết biến thể
    const [selectedVariants, setSelectedVariants] = useState<{ sizeId: string; colorId: string }[]>([]);
    const [variantDetails, setVariantDetails] = useState<{
        [key: string]: { price: string; quantity: string; sale_price: string; sale_start: string; sale_end: string };
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

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFileVariants, setSelectedFileVariants] = useState<{
        [key: string]: File | null;
    }>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Hàm xử lý khi người dùng chọn file
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, variantKey: string) => {
        const file = event.target.files?.[0] || null;
        setSelectedFile(file);
        setSelectedFileVariants((prevFiles) => ({
            ...prevFiles,
            [variantKey]: file, // Lưu file ảnh vào đối tượng với variantKey
        })); // Lưu file ảnh được chọn
        // Lưu ảnh vào `variantDetails` dựa trên `variantKey`
        // Cập nhật hình ảnh vào `variantDetails` dựa trên `variantKey`
        setVariantDetails((prevDetails) => ({
            ...prevDetails,
            [variantKey]: {
                ...prevDetails[variantKey],
                image: file ? URL.createObjectURL(file) : "", // Lưu URL tạm thời cho ảnh
            },
        }));

        // Tạo URL tạm thời cho ảnh để hiển thị
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };
    return (
        <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
            <Sidebar />
            <div className="w-full hover:bg-blackPrimary bg-whiteSecondary">
                <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
                    <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
                        <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                            Thêm sản phẩm mới
                        </h2>
                    </div>

                    {/* Form thông tin cơ bản */}
                    <form className="mt-5" onSubmit={handleSubmitBasic(onSubmitBasic)}>
                        <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
                            <div>
                                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                                    Thông tin cơ bản
                                </h3>
                                <div className="mt-4 flex flex-col gap-5">
                                    <InputWithLabel label="Tên sản phẩm">
                                        <input
                                            className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-12 px-4 py-2 rounded-lg border border-gray-700 dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 transition-all"
                                            {...registerBasic("name")}
                                            type="text"
                                            placeholder="Nhập tên sản phẩm..."
                                        />
                                    </InputWithLabel>
                                    {errors.name && <span className="text-sm text-red-500">{errors.name.message}</span>}

                                    {/* <InputWithLabel label="Số lượng">
                                        <input
                                            className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-12 px-4 py-2 rounded-lg border border-gray-700 dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 transition-all"
                                            {...registerBasic("quantity")}
                                            type="text"
                                            placeholder="Nhập số lượng..."
                                        />
                                    </InputWithLabel>
                                    {errors.quantity && (
                                        <span className="text-sm text-red-500">{errors.quantity.message}</span>
                                    )} */}

                                    <InputWithLabel label="Mô tả">
                                        <textarea
                                            className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-40 px-4 py-2 rounded-lg border border-gray-700 dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 transition-all"
                                            {...registerBasic("description")}
                                            placeholder="Nhập mô tả sản phẩm..."
                                            rows={4}
                                        />
                                    </InputWithLabel>
                                    {errors.description && (
                                        <span className="text-sm text-red-500">{errors.description.message}</span>
                                    )}

                                    <InputWithLabel label="Ảnh">
                                        <label
                                            htmlFor="category-image"
                                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer dark:bg-blackPrimary bg-whiteSecondary dark:hover:border-gray-600 hover:border-gray-500 transition-all"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg
                                                    className="w-8 h-8 mb-4 text-blackPrimary dark:text-whiteSecondary"
                                                    aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 20 16"
                                                >
                                                    <path
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                    />
                                                </svg>
                                                <p className="mb-2 text-sm text-blackPrimary dark:text-whiteSecondary">
                                                    <span className="font-semibold">Bấm để thêm ảnh</span>{" "}
                                                </p>
                                                <p className="text-xs dark:text-whiteSecondary text-blackPrimary">
                                                    SVG, PNG, JPG or GIF
                                                </p>
                                            </div>
                                            <input
                                                id="category-image"
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </label>

                                        {/* Hiển thị ảnh nếu đã chọn */}
                                        {imagePreview && (
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="mt-4 w-full h-64 object-contain rounded-lg"
                                            />
                                        )}
                                    </InputWithLabel>

                                    <InputWithLabel label="Danh mục">
                                        <select
                                            {...registerBasic("category_id", { required: "Hãy chọn danh mục!" })}
                                            className="w-full h-12 px-4 py-2 rounded-lg border border-gray-600 dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary outline-none dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-500 hover:border-gray-400 transition-all"
                                        >
                                            <option value="">Danh muc</option>
                                            {safeCategories.map((cat, index) => (
                                                <option key={index} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>
                                        )}
                                    </InputWithLabel>
                                </div>

                                {/* <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                                    Giá & Tồn kho
                                </h3>
                                <div className="mt-4 flex flex-col gap-5"> */}
                                {/* <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                    <div>
                      <InputWithLabel label="Giá cơ bản">
                        {!hasVariants ? (
                          <input
                            className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-12 px-4 py-2 rounded-lg border border-gray-700 dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 transition-all"
                            type="number"
                            placeholder="Nhập giá cơ bản sản phẩm..."
                            {...registerBasic("price")}
                          />
                        ) : (
                          <input
                            disabled
                            className="dark:bg-blackPrimary bg-[#ccc] dark:text-whiteSecondary text-blackPrimary w-full h-12 px-4 py-2 rounded-lg border border-gray-700 dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 transition-all"
                            type="number"
                            placeholder="Nhập giá cơ bản sản phẩm..."
                          />
                        )}
                      </InputWithLabel>
                      {errors.price && (
                        <span className="text-sm text-red-500">
                          {errors.price.message}
                        </span>
                      )}
                    </div>

                    <div>
                      <InputWithLabel label="Giá khuyến mãi">
                        <input
                          type="number"
                          className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-12 px-4 py-2 rounded-lg border border-gray-700 dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 transition-all"
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
                  </div> */}

                                {/* <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                                        <InputWithLabel label="Ngày bắt đầu">
                                            <input
                                                type="date"
                                                className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-12 px-4 py-2 rounded-lg border border-gray-700 dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 transition-all"
                                                {...registerBasic("sale_start")}
                                            />
                                        </InputWithLabel>

                                        <InputWithLabel label="Ngày kết thúc">
                                            <input
                                                type="date"
                                                className="dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-12 px-4 py-2 rounded-lg border border-gray-700 dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400 transition-all"
                                                {...registerBasic("sale_end")}
                                            />
                                        </InputWithLabel>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                        <div className="p-8">
                            <>
                                <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">Kiểm tra</h3>
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
                                                Sản phẩm mới
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
                                                Sản phẩm bán chạy
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
                                                Sản phẩm nổi bật
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
                                                                                    type="file"
                                                                                    onChange={(e) =>
                                                                                        handleFileChange(e, variantKey)
                                                                                    }
                                                                                    accept="image/*"
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
                                                                            <InputWithLabel label="Giá khuyến mãi">
                                                                                <input
                                                                                    type="number"
                                                                                    placeholder="Nhập giá khuyến mãi"
                                                                                    value={
                                                                                        variantDetails[variantKey]
                                                                                            ?.sale_price || ""
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleVariantDetailChange(
                                                                                            variantKey,
                                                                                            "sale_price",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </InputWithLabel>
                                                                            <InputWithLabel label="Ngày bắt đầu khuyến mãi">
                                                                                <input
                                                                                    type="date"
                                                                                    value={
                                                                                        variantDetails[variantKey]
                                                                                            ?.sale_start || ""
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleVariantDetailChange(
                                                                                            variantKey,
                                                                                            "sale_start",
                                                                                            e.target.value
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </InputWithLabel>
                                                                            <InputWithLabel label="Ngày kết thúc khuyến mãi">
                                                                                <input
                                                                                    type="date"
                                                                                    value={
                                                                                        variantDetails[variantKey]
                                                                                            ?.sale_end || ""
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        handleVariantDetailChange(
                                                                                            variantKey,
                                                                                            "sale_end",
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
