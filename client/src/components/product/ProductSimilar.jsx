import { Section } from "../../styles/styles";
import Title from "../common/Title";
import ProductList from "./ProductList";
import useProduct from "../../hooks/useProduct";
import { PropTypes } from "prop-types";

const ProductSimilar = ({ product }) => {
    const { products } = useProduct();

    const similarProduct = products.filter(
        (item) => item.category_name == product?.category_name && item.id !== product.id
    );
    
    return (
        <Section>
            <Title titleText={"Sản phẩm tương tự"} />
            <ProductList productSeller={similarProduct.slice(0, 4)} />
        </Section>
    );
};

ProductSimilar.propTypes = {
    product: PropTypes.shape({
        id: PropTypes.string.isRequired, // Hoặc PropTypes.number, tùy theo kiểu id của bạn
        category_name: PropTypes.string.isRequired,
        // Thêm các thuộc tính khác của product nếu cần
    }).isRequired,
};

export default ProductSimilar;
