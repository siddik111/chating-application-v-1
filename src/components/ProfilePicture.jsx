import { useEffect, useState } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const ProfilePicture = ({item}) => {
    const storage =getStorage();
    const [image, setImage] = useState();

    const profilePictureRef = ref(storage, item.id);

    useEffect( () =>{
        getDownloadURL(profilePictureRef).then((url) =>[
            setImage(url)
        ])
        .catch((error) =>{
            // console.log(error)
        })
    },[]);
    // console.log(image)
    return (
        <div className="img relative">
            {
                image?
                <img src={image} alt="profilepic" />
                :
                <h2 className="text-3xl absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[50%] capitalize font-bold">{item.username[0]}</h2>
            }

        </div>
    );
};

export default ProfilePicture;