import { useState, useEffect } from "react";
import {
    ColorsFilter,
    FilterTitle,
    FilterWrap,
    PriceFilter,
    ProductCategoryFilter,
    SizesFilter,
    StyleFilter,
} from "../../styles/filter";
import { ProductFilterList, StyleFilterList } from "../../data/data";

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
    const [isProductFilterOpen, setProductFilterOpen] = useState(true);
    const [isPriceFilterOpen, setPriceFilterOpen] = useState(true);
    const [isColorFilterOpen, setColorFilterOpen] = useState(true);
    const [isSizeFilterOpen, setSizeFilterOpen] = useState(true);
    const [isStyleFilterOpen, setStyleFilterOpen] = useState(true);

    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);

    useEffect(() => {
        const fetchSizeAndColor = async () => {
            try {
                // Lấy màu sắc từ API
                const colorsResponse = await fetch("http://127.0.0.1:8000/api/colors");
                const colorsData = await colorsResponse.json();
                setColors(colorsData);

                // Lấy kích thước từ API
                const sizesResponse = await fetch("http://127.0.0.1:8000/api/sizes");
                const sizesData = await sizesResponse.json();
                setSizes(sizesData);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchSizeAndColor();
    }, []);

    const toggleFilter = (filter) => {
        switch (filter) {
            case "product":
                setProductFilterOpen((prev) => !prev);
                break;
            case "price":
                setPriceFilterOpen((prev) => !prev);
                break;
            case "color":
                setColorFilterOpen((prev) => !prev);
                break;
            case "size":
                setSizeFilterOpen((prev) => !prev);
                break;
            case "style":
                setStyleFilterOpen((prev) => !prev);
                break;
            default:
                break;
        }
    };

    const rangeMin = 100;

    // Đảm bảo min và max nằm trong khoảng hợp lệ
    useEffect(() => {
        if (minRange < 0) setMinRange(0);
        if (maxRange > 1000) setMaxRange(1000);
        if (maxRange - minRange < rangeMin) {
            setMaxRange(minRange + rangeMin);
        }
    }, [minRange, maxRange, setMinRange, setMaxRange]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const inputValue = Math.min(Math.max(parseInt(value), 0), 1000);
        console.log(e.target);

        if (name === "min") {
            if (inputValue <= 900) {
                setMinRange(inputValue);
            }
            // Nếu min lớn hơn hoặc bằng max, điều chỉnh max
            if (inputValue >= maxRange) {
                setMaxRange(inputValue + rangeMin);
            }
        } else if (name === "max") {
            setMaxRange(inputValue);
            // Nếu max nhỏ hơn hoặc bằng min, điều chỉnh min
            if (inputValue <= minRange) {
                setMinRange(inputValue - rangeMin);
            }
        }
    };

    const calculateRangePosition = (value, max) => {
        return (value / max) * 100 + "%";
    };

    const handleColorChange = (colorId) => {
        setSelectedColors((prevColors) => {
            return prevColors.includes(colorId) ? prevColors.filter((c) => c !== colorId) : [...prevColors, colorId];
        });
    };

    const handleSizeChange = (sizeId) => {
        setSelectedSizes((prevSizes) => {
            return prevSizes.includes(sizeId) ? prevSizes.filter((s) => s !== sizeId) : [...prevSizes, sizeId];
        });
    };

    return (
        <>
            <ProductCategoryFilter>
                <FilterTitle
                    className="filter-title flex items-center justify-between"
                    onClick={() => toggleFilter("product")}
                >
                    <p className="filter-title-text text-gray text-base font-semibold text-lg">Bộ lọc</p>
                    <span className={`text-gray text-xxl filter-title-icon ${!isProductFilterOpen ? "rotate" : ""}`}>
                        <i className="bi bi-filter"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!isProductFilterOpen ? "hide" : "show"}`}>
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
                    <span className={`text-gray text-xl filter-title-icon ${!isPriceFilterOpen ? "rotate" : ""}`}>
                        <i className="bi bi-chevron-up"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`range filter-wrap ${!isPriceFilterOpen ? "hide" : "show"}`}>
                    <div className="range-slider">
                        <span
                            className="range-selected h-full bg-sea-green"
                            style={{
                                left: calculateRangePosition(minRange, 1000),
                                right: calculateRangePosition(1000 - maxRange, 1000),
                            }}
                        ></span>
                    </div>
                    <div className="range-input">
                        <input
                            type="range"
                            className="min w-full"
                            min="0"
                            max="1000"
                            value={minRange}
                            step="10"
                            name="min"
                            onChange={handleInputChange}
                        />
                        <input
                            type="range"
                            className="max w-full"
                            min="0"
                            max="1000"
                            value={maxRange}
                            step="10"
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
                    <span className={`text-gray text-xl filter-title-icon ${!isColorFilterOpen ? "rotate" : ""}`}>
                        <i className="bi bi-chevron-up"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!isColorFilterOpen ? "hide" : "show"}`}>
                    <div className="colors-list grid">
                        {colors.map((color) => (
                            <div
                                className="colors-item text-center flex flex-col justify-center items-center"
                                key={color.id}
                            >
                                <input
                                    type="checkbox"
                                    id={`color-${color.id}`}
                                    onChange={() => handleColorChange(color.id)}
                                    aria-label={`Bộ lọc theo màu ${color.name}`}
                                />
                                <label htmlFor={`color-${color.id}`}>
                                    <img src={color.src} alt={color.name} />
                                </label>
                            </div>
                        ))}
                    </div>
                </FilterWrap>
            </ColorsFilter>

            <SizesFilter>
                <FilterTitle className="flex items-center justify-between" onClick={() => toggleFilter("size")}>
                    <p className="filter-title-text text-gray text-base font-semibold text-lg">Kích thước</p>
                    <span className={`text-gray text-xl filter-title-icon ${!isSizeFilterOpen ? "rotate" : ""}`}>
                        <i className="bi bi-chevron-up"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!isSizeFilterOpen ? "hide" : "show"}`}>
                    <div className="sizes-list grid text-center justify-center">
                        {sizes.map((size) => (
                            <div className="sizes-item text-sm font-semibold text-outerspace w-full" key={size.id}>
                                <input
                                    type="checkbox"
                                    id={`size-${size.id}`}
                                    onChange={() => handleSizeChange(size.id)}
                                    aria-label={`Bộ lọc theo kích thước ${size.name}`}
                                />
                                <label htmlFor={`size-${size.id}`}>
                                    <span className="flex items-center justify-center uppercase">{size.name}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </FilterWrap>
            </SizesFilter>

            <StyleFilter>
                <FilterTitle className="flex items-center justify-between" onClick={() => toggleFilter("style")}>
                    <p className="filter-title-text text-gray text-base font-semibold text-lg">Phong cách váy</p>
                    <span className={`text-gray text-xl filter-title-icon ${!isStyleFilterOpen ? "rotate" : ""}`}>
                        <i className="bi bi-chevron-up"></i>
                    </span>
                </FilterTitle>
                <FilterWrap className={`${!isStyleFilterOpen ? "hide" : "show"}`}>
                    {StyleFilterList?.map((styleFilter) => (
                        <div className="style-filter-item" key={styleFilter.id}>
                            <button type="button" className="filter-item-head w-full flex items-center justify-between">
                                <span className="filter-head-title text-base text-gray font-semibold">
                                    {styleFilter.title}
                                </span>
                                <span className="filter-head-icon text-gray">
                                    <i className="bi bi-chevron-right"></i>
                                </span>
                            </button>
                        </div>
                    ))}
                </FilterWrap>
            </StyleFilter>
        </>
    );
};

export default ProductFilter;
