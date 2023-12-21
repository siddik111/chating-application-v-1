import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter } from "react-router-dom";
import  firebaseConfig  from "./firebase.config.js"
import store from './store.js'
import { Provider } from 'react-redux'



ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <Provider store={store} >
          <BrowserRouter>
                <App />
                <ToastContainer />
          </BrowserRouter>
        </Provider>
      </React.StrictMode>,
)
