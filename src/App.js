import AddVehicle from "./Components/AddVehicle";
import AdminSideBar from "./Components/AdminSideBar";
import AdminHome from "./Components/AdminHome";
import UserHome from "./Components/UserHome";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import UserNavBar from "./Components/UserNavBar";
import UserProfile from "./Components/UserProfile";
import MyFavorite from './Components/MyFavorite'
import styles from './Styles/app.module.css'
import UserCart from "./Components/UserCart";
import SuccessPage from "./Components/SuccessPage";
import { SearchResults } from "./contextAPI/ProductsProvider"
import SearchResult from './Components/SearchResult'
import { useContext } from "react";
import AddProduct from "./Components/AddProduct";
import DetailsPage from "./Components/DetailsPage";
import Orders from "./Components/Orders";
import Categories from "./Components/Categories";

const  App = ()=>{

  const searchResults = useContext(SearchResults)

  return (
    <>
      <div className={styles.app}>
        <BrowserRouter>
        <AdminSideBar/>
        <UserNavBar/>
       { searchResults?.length!==0 && <SearchResult/>} 
        <Routes>
          <Route path="/admin/addvehicle" element={<AddVehicle/>}/>
          <Route path="/admin/addproduct" element={<AddProduct/>}/>
          <Route path="/admin/homepage" element={<AdminHome/>}/>
          <Route path="/" element={<Signup/>}/>  
          <Route path="/user/signup" element={<Signup/>}/>
          <Route path="/admin/signup" element={<Signup/>}/>
          <Route path="/user/login" element={<Login/>}/>
          <Route path="/admin/login" element={<Login/>}/>
          <Route path="/user/profile" element={<UserProfile/>}/>
          <Route path="/user/home" element={<UserHome/>}/>
          <Route path="/user/favorites" element={<MyFavorite/>}/>
          <Route path="/user/cart" element={<UserCart/>}/>
          <Route path="/user/orders" element={<Orders/>}/>
          <Route path="/user/categories" element={<Categories/>}/>
          <Route path="/user/products/:productId" element={<DetailsPage/>}/>
          <Route path="/user/payment/success" element={<SuccessPage/>}/>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
