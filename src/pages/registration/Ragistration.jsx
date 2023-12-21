import Lottie from "lottie-react";
import regAnim from "../../../public/animation/reganim.json"
import { useState } from "react";
import { toast } from "react-toastify";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";


const Ragistration = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const db = getDatabase()

    // input value state start
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // input value state end
    // error massage state start
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    // error massage state end
    // handle input value start
    const handleName = (e) => {
        setFullName(e.target.value)
        setNameError("")
    }
    const handleEmail = (e) => {
        setEmail(e.target.value)
        setEmailError("")
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
        setPasswordError("")
    }
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value)
        setConfirmPasswordError("")
    }
    // handle input value end
    // rezx start
    const emailRegx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    // rezx end
    // show password start
    const [showPassword, setShowPassword] = useState("password")
    // show password end
    // handleSubmit start
    const handleSubmit = (e) => {
        e.preventDefault()
        if(fullName == ""){
            setNameError("enter your name")
        }
        else if(email == ""){
            setEmailError("enter your email")
        }
        else if(!emailRegx.test(email)){
            setEmailError("enter your valid email")
        }
        else if(password == ""){
            setPasswordError("enter your password")
        }
        else if(confirmPassword == ""){
            setConfirmPasswordError("enter your password")
            
        }
        else if(confirmPassword !== password){
            setConfirmPasswordError("password not match")
        }
        else{
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    updateProfile(auth.currentUser, {
                        displayName: fullName, 
                        photoURL: "../../../public/profile_img.png"})
                        .then(() =>{
                            toast("Registration succes")
                            navigate('/')
                            set(ref(db, 'users/' + auth.currentUser.uid), {
                                username: auth.currentUser.displayName,
                                email: auth.currentUser.email,
                            });
                        })
                        .catch((error) =>{
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(error, message)
                        })
                    })
                    .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage)
                    // ..
                });
        }
    };
    // handleSubmit end
    return (
        <div id="registration">
            <div className="main">
                <div className="left">
                    <Lottie animationData={regAnim}></Lottie>
                </div>
                <div className="right">
                    <h2 className="main_hadding">WeChat</h2>
                    <p className="pera mt-1">Get started with easily register</p>
                    <form onSubmit={handleSubmit} className="mt-10">
                        <input onChange={handleName} type="text" placeholder="enter your name" />
                        <p className="mb-2 text-red-600">{nameError}</p>
                        <input onChange={handleEmail} type="text" placeholder="enter your email" />
                        <p className="mb-2 text-red-600">{emailError}</p>
                        <div className="relative">
                        <input onChange={handlePassword} type={showPassword} placeholder="enter your password" />
                        {
                            showPassword == "password" ?
                            <FaEyeSlash onClick={ () => setShowPassword("text") } className="absolute top-1/2 right-5 transform translate-y-[-70%] text-lg cursor-pointer"></FaEyeSlash>
                            :
                            <FaEye onClick={ () => setShowPassword("password") } className="absolute top-1/2 right-5 transform translate-y-[-70%] text-lg cursor-pointer"></FaEye>
                        }
                        </div>
                        <p className="mb-2 text-red-600">{passwordError}</p>
                        <div className="relative">
                        <input onChange={handleConfirmPassword} type={showPassword} placeholder="confirm your password" />
                        {
                            showPassword == "password" ?
                            <FaEyeSlash onClick={ () => setShowPassword("text") } className="absolute top-1/2 right-5 transform translate-y-[-70%] text-lg cursor-pointer"></FaEyeSlash>
                            :
                            <FaEye onClick={ () => setShowPassword("password") } className="absolute top-1/2 right-5 transform translate-y-[-70%] text-lg cursor-pointer"></FaEye>
                        }
                        </div>
                        <p className="mb-2 text-red-600">{confirmPasswordError}</p>
                        <button className="button_v_1 w-full mb-5">Register</button>
                    </form>
                    <p>Already have a account? <Link className="text-primary hover:text-fourth font-bold" to={'/'}>LogIn</Link>
                    </p>
                </div>
            </div>            
        </div>
    );
};

export default Ragistration;