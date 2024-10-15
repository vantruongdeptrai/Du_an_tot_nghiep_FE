// src/App.tsx

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import {
  Categories,
  CreateCategory,
  CreateOrder,
  CreateProduct,
  CreateReview,
  CreateUser,
  EditCategory,
  EditOrder,
  EditProduct,
  EditReview,
  EditUser,
  HelpDesk,
  HomeLayout,
  Landing,
  LandingV2,
  Login,
  Notifications,
  Orders,
  Products,
  Profile,
  Register,
  Reviews,
  Users,
} from "./pages"; // Import các page từ src/pages

import Permissions from "./pages/permission/Permissions";
import CreatePermission from "./pages/permission/CreatePermission";
import EditPermission from "./pages/permission/EditPermission";
import Coupon from "./pages/coupon/Coupon";
import CreateCoupon from "./pages/coupon/CreateCoupon";
import EditCoupon from "./pages/coupon/EditCoupon";
import OperatingCost from "./pages/operating_costs/OperatingCost";
import CreateOperatingCost from "./pages/operating_costs/CreateOperatingCost";
import EditOperatingCost from "./pages/operating_costs/EditOperatingCost";
import DetailProduct from "./pages/product/DetailProduct";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />, // Đảm bảo Login được import chính xác
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/landing-v2",
        element: <LandingV2 />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/create-product",
        element: <CreateProduct />,
      },
      {
        path: "/product/edit/:id",
        element: <EditProduct />,
      },
      {
        path: "/product/detail/:id",
        element: <DetailProduct />,
      },
      {
        path: "/permissions",
        element: <Permissions />,
      },
      {
        path: "/permissions/create-permission",
        element: <CreatePermission />,
      },
      {
        path: "/permissions/:id",
        element: <EditPermission />,
      },
      {
        path: "/operating-costs",
        element: <OperatingCost />,
      },
      {
        path: "/operating-costs/create-operating-cost",
        element: <CreateOperatingCost />,
      },
      {
        path: "/operating-costs/:id",
        element: <EditOperatingCost />,
      },
      {
        path: "/coupons",
        element: <Coupon />,
      },
      {
        path: "/coupons/create-coupon",
        element: <CreateCoupon />,
      },
      {
        path: "/coupons/:id",
        element: <EditCoupon />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
      {
        path: "/categories/create-category",
        element: <CreateCategory />,
      },
      {
        path: "/categories/:id",
        element: <EditCategory />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
      {
        path: "/orders/create-order",
        element: <CreateOrder />,
      },
      {
        path: "/orders/1",
        element: <EditOrder />,
      },
      {
        path: "/reviews",
        element: <Reviews />,
      },
      {
        path: "/reviews/:id",
        element: <EditReview />,
      },
      {
        path: "/reviews/create-review",
        element: <CreateReview />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/:id",
        element: <EditUser />,
      },
      {
        path: "/users/create-user",
        element: <CreateUser />,
      },
      {
        path: "/help-desk",
        element: <HelpDesk />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
