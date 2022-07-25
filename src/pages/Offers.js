import React, { useEffect, useState } from "react";
import { Table, Button, Row, Col, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { listOffers, listProducts } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../App";

const OfferList = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [l, setL] = useState(false);
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo) {
      navigate("/login");
    }

    dispatch(listOffers());
  }, [dispatch, userInfo, navigate, l]);
  const acceptOffer = async (e) => {
    setL(true);
    try {
      await setDoc(
        doc(db, "orders", userInfo.email + Date.now().toString()),
        {
          customer: e.addedBy,
          id: userInfo.email + Date.now().toString(),
          image: e.image,
          technicianImage: "",
          location: e.location,
          price: e.priceOffered,
          size: e.size,
          technicianAssigned: "",
          technicianNotes: "",
          poolChemistry: "",
          gallonsUser: "",
          tabsUser: "",
          acidUsed: "",
          message: e.message,
          lastServiced: "",
          dateAssignedOn: "",
        }
      );
      await deleteDoc(doc(db, "offers", e.idd));
      alert("Offer sent");
      setL(false);
    } catch (error) {
      setL(false);
      alert(error.message);
    }
  };
  const rejectOffer = async (e) => {
    setL(true);
    try {
      await deleteDoc(doc(db, "offers", e.idd));

      alert("Offer rejected");
      setL(false);
    } catch (error) {
        console.log(error);
      setL(false);
      alert(error.message);
    }
  };
  return (
    <>
      <Row className="align-items-center">
        <Col>
          <h1>Offers</h1>
        </Col>
      </Row>

      {loading || l ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>Offered Price</th>
                <th>LOCATION</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product, idx) => (
                <tr key={product._id}>
                  <td>{idx + 1}</td>
                  <td>{product.name}</td>
                  <td>${product.price}</td>
                  <td>{product.priceOffered}</td>
                  <td>{product.location}</td>
                  <td>
                    <Button
                      variant="success"
                      onClick={() => acceptOffer(product)}
                      className="btn-sm"
                    >
                      Acecpt Offer
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => rejectOffer(product)}
                      className="btn-sm"
                    >
                      Reject Offer
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </>
  );
};

export default OfferList;
