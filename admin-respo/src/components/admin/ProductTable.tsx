// *********************
// Role of the component: ProductTable component that displays the products in a table
// Name of the component: ProductTable.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <ProductTable />
// Input parameters: no input parameters
// Output: ProductTable component that displays the products in a table
// *********************

import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlineEye } from "react-icons/hi";
import useProduct from "../../hooks/product";

const ProductTable = () => {
    const { products } = useProduct();
    console.log(products);

    return (
        <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
            <colgroup>
                <col className="w-full sm:w-4/12" />
                <col className="lg:w-4/12" />
                <col className="lg:w-2/12" />
                <col className="lg:w-1/12" />
                <col className="lg:w-1/12" />
            </colgroup>
            <thead className="border-b border-white/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                <tr>
                    <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
                        Product
                    </th>
                    <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
                        Description
                    </th>
                    <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
                        Price
                    </th>
                    <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell lg:pr-20">
                        Category
                    </th>
                    <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {products.map((item) => (
                    <tr key={item.id}>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                            <div className="flex items-center gap-x-4">
                                <img src={item.image} alt="" className="h-8 w-8 rounded-full bg-gray-800" />
                                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                                    {item.name}
                                </div>
                            </div>
                        </td>
                        <td className="py-4 pl-0 pr-4 table-cell pr-8">
                            <div className="flex gap-x-3">
                                <div className="font-mono text-sm leading-6 dark:text-whiteSecondary text-blackPrimary truncate w-56">
                                    {item.description}
                                </div>
                            </div>
                        </td>
                        <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                            <div className="flex items-center gap-x-2 justify-start">
                                <div className="dark:text-whiteSecondary text-blackPrimary block">${item.price}</div>
                            </div>
                        </td>
                        <td className="py-4 pl-0 pr-8 text-sm leading-6 dark:text-rose-200 text-rose-600 font-medium table-cell lg:pr-20">
                            {item.category
                                ? item.category.map((cat) => cat.id === item.id ? cat.name : "Unknown").join(", ")
                                : "Unknown"}
                        </td>
                        <td className="py-4 pl-0 pr-4 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                            <div className="flex gap-x-1 justify-end">
                                <Link
                                    to="/products/1"
                                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                                >
                                    <HiOutlinePencil className="text-lg" />
                                </Link>
                                <Link
                                    to="/products/1"
                                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                                >
                                    <HiOutlineEye className="text-lg" />
                                </Link>
                                <Link
                                    to="#"
                                    className="dark:bg-blackPrimary bg-whiteSecondary dark:text-whiteSecondary text-blackPrimary border border-gray-600 w-8 h-8 block flex justify-center items-center cursor-pointer hover:border-gray-400"
                                >
                                    <HiOutlineTrash className="text-lg" />
                                </Link>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
export default ProductTable;
