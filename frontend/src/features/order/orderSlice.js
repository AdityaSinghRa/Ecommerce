import {createSlice} from '@reduxjs/toolkit';

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
    
  }
})