import { useQuery } from '@tanstack/react-query';
import apiClient from "../api/axiosConfig";

// Function to fetch user data
const fetchUser = async () => {
    const token = localStorage.getItem('token');
    const response = await apiClient.get('/user', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    return response.data; // Returning data from the API response
};

const useUser = () => {
    // Using useQuery to fetch user data
    const { data: users = [], error, isLoading } = useQuery(['users'], fetchUser);

    return {
        users,     // Data for the users
        error,     // If there was an error
        isLoading, // Whether the data is still loading
    };
};

export default useUser;
