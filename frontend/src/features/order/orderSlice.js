import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


//Creating Order
export const createOrder=createAsyncThunk('order/createOrder',async(order,{rejectWithValue})=>{

  try{
    const config={
      headers:{
        'Content-Type':'application/json'
      }
    }
    const {data}=await axios.post('/api/v1/new/order',order,config);
    console.log('Order Data',data)
    return data;
  }catch(error){
     return rejectWithValue(
        error.response?.data?.message ||
        "Order Creating Failed."
      );
  }
})


//Get User Orders
export const getAllMyOrders=createAsyncThunk('order/getAllMyOrders',async(_,{rejectWithValue})=>{

  try{
   const {data}=await axios.get('/api/v1/orders/user')
   return data
  }catch(error){
     return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch orders."
      );
  }
});


//Get Order Details
export const getOrderDetail=createAsyncThunk('order/getOrderDetail',async(orderId,{rejectWithValue})=>{

  try{
   const {data}=await axios.get(`/api/v1/order/${orderId}`)
   return data
  }catch(error){
     return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch order details."
      );
  }
})


const orderSlice=createSlice({
  name:'order',
  initialState:{
    success:false,
    loading:false,
    error:null,
    orders:[],
    order:{}
  },
  reducers:{
    removeErrors:(state)=>{
      state.error=null;
    },
    removeSuccess:(state)=>{
      state.success=false
    }
  },
  extraReducers:(builder)=>{
     builder.addCase(createOrder.pending,(state)=>{
          state.loading=true;
          state.error=null
        })
        .addCase(createOrder.fulfilled,(state,action)=>{
          state.loading=false;
          state.order=action.payload.order
          state.success=action.payload.success
        })
        .addCase(createOrder.rejected,(state,action)=>{
          state.loading=false;
          state.error=action.payload || 'Order Creating Failed.';
        });

        //Get All user Order
         builder.addCase(getAllMyOrders.pending,(state)=>{
          state.loading=true;
          state.error=null
        })
        .addCase(getAllMyOrders.fulfilled,(state,action)=>{
          state.loading=false;
          state.orders=action.payload.orders
          state.success=action.payload.success
        })
        .addCase(getAllMyOrders.rejected,(state,action)=>{
          state.loading=false;
          state.error=action.payload || 'Failed to fetch orders.';
        });

        //Get Order Details
         builder.addCase(getOrderDetail.pending,(state)=>{
          state.loading=true;
          state.error=null
        })
        .addCase(getOrderDetail.fulfilled,(state,action)=>{
          state.loading=false;
          state.order=action.payload.order
          state.success=action.payload.success
        })
        .addCase(getOrderDetail.rejected,(state,action)=>{
          state.loading=false;
          state.error=action.payload || 'Failed to fetch order detail.';
        });
  }
})

export const {removeErrors,removeSuccess}=orderSlice.actions;
export default orderSlice.reducer;
