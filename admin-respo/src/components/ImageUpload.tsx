// *********************
// Role of the component: The image upload component
// Name of the component: ImageUpload.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.1
// Component call: <ImageUpload onFileChange={handleFileChange} />
// Input parameters: onFileChange (function to handle file selection)
// Output: The upload input component
// *********************

import React, { ChangeEvent } from "react";

interface ImageUploadProps {
  onFileChange: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onFileChange }) => {
  // Hàm xử lý khi người dùng chọn file
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onFileChange(file);
  };

  return (
    <div className="flex items-center justify-center w-full mt-5">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer dark:bg-blackPrimary bg-whiteSecondary  dark:hover:border-gray-600 hover:border-gray-500"
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
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs dark:text-whiteSecondary text-blackPrimary">
            SVG, PNG, JPG or GIF
          </p>
        </div>
        {/* Input file */}
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
      </label>
    </div>
  );
};
export default ImageUpload;
