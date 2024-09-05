import { Link } from "react-router-dom";
import { HiOutlinePencil } from "react-icons/hi";
import { HiOutlineTrash } from "react-icons/hi";
import { HiOutlineEye } from "react-icons/hi";
import usePermission from "../hooks/permissions";

const PermissionTable = () => {
    const { permissions, deletePermission } = usePermission();
    return (
        <table className="mt-6 w-full whitespace-nowrap text-left max-lg:block max-lg:overflow-x-scroll">
            <colgroup>
                <col className="w-full sm:w-4/12" />
                <col className="lg:w-4/12" />
                <col className="lg:w-2/12" />
                <col className="lg:w-1/12" />
                <col className="lg:w-1/12" />
            </colgroup>
            <thead className="border-b dark:border-white/10 border-black/10 text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                <tr>
                    <th scope="col" className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
                        STT
                    </th>
                    <th scope="col" className="py-2 pl-0 pr-8 font-semibold table-cell">
                        Name
                    </th>
                    <th scope="col" className="py-2 pl-0 pr-4 text-right font-semibold table-cell sm:pr-6 lg:pr-8">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {permissions.map((item, index) => (
                    <tr key={item.id}>
                        <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                            <div className="flex items-center gap-x-4">
                                <div className="truncate text-sm font-medium leading-6 dark:text-whiteSecondary text-blackPrimary">
                                    {index + 1}
                                </div>
                            </div>
                        </td>
                        <td className="py-4 pl-0 table-cell pr-8">
                            <div className="flex gap-x-3">
                                <div className="text-sm leading-6 dark:text-whiteSecondary text-blackPrimary">
                                    {item.name}
                                </div>
                            </div>
                        </td>
                        <td className="py-4 pl-0 text-right text-sm leading-6 dark:text-whiteSecondary text-blackPrimary table-cell pr-6 lg:pr-8">
                            <div className="flex gap-x-1 justify-end">
                                <Link
                                    to={`/permissions/${item.id}`}
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
                                    onClick={() => deletePermission(`${item.id}`)}
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

export default PermissionTable;
