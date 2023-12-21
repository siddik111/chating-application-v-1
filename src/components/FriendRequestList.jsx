import { DataSnapshot, getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";
import ProfilePictureFrindRequest from "./ProfilePictureFrindRequest";

const FriendRequestList = () => {
    const db =getDatabase()
    const [frindRequestList, setFriendRequestList] = useState([]);
    const [show, setShow] =useState(false)
    const data = useSelector( (state) => state.userloginInfo.userInfo);

    useEffect( () =>{
        const friendRequestRef = ref(db, "frindRequest");
        onValue(friendRequestRef, (snapshot) =>{
            let frindRequest = [];
            snapshot.forEach((item) => {
                // console.log(item.val())
                if(item.val().receverId === data.uid){
                    frindRequest.push({...item.val() , id: item.key})
                }
            });
            setFriendRequestList(frindRequest);
        })
    },[]);
    // console.log(frindRequestList);
    const handleAcceptFrindRequest = (item) =>{
        set(push(ref(db, "frinds")),{...item})
        .then( ()=> {
            remove(ref(db, "frindRequest/" + item.id))
            
        })
    };
    const handleRemoveFrindRequest = (item)=>{
        remove(ref(db, "frindRequest/" + item.id))
        setShow(false)
    };
    return (
        
        <div className="list">
            <div className="list_header">
                <h2 className="text-secondary font-bold">Friend Request : <span className="text-primary">{frindRequestList.length}</span></h2>
                <BsThreeDotsVertical className="text-secondary"></BsThreeDotsVertical>
            </div>
            <div className="list_items relative">
            {
                frindRequestList.map((item, i) =>{
                    return(
                        
                        show?
                            <div className=" w-full  text-center items-center flex justify-center gap-6 absolute bg-secondary z-[999] top-[50%] left-[50%] transform translate-x-[-50%] translate-y-[-50%]">
                                <div>
                                    <h2>Are you sure ?</h2>
                                    <p>Delete <span className="text-[14px] font-bold font-roboto">{item.senderName}...</span>Friend Request</p>
                                </div>
                                <div className=" ">
                                    <button  onClick={() => handleRemoveFrindRequest(item)}  className="button_v_3 capitalize px-5">yes</button>
                                    <button  onClick={() => setShow(false)}  className="button_v_2 capitalize px-5">no</button>
                                </div>
                            </div>
                            :
                            <div key={i} className="item ">
                            <div className="dtls">
                                <div className="profile_img">
                                    {/* <img src="../../public/profile_img.png" alt="#" /> */}
                                    {/* <ProfilePicture item={item.id}></ProfilePicture> */}
                                    <ProfilePictureFrindRequest user={item}></ProfilePictureFrindRequest>
                                </div>
                                <div className="text">
                                    <div>
                                        <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.senderName}</h3>
                                        <p className="text-[14px] text-secondary font-normal font-Poppins">{item.senderEmail}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="buttons">
                                <button onClick={() => handleAcceptFrindRequest(item)} className="button_v_2 text-[11px]">Accept</button>
                                <button onClick={() => setShow(true)} className="button_v_3 text-[11px] ">Cencle</button>
                            </div>    
                            </div>
                        )
                    })
            }
            </div>
        </div>
    );
};

export default FriendRequestList;