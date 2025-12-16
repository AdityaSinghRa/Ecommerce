import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeErrors, removeSuccess, updateProfile } from "../features/user/userSlice";
import Loader from '../components/Loader';
import PageTitle from '../components/PageTitle';

function UpdateProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("./images/profile.jpg");

  const { user, error, success, message, loading } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const profileImageUpdate = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
      }
    };
    reader.onerror = (error) => {
      toast.error("Error Reading File");
    };
    reader.readAsDataURL(file);
  };

  const updateSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("name", name);
    myForm.append("email", email);
    myForm.append("avatar", avatar);
    dispatch(updateProfile(myForm));
  };

    useEffect(()=>{
          if(error){
            toast.error(error,{position:'top-center',autoClose:3000});
            dispatch(removeErrors());
          }
        },[dispatch,error])

       useEffect(()=>{
          if(success){
            toast.success(message,{position:'top-center',autoClose:3000});
            dispatch(removeSuccess());
            navigate('/profile')
          }
        },[dispatch,success]);
        
        useEffect(()=>{
          if(user){
            setName(user.name)
             setEmail(user.email)
              setAvatarPreview(user.avatar.url || './images/profile.jpg')
          }
        },[user])
  return (
    <>
   {loading?(<Loader/>):( <>
      <Navbar />
      <PageTitle title='Profile Update' />
      <div className="form-container update-profile">
        <div className="form-content">
          <form
            className="form"
            encType="multipart/form-data"
            onSubmit={updateSubmit}
          >
            <h2>Update Profile</h2>
            <div className="input-group avatar-group">
              <img src={avatarPreview} alt="User Profile" className="avatar" />
              <input
                type="file"
                accept="image/"
                className="file-input"
                name="avatar"
                onChange={profileImageUpdate}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                value={name}
                name="name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="text"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="authBtn">Update</button>
          </form>
        </div>
      </div>

      <Footer />
    </>)}
    </>
  );
}

export default UpdateProfile;
