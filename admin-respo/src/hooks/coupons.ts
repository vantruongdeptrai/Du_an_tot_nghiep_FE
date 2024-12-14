import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Coupon, CouponInput } from "../api/coupons/type";

const useCoupon = () => {
    const { id } = useParams();
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [coupon, setCoupon] = useState<Coupon>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const getCoupons = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:8000/api/coupons");
            setCoupons(response.data);
        } catch (err) {
            setError("Failed to fetch Coupons");
        } finally {
            setIsLoading(false);
        }
    };

    const getCouponById = async (id: string) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:8000/api/coupons/${id}`);
            setCoupon(response.data);
        } catch (err) {
            setError("Failed to fetch Coupons");
        } finally {
            setIsLoading(false);
        }
    };

    const addCoupon = async (data: CouponInput) => {
        try {
            setIsLoading(true);
            await axios.post("http://localhost:8000/api/coupons", data);
            toast.success("Thêm mã giảm giá thành công.");
        } catch (err) {
            setError("Failed to add Coupon");
        } finally {
            setIsLoading(false);
        }
    };

    const editCoupon = async (data: CouponInput) => {
        try {
            setIsLoading(true);
            await axios.put(`http://localhost:8000/api/coupons/${id}`, data);
            toast.success("Cập nhật mã giảm giá thành công.");
        } catch (err) {
            setError("Failed to edit Coupon");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCoupon = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete?")) {
                setIsLoading(true);
                await axios.delete(`http://localhost:8000/api/coupons/${id}`);
                toast.success("Xóa mã giảm giá thành công.");
                getCoupons();
            }
        } catch (err) {
            setError("Failed to delete Coupon");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCoupons();
    }, []);

    useEffect(() => {
        if (!id) return;
        getCouponById(id);
    }, [id]);

    return {
        coupon,
        setCoupon,
        coupons,
        getCoupons,
        getCouponById,
        addCoupon,
        editCoupon,
        deleteCoupon,
        error,
        isLoading,
    };
};

export default useCoupon;
