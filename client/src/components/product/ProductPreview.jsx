import styled from "styled-components";
import { PropTypes } from "prop-types";
import { useState } from "react";
import { breakpoints, defaultTheme } from "../../styles/themes/default";

const ProductPreviewWrapper = styled.div`
    grid-template-columns: 72px auto;
    gap: 24px;

    @media (max-width: ${breakpoints.xl}) {
        gap: 16px;
    }

    @media (max-width: ${breakpoints.sm}) {
        gap: 12px;
        grid-template-columns: 42px auto;
    }

    @media (max-width: ${breakpoints.xs}) {
        grid-template-columns: 100%;
    }

    .preview-items {
        @media (max-width: ${breakpoints.xs}) {
            width: 80%;
            margin-right: auto;
            margin-left: auto;
            order: 2;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 10px;
        }
    }

    .preview-item {
        width: 70px;
        height: 70px;
        overflow: hidden;
        border-radius: 8px;
        cursor: pointer;
        transition: ${defaultTheme.default_transition};

        @media (max-width: ${breakpoints.sm}) {
            width: 40px;
            height: 40px;
        }

        &:hover {
            opacity: 0.9;
            outline: 1px solid ${defaultTheme.color_gray};
        }

        &-wrapper {
            padding-top: 4px;
            padding-bottom: 4px;

            @media (max-width: ${breakpoints.xs}) {
                display: flex;
                justify-content: center;
            }
        }
    }

    .preview-display {
        height: 600px;
        overflow: hidden;

        @media (max-width: ${breakpoints.md}) {
            height: 520px;
        }

        @media (max-width: ${breakpoints.sm}) {
            height: 400px;
        }

        @media (max-width: ${breakpoints.xs}) {
            height: 320px;
        }
    }
`;
const ProductPreview = ({ previewImages, previewImagesVariant }) => {
    const [selectedImage, setSelectedImage] = useState(previewImages);

    console.log(previewImagesVariant);
    

    const handleImageClick = (image_variant) => {
        setSelectedImage(image_variant);
    };
    // console.log(previewImagesVariant);
    

    return (
        <ProductPreviewWrapper className="grid items-center">
            <div className="preview-items w-full">
                <div className="preview-item-wrapper">
                    {previewImagesVariant.map((image_variant, index) => (
                        <div className="preview-item" key={index} onClick={() => handleImageClick(image_variant)}>
                            <img src={image_variant.image_url} alt={`variant ${index}`} className="object-cover" />
                        </div>
                    ))}
                </div>
            </div>
            <div className="preview-display">
                <img src={selectedImage} className="object-cover" alt="Selected product" />
            </div>
        </ProductPreviewWrapper>
    );
};

ProductPreview.propTypes = {
  previewImages: PropTypes.string.isRequired,
  previewImagesVariant: PropTypes.arrayOf(PropTypes.string).isRequired, // Khai báo kiểu cho previewImagesVariant
};

export default ProductPreview;
