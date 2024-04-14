import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from '../components/LoginPage/LoginPage';
import SignupPage from '../components/SignupPage/SignupPage';
import ProductPage from '../components/ProductPage/ProductPage';
import HomePage from '../components/HomePage/HomePage';
import ProductDetailsPage from '../components/ProductDetailsPage/ProductDetailsPage';
import CreateOrderPage from '../components/CreateOrderPage/CreateOrderPage';
import ManageProductsPage from '../components/ManageProductsPage/ManageProductsPage';

export default function App() {

  useEffect(() => {
    document.title = "UPGRAD ESHOP";
  }, []);

  return (
    <div>
      <Router>
          <Routes>
            <Route exact path="/signin" Component={LoginPage} />
            <Route exact path="/signup" Component={SignupPage} />
            <Route exact path="/Products" Component={ProductPage} />
            <Route exact path="/" Component={HomePage} />
            <Route exact path="/Product-Details" Component={ProductDetailsPage}/>
            <Route exact path="/Create-order" Component={CreateOrderPage}/>
            <Route exact path="/Manage_Products" Component={ManageProductsPage}/>
          </Routes>
      </Router>
    </div>
  );
}