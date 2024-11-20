import { Link } from "react-router-dom";
import { HiOutlinePencil, HiOutlineTrash, HiOutlineEye } from "react-icons/hi";
import useCoupon from "../../hooks/coupons";

const CouponTable = () => {
  const { coupons, deleteCoupon } = useCoupon();

  return (
    <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
      <colgroup>
        <col className="w-full sm:w-4/12" />
        <col className="lg:w-4/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-2/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
        <col className="lg:w-1/12" />
      </colgroup>
      <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
        <tr>
          <th className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">Name</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Description</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Discount</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Min Order</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Usage Limit</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Active</th>
          <th className="py-2 pl-0 pr-8 font-semibold">Start Date</th>
          <th className="py-2 pl-0 pr-8 font-semibold">End Date</th>
          <th className="py-2 pl-0 pr-4 text-right font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {coupons.map((item) => (
          <tr key={item.id}>
            <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">{item.name}</td>
            <td className="py-4 pl-0 pr-8">{item.description}</td>
            <td className="py-4 pl-0 pr-8">{item.discount_amount}</td>
            <td className="py-4 pl-0 pr-8">{item.min_order_value}</td>
            <td className="py-4 pl-0 pr-8">{item.usage_limit}</td>
            <td className="py-4 pl-0 pr-8">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  item.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.is_active ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-4 pl-0 pr-8">
              {new Date(item.start_date).toLocaleDateString()}
            </td>
            <td className="py-4 pl-0 pr-8">
              {new Date(item.end_date).toLocaleDateString()}
            </td>
            <td className="py-4 pl-0 text-right pr-6 lg:pr-8">
              <div className="flex gap-x-1 justify-end">
                <Link
                  to={`/coupons/${item.id}`}
                  className="dark:bg-blackPrimary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                >
                  <HiOutlinePencil className="text-lg" />
                </Link>
                <Link
                  to={`/categories/${item.id}`}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                >
                  <HiOutlineEye className="text-lg" />
                </Link>
                <button
                  onClick={() => deleteCoupon(`${item.id}`)}
                  className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer dark:hover:border-gray-500 hover:border-gray-400"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CouponTable;
