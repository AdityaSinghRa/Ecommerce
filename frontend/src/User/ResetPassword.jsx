import React, { useEffect, useState } from 'react';
import '../UserStyles/Form.css'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from '../components/PageTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { removeErrors, removeSuccess, resetPassword, updatePassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

function ResetPassword() {
   const {success,loading,error}=useSelector(state=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
     const {token}=useParams();

  const resetPasswordSubmit=(e)=>{
    e.preventDefault();
    const data={
      password,
      confirmPassword,
    }
    console.log(data)
    dispatch(resetPassword({token:token,userData:data}))
  }

   useEffect(()=>{
            if(error){
              toast.error(error,{position:'top-center',autoClose:3000});
              dispatch(removeErrors());
            }
          },[dispatch,error])
    
     useEffect(()=>{
              if(success){
                toast.success('Password Reset Successfully',{position:'top-center',autoClose:3000});
                dispatch(removeSuccess());
                navigate('/login')
              }
            },[dispatch,success]);
  return (
     <>
   {loading?(<Loader/>):( <>
    <Navbar/>
    <PageTitle title='Reset Password'/>
   <div className="form-container update-container">
     <div className="form-content">
          <form
            className="form"
            onSubmit={resetPasswordSubmit}
          >
            <h2>Forgot Password</h2>
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder='New Password'
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder='Confirm New Password'
                value={confirmPassword}
                onChange={(e)=>setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="authBtn">Update Password</button>
          </form>
        </div>
   </div>
   <Footer/>
   </>)}
   </>
  )
}

export default ResetPassword
