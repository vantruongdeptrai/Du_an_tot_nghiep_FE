import { useState, useEffect } from "react";
import apiClient from "../api/axiosConfig";


const useUser = () => {
    const [users, setUsers] = useState([]);
    const fetchUser = async () => {
        const token = localStorage.getItem('token'); 
      
        try {
          const response = await apiClient.get('/user', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

    useEffect(() => {
        fetchUser();
    }, [])

    return {
        users,
        setUsers,
    };
};

export default useUser;
