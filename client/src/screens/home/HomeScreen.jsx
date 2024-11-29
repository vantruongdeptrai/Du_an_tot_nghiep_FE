import styled from "styled-components";
import Hero from "../../components/home/Hero";
import Featured from "../../components/home/Featured";
import NewArrival from "../../components/home/NewArrival";
import SavingZone from "../../components/home/SavingZone";
import Catalog from "../../components/home/Catalog";
import Brands from "../../components/home/Brands";
import Feedback from "../../components/home/Feedback";
import useProduct from "../../hooks/useProduct";
import Loader from "../../components/loader/loader";

const HomeScreenWrapper = styled.main``;

const HomeScreen = () => {
    // const { products } = useProduct();
    const { products, isLoading, isError } = useProduct();

    if (isLoading)
        return (
            <div>
                <Loader></Loader>
            </div>
        );
    if (isError) return <p>Failed to load products.</p>;
    console.log(products);

    const bestSellerProduct = products.filter((product) => product.best_seller_product == 1);
    const featuredProduct = products.filter((product) => product.featured_product == 1);
    return (
        <HomeScreenWrapper>
            <Hero />
            <Featured />
            <NewArrival />
            <SavingZone />
            <Catalog catalogTitle={"Sản phẩm đang được giảm giá"} productSeller={bestSellerProduct || []} />
            <Catalog catalogTitle={"Tất cả sản phẩm"} products={products} />
            <Brands />
            <Catalog catalogTitle={"Sản phẩm đặc trưng của shop"} products={featuredProduct} />
            <Feedback />
        </HomeScreenWrapper>
    );
};

export default HomeScreen;
