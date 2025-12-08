import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFuctionality.js";

//http://localhost:8000/api/v1/product/692c6130c19c770dba871b59?keyword=shirt

//Creating Products
export const createProducts = handleAsyncError(async (req, res, next) => {
   req.body.user=req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
  const resultPerPage=3;
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

    //Getting filtered query before pagination
    const filteredQuery=apiFeatures.query.clone();
    const productCount=await filteredQuery.countDocuments();

    //Calculate totalpages on filtered count
    const totalpages=Math.ceil(productCount/resultPerPage);
    const page=Number(req.query.page)||1;

    if(page>totalpages&&productCount>0){
      return next(new HandleError("This page doesn't exist",404))
    }

    //Apply Pagination
    apiFeatures.pagination(resultPerPage);
   
  const products = await apiFeatures.query;
  if(!products||products.length===0){
    return next(new HandleError("No Product Found",404))
  }
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    totalpages,
    currentPage:page
  });
});

//Update Product
export const updateProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new HandleError("Product not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product

export const deleteProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new HandleError("Poduct not Found", 404));
  }
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

//Accessing Single Product
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError("Poduct not Found", 404));
  }
  res.status(200).json({
    success: true,
    product,
  });
});


//Creating and Updating Review
export const createAndUpdateReview = handleAsyncError(async (req, res, next) => {
  const {rating,comment,productId}=req.body;
  const review={
    user:req.user._id,
    name:req.user.name,
    rating,
    comment
  }
  const product=await Product.findById(productId);
  console.log(product);
});


// Admin-Getting all products
export const getAdminProducts=handleAsyncError(async(req,res,next)=>{
  const products=await Product.find();
  res.status(200).json({
    success:true,
    products
  })
});


