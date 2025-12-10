import React from 'react'
import '../pageStyles/Home.css'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar';
import ImageSlider from '../components/imageSlider';
import Product from '../components/Product';


 const products = [
        {
            "_id": "692c6130c19c770dba871b59",
            "name": "product2",
            "description": "Product description2",
            "price": 200,
            "rating": 0,
            "image": [
                {
                    "public_id": "This is test id2",
                    "url": "Thuius is test url2",
                    "_id": "692c6130c19c770dba871b5a"
                }
            ],
            "category": "phone",
            "stock": 8,
            "numOfReviews": 0,
            "reviews": [],
            "createdAt": "2025-11-30T15:22:24.252Z",
            "__v": 0
        },
        {
            "_id": "692d592662ce29a2eb802fa3",
            "name": "product1",
            "description": "Product description1",
            "price": 900,
            "rating": 3.3333333333333335,
            "image": [
                {
                    "public_id": "This is test id1",
                    "url": "Thuius is test url1",
                    "_id": "692d592662ce29a2eb802fa4"
                }
            ],
            "category": "shirt",
            "stock": 1,
            "numOfReviews": 3,
            "reviews": [
                {
                    "user": "693696504d675722a69865ea",
                    "name": "Aditya Singh",
                    "rating": 5,
                    "comment": "Good quality",
                    "_id": "6937ec19a52faa4885179ce5"
                },
                {
                    "user": "69370274f8a0e8b73a876be5",
                    "name": "Aditya Singh Rajput",
                    "rating": 2,
                    "comment": "Bad quality",
                    "_id": "6937ec3aa52faa4885179cef"
                },
                {
                    "user": "693702a2f8a0e8b73a876be7",
                    "name": "Budhau Singh",
                    "rating": 3,
                    "comment": "Better quality",
                    "_id": "6937ec56a52faa4885179cfb"
                }
            ],
            "createdAt": "2025-12-01T09:00:22.205Z",
            "__v": 13
        }];


function Home() {
  return (
    <>
    <Navbar/>
    <ImageSlider/>
    <div className="home-container">
      <h2 className="home-heading">Trending Now</h2>
      <div className="home-product-container">
        {products.map((product,index) =>(
           <Product product={product} key={index}/>
        ))
         }
      </div>
      <Footer/>
    </div>
   </>
  )
}

export default Home
