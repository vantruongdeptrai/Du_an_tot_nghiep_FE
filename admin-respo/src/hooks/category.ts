import { useState, useEffect } from "react";
import {Category} from "../api/categories/types";
// import request from "../api/aixos";
import axios from "axios";

const useCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    // const vite:string = true;
    // console.log(vite);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const respon  = await axios.get("/categories");
            setCategories(respon.data);
        } catch (err) {
            setError("Failed to fetch categories");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchCategories();
    }, [])
    return { categories, fetchCategories, error, isLoading };
};



export default useCategory;
