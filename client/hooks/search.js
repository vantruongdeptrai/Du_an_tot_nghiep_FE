import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../src/api/axiosConfig";

const useSearch = () => {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState([]);

    const fetchResults = async () => {
        try {
            const response = await apiClient.get(`/search?name=${keyword}`);
            setResults(response.data.products.data);        
        } catch (err) {
            toast.error("Failed to fetch results: " + err.message);
        }
    };

    useEffect(() => {
        if (keyword) {
            fetchResults();
        } else {
            setResults([]);
        }
    }, [keyword]); // Thêm `keyword` vào dependency array

    return {
        keyword,
        setKeyword,
        results,
    };
};

export default useSearch;
