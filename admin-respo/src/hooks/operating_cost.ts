import { useState, useEffect } from "react";
// import request from "../api/aixos";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { OperatingCost, OperatingCostInput } from "../api/operating_cost/type";

const useOperatingCost = () => {
    const { id } = useParams();
    const [operatingCosts, setOperatingCosts] = useState<OperatingCost[]>([]);
    const [operatingCost, setOperatingCost] = useState<OperatingCost>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const getOperatingCost = async () => {
        try {
            setIsLoading(true);
            const respon = await axios.get("http://localhost:8000/api/operating-costs");
            setOperatingCosts(respon.data);
        } catch (err) {
            setError("Failed to fetch OperatingCost");
        } finally {
            setIsLoading(false);
        }
    };
    const getOperatingCostById = async (id: string) => {
        try {
            setIsLoading(true);
            const respon = await axios.get("http://localhost:8000/api/operating-costs/" + id);
            setOperatingCost(respon.data);
        } catch (err) {
            setError("Failed to fetch OperatingCost");
        } finally {
            setIsLoading(false);
        }
    };
    const addOperatingCost = async (data: OperatingCostInput) => {
        try {
            setIsLoading(true);
            await axios.post("http://localhost:8000/api/operating-costs", data);
            toast.success("OperatingCost added successfully");
        } catch (err) {
            setError("Failed to fetch OperatingCost");
        } finally {
            setIsLoading(false);
        }
    };
    const editOperatingCost = async (data: OperatingCostInput) => {
        try {
            setIsLoading(true);
            await axios.put(`http://localhost:8000/api/operating-costs/${id}`, data);
            toast.success("OperatingCost edit successfully");
        } catch (err) {
            setError("Failed to fetch OperatingCost");
        } finally {
            setIsLoading(false);
        }
    };
    const deleteOperatingCost = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete")) {
                setIsLoading(true);
                await axios.delete("http://localhost:8000/api/operating-costs/" + id);
                toast.success("OperatingCost delete successfully");
                getOperatingCost();
            }
        } catch (err) {
            setError("Failed to fetch OperatingCost");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getOperatingCost();
    }, []);
    useEffect(() => {
        if (!id) return;
        getOperatingCostById(id);
    }, [id]);
    return {
        operatingCost,
        setOperatingCost,
        operatingCosts,
        getOperatingCost,
        getOperatingCostById,
        addOperatingCost,
        editOperatingCost,
        deleteOperatingCost,
        error,
        isLoading,
    };
};

export default useOperatingCost;
