import './App.css';
import Log from './Front_Page/Login';
import Register from './Front_Page/Register';
import User from './getuser/user';
import Adduser from './adduser/Adduser';
import Update from "./updateproduct/Update";
import Home from "./Front_Page/Home";
import Admin from "./Front_Page/Admin";
import Product from './products/product';
import Add_prooducts from './products/Add_prooducts';
import View_products from './products/View_products';
import Payment from './Front_Page/PaymentPage'; 
import AddToCart from './Front_Page/AddToCart'; // <-- NEW AddToCart Import
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Log />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path:"/home",
    element:<Home />
  },
  {
    path:"/admin",
    element:<Admin />
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/products",
    element: <Product />,
  },
  {
    path: "/add_products",
    element: <Add_prooducts />,
  },
  {
    path: "/all_products",
    element: <View_products />,
  },
  {
    path:"/add",
    element:<Adduser />
  },  
  {
    path:"/update/:id",
    element:<Update />
  },
  {
    path:"/payment",
    element:<Payment />
  },
  {
    path:"/addtocart",           // <-- NEW route for AddToCart page
    element:<AddToCart />
  }
]);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RouterProvider router={router} /> 
      </header>
    </div>
  );
}

export default App;
