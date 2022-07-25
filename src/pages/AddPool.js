import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import { storage } from "../App";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const AddPool = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState(0);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
    if (success) {
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate("/pools");
    }
  }, [dispatch, success, userInfo, navigate]);

  const uploadFileHandler = async (e) => {
    setUploading(true);
    try {
      const file = e.target.files[0];
      const metadata = {
        contentType: "image/any",
      };

      const storageRef = ref(storage, "images/" + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          alert(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImage(downloadURL);
            setUploading(false);
          });
        }
      );
      setUploading(false);
    } catch (error) {
      alert(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        id: userInfo.email + Date.now().toString(),
        name,
        price,
        image,
        location,
        addedBy: userInfo.email,
        size,
        isVerified:false,
        message,
        status:"start" //order offer start
      })
    );
  };

  return (
    <>
      <FormContainer>
        <h1>Add Pool</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="name"
                placeholder="Enter Title"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
              type="file"
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.Control>
              {uploading && <Loader />}
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="size">
              <Form.Label>Pool Size</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Pool Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Create
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default AddPool;
