import Product from "../models/productModel.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import APIFunctionality from "../utils/apiFuctionality.js";
import { v2 as cloudinary } from "cloudinary";

//http://localhost:8000/api/v1/product/692c6130c19c770dba871b59?keyword=shirt

//Creating Products
export const createProducts = handleAsyncError(async (req, res, next) => {
  let image = [];
  if (typeof req.body === "string") {
    image.push(req.body.image);
  } else {
    image = req.body.image;
  }

  const imageLinks = [];
  for (let i = 0; i < image.length; i++) {
    const result = await cloudinary.uploader.upload(image[i], {
      folder: "products",
    });
    imageLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.image = imageLinks;
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all products
export const getAllProducts = handleAsyncError(async (req, res, next) => {
  const resultPerPage = 4;
  const apiFeatures = new APIFunctionality(Product.find(), req.query)
    .search()
    .filter();

  //Getting filtered query before pagination
  const filteredQuery = apiFeatures.query.clone();
  const productCount = await filteredQuery.countDocuments();

  //Calculate totalpages on filtered count
  const totalpages = Math.ceil(productCount / resultPerPage);
  const page = Number(req.query.page) || 1;

  if (page > totalpages && productCount > 0) {
    return next(new HandleError("This page doesn't exist", 404));
  }

  //Apply Pagination
  apiFeatures.pagination(resultPerPage);

  const products = await apiFeatures.query;
  if (!products || products.length === 0) {
    return next(new HandleError("No Product Found", 404));
  }
  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    totalpages,
    currentPage: page,
  });
});

// Update Product
export const updateProduct = handleAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandleError("Product not Found", 404));
  }

  let images = [];

  if (req.body.image) {
    if (typeof req.body.image === "string") {
      images.push(req.body.image);
    } else if (Array.isArray(req.body.image)) {
      images = req.body.image;
    }
  }

  // If new images are provided, delete old ones & upload new
  if (images.length > 0) {
    for (let i = 0; i < product.image.length; i++) {
      await cloudinary.uploader.destroy(product.image[i].public_id);
    }

    const imageLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.uploader.upload(images[i], {
        folder: "products",
      });

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.image = imageLinks;
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

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
  for(let i=0;i<product.image.length;i++){
    await cloudinary.uploader.destroy(product.image[i].public_id)
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
export const createAndUpdateReview = handleAsyncError(
  async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
    const product = await Product.findById(productId);
    const reviewExists = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );
    if (reviewExists) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          (review.rating = rating), (review.comment = comment);
        }
      });
    } else {
      product.reviews.push(review);
    }
    product.numOfReviews = product.reviews.length;
    let avg = 0;
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
    product.rating =
      product.reviews.length > 0 ? avg / product.reviews.length : 0;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      product,
    });
  }
);

//Get all reviews of a product
export const getProductReviews = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);
  if (!product) {
    return next(new HandleError("Product not Found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Deleting Reviews
export const deleteReview = handleAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new HandleError("Product not Found", 404));
  }
  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );
  let sum = 0;
  reviews.forEach((rev) => {
    sum += rev.rating;
  });
  const rating = reviews.length > 0 ? sum / reviews.length : 0;
  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      rating,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    message: "Review Deleted Successfully",
  });
});

// Admin-Getting all products
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});
