import { useQuery } from "@tanstack/react-query";

// Hook để lấy Sizes
export const useSizes = () => {
    const fetchSizes = async () => {
        const response = await fetch("http://localhost:8000/api/sizes");
        if (!response.ok) {
            throw new Error("Failed to fetch sizes");
        }
        return response.json();
    };

    const { data: sizes = [], isLoading, isError, error } = useQuery(
        ["sizes"],
        fetchSizes,
        { staleTime: 5 * 60 * 1000 } // 5 phút
    );

    return { sizes, isLoading, isError, error };
};

// Hook để lấy Colors
export const useColors = () => {
    const fetchColors = async () => {
        const response = await fetch("http://localhost:8000/api/colors");
        if (!response.ok) {
            throw new Error("Failed to fetch colors");
        }
        return response.json();
    };

    const { data: colors = [], isLoading, isError, error } = useQuery(
        ["colors"],
        fetchColors,
        { staleTime: 5 * 60 * 1000 } // 5 phút
    );

    return { colors, isLoading, isError, error };
};
