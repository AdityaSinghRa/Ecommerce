import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true
    },
    state:{
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    pinCode: {
      type: Number,
      required: true
    },
    phoneNo: {
      type: Number,
      required: true
    }
  },

  orderItems: [
    {
      name: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      image:{
        type: String,
        required: true
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: true
      }
    }
  ],
  orderStatus:{
    type:String,
    default:"Processing"
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },

  paymentInfo: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true
    }

  },

  paidAt: {
    type: Date,
    required: true
  },
  itemsPrice: {
    type: Number,
    required: true,
    default:0
  },

  taxPrice: {
    type: Number,
   required: true, 
  },

  shippingPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveredAt: Date,
  createdAt:{
    type: Date,
    default: Date.now
  }
});


export default mongoose.model("Order", orderSchema);