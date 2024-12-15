import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import { Coupon, CouponInput } from "../api/coupons/type";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const getCoupons = async () => {
    const response = await axios.get("http://localhost:8000/api/coupons");
    return response.data;
};
const useCoupon = () => {
    const { id } = useParams();
    const [coupon, setCoupon] = useState<Coupon>();

    const queryClient = useQueryClient();

    // Query để lấy danh sách coupon
    const { data: coupons = [], isLoading, error } = useQuery<Coupon[]>(["coupons"], getCoupons);

    const getCouponById = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/coupons/${id}`);
            setCoupon(response.data);
        } catch (err) {
            console.log(err);
            toast.error("Có lỗi ở phần lấy mã giảm giá theo id.");
        }
    };

    const addCoupon = async (data: CouponInput) => {
        try {
            await axios.post("http://localhost:8000/api/coupons", data);
            toast.success("Thêm mã giảm giá thành công.");
        } catch (err) {
            console.log(err);
            toast.error("Có lỗi ở phần thêm mới mã giảm giá.");
        }
    };

    const editCoupon = async (data: CouponInput, id: string) => {
        try {
            await axios.put(`http://localhost:8000/api/coupons/${id}`, data);
            toast.success("Cập nhật mã giảm giá thành công.");
        } catch (err) {
            console.log(err);
            toast.error("Có lỗi ở phần cập nhật mã giảm giá.");
        }
    };

    const deleteCoupon = async (id: string) => {
        try {
            if (window.confirm("Are you sure you want to delete?")) {
                await axios.delete(`http://localhost:8000/api/coupons/${id}`);
                toast.success("Xóa mã giảm giá thành công.");

                queryClient.invalidateQueries(["coupons"]);

            }
        } catch (err) {
            console.log(err);
            toast.error("Có lỗi ở phần xóa mã giảm giá.");
        }
    };

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
