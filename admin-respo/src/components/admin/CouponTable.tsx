import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import useCoupon from "../../hooks/coupons";

const CouponTable = () => {
  const { coupons, deleteCoupon } = useCoupon();

  // Hàm định dạng giá trị tiền tệ sang VNĐ
  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div
      style={{
        overflowX: "auto",
        maxWidth: "100%",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
        className="mt-6 whitespace-nowrap text-left"
      >
        <colgroup>
          <col style={{ width: "100%" }} />
          <col style={{ width: "33.33%" }} />
          <col style={{ width: "16.66%" }} />
          <col style={{ width: "16.66%" }} />
          <col style={{ width: "8.33%" }} />
          <col style={{ width: "8.33%" }} />
          <col style={{ width: "8.33%" }} />
        </colgroup>
        <thead
          style={{
            backgroundColor: "#f9f9f9",
            borderBottom: "2px solid #ddd",
            color: "#333",
          }}
          className="text-sm leading-6"
        >
          <tr>
            <th style={{ padding: "8px", textAlign: "left" }}>Tên</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Mô tả</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Chiết khấu</th>
            <th style={{ padding: "8px", textAlign: "left" }}>
              Đơn hàng tối thiểu
            </th>
            <th style={{ padding: "8px", textAlign: "left" }}>
              Giảm giá tối đa
            </th>
            <th style={{ padding: "8px", textAlign: "left" }}>
              Giới hạn sử dụng
            </th>
            <th style={{ padding: "8px", textAlign: "left" }}>Trạng thái</th>
            <th style={{ padding: "8px", textAlign: "right" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((item, index) => (
            <tr
              key={item.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#eaeaea")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor =
                  index % 2 === 0 ? "#f5f5f5" : "white")
              }
            >
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {item.name}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {item.description}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {item.discount_amount}%
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {formatCurrency(item.min_order_value)}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {formatCurrency(item.max_order_value)}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                {item.usage_limit}
              </td>
              <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                <span
                  style={{
                    display: "inline-block",
                    padding: "4px 8px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: item.is_active ? "#007f00" : "#a10000",
                    backgroundColor: item.is_active ? "#d6f5d6" : "#ffd6d6",
                    borderRadius: "4px",
                  }}
                >
                  {item.is_active ? "Hoạt động" : "Không hoạt động"}
                </span>
              </td>
              <td
                style={{
                  padding: "8px",
                  borderBottom: "1px solid #ddd",
                  textAlign: "right",
                }}
              >
                <div
                  style={{ display: "flex", gap: "8px", justifyContent: "end" }}
                >
                  <Link
                    to={`/coupons/${item.id}`}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "32px",
                      height: "32px",
                      border: "1px solid #999",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                  >
                    <HiOutlinePencil />
                  </Link>
                  <Link
                    to={`/coupons/${item.id}`}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "32px",
                      height: "32px",
                      border: "1px solid #999",
                      borderRadius: "4px",
                      color: "#333",
                    }}
                  >
                    <HiOutlineEye />
                  </Link>
                  <button
                    onClick={() => deleteCoupon(`${item.id}`)}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "32px",
                      height: "32px",
                      border: "1px solid #999",
                      borderRadius: "4px",
                      color: "#333",
                      backgroundColor: "transparent",
                    }}
                  >
                    <HiOutlineTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CouponTable;
