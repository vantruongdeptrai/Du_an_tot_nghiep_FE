import styled from "styled-components";
import Hero from "../../components/home/Hero";
import Featured from "../../components/home/Featured";
import NewArrival from "../../components/home/NewArrival";
import SavingZone from "../../components/home/SavingZone";
import Catalog from "../../components/home/Catalog";
import Brands from "../../components/home/Brands";
import Feedback from "../../components/home/Feedback";
import useProduct from "../../hooks/useProduct";


const HomeScreenWrapper = styled.main``;

const HomeScreen = () => {
  const { products } = useProduct();
    const bestSellerProduct = products.filter((product) => product.best_seller_product == 1);
    const featuredProduct = products.filter((product) => product.featured_product == 1);
  return (
    <HomeScreenWrapper>
      <Hero />
      <Featured />
      <NewArrival />
      <SavingZone />
      <Catalog catalogTitle={"Product best seller"} productSeller={bestSellerProduct || []} />
      <Catalog catalogTitle={"All Product"} products={products} />
      <Brands />
      <Catalog catalogTitle={"Featured product"} products={featuredProduct} />
      <Feedback />
    </HomeScreenWrapper>
  );
};

export default HomeScreen;
