import { BsThreeDotsVertical } from "react-icons/bs";
import { getDatabase, ref, onValue, push, set, remove } from "firebase/database";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ProfilePicture from "./ProfilePicture";

const UserList = () => {
    const db =getDatabase();
    const [userList, setUserList] =useState([]);
    const [friendRequestList, setFriendRequestList] =useState([]);
    const [friendList, setFriendList] =useState([]);
    const data =useSelector( (state) => state.userloginInfo.userInfo);
    // console.log(data);
    // Get user list from database start
    useEffect(() =>{
        const userRef = ref(db,'users')
        let list = [];
        onValue(userRef,(snapshot) =>{
            // console.log(snapshot.val());
            snapshot.forEach((item) =>{
                if(data.uid !== item.key){
                    list.push({...item.val(), id: item.key})
                }
            })
            setUserList(list)
        })
    },[]);
    // Get user list from database end
    // frind request start
    const handaleFrindReques =(item) => {
        set(push(ref(db, "frindRequest")),{
            senderId: data.uid,
            senderName: data.displayName,
            receverId: item.id,
            receverName: item.username,
        })
    };
    useEffect( () =>{
        const friendRequestRef = ref(db, 'frindRequest')
        onValue( friendRequestRef, (snapshot) => {
            let friendRequest = []
            snapshot.forEach((item) =>{
                friendRequest.push(item.val().receverId + item.val().senderId)           
            })
            setFriendRequestList(friendRequest)            
        })
    },[])
    // console.log(friendRequestList);
    const handleRemoveFrindRequest =(req)=>{
        remove(ref(db, "frindRequest/" + req.id))
        // console.log(item.);
    }
    // frind request end
    useEffect( ()=>{
        const friendListRef =ref(db, "frinds")
        onValue(friendListRef, (snapshot) =>{
            let friends =[];
            snapshot.forEach((item)=>{
                friends.push(item.val().receverId + item.val().senderId)           
            })
            setFriendList(friends)
        })
    },[])
    // console.log(friendList)
    // friends List start
    // friends List end
    return (
        <div className="list">
            <div className="list_header">
                <h2 className="text-secondary font-bold">User List : <span className="text-primary">{userList.length}</span></h2>
                <BsThreeDotsVertical className="text-secondary"></BsThreeDotsVertical>
            </div>
            <div className="list_items">
                {
                    userList.map( (item) =>{
                        return(
                            <div key={item.id} className="item">
                    <div className="dtls">
                        <div className="profile_img">
                                <ProfilePicture item={item}></ProfilePicture>
                        </div>
                        <div className="text">
                            <div>
                                <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.username}</h3>
                                <p className="text-[14px] text-secondary font-normal font-Poppins">{item.email}</p>
                            </div>
                        </div>
                    </div>
                    <div className="buttons">
                        {
                            friendList.includes(item.id + data.uid) || friendList.includes(data.uid + item.id)?
                            <button  className="button_v_2 capitalize">friend</button>
                            :
                            <div>
                            {
                                friendRequestList.includes(item.id + data.uid) || friendRequestList.includes(data.uid + item.id)?
                                // <button  className="button_v_2">Requst end</button>
                                <button onClick={()=> handleRemoveFrindRequest(req)} className="button_v_2">cancle</button>
                                :
                                <button onClick={ () =>handaleFrindReques(item)} className="button_v_2">Add friend</button>
                            }
                            </div>
                        }
                    </div>    
                </div>
                        )
                    })
                }
                
            </div>
        </div>
    );
};

export default UserList;