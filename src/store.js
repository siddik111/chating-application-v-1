import { configureStore } from '@reduxjs/toolkit'
import  user  from './slices/userSlice'
import activeChatSlice from './slices/activeChatSlice'

export default configureStore({
  reducer: {
    userloginInfo  : user,
    activeChatSlice : activeChatSlice
   },
})