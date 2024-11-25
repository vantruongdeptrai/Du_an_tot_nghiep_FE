import { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import { toast } from "react-toastify";

const useAddress = () => {
    const [addresses, setAdress] = useState([]);
    const getAllAddress = async () => {
        try {
            const response = await apiClient.get("/addresses");
            setAdress(response.data.data);
        } catch (error) {
            console.log(error);
            toast.error("Get address failed!");
        }
    };
    const createAddress = async (data) => {
        try {
            const response = await apiClient.post("/addresses", data);
            setAdress(response.data);
        } catch (error) {
            console.log(error);
            toast.error("Get address failed!");
        }
    };
    useEffect(() => {
        getAllAddress();
    }, [])
    return {
        addresses,
        createAddress
    }
};

export default useAddress;
