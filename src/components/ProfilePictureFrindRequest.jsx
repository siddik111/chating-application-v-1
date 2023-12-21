import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useSelector } from "react-redux";


const ProfilePictureFrindRequest = ({user}) => {
    const storage = getStorage();
    const [image, setImage] =useState();
    const data = useSelector( (state) => state.userloginInfo.userInfo);

        const profilePictureRef = ref(storage, data.uid ==user.receverId? user.senderId :user.receverId);

    useEffect( ()=>{
        getDownloadURL(profilePictureRef).then( (url) =>[
            setImage(url)
        ])
        .catch( (error)=>{

        })
    },[user.senderId])
    
    return (
        <div className="img relative">
            {
                image?
                <img src={image} alt="profilepic" />
                :
                <h2 className="text-3xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[50%] capitalize font-bold">{user.senderName[0]}</h2>
            }

        </div>
    );
};

export default ProfilePictureFrindRequest;