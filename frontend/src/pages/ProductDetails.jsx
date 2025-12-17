import React, { useEffect, useState } from "react";
import "../pageStyles/ProductDetails.css";
import PageTitle from "../components/pageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Rating from "../components/Rating";
import Laoder from "../components/Loader";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getProductDetails,
  removeErrors,
} from "../features/products/productSlice";
import { toast } from "react-toastify";
import { addItemsToCart, removeMessage } from "../features/cart/cartSlice";

function ProductDetails() {
  const [userRating, setUserRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const handleRatingChange = (newRating) => {
    setUserRating(newRating);
  };

  const { loading, error, product } = useSelector((state) => state.product);

  const {
    loading: cartLoading,
    error: cartError,
    success,
    message,
    cartItems,
  } = useSelector((state) => state.cart);

 
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      dispatch(getProductDetails(id));
    }
    return () => {
      //cleanup
      dispatch(removeErrors());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (cartError) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
    }
  }, [dispatch, error,cartError]);


  useEffect(() => {
    if (success) {
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeMessage());
    }
  }, [dispatch,success,message]);

  if (loading) {
    return (
      <>
        <Navbar />
        <PageTitle title={`${product?.name}-Details`} />
        <Laoder />
        <Footer />
      </>
    );
  }

  const decreaseQuantity = () => {
    if (quantity <= 1) {
      toast.error("Quantity can't be less than 1", {
        position: "top-center",
        autoClose: 2000,
      });
      dispatch(removeErrors());
      return;
    }
    setQuantity((qty) => qty - 1);
  };
  const increaseQuantity = () => {
    if (product.stock <= quantity) {
      toast.error("Cannot exceed available Stock!", {
        position: "top-center",
        autoClose: 2000,
      });
      dispatch(removeErrors());
      return;
    }
    setQuantity((qty) => qty + 1);
  };

  const addToCart = () => {
    dispatch(addItemsToCart({ id, quantity }));
  };

  if (error || !product) {
    return (
      <>
        <Navbar />
        <PageTitle title={`Product-Details`} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <PageTitle title={`${product?.name}-Details`} />
      <Navbar />
      <div className="product-details-container">
        <div className="product-detail-container">
          <div className="product-image-container">
            <img
              src={product.image[0].url.replace("./", "/")}
              alt="Product title"
              className="product-detail-image"
            />
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <p className="product-description">{product.description}</p>
            <p className="product-price">Price : {product.price}/</p>
            <div className="product-rating">
              <Rating value={product.rating} disabled={true} />
            </div>
            <span className="productCardSpan">
              ({product.numOfReviews} Review)
            </span>
            <div className="stock-status">
              <span
                className={product.stock > 0 ? ` in-stock` : `out-of-stock`}
              >
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : `Out of Stock`}
              </span>
            </div>
            {product.stock > 0 && (
              <>
                <div className="quantity-controls">
                  <span className="quantity-label">Quantity:</span>
                  <button
                    className="quantity-button"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    className="quantity-value"
                    readOnly
                  />
                  <button
                    className="quantity-button"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={addToCart}
                  disabled={cartLoading}
                >
                  {cartLoading ? "Adding" : "Add to Cart"}
                </button>
              </>
            )}
            <form className="review-form">
              <h3>Write a Review</h3>
              <Rating
                value={0}
                onRatingChange={handleRatingChange}
                disabled={false}
              />
              <textarea
                placeholder="Write your review here"
                className="review-input"
              ></textarea>
              <button className="submit-review-btn">Submit</button>
            </form>
          </div>
        </div>
        <div className="reviews-container">
          <h3>Customer Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="reviews-section">
              {product.reviews.map((review, index) => (
                <div className="review-item" key={index}>
                  <div className="review-header">
                    <Rating value={review.rating} disabled={true} />
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <p className="review-name">By: {review.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-reviews">No Reviews Yet</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductDetails;
