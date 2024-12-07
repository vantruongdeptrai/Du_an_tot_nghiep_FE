import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import useCoupon from "../../hooks/coupons";
import formatCurrency from "../../utils/formatCurrent";

const CouponTable = () => {
    const { coupons, deleteCoupon } = useCoupon();

    return (
        <div
            style={{
                overflowX: "auto",
                maxWidth: "100%",
            }}
        >
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Tên
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Mô tả
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Chiết khấu
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Giảm giá tối thiểu
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Giảm giá tối đa
                        </th>

                        <th scope="col" className="px-6 py-3">
                            Giới hạn sử dụng
                        </th>

                        <th scope="col" className="px-6 py-3">
                            Trạng thái
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Hành động
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {coupons.map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <th
                                scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                {item.name}
                            </th>
                            <td className="px-6 py-4">{item.description}</td>
                            <td className="px-6 py-4">{item.discount_amount}%</td>
                            <td className="px-6 py-4">{formatCurrency(item.min_order_value)}</td>
                            <td className="px-6 py-4">{formatCurrency(item.max_order_value)}</td>
                            <td className="px-6 py-4">{item.usage_limit}</td>
                            <td className="px-6 py-4">
                                <span
                                    style={{
                                        display: "inline-block",
                                        padding: "4px 8px",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        color: item.is_active ? "#007f00" : "#a10000",
                                        backgroundColor: item.is_active ? "#d6f5d6" : "#ffd6d6",
                                        borderRadius: "4px",
                                    }}
                                >
                                    {item.is_active ? "Hoạt động" : "Không hoạt động"}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/coupons/${item.id}`}
                                        className="flex justify-center items-center w-8 h-8 border border-gray-500 rounded text-gray-800 hover:bg-slate-400"
                                    >
                                        <HiOutlinePencil />
                                    </Link>
                                    <Link
                                        to={`/coupons/${item.id}`}
                                        className="flex justify-center items-center w-8 h-8 border border-gray-500 rounded text-gray-800 hover:bg-slate-400"
                                    >
                                        <HiOutlineEye />
                                    </Link>
                                    <button
                                        onClick={() => deleteCoupon(`${item.id}`)}
                                        style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "32px",
                                            height: "32px",
                                            border: "1px solid #999",
                                            borderRadius: "4px",
                                            color: "#333",
                                            backgroundColor: "transparent",
                                        }}
                                    >
                                        <HiOutlineTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CouponTable;
