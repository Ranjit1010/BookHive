import './index.css';
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";
import { Home } from './Components/Home';
import { Login } from './Components/Login';
import { Signup } from './Components/Signup';
import { AddProduct } from './Components/AddProduct';
import {LikedProducts} from './Components/LikedProducts';
import ProductDetail from './Components/ProductDetail';
import { CategoryPage } from './Components/CategoryPage';
import { MyProducts } from './Components/MyProducts';
import { MyProfile } from './Components/MyProfile';
import { EditProduct } from './Components/EditProduct';
 


const router = createBrowserRouter([
  {
    path: "/",
    element: (<Home/>),
  },
  {
  path: "/category/:catName",
  element: (<CategoryPage/>),
  },
  {

  path: "about",
    element: <div>About</div>,
  },
  {
    path: "/login",
    element: (<Login/>),
  },
  {
    path: "/signup",
    element: (<Signup/>),
  },
  {
    path: "/addproduct",
    element: (<AddProduct/>),
  },
  {
    path: "/liked-products",
    element: (<LikedProducts/>),
  },
  {
    path: "/edit-product/:productId",
    element: (<EditProduct/>),
  },
  {
    path: "/product/:productId",
    element: (<ProductDetail/>),
  },
  {
    path: "/my-products",
    element: (<MyProducts/>),
  },
  {
    path: "/my-profile",
    element: (<MyProfile/>),
  },
  
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);