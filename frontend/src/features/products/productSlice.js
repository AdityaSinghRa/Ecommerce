import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


export const getProduct=createAsyncThunk('product/getProduct',async({keyword,page=1,category}={},{rejectWithValue})=>{
  try{

    let link='/api/v1/products?page='+page;
    if(category){
      link+=`&category=${category}`;
    }
    if(keyword){
      link += `&keyword=${encodeURIComponent(keyword)}`;
    }
    // const link=keyword?`/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}`:`/api/v1/products?page=${page}`;

    const {data}=await axios.get(link);
    return data;
  }catch(error){
       if (error.response?.status === 404) {
        return rejectWithValue({ silent: true });
      }

      return rejectWithValue({
        message:
          error.response?.data?.message || "Something went wrong",
        silent: false,
      });
  }
});

//Product Details
export const getProductDetails=createAsyncThunk('product/getProductDetails',async(id,{rejectWithValue})=>{
 try{
  const link=`/api/v1/product/${id}`;
  const {data}=await axios.get(link);
  return data;
 }catch(error){
  // If the backend sent a message
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Something went wrong');
      }
 }
});

const productSlice=createSlice({
  name:'product',
  initialState:{
    products:[],
    productCount:0,
    loading:false,
    error:null,
    product:null,
    resultPerPage:1,
    totalpages:0,
  },
  reducers:{
    removeErrors:(state)=>{
      state.error=null;
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(getProduct.pending,(state)=>{
      state.loading=true;
      state.error=null;
    }).addCase(getProduct.fulfilled,(state,action)=>{
      state.loading=false;
       state.error=null;
      state.products=action.payload.products;
      state.productCount=action.payload.productCount;
      state.resultPerPage=action.payload.resultPerPage;
      state.totalpages=action.payload.totalpages;
    }).addCase(getProduct.rejected,(state,action)=>{
      state.loading=false;
       state.error=action.payload||'Something went wrong';
       state.products=[];
    });

    builder.addCase(getProductDetails.pending,(state)=>{
       state.loading=true;
      state.error=null;
    }).addCase(getProductDetails.fulfilled,(state,action)=>{
      state.loading=false;
       state.error=null;
      state.product=action.payload.product;
    }).addCase(getProductDetails.rejected,(state,action)=>{
      state.loading=false;
       state.error=action.payload||'Something went wrong';
    })
  }
})

export const {removeErrors}=productSlice.actions;
export default productSlice.reducer;