import { useState, useEffect } from "react";
import styled from "styled-components";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import ProductFilter from "../../components/product/ProductFilter";
import { Link, useLocation, useParams } from "react-router-dom";
import useSearch from "../../../hooks/search";
import formatCurrency from "../../utils/formatUtils";
import Loader from "../../components/loader/loader";
import { useQuery } from "@tanstack/react-query";
import useCategory from "../../hooks/useCategory";

const ProductsContent = styled.div`
    display: grid;
    grid-template-columns: 320px auto;
    margin: 20px 0;

    @media (max-width: ${breakpoints.xl}) {
        grid-template-columns: 260px auto;
    }

    @media (max-width: ${breakpoints.lg}) {
        grid-template-columns: 100%;
        row-gap: 24px;
    }
`;

const ProductsContentLeft = styled.div`
    border: 1px solid rgba(190, 188, 189, 0.4);
    border-radius: 12px;
    box-shadow: rgba(0, 0, 0, 0.05) 0 10px 50px;
    overflow: hidden;

    @media (max-width: ${breakpoints.lg}) {
        display: grid;
    }
`;

const ProductsContentRight = styled.div`
    padding: 16px 40px;

    .products-right-top {
        margin-bottom: 40px;
        @media (max-width: ${breakpoints.lg}) {
            margin-bottom: 24px;
        }
        @media (max-width: ${breakpoints.sm}) {
            flex-direction: column;
            row-gap: 16px;
            align-items: flex-start;
        }
    }

    .product-card-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
        gap: 24px;
    }

    .product-card {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.05);
        padding: 16px;
        transition: box-shadow 0.3s ease-in-out;
        &:hover {
            box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
        }
    }

    .product-image {
        width: 100%;
        height: 200px;
        object-fit: cover;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .product-info {
        padding: 16px;
    }

    .product-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
    }

    .product-price {
        font-size: 16px;
        color: ${defaultTheme.color_black};
    }

    .new-product {
        background-color: green;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
    }

    .category-info {
        font-size: 14px;
        color: #888;
        margin-top: 8px;
    }

    .add-to-cart {
        margin-top: 10px;
        padding: 8px 16px;
        background-color: ${defaultTheme.color_sea_green};
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        &:hover {
            background-color: darken(${defaultTheme.color_sea_green}, 10%);
        }
    }

    @media (max-width: ${breakpoints.sm}) {
        padding-left: 0;
        padding-right: 0;
    }
`;

const SearchResult = () => {
    const { categories } = useCategory();
    // State để lưu các bộ lọc
    // State để lưu các bộ lọc trong một đối tượng duy nhất
    const [filters, setFilters] = useState({
        minRange: 0,
        maxRange: 2000000,
        selectedColors: [],
        selectedSizes: [],
    });
    const [keyword, setKeyword] = useState("");
    const { results, isLoading } = useSearch(keyword);
    console.log(keyword);

    const location = useLocation(); // Lấy đối tượng location
    const searchParams = new URLSearchParams(location.search); // Tạo một đối tượng URLSearchParams từ chuỗi tìm kiếm
    const searchName = searchParams.get("name");

    useEffect(() => {
        if (searchName) {
            setKeyword(searchName); // Cập nhật keyword trong hook
        }
    }, [searchName, setKeyword]);

    // Hàm lấy dữ liệu sản phẩm từ API
    const fetchFilteredProducts = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/filter?min_price=${filters.minRange}&max_price=${filters.maxRange}&color_id=${filters.selectedColors}&size_id=${filters.selectedSizes}`
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching filtered products:", error);
            return [];
        }
    };

    const { data = [] } = useQuery(
        ["filteredProducts", filters.minRange, filters.maxRange, filters.selectedColors, filters.selectedSizes],
        fetchFilteredProducts,
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );

    const getCategoryById = (categoryId) => {
        return categories ? categories.find((category) => category.id == categoryId) : undefined;
    };
    const { slug } = useParams();
    const getProductByCategory = slug ? data.filter((product) => product.category.slug === slug) : data;
    const calculateMinMaxPrices = (productVariants) => {
        const prices = productVariants
            .map((variant) => parseFloat(variant.price || "0"))
            .filter((price) => !isNaN(price));
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
        const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
        return { minPrice, maxPrice };
    };

    if (isLoading) {
        return (
            <p>
                <Loader />
            </p>
        );
    }

    return (
        <ProductsContent>
            <ProductsContentLeft>
                <ProductFilter
                    minRange={filters.minRange}
                    setMinRange={(value) => setFilters({ ...filters, minRange: value })}
                    maxRange={filters.maxRange}
                    setMaxRange={(value) => setFilters({ ...filters, maxRange: value })}
                    selectedColors={filters.selectedColors}
                    setSelectedColors={(colors) => setFilters({ ...filters, selectedColors: colors })}
                    selectedSizes={filters.selectedSizes}
                    setSelectedSizes={(sizes) => setFilters({ ...filters, selectedSizes: sizes })}
                />
            </ProductsContentLeft>

            <ProductsContentRight>
                <div className="products-right-top">
                    <h2>Danh sách sản phẩm</h2>
                    <h3>Kết quả tìm kiếm cho: "{searchName}"</h3>
                </div>
                <div className="product-card-list">
                    {results?.map((product) => {
                        const category = getCategoryById(product.category_id);
                        const { minPrice, maxPrice } = calculateMinMaxPrices(product.product_variants);
                        return (
                            <Link to={`/product/details/${product.id}`} key={product.id}>
                                <div key={product.id} className="product-card">
                                    <img
                                        src={product.image_url || "https://picsum.photos/200/300"}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                    <div className="product-info">
                                        <h3 className="product-name">
                                            {product.name.length > 20
                                                ? product.name.substring(0, 20) + "..."
                                                : product.name}
                                        </h3>
                                        <p style={{color: `${defaultTheme.color_sea_green}`}} className="product-price">
                                            Giá:{" "}
                                            {minPrice !== maxPrice ? (
                                                <>
                                                    {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
                                                </>
                                            ) : (
                                                formatCurrency(minPrice)
                                            )}
                                        </p>
                                        {category && <p className="category-info">Danh mục: {category.name}</p>}
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </ProductsContentRight>
        </ProductsContent>
    );
};

export default SearchResult;
