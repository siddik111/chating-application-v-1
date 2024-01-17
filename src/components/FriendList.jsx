import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import ProfilePictureFrindRequest from "./ProfilePictureFrindRequest";
import { activeChat } from "../slices/activeChatSlice";
const FriendList = () => {
    const db =getDatabase()
    const data = useSelector( (state) => state.userloginInfo.userInfo);
    const [friendList, setFriendList] =useState([]);
    const dispach =useDispatch();
    // get data from Database friend
    useEffect( ()=>{
        const friendListRef = ref(db, "frinds")
        onValue(friendListRef, (snapshort) =>{
            let friends =[];
            snapshort.forEach((item) =>{
                if(item.val().receverId === data.uid||data.uid === item.val().senderId){
                    friends.push({...item.val() , id: item.key})
                }
            })
            setFriendList(friends)
        })
    },[]);
    // get data from Database end
    // send block data to Database start
    const handleBlockList =(listItem)=>{
        // console.log(listItem);
        if(data.uid == listItem.receverId){
            set(push(ref(db, "blockList")),{
                blockID:listItem.senderId,
                blockName:listItem.senderName,
                blockById:listItem.receverId,
                blockByName:listItem.receverName,
            }).then( ()=>{
                remove(ref(db, "frinds/" + listItem.id))
                // console.log(listItem.id);
            }).catch ((error)=>{
                console.log(error);
            })
        }else{
            set(push(ref(db, "blockList")),{
                blockID:listItem.receverId,
                blockName:listItem.receverName,
                blockById:listItem.senderId,
                blockByName:listItem.senderName,
            }).then( ()=>{
                remove(ref(db, "frinds/" + listItem.id))
                // console.log(listItem.id);
            }).catch ((error)=>{
                console.log(error);
            })
        }
    }
    // send block data to Database end
    // send active friend info start 
    const handleSendInfo = (item)=>{
        if(item.receverId == data.uid){
            dispach(activeChat({status:'single', id: item.senderId, displayName: item.senderName}))
            localStorage.setItem("activeFriend", JSON.stringify({status:'single', id: item.senderId, displayName: item.senderName}))
        }else{
            dispach(activeChat({status: 'single', id: item.receverId, displayName: item.receverName}))
            localStorage.setItem("activeFriend", JSON.stringify({status: 'single', id: item.receverId, displayName: item.receverName}))
        }
    }
    // send active friend info end 


    return (
        <div className="list">
            <div className="list_header">
                <h2 className="text-secondary font-bold">Friends : <span className="text-primary">{friendList.length}</span></h2>
                <BsThreeDotsVertical className="text-secondary"></BsThreeDotsVertical>
            </div>
            <div className="list_items">
                {
                    friendList.map((item, i)=>{
                        return(

                        <div onClick={()=> handleSendInfo(item)} key={i} className="item">
                            <div className="dtls">
                                <div className="profile_img">
                                    {/* <img src="../../public/profile_img.png" alt="#" /> */}
                                    <ProfilePictureFrindRequest user={item}></ProfilePictureFrindRequest>
                                </div>
                                <div className="text">
                                    <div>
                                        {
                                            data.uid == item.receverId?
                                            <div>
                                                <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.senderName}</h3>
                                                <p className="pera">hello</p>
                                            </div>
                                            
                                            :
                                            <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.receverName}</h3>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="buttons">
                                <button onClick={ ()=> handleBlockList(item)} className="button_v_3">Block</button>
                                <button className="button_v_2">Massage</button>
                            </div>    
                        </div>
                        )

                    })
                }
            </div>
        </div>
    );
};

export default FriendList;