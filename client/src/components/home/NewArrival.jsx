import styled from "styled-components";
import { Container, Section } from "../../styles/styles";
import Title from "../common/Title";
import Slider from "react-slick";
import CustomNextArrow from "../common/CustomNextArrow";
import CustomPrevArrow from "../common/CustomPrevArrow";
import { commonCardStyles } from "../../styles/card";
import { breakpoints } from "../../styles/themes/default";
import useProduct from "../../hooks/useProduct";
import { Link } from "react-router-dom";

const ProductCardBoxWrapper = styled.div`
    ${commonCardStyles}
    .product-img {
        height: 262px;
        width: 262px;
    }

    @media (max-width: ${breakpoints.sm}) {
        padding-left: 6px;
        padding-right: 6px;
    }
`;

const ArrivalSliderWrapper = styled.div`
    .custom-prev-arrow {
        top: 43%;
        left: -18px;
        @media (max-width: ${breakpoints.xxl}) {
            left: 24px;
        }

        @media (max-width: ${breakpoints.xs}) {
            left: 4px;
        }
    }

    .custom-next-arrow {
        top: 43%;
        right: -18px;
        @media (max-width: ${breakpoints.xxl}) {
            right: 24px;
        }

        @media (max-width: ${breakpoints.xs}) {
            right: 4px;
        }
    }
`;

const NewArrival = () => {
    const settings = {
        dots: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true,
    };
    const { products } = useProduct();
    const newProduct = products.filter((product) => product.new_product == 1);

    return (
        <Section>
            <Container>
                <Title titleText={"New Arrival"} />
                <ArrivalSliderWrapper>
                    <Slider nextArrow={<CustomNextArrow />} prevArrow={<CustomPrevArrow />} {...settings}>
                        {newProduct?.map((newArrival, index) => {
                            return (
                                <ProductCardBoxWrapper key={index}>
                                    <Link to={`/product/details/${newArrival.id}`}>
                                        <div className="product-img">
                                            <img className="object-fit-cover" src={newArrival.image_url} />
                                        </div>
                                        <div className="product-info">
                                            <p className="font-semibold text-xl">{newArrival.name.length > 20 ? newArrival.name.substring(0, 20) + '...' : newArrival.name}</p>
                                        </div>
                                    </Link>
                                </ProductCardBoxWrapper>
                            );
                        })}
                    </Slider>
                </ArrivalSliderWrapper>
            </Container>
        </Section>
    );
};

export default NewArrival;
