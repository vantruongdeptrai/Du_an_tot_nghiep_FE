import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import productSchema from "../../api/products/productSchema";
import useProduct from "../../hooks/product";
import { ProductInput } from "../../api/products/types";
import SimpleInput from "../../components/SimpleInput";
import TextAreaInput from "../../components/TextAreaInput";
import SelectInput from "../../components/SelectInput";
import { InputWithLabel, Sidebar } from "../../components";

const CreateProduct = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
  });
  const { createProduct } = useProduct();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const nav = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const onSubmit: SubmitHandler<ProductInput> = (data) => {
    createProduct(data, selectedFile || undefined);
    console.log(data);

    nav("/products");
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(
          data.map((cat: { id: string; name: string }) => ({
            id: cat.id,
            name: cat.name,
          }))
        );
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="hover:bg-blackPrimary bg-whiteSecondary w-full">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Add New Product
              </h2>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
              <div>
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                  Basic information
                </h3>

                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Tên sản phẩm">
                    <SimpleInput
                      {...register("name")}
                      type="text"
                      placeholder="Nhập tên sản phẩm..."
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Mô tả">
                    <TextAreaInput
                      {...register("description")}
                      placeholder="Nhập mô tả sản phẩm..."
                      rows={4}
                      cols={50}
                    />
                  </InputWithLabel>

                  <InputWithLabel label="Danh mục">
                    <SelectInput
                      selectList={categories.map((cat) => ({
                        value: cat.id,
                        label: cat.name,
                      }))}
                      {...register("category_id")}
                      multiple
                    />
                  </InputWithLabel>
                </div>
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary mt-16">
                  Giá & Tồn kho
                </h3>

                <div className="mt-4 flex flex-col gap-5">
                  <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                    <InputWithLabel label="Giá cơ bản">
                      <SimpleInput
                        type="number"
                        placeholder="Nhập giá cơ bản sản phẩm..."
                        {...register("price")}
                      />
                    </InputWithLabel>

                    <InputWithLabel label="Giá khuyến mãi">
                      <SimpleInput
                        type="number"
                        placeholder="Nhập giá khuyến mãi..."
                        {...register("saleprice")}
                      />
                    </InputWithLabel>
                  </div>

                  <div className="grid grid-cols-2 gap-x-5 max-[500px]:grid-cols-1 max-[500px]:gap-x-0 max-[500px]:gap-y-5">
                    <InputWithLabel label="Ngày bắt đầu khuyến mãi">
                      <SimpleInput type="date" {...register("salestart")} />
                    </InputWithLabel>

                    <InputWithLabel label="Ngày kết thúc khuyến mãi">
                      <SimpleInput type="date" {...register("saleend")} />
                    </InputWithLabel>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                  Hình ảnh sản phẩm
                </h3>
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-4"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-sm"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 pb-8">
              <button
                type="submit"
                className="dark:bg-blackPrimary bg-whiteSecondary border border-gray-600 w-full py-2 text-lg dark:hover:border-gray-500 hover:border-gray-400 duration-200 flex items-center justify-center gap-x-2 text-black dark:text-white"
              >
                <span className="font-semibold">Thêm sản phẩm</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;
