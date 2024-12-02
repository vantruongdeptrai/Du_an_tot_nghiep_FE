import styled from "styled-components";
import { breakpoints, defaultTheme } from "../../styles/themes/default";
import useProduct from "../../hooks/useProduct";
import formatCurrency from "../../utils/formatUtils";
import { useColors, useSizes } from "../../hooks/useAtribute";

const CheckoutSummaryWrapper = styled.div`
    box-shadow: 2px 2px 4px 0px rgba(0, 0, 0, 0.05), -2px -2px 4px 0px rgba(0, 0, 0, 0.05);
    padding: 40px;

    @media (max-width: ${breakpoints.xl}) {
        padding: 24px;
    }

    @media (max-width: ${breakpoints.sm}) {
        padding: 16px;
    }

    @media (max-width: ${breakpoints.xs}) {
        background-color: transparent;
        padding: 0;
        box-shadow: none;
    }

    .order-list {
        row-gap: 24px;
        margin-top: 20px;

        @media (max-width: ${breakpoints.sm}) {
            row-gap: 16px;
        }
    }

    .order-item {
        grid-template-columns: 60px auto;
        gap: 16px;

        @media (max-width: ${breakpoints.xs}) {
            align-items: center;
        }

        &-img {
            width: 60px;
            height: 60px;
            overflow: hidden;
            border-radius: 4px;
        }

        &-info {
            gap: 16px;

            @media (max-width: ${breakpoints.xs}) {
                flex-direction: column;
                gap: 6px;
            }
        }
    }

    .order-info {
        margin-top: 30px;
        @media (max-width: ${breakpoints.sm}) {
            margin-top: 20px;
        }

        li {
            margin: 6px 0;
        }

        .list-separator {
            height: 1px;
            background-color: ${defaultTheme.color_anti_flash_white};
            margin: 12px 0;
        }
    }
`;

const CheckoutSummary = () => {
    const data = JSON.parse(localStorage.getItem("orderItems"));
    const { products } = useProduct();
    const { colors } = useColors();

    const { sizes } = useSizes();

    // Lấy danh sách các `product_id` từ `data`
    const productIds = data.map((item) => item.product_id);

    // Lọc ra các sản phẩm có ID nằm trong `productIds`
    const checkoutSummary = products.filter((product) => productIds.includes(product.id));

    const subtotal = data.reduce((acc, item) => {
        return acc + (parseFloat(item.price) * item.quantity);
    }, 0);
    const totalDiscount = data?.map((item) => item.discount);
    

    return (
        <CheckoutSummaryWrapper>
            <h4 className="text-xxl font-bold text-outersapce">Thông tin đơn hàng</h4>
            <div className="order-list grid">
                {checkoutSummary.map((order) => {
                    // Lấy dữ liệu từ `orderItems` tương ứng với sản phẩm
                    const itemData = data.filter((item) => item.product_id === order.id);

                    // Hiển thị từng sản phẩm trong data (có thể là sản phẩm không có biến thể hoặc có biến thể)
                    return itemData.map((item, index) => {
                        const detailColor = colors.find((color) => color.id === item.color);
                        const detailSize = sizes.find((size) => size.id === item.size);
                        return (
                            <div className="order-item grid" key={`${order.id}-${index}`}>
                                <div className="order-item-img">
                                    {/* Nếu sản phẩm có biến thể thì lấy ảnh biến thể, nếu không thì lấy ảnh mặc định của sản phẩm */}
                                    <img
                                        src={item.image_url || order.image_url}
                                        className="object-fit-cover"
                                        alt={order.name}
                                    />
                                </div>
                                <div className="order-item-info flex justify-between">
                                    <div className="order-item-info-l">
                                        <p className="text-base font-bold text-outerspace">
                                            {order.name}&nbsp;
                                            <span className="text-gray">x{item.quantity}</span>
                                        </p>
                                        {item.color && item.color !== "N/A" && (
                                            <p className="text-base font-bold text-outerspace">
                                                Màu: &nbsp;
                                                <span className="text-gray font-normal">{detailColor ? detailColor.name : item.color}</span>
                                            </p>
                                        )}
                                        {item.size && item.size !== "N/A" && (
                                            <p className="text-base font-bold text-outerspace">
                                                Kích cỡ: &nbsp;
                                                <span className="text-gray font-normal">{detailSize ? detailSize.name : item.size}</span>
                                            </p>
                                        )}
                                    </div>
                                    <div className="order-item-info-r text-gray font-bold text-base">
                                        {formatCurrency(item.price)}
                                    </div>
                                </div>
                            </div>
                        );
                    });
                })}
            </div>

            <ul className="order-info">
                <li className="flex items-center justify-between">
                    <span className="text-outerspace font-bold text-lg">
                        Tổng phụ <span className="text-gray font-semibold">({data.length} items)</span>
                    </span>
                    <span className="text-outerspace font-bold text-lg">{formatCurrency(subtotal)}</span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="text-outerspace font-bold text-lg">Tiết kiệm</span>
                    <span className="text-outerspace font-bold text-lg">{formatCurrency(totalDiscount[0])}</span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="text-outerspace font-bold text-lg">Phí ship</span>
                    <span className="text-outerspace font-bold text-lg">{formatCurrency(0)}</span>
                </li>
                <li className="list-separator"></li>
                <li className="flex items-center justify-between">
                    <span className="text-outerspace font-bold text-lg">Tổng tiền</span>
                    <span className="text-outerspace font-bold text-lg">{formatCurrency(subtotal - totalDiscount[0])}</span>
                </li>
            </ul>
        </CheckoutSummaryWrapper>
    );
};

export default CheckoutSummary;
