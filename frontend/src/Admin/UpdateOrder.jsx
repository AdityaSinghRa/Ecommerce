import React, { useEffect, useState } from "react";
import "../AdminStyles/UpdateOrder.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetail } from "../features/order/orderSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { removeErrors, removeSuccess, updateOrderStatus } from "../features/admin/adminSlice";

function UpdateOrder() {
  const [status, setStatus] = useState("");
  const { id } = useParams();
  const { order, loading:orderLoading} = useSelector((state) => state.order);
  const {success,loading:adminLoading,error}=useSelector(state=>state.admin);
  const loading=orderLoading || adminLoading
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getOrderDetail(id));
    }
  }, [dispatch, id]);

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
  } = order;

  const paymentStatus=paymentInfo.status==='succeeded'?'Paid':'Not Paid';
  const finalOrderStatus=paymentStatus==='Not Paid'?'Cancelled':orderStatus;

  const handleStatusUpdate=()=>{
    if(!status){
      toast.error('Please select a status',{ position: "top-center", autoClose: 3000 })
      return
    }
    dispatch(updateOrderStatus({id,status}))
  }

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if(success){
       toast.success('Order Status Updated Successfully', { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      dispatch(getOrderDetail(id));
    }
  }, [dispatch, error,success,id]);
  return (
    <>
      <Navbar />
      <PageTitle title="Update Order" />
    {loading?(<Loader/>):(  <div className="order-container">
        <h1 className="order-title">Update Order</h1>
        <div className="order-details">
          <h2>Order Information</h2>
          <p>
            <strong>Order ID:</strong>
            {id}
          </p>
          <p>
            <strong>Shipping Address:</strong>
            {shippingInfo.address},{shippingInfo.city},{shippingInfo.state},
            {shippingInfo.country}-{shippingInfo.pinCode}
          </p>
          <p>
            <strong>Phone:</strong>{shippingInfo.phoneNo}
          </p>
          <p>
            <strong>Order Status:</strong>{finalOrderStatus}
          </p>
          <p>
            <strong>Payment Status:</strong>{paymentStatus}
          </p>
          <p>
            <strong>Total Price:</strong>{totalPrice}/-
          </p>
        </div>

        <div className="order-items">
          <h2>Order Items</h2>
          <table className="order-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
             {orderItems.map((order,ind)=>(
              <tr key={order._id}>
                <td>
                  <img
                    src={order.image}
                    alt={order.name}
                    className="order-item-image"
                  />
                </td>
                <td>{order.name}</td>
                <td>{order.quantity}</td>
                <td>{order.price}/-</td>
              </tr>
             )) }
            </tbody>
          </table>
        </div>

        <div className="order-status">
          <h2>Update Status</h2>
          <select
            className="status-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={loading || orderStatus==='Delivered'}
          >
            <option value="">Select Status</option>
            <option value="Shipped">Shipped</option>
            <option value="On The Way">On The Way</option>
            <option value="Delivered">Delivered</option>
          </select>
          <button className="update-button" onClick={handleStatusUpdate} disabled={loading || !status ||orderStatus==='Delivered'}>Update Status</button>
        </div>
      </div>)}
      <Footer />
    </>
  );
}

export default UpdateOrder;
