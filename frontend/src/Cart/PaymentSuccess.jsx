import React from 'react'
import '../CartStyles/PaymentSuccess.css'
import { Link, useSearchParams } from 'react-router-dom'

function PaymentSuccess() {
   const [searchParams]=useSearchParams();
   const reference=searchParams.get('reference')
  return (
    <div className="payment-success-container">
      <div className="success-icon">
        <div className="checkmark"></div>
      </div>
      <h1>Order Confirmed!</h1>
      <p>Your payment was successful. Reference ID <strong>{reference}</strong></p>
      <Link className='explore-btn' to='/'>Explore More Products</Link>
    </div>
  )
}

export default PaymentSuccess
