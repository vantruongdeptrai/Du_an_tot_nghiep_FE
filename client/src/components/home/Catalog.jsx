import { Container, Section } from "../../styles/styles";
import Title from "../common/Title";
import { PropTypes } from "prop-types";
import ProductList from "../product/ProductList";

const Catalog = ({ catalogTitle, productSeller, products }) => {
  return (
    <Section>
      <Container>
        <div className="categories-content">
          <Title titleText={catalogTitle} />
          <ProductList productSeller={productSeller || products} />
        </div>
      </Container>
    </Section>
  );
};

export default Catalog;

Catalog.propTypes = {
  catalogTitle: PropTypes.string,
  productSeller: PropTypes.string,
  products: PropTypes.array,
};
