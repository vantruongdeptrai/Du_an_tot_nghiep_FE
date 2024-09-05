import { useState, useEffect } from "react";
// import request from "../api/aixos";
import axios from "axios";
import { permissionInput, permissions } from "../api/permissions/types";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

const usePermission = () => {
    const { id } = useParams();
    const [permissions, setPermissions] = useState<permissions[]>([]);
    const [permission, setPermission] = useState<permissions>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const getPermissions = async () => {
        try {
            setIsLoading(true);
            const respon = await axios.get("http://localhost:8000/api/permissions");
            setPermissions(respon.data);
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };
    const getPermissionById = async (id: string) => {
        try {
            setIsLoading(true);
            const respon = await axios.get("http://localhost:8000/api/permissions/" + id);
            setPermission(respon.data);
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };
    const addPermission = async (data: permissionInput) => {
        try {
            setIsLoading(true);
            await axios.post("http://localhost:8000/api/permissions", data);
            toast.success("Permissions added successfully");
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };
    const editPermission = async (data: permissionInput) => {
        try {
            setIsLoading(true);
            await axios.put(`http://localhost:8000/api/permissions/${id}`, data);
            toast.success("Permissions edit successfully");
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };
    const deletePermission = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete")) {
                setIsLoading(true);
                await axios.delete("http://localhost:8000/api/permissions/" + id);
                toast.success("Permissions delete successfully");
                getPermissions();
            }
        } catch (err) {
            setError("Failed to fetch permissions");
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        getPermissions();
    }, []);
    useEffect(() => {
        if (!id) return;
        getPermissionById(id);
    }, [id]);
    return {
        permission,
        setPermission,
        permissions,
        getPermissions,
        getPermissionById,
        addPermission,
        editPermission,
        deletePermission,
        error,
        isLoading,
    };
};

export default usePermission;
