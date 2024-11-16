// useSizes.ts
import { useEffect, useState } from "react";
export const useSizes = () => {
    const [sizes, setSizes] = useState([]);
    
    // Lấy dữ liệu màu sắc từ API
    const getAllSizes = async () => {
        const response = await fetch("http://localhost:8000/api/sizes"); // Đường dẫn API của bạn
        const data = await response.json();
        setSizes(data);
        return data;
    };
    
    useEffect(() => {
        getAllSizes();
    }, []);

    return {sizes, getAllSizes};
};

// useColors.ts

export const useColors = () => {
    const [colors, setColors] = useState([]);
     // Lấy dữ liệu màu sắc từ API
     const getAllColors = async () => {
        const response = await fetch("http://localhost:8000/api/colors"); // Đường dẫn API của bạn
        const data = await response.json();
        setColors(data);
        return data;
    };
    
    useEffect(() => {
        getAllColors();
    }, []);

    return {colors, getAllColors};
};
