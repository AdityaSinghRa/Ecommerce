import express from 'express';
import product from "./routes/productRoutes.js";
import errorHandleMiddleware from "./middleware/error.js";
import user from "./routes/userRoutes.js";
import order from "./routes/orderRoutes.js";
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

const app=express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true, // temporary files
    tempFileDir: '/tmp/',
    limits: { fileSize: 50 * 1024 * 1024 },
    abortOnLimit: true,
  })
);

//Route
app.use('/api/v1',product);
app.use('/api/v1',user);
app.use('/api/v1',order);


app.use(errorHandleMiddleware);

export default app;