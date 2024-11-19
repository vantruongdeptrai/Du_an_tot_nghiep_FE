import OrderItem from "./OrderItem";
import PropTypes from "prop-types";

const OrderItemList = ({ orders, guestOrders }) => {
  
  return (
    <div>
      {orders.map((order, index) => (
        <OrderItem key={index} order={order} guestOrder={guestOrders} />
      ))}
    </div>
  );
};

export default OrderItemList;

OrderItemList.propTypes = {
  orders: PropTypes.array,
  guestOrders: PropTypes.array,
};
