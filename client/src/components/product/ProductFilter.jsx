import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash"; // Import lodash debounce
import {
    ColorsFilter,
    FilterTitle,
    FilterWrap,
    PriceFilter,
    ProductCategoryFilter,
    SizesFilter,
} from "../../styles/filter";
import { ProductFilterList } from "../../data/data";

const ProductFilter = ({
    minRange,
    setMinRange,
    maxRange,
    setMaxRange,
    selectedColors,
    setSelectedColors,
    selectedSizes,
    setSelectedSizes,
}) => {
    const [filterState, setFilterState] = useState({
        product: true,
        price: true,
        color: true,
        size: true,
        style: true,
    });

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    // Fetch sizes and colors from API
    useEffect(() => {
        const fetchSizeAndColor = async () => {
            try {
                const colorsResponse = await fetch("http://127.0.0.1:8000/api/colors");
                const colorsData = await colorsResponse.json();
                setColors(colorsData);

                const sizesResponse = await fetch("http://127.0.0.1:8000/api/sizes");
                const sizesData = await sizesResponse.json();
                setSizes(sizesData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchSizeAndColor();
    }, []);

    // Debounce for price filter
    const debouncedSetMinRange = useCallback(
        debounce((value) => setMinRange(value), 500),
        []
    );
    const debouncedSetMaxRange = useCallback(
        debounce((value) => setMaxRange(value), 500),
        []
    );

    const toggleFilter = (filter) => {
        setFilterState((prevState) => ({
            ...prevState,
            [filter]: !prevState[filter],
        }));
    };

    const rangeMin = 100;

    // Đảm bảo min và max nằm trong khoảng hợp lệ
    useEffect(() => {
        if (minRange < 0) setMinRange(0);
        if (maxRange > 2000000) setMaxRange(2000000); // Thay đổi giới hạn giá trị maxRange
        if (maxRange - minRange < rangeMin) {
            setMaxRange(minRange + rangeMin);
        }
    }, [minRange, maxRange, setMinRange, setMaxRange]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const inputValue = Math.min(Math.max(parseInt(value), 0), 2000000); // Thay đổi giới hạn cho giá trị

        if (name === "min") {
            if (inputValue <= 999900) {
                // Thay đổi điều kiện này để phù hợp với giá trị lớn hơn
                debouncedSetMinRange(inputValue); // Debounced update for min range
            }
            if (inputValue >= maxRange) {
                setMaxRange(inputValue + rangeMin);
            }
        } else if (name === "max") {
            debouncedSetMaxRange(inputValue); // Debounced update for max range
            if (inputValue <= minRange) {
                setMinRange(inputValue - rangeMin);
            }
        }
    };

    const calculateRangePosition = (value, max) => {
        return (value / max) * 100 + "%";
    };

    // Handle color changes
    const handleColorChange = (colorId) => {
        setSelectedColors(colorId); // Lưu chỉ 1 giá trị cho màu đã chọn
    };
    
    // Handle size changes
    const handleSizeChange = (sizeId) => {
        setSelectedSizes(sizeId); // Lưu chỉ 1 giá trị cho kích thước đã chọn
    };

    return (
        <>
            <ProductCategoryFilter>
                <FilterTitle
                    className="filter-title flex items-center justify-between"
                    onClick={() => toggleFilter("product")}
                >
                    <p className="filter-title-text text-gray text-base font-semibold text-lg">Bộ lọc</p>
                    <span className={`text-gray text-xxl filter-title-icon ${!filterState.product ? "rotate" : ""}`}>
                        <i className="bi bi-filter"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!filterState.product ? "hide" : "show"}`}>
                    {ProductFilterList?.map((productFilter) => (
                        <div className="product-filter-item" key={productFilter.id}>
                            <button type="button" className="filter-item-head w-full flex items-center justify-between">
                                <span className="filter-head-title text-base text-gray font-semibold">
                                    {productFilter.title}
                                </span>
                                <span className="filter-head-icon text-gray">
                                    <i className="bi bi-chevron-right"></i>
                                </span>
                            </button>
                        </div>
                    ))}
                </FilterWrap>
            </ProductCategoryFilter>

            <PriceFilter>
                <FilterTitle
                    className="filter-title flex items-center justify-between"
                    onClick={() => toggleFilter("price")}
                >
                    <p className="filter-title-text text-gray text-base font-semibold text-lg">Giá</p>
                    <span className={`text-gray text-xl filter-title-icon ${!filterState.price ? "rotate" : ""}`}>
                        <i className="bi bi-chevron-up"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`range filter-wrap ${!filterState.price ? "hide" : "show"}`}>
                    <div className="range-slider">
                        <span
                            className="range-selected h-full bg-sea-green"
                            style={{
                                left: calculateRangePosition(minRange, 2000000), // Thay đổi max thành 10000000
                                right: calculateRangePosition(2000000 - maxRange, 2000000), // Thay đổi max thành 20000000
                            }}
                        ></span>
                    </div>
                    <div className="range-input">
                        <input
                            type="range"
                            className="min w-full"
                            min="0"
                            max="3000000" // Thay đổi max thành 20000000
                            value={minRange}
                            step="1000" // Thay đổi bước nhảy thành 1000
                            name="min"
                            onChange={handleInputChange}
                        />
                        <input
                            type="range"
                            className="max w-full"
                            min="0"
                            max="2000000" // Thay đổi max thành 20000000
                            value={maxRange}
                            step="1000" // Thay đổi bước nhảy thành 1000
                            name="max"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="range-price w-full flex items-center">
                        <input
                            type="number"
                            className="text-center"
                            name="min"
                            value={minRange}
                            onChange={handleInputChange}
                        />
                        <input
                            type="number"
                            className="text-center"
                            name="max"
                            value={maxRange}
                            onChange={handleInputChange}
                        />
                    </div>
                </FilterWrap>
            </PriceFilter>

            <ColorsFilter>
                <FilterTitle className="flex items-center justify-between" onClick={() => toggleFilter("color")}>
                    <p className="filter-title-text text-gray text-base font-semibold text-lg">Màu sắc</p>
                    <span className={`text-gray text-xl filter-title-icon ${!filterState.color ? "rotate" : ""}`}>
                        <i className="bi bi-chevron-up"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!filterState.color ? "hide" : "show"}`}>
                    <div style={{gap: 20}} className="flex flex-col">
                        {colors.map((color) => (
                            <div
                                style={{gap: 20, border: "1px solid", padding: 10, borderRadius: 5}}
                                className="flex"
                                key={color.id}
                            >
                                <input
                                    type="radio"
                                    id={`color-${color.id}`}
                                    name="color"
                                    onChange={() => handleColorChange(color.id)}
                                    aria-label={`Bộ lọc theo màu ${color.name}`}

                                />
                                <label
                                    htmlFor={`color-${color.id}`}
                                    className=""
                                    style={{ backgroundColor: color.name }} // Dùng color.name làm background
                                >
                                    {/* Hiển thị tên màu bên trong label */}
                                    <span style={{padding: "0 10px"}} className="text-white text-lg font-semibold">{color.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </FilterWrap>
            </ColorsFilter>

            <SizesFilter>
                <FilterTitle className="flex items-center justify-between" onClick={() => toggleFilter("size")}>
                    <p className="filter-title-text text-gray text-base font-semibold text-lg">Kích thước</p>
                    <span className={`text-gray text-xl filter-title-icon ${!filterState.size ? "rotate" : ""}`}>
                        <i className="bi bi-chevron-up"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!filterState.size ? "hide" : "show"}`}>
                    <div style={{gap: 20}} className="flex flex-col">
                        {sizes.map((size) => (
                            <div style={{gap: 20, border: "1px solid", padding: 10, borderRadius: 5}} className="flex" key={size.id}>
                                <input
                                    type="radio"
                                    name="size"
                                    id={`size-${size.id}`}
                                    onChange={() => handleSizeChange(size.id)}
                                />
                                <label style={{ border: "1px solid", padding: "5px 20px", borderRadius: 2}} htmlFor={`size-${size.id}`}>{size.name}</label>
                            </div>
                        ))}
                    </div>
                </FilterWrap>
            </SizesFilter>
        </>
    );
};

export default ProductFilter;
