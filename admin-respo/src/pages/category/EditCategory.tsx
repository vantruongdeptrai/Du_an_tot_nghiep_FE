import { InputWithLabel, Sidebar } from "../../components";
import { categoryInput } from "../../api/categories/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import categorySchema from "../../api/categories/categorySchema";
import useCategory from "../../hooks/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

const EditCategory = () => {
  const { categorie, updateCategory } = useCategory(); // Lấy dữ liệu danh mục từ hook

  const {
    register,
    handleSubmit,
    setValue, // Thêm setValue để gán giá trị
    formState: { errors },
  } = useForm<categoryInput>({
    resolver: zodResolver(categorySchema),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const nav = useNavigate();

  // Khi chọn file ảnh
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  // Xử lý submit form
  const onSubmit: SubmitHandler<categoryInput> = async (data) => {
    try {
      await updateCategory(data, selectedFile || undefined);
      nav("/categories");
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  // Lấy dữ liệu danh mục hiện tại để hiển thị giá trị ban đầu
  useEffect(() => {
    if (categorie) {
      setValue("name", categorie.name); // Gán giá trị ban đầu cho tên danh mục
      if (categorie.image) {
        setImagePreview(categorie.image_url); // Hiển thị ảnh hiện tại nếu có
      }
    }
  }, [categorie, setValue]);

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full ">
        <div className="dark:bg-blackPrimary bg-whiteSecondary py-10">
          <div className="px-4 sm:px-6 lg:px-8 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                Sửa danh mục
              </h2>
            </div>
          </div>

          {/* Form edit category */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-8 grid grid-cols-2 gap-x-10 max-xl:grid-cols-1 max-xl:gap-y-10">
              {/* Phần thông tin cơ bản */}
              <div>
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                  Thông tin cơ bản
                </h3>
                <div className="mt-4 flex flex-col gap-5">
                  <InputWithLabel label="Tên danh mục">
                    <input
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-10 indent-2 outline-none border-gray-700 border dark:focus:border-gray-600 focus:border-gray-400 dark:hover:border-gray-600 hover:border-gray-400`}
                      {...register("name")}
                      type="text"
                      placeholder="Enter a category name..."
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500">
                        {errors.name.message}
                      </span>
                    )}
                  </InputWithLabel>
                </div>
              </div>

              {/* Phần upload ảnh */}
              <div>
                <h3 className="text-2xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
                  Ảnh danh mục
                </h3>
                <div className="mt-4 flex flex-col gap-5">
                  <label
                    htmlFor="category-image"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer dark:bg-blackPrimary bg-whiteSecondary dark:hover:border-gray-600 hover:border-gray-500"
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
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs dark:text-whiteSecondary text-blackPrimary">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      id="category-image"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      multiple
                    />
                  </label>

                  {/* Hiển thị ảnh đã chọn hoặc ảnh hiện tại */}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Nút cập nhật */}
              <div className="mt-4 flex flex-col gap-5">
                <button
                  type="submit"
                  className="focus:outline-none text-white bg-black hover:border hover:border-white focus:ring-1 focus:ring-white font-medium rounded-none text-sm px-5 py-2.5 me-2 mb-2"
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;
