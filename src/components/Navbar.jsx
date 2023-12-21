import { IoHomeOutline } from "react-icons/io5";
import { FaAlignJustify } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { IoIosLogOut } from "react-icons/io";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createRef, useState } from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { getDownloadURL, getStorage, ref, uploadString } from "firebase/storage";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { userLoginInfo } from "../slices/userSlice";
import { useNavigate, NavLink } from "react-router-dom";
import { getDatabase, set } from "firebase/database";
// import { getAuth, signOut } from "firebase/auth";

const Navbar = () => {
    const auth = getAuth();
    const dispach = useDispatch();
    const naviget = useNavigate();
    const db = getDatabase();
    // console.log(auth.currentUser.uid)

    const data =useSelector( (state) => (state.userloginInfo.userInfo))
    // profile Image modal start
    const [modal, setModal] =useState(false)

    // profile image crop start
    const [image, setImage] = useState();
    const [cropData, setCropData] = useState("");
    const cropperRef = createRef();
    const storage = getStorage();
    

    // console.log(image);

    const handleProfileImage = (e) => {
        e.preventDefault();
        let files;
        if (e.dataTransfer) {
          files = e.dataTransfer.files;
        } else if (e.target) {
          files = e.target.files;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(files[0]);
      };
      const getCropData = () => {
        if (typeof cropperRef.current?.cropper !== "undefined") {
          setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
        }
        const storageRef = ref(storage, auth.currentUser.uid);
        const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
        uploadString(storageRef, message4, 'data_url').then((snapshot) => {
        // console.log('Uploaded a data_url string!');
        getDownloadURL(storageRef).then((downloadURL) => {
            // console.log('File available at', downloadURL);
            //update firebase curent user
            updateProfile(auth.currentUser,{
                photoURL:downloadURL
            })
            //update redux userInfo
            dispach(userLoginInfo({
                ...data,
                photoURL:downloadURL
            }));
            localStorage.setItem("user", JSON.stringify(auth.currentUser))
            setModal(false)
            setImage("")
          });
        });

      };  
    // profile image crop end
    // profile Image modal end

    // signOut start
    const handleSignOut = (e)=> {
        signOut(auth).then(() => {
            localStorage.removeItem('user')
            naviget("/")
            // Sign-out successful.
            }).catch((error) => {
            // An error happened.
            console.log(error)
            });
    }
    // signOut end
        return (
        <div id="header">
            <div className="main">
                <div className="left">
                    <ul>
                        <li>
                            <NavLink  to="/home" href="#"><FaAlignJustify  ></FaAlignJustify></NavLink>
                        </li>
                        <ul>
                            <li>
                                <NavLink to="" href="#"><IoHomeOutline></IoHomeOutline></NavLink>
                            </li>
                            <li>
                                <NavLink to="" href="#"><AiOutlineMessage ></AiOutlineMessage></NavLink>
                            </li>
                            <li>
                                <NavLink to="" ><IoMdNotificationsOutline ></IoMdNotificationsOutline></NavLink>
                            </li>
                            <li>
                                <NavLink onClick={handleSignOut}><IoIosLogOut></IoIosLogOut></NavLink>
                            </li>
                        </ul>
                    </ul>
                </div>
                <div className="right">
                    <div>
                        <h2 className="mx-5 text-3xl capitalize">{data?.displayName}</h2>
                    </div>
                    <div className="profile_img">
                        <img className="w-full h-full object-cover" src={data?.photoURL} alt="#" />
                        <div className="hover_image" onClick={()=> setModal(!modal)}>
                            <FaCloudUploadAlt className="text-3xl text-secondary"></FaCloudUploadAlt>
                        </div>
                    </div>
                </div>
            </div>
            {
                modal&&
                <div className="profile_image_modal"> 
                    <div className="modal">
                        <div>
                            <input onChange={handleProfileImage} className="my-5" type="file"/>
                        </div>
                        {   
                            image&&
                            <div className="text-center w-[80px] h-[80px] rounded-full overflow-hidden my-5 mx-auto">
                            <div className="img-preview" style={{ width: "100%", float: "left", height: "300px" }}> </div>
                            </div>
                        }
                        {
                            image&&
                            <Cropper
                            ref={cropperRef}
                            style={{ height: 300, width: "100%" }}
                            zoomTo={0.5}
                            initialAspectRatio={1}
                            preview=".img-preview"
                            src={image}
                            viewMode={1}
                            minCropBoxHeight={10}
                            minCropBoxWidth={10}
                            background={false}
                            responsive={true}
                            autoCropArea={1}
                            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                            guides={true}
                            />
                        }
                        <div className="buttons mt-5">
                            {
                                image&&
                                <button onClick={getCropData} className="button_v_2 !px-10">Upload</button>
                            }
                            <button className="button_v_3 !px-10" onClick={()=> {setModal(!modal), setImage("") }}>Cencel</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default Navbar;