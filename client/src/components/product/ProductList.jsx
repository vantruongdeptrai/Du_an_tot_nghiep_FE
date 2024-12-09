import styled from "styled-components";
import ProductItem from "./ProductItem";
import { PropTypes } from "prop-types";
import { breakpoints } from "../../styles/themes/default";

const ProductListWrapper = styled.div`
  column-gap: 20px;
  row-gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));

  @media (max-width: ${breakpoints.sm}) {
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

const ProductList = ({productSeller}) => {
  return (
    <ProductListWrapper className="grid">
      {productSeller?.map((product, index) => {
        return <ProductItem key={index} product={product} />;
      })}
    </ProductListWrapper>
  );
};

export default ProductList;

ProductList.propTypes = {
  products: PropTypes.array, // Nếu bạn truyền "products" làm prop
  productSeller: PropTypes.array, // Định nghĩa productSeller là string (hoặc kiểu phù hợp)
};

