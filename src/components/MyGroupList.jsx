import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";

const MyGroupList = () => {
    const db =getDatabase();
    const data = useSelector( (state) => state.userloginInfo.userInfo);
    const [myGroupList, setMyGroupList] =useState([]);
    // get data from database start
    useEffect( ()=>{
        const myGroupListRef = ref(db, "groups")
        onValue(myGroupListRef, (snapshort)=>{
            let group = [];
            snapshort.forEach( (item)=>{
                // console.log(item.val());
                // console.log(data.uid);
                
                if(data.uid === item.val().adminName){
                    group.push({...item.val(), id: item.key})
                }
            })
            setMyGroupList(group);
        })
    },[]);
    // get data from database end
    // console.log(myGroupList);

    return (
        <div className="list">
            <div className="list_header">
                <h2 className="text-secondary font-bold">My Groups</h2>
                <BsThreeDotsVertical className="text-secondary"></BsThreeDotsVertical>
            </div>
            <div className="list_items">
                {

                    myGroupList.map( (item, i)=>{
                        return(
                            <div key={i} className="item">
                            <div className="dtls">
                                <div className="profile_img">
                                    <img src="../../public/profile_img.png" alt="#" />
                                </div>
                                <div className="text">
                                    <div>
                                        <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.groupName}</h3>
                                        <p className="text-[14px] text-secondary font-normal font-Poppins">{item.groupTagName}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="buttons">
                                <button className="button_v_2 text-[12px]">Delete</button>
                                <button className="button_v_2 text-[12px]">Massage</button>
                            </div>    
                        </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default MyGroupList;