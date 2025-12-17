import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';




//Register API
export const register=createAsyncThunk('user/register',async(userData,{rejectWithValue})=>{

  try{
     const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      const { data } = await axios.post('/api/v1/register', userData, config);
     console.log('Registration Data',data);
     return data;
  }catch(error){
   if (error.response && error.response.data && error.response.data.message) {
        return rejectWithValue(error.response.data.message); // string only
      } else {
        return rejectWithValue('Registration failed. Please try again.');
      }
  }
});


export const login=createAsyncThunk('user/login',async({email,password},{rejectWithValue})=>{

  try{
    const config={
      headers:{
        'Content-Type':'application/json'
      }
    }
     const {data}=await axios.post('/api/v1/login',{email,password},config);
     console.log('Login Data',data);
     return data;
  }catch(error){
    if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Login failed.Please try again later');
      }
  }
});

export const loadUser=createAsyncThunk('user/loadUser',async(_,{rejectWithValue})=>{
  try{
    const {data}= await axios.get('/api/v1/profile');
    return data;
  }catch(error){
    if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Failed to load User Profile');
      }
  }
});


export const logout=createAsyncThunk('user/logout',async(_,{rejectWithValue})=>{
  try{
    const {data}=await axios.post('/api/v1/logout',{withCredentials:true});
    return data;
  }catch(error){
    if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Failed to log out User Profile');
      }
  }
});


export const updateProfile=createAsyncThunk('user/updateProfile',async(userData,{rejectWithValue})=>{
  try{
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };
    const {data}=await axios.put('/api/v1/profile/update',userData,config);
    return data;
  }catch(error){
   return rejectWithValue(
        error.response?.data?.message ||
        "Profile update failed. Please try again later"
      );
  }
});



export const updatePassword=createAsyncThunk('user/updatePassword',async(formData,{rejectWithValue})=>{
  try{
    const config = { headers: { 'Content-Type': 'application/json' } };
    const {data}=await axios.put('/api/v1/password/update',formData,config);
    return data;
  }catch(error){
   return rejectWithValue(
        error.response?.data?.message ||
        "Password update failed. Please try again later"
      );
  }
});



export const forgotPassword=createAsyncThunk('user/forgotPassword',async(email,{rejectWithValue})=>{
  try{
    const config = { headers: { 'Content-Type': 'application/json' } };
    const {data}=await axios.post('/api/v1/password/forgot',email,config);
    return data;
  }catch(error){
   return rejectWithValue(
        error.response?.data?.message ||
        'Email sent Failed'
      );
  }
});

export const resetPassword=createAsyncThunk('user/resetPassword',async({token,userData},{rejectWithValue})=>{
  try{
    const config = { headers: { 'Content-Type': 'application/json' } };
    const {data}=await axios.post(`/api/v1/reset/${token}`,userData,config);
    return data;
  }catch(error){
   return rejectWithValue(
        error.response?.data?.message ||
        'Email sent Failed'
      );
  }
});


const userSlice=createSlice({
  name:'user',
  initialState:{
    user:null,
    loading:false,
    error:null,
    success:false,
    isAuthenticated:false,
    message:null
  },
  reducers:{
    removeErrors:(state)=>{
      state.error=null;
    },
    removeSuccess:(state)=>{
      state.success=false
    }
  },
  extraReducers:(builder)=>{
    //Registration cases
    builder.addCase(register.pending,(state)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(register.fulfilled,(state,action)=>{
      state.loading=false;
      state.error=null;
      state.success=action.payload.success;
      state.user=action.payload?.user||null;
      state.isAuthenticated=Boolean(action.payload?.user);
    })
    .addCase(register.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload || 'Registration failed.Please try again later';
      state.user=null;
      state.isAuthenticated=false
    });

      //Login cases
    builder.addCase(login.pending,(state)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(login.fulfilled,(state,action)=>{
      state.loading=false;
      state.error=null;
      state.user=action.payload?.user||null;
      state.isAuthenticated=Boolean(action.payload?.user);
    })
    .addCase(login.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload || 'Login failed.Please try again later';
      state.user=null;
      state.isAuthenticated=false
    });


    //Loading User
    builder.addCase(loadUser.pending,(state)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(loadUser.fulfilled,(state,action)=>{
      state.loading=false;
      state.error=null;
      state.success=action.payload.success;
      state.user=action.payload?.user||null;
      state.isAuthenticated=Boolean(action.payload?.user);
    })
    .addCase(loadUser.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload || 'Failed to load User Profile';
      state.user=null;
      state.isAuthenticated=false
    });



      //Logout cases
    builder.addCase(logout.pending,(state)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(logout.fulfilled,(state,action)=>{
      state.loading=false;
      state.error=null;
      state.user=null;
      state.isAuthenticated=false
    })
    .addCase(logout.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload || 'Login failed.Please try again later';
    });



     //Update User Profile
    builder.addCase(updateProfile.pending,(state)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(updateProfile.fulfilled,(state,action)=>{
      state.loading=false;
      state.error=null;
      state.success=action.payload.success;
      state.user=action.payload?.user||null;
      state.message=action.payload?.message
    })
    .addCase(updateProfile.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload || `Profile update failed.Please try again later`;
    });



    
     //Update User Password
    builder.addCase(updatePassword.pending,(state)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(updatePassword.fulfilled,(state,action)=>{
      state.loading=false;
      state.error=null;
      state.success=action.payload?.success;
    })
    .addCase(updatePassword.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload || `Password update failed.Please try again later`;
    });



     // Forgot User Password
    builder.addCase(forgotPassword.pending,(state)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(forgotPassword.fulfilled,(state,action)=>{
      state.loading=false;
      state.error=null;
      state.success=action.payload?.success;
      state.message=action.payload?.message;
    })
    .addCase(forgotPassword.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload || 'Email sent Failed';
    });


      // Reset Password
    builder.addCase(resetPassword.pending,(state)=>{
      state.loading=true;
      state.error=null
    })
    .addCase(resetPassword.fulfilled,(state,action)=>{
      state.loading=false;
      state.error=null;
      state.success=action.payload?.success;
      state.user=null,
      state.isAuthenticated=false
    })
    .addCase(resetPassword.rejected,(state,action)=>{
      state.loading=false;
      state.error=action.payload || 'Email sent Failed';
    });
  }
})

export const {removeErrors,removeSuccess}=userSlice.actions;
export default userSlice.reducer;
