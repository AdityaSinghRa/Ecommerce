import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({ keyword, page = 1, category } = {}, { rejectWithValue }) => {
    try {
      let link = "/api/v1/products?page=" + page;
      if (category) {
        link += `&category=${category}`;
      }
      if (keyword) {
        link += `&keyword=${encodeURIComponent(keyword)}`;
      }
      // const link=keyword?`/api/v1/products?keyword=${encodeURIComponent(keyword)}&page=${page}`:`/api/v1/products?page=${page}`;

      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      if (error.response?.status === 404) {
        return rejectWithValue({ silent: true });
      }

      return rejectWithValue({
        message: error.response?.data?.message || "Something went wrong",
        silent: false,
      });
    }
  }
);

//Product Details
export const getProductDetails = createAsyncThunk(
  "product/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const link = `/api/v1/product/${id}`;
      const { data } = await axios.get(link);
      return data;
    } catch (error) {
      // If the backend sent a message
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

//Submit Review
export const createReview = createAsyncThunk(
  "product/createReview",
  async ({ rating, comment, productId }, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/v1/review",
        { rating, comment, productId },
        config
      );
      return data;
    } catch (error) {
      // If the backend sent a message
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    loading: false,
    error: null,
    product: null,
    resultPerPage: 1,
    totalpages: 0,
    reviewSuccess: false,
    reviewLoading: false,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    removeSuccess: (state) => {
      state.reviewSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = action.payload.products;
        state.productCount = action.payload.productCount;
        state.resultPerPage = action.payload.resultPerPage;
        state.totalpages = action.payload.totalpages;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.products = [];
      });

    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload.product;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });

    builder
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        (state.reviewLoading = false), (state.reviewSuccess = true);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { removeErrors, removeSuccess } = productSlice.actions;
export default productSlice.reducer;
