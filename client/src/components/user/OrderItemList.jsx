import styled from "styled-components";
import OrderItem from "./OrderItem";
import PropTypes from "prop-types";
import { useState } from "react";

const Pagination = styled.div`
    .pagination-controls {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
    }

    .pagination-button {
        background-color: #4caf50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        margin: 0 10px;
        cursor: pointer;
        font-size: 16px;
    }

    .pagination-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .pagination-button:hover {
        opacity: 0.6;
    }

    .pagination-info {
        font-size: 16px;
        color: #555;
    }

    .pagination-page {
        background-color: #fff;
        color: #333;
        padding: 10px;
        border-radius: 5px;
        margin: 0 5px;
        cursor: pointer;
        font-size: 16px;
        border: 1px solid #ddd;
        transition: background-color 0.3s;
        padding: 10px 20px;
    }

    .pagination-page:hover {
        background-color: #4caf50;
        color: white;
    }

    .pagination-page.selected {
        background-color: #4caf50;
        color: white;
    }
`;

const OrderItemList = ({ orders, guestOrders }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Số lượng đơn hàng hiển thị trên mỗi trang

    // Lấy danh sách đơn hàng theo trang hiện tại
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedOrders = orders.slice(startIndex, endIndex);
    const totalPages = Math.ceil(orders.length / itemsPerPage);
    console.log(paginatedOrders);

    // Chuyển đến trang trước
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Chuyển đến trang tiếp theo
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Chuyển đến trang khi người dùng nhấn vào số trang
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            {paginatedOrders.map((order, index) => (
                <OrderItem key={index} order={order} guestOrder={guestOrders} />
            ))}
            <Pagination>
                <div className="pagination-controls">
                    <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-button">
                        Previous
                    </button>
                    {/* Hiển thị các số trang */}
                    <div className="pagination-info">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <span
                                key={index}
                                onClick={() => handlePageClick(index + 1)}
                                className={`pagination-page ${currentPage === index + 1 ? "selected" : ""}`}
                            >
                                {index + 1}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                    >
                        Next
                    </button>
                </div>
            </Pagination>
        </div>
    );
};

export default OrderItemList;

OrderItemList.propTypes = {
    orders: PropTypes.array,
    guestOrders: PropTypes.array,
};
