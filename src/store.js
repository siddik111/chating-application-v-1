import { configureStore } from '@reduxjs/toolkit'
import  user  from './slices/userSlice'

export default configureStore({
  reducer: {
    userloginInfo  : user, 
   },
})