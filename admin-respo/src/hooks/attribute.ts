// useSizes.ts
import { useEffect, useState } from "react";
import { Color, Size } from "../api/attribute/type";
export const useSizes = () => {
    const [sizes, setSizes] = useState<Size[]>([]);
    
    // Lấy dữ liệu màu sắc từ API
    const getAllSizes = async () => {
        const response = await fetch("http://localhost:8000/api/sizes"); // Đường dẫn API của bạn
        const data = await response.json();
        setSizes(data);
    };
    
    useEffect(() => {
        getAllSizes();
    }, []);

    return {sizes, getAllSizes};
};

// useColors.ts

export const useColors = () => {
    const [colors, setColors] = useState<Color[]>([]);
     // Lấy dữ liệu màu sắc từ API
     const getAllColors = async () => {
        const response = await fetch("http://localhost:8000/api/colors"); // Đường dẫn API của bạn
        const data = await response.json();
        setColors(data);
    };
    
    useEffect(() => {
        getAllColors();
    }, []);

    return {colors, getAllColors};
};
