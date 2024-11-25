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
            margin: 0 auto;
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
        margin-top: 10px;
        transition: ${defaultTheme.default_transition};

        @media (max-width: ${breakpoints.sm}) {
            width: 40px;
            height: 40px;
        }

        &:hover {
            opacity: 0.9;
            outline: 1px solid ${defaultTheme.color_gray};
        }

        img {
            width: 100%;
            height: 100%;
            object-fit: contain; /* Hiển thị đầy đủ ảnh */
        }
    }

    .preview-display {
        display: flex;
        justify-content: center;
        align-items: center;
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

        img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain; /* Không cắt ảnh */
        }
    }
`;
const ProductPreview = ({ previewImages, previewImagesVariant }) => {
    const [selectedImage, setSelectedImage] = useState(previewImages);
    const handleImageClick = (imageVariant) => {
        setSelectedImage(imageVariant.image_url);
    };
    // console.log(previewImagesVariant);

    return (
        <ProductPreviewWrapper className="grid items-center">
            <div className="preview-items w-full">
                <div className="preview-item-wrapper">
                    {previewImagesVariant.map((imageVariant, index) => {
                        console.log("Image Variant: ", imageVariant.image_url); // Log đường dẫn ảnh
                        return (
                            <div className="preview-item" key={index} onClick={() => handleImageClick(imageVariant)}>
                                <img src={imageVariant.image_url} alt={`variant ${index}`} className="object-cover" />
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="preview-display">
                <img
                    src={selectedImage}
                    alt="Selected product"
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                />
            </div>
        </ProductPreviewWrapper>
    );
};

ProductPreview.propTypes = {
    previewImages: PropTypes.string.isRequired,
    previewImagesVariant: PropTypes.arrayOf(PropTypes.string).isRequired, // Khai báo kiểu cho previewImagesVariant
};

export default ProductPreview;
