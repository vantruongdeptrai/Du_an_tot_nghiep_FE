import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// const getTotalOrderDaily = async (date: string) => {
//     const response = await axios.get(`http://localhost:8000/api/order-statistics?date=${date}`);
//     return response.data.data.total_orders;
// };

const getMonthlyRevenue = async (year: string) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/revenue/months?year=${year}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching monthly revenue:", error);
    }
};

const getTotalStatusOrderDaily = async (date: string) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/order-stats-d?date=${date}`);
    return response.data.data;
};

const getTotalRevenueProductSold = async (date: string) => {
    const response = await axios.get(`http://127.0.0.1:8000/api/sold-products-count-by-day?date=${date}`);
    return response.data.data.products;
};

const getTotalRevenueDay = async (date: string) => {
    const response = await axios.get(`http://localhost:8000/api/revenue-by-date?date=${date}`);
    return response.data.total_revenue;
};

const getTotalRevenueDaily = async (month: string, year: string) => {
    const response = await axios.get(`http://localhost:8000/api/revenue/day?year=${year}&month=${month}`);
    return response.data;
};

// export const useQueryTotalOrderDaily = (date: string) => {
//     return useQuery(["totalOrderDaily", date], () => getTotalOrderDaily(date), {
//         enabled: !!date,
//     });
// };

export const useQueryTotalRevenueDay = (date: string) => {
    return useQuery(["totalRevenueDaily", date], () => getTotalRevenueDay(date), {
        enabled: !!date,
    });
};

export const useQueryTotalRevenueProductSold = (date: string) => {
    return useQuery(["totalRevenueProductSold", date], () => getTotalRevenueProductSold(date), {
        enabled: !!date,
    });
};

export const useQueryTotalRevenueDailyLine = (month: string, year: string) => {
    return useQuery(["totalRevenueDaily", month, year], () => getTotalRevenueDaily(month, year), {
        enabled: !!month && !!year,
    });
};

export const useQueryTotalStatusOrderDaily = (date: string) => {
    return useQuery(["totalStatusOrderDaily", date], () => getTotalStatusOrderDaily(date), {
        enabled: !!date,
    });
};

export const useQueryMonthlyRevenueLine = (year: string) => {
    return useQuery(["totalStatusOrderDaily", year], () => getMonthlyRevenue(year), {
        enabled: !!year,
    });
};




