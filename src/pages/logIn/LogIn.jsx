import Lottie from "lottie-react";
import logAnim from "../../../public/animation/loginAnim.json"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../../slices/UserSlice";


const LogIn = () => {
    const auth = getAuth();
    const naviget = useNavigate();
    const dispach =useDispatch();

    // Input value Start
    // const [fullName , setFullName] = useState("")
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");
    // Input value End
    // Error massage state start
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    // Error massage state end
    // handle input value start
    const handleEmail = (event) => {
        setEmail(event.target.value);
        setEmailError("")
    }
    const handlePassword = (event) => {
        setPassword(event.target.value);
        setPasswordError("")
    }
    // handle input value end
    // rezx start
    const emailRegx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    // rezx end
    // input value submit start
    const handleSubmit = (e) => {
        e.preventDefault()
        if(email == ""){
            setEmailError("enter your Email")     
        }
        else if(!emailRegx.test(email)){
            setEmailError("enter valid email");
        }
        else if (password == ""){
            setPasswordError("enter password");
        }
        else{
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                toast("Log in success");
                dispach(userLoginInfo(user));
                localStorage.setItem("user", JSON.stringify(user));
                naviget('/home');
                // console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
            });
        }
    };
    // input value submit end
    
    console.log(email,password)
    return (
        <div id="log_in">
            <div className="main p-1">
                <div className="left">
                    <h2 className="main_hadding">WeChat</h2>
                    {/* <p className="pera mt-2 font-normal ">Login your account</p> */}
                    <form onSubmit={handleSubmit} className="my-5">
                        <input onChange={handleEmail} type="text" placeholder="enter your email"/>
                        <p className="pera mb-2 text-red-600">{emailError}</p>
                        <input onChange={handlePassword} type="password" placeholder="enter your password"/>
                        <p className="pera mb-2 text-red-600">{passwordError}</p>
                        <button className="button_v_1 w-full"> LogIn </button>
                    </form>
                    <p className="text-third">new hare ? <Link className="text-primary hover:text-fourth font-bold" to={'/ragistration'}>create account</Link>
                    </p>
                </div>
                <div className="right">
                    <div>
                        <Lottie animationData={logAnim}></Lottie>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogIn;