import { PropTypes } from "prop-types";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { commonCardStyles } from "../../styles/card";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import formatCurrency from "../../utils/formatUtils.js";

const ProductCardWrapper = styled(Link)`
    ${commonCardStyles}
    @media (max-width: ${breakpoints.sm}) {
        padding-left: 0;
        padding-right: 0;
    }

    .product-img {
        height: 393px;
        position: relative;

        @media (max-width: ${breakpoints.sm}) {
            height: 320px;
        }
    }

    .product-wishlist-icon {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 100%;

        &:hover {
            background-color: ${defaultTheme.color_yellow};
            color: ${defaultTheme.color_white};
        }
    }

    .product-price {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .original-price {
            text-decoration: line-through;
            color: ${defaultTheme.color_gray};
            font-size: 0.875rem; /* Small font for original price */
        }

        .sale-price {
            color: ${defaultTheme.color_sea_green};
            font-weight: bold;
        }
    }
`;

const ProductItem = ({ product }) => {
    return (
        <ProductCardWrapper key={product.id} >
            <Link to={`/product/details/${product.id}`}>
                <div className="product-img">
                    <img className="object-fit-cover" src={product.image_url} alt={product.name} />
                    <button type="button" className="product-wishlist-icon flex items-center justify-center bg-white">
                        <i className="bi bi-heart"></i>
                    </button>
                </div>
                <div className="product-info">
                    <p className="font-bold">{product.name.length > 20 ? product.name.substring(0, 40) + '...' : product.name}</p>
                    <div className="text-sm text-gray">{product.category_name}</div>
                    <div className="product-price">
                        {product.sale_price ? (
                            <>
                                <span className="original-price">{formatCurrency(product.price)}</span>
                                <span className="sale-price">{formatCurrency(product.sale_price)}</span>
                            </>
                        ) : (
                            <span className="font-bold">{formatCurrency(product.price)}</span>
                        )}
                    </div>
                </div>
            </Link>
        </ProductCardWrapper>
    );
};

export default ProductItem;

ProductItem.propTypes = {
    product: PropTypes.object,
};
