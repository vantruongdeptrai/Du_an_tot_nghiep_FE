import { InputWithLabel, Sidebar } from "../../components";
import { categoryInput } from "../../api/categories/types";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import categorySchema from "../../api/categories/categorySchema";
import useCategory from "../../hooks/category";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const CreateCategory = () => {
  // Khởi tạo các hàm của React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<categoryInput>({
    resolver: zodResolver(categorySchema),
  });
  const { createCategory } = useCategory();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const nav = useNavigate();

  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);

    // Tạo URL tạm thời cho ảnh để hiển thị
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  // Hàm xử lý khi form được submit
  const onSubmit: SubmitHandler<categoryInput> = (data) => {
    createCategory(data, selectedFile || undefined);
    // nav("/categories");
  };

  return (
    <div className="h-auto border-t border-blackSecondary border-1 flex dark:bg-blackPrimary bg-whiteSecondary">
      <Sidebar />
      <div className="dark:bg-blackPrimary bg-whiteSecondary w-full px-6 py-8">
        <div className="py-10">
          <div className="px-6 pb-8 border-b border-gray-800 flex justify-between items-center max-sm:flex-col max-sm:gap-5">
            <h2 className="text-3xl font-bold leading-7 dark:text-whiteSecondary text-blackPrimary">
              Add New Category
            </h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Left Column */}
              <div>
                <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">
                  Basic Information
                </h3>
                <div className="flex flex-col gap-5">
                  <InputWithLabel label="Category Name">
                    <input
                      className={`dark:bg-blackPrimary bg-white dark:text-whiteSecondary text-blackPrimary w-full h-12 px-4 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-600 hover:border-blue-300`}
                      {...register("name")}
                      type="text"
                      placeholder="Enter a category name..."
                    />
                    {errors.name && (
                      <span className="text-sm text-red-500 mt-2">
                        {errors.name.message}
                      </span>
                    )}
                  </InputWithLabel>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h3 className="text-2xl font-bold dark:text-whiteSecondary text-blackPrimary mb-4">
                  Category Image
                </h3>
                <div className="mt-4 flex flex-col gap-5">
                  <label
                    htmlFor="category-image"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer dark:bg-blackPrimary bg-whiteSecondary dark:hover:border-gray-600 hover:border-gray-500 transition-colors"
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
                      <p className="text-xs text-gray-500 dark:text-whiteSecondary">
                        SVG, PNG, JPG, or GIF (MAX. 800x400px)
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

                  {/* Preview image if selected */}
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-4 w-full h-64 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="px-8 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Add New Category
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
