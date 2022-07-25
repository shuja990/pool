import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "./components/Header";
import ".//bootstrap.min.css";
import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import RegisterScreen from "./pages/RegisterScreen";
import LoginScreen from "./pages/LoginScreen";
import AddPool from "./pages/AddPool";
import PoolList from "./pages/PoolsList";
import OfferList from "./pages/Offers";
import OrderListScreen from "./pages/PoolOrders";
import OrderScreen from "./pages/PoolOrder";

const firebaseConfig = {
  apiKey: "AIzaSyD2rHiBMhN2h2kA7lnNW0X_OUgKebqYBc8",
  authDomain: "pool-3519b.firebaseapp.com",
  databaseURL: "https://pool-3519b-default-rtdb.firebaseio.com",
  projectId: "pool-3519b",
  storageBucket: "pool-3519b.appspot.com",
  messagingSenderId: "872457707354",
  appId: "1:872457707354:web:24113f2bb5bafad94a5d63",
  measurementId: "G-6YLWJMR0HT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

const App = () => {
  return (
    <Router>
      <Header />
      <main className="py-3">
        <Container>
          <Routes>
            <Route exact path="/*" element={<AddPool />} />
            <Route exact path="/signup" element={<RegisterScreen />} />
            <Route exact path="/login" element={<LoginScreen />} />
            <Route exact path="/addPool" element={<AddPool />} />
            <Route exact path="/pools" element={<PoolList />} />
            <Route exact path="/offers" element={<OfferList />} />
            <Route exact path="/orders" element={<OrderListScreen />} />
            <Route exact path="/order/:id" element={<OrderScreen />} />
          </Routes>
        </Container>
      </main>
    </Router>
  );
};

export default App;
