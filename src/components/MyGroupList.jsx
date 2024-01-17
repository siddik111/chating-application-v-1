import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

const MyGroupList = () => {
    const db =getDatabase();
    const dispach =useDispatch();
    const data = useSelector( (state) => state.userloginInfo.userInfo);
    const [myGroupList, setMyGroupList] = useState([]);
    const [joinReqList, setJoinReqLIst] = useState([]);
    const [groupInfoList, setGroupInfoList] = useState([]);
    const [showRequest, setShowRequest] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    // get data from database start
    useEffect( ()=>{
        const myGroupListRef = ref(db, "groups")
        onValue(myGroupListRef, (snapshort)=>{
            let group = [];
            snapshort.forEach( (item)=>{
                if(data.uid === item.val().adminName){
                    group.push({...item.val(), id: item.key})
                }
            })
            setMyGroupList(group);
        })
    },[]);
    // get data from database end
    // get data from database start
    const handleGroupRequest = (item)=>{
            setShowRequest(true)
            const joinRequestref = ref(db, "groupJoinRequest")
            onValue(joinRequestref, (snapshort)=>{
                let groupJoinRequest =[];
                snapshort.forEach((groupJoinReq)=>{
                    if( data.uid == item.adminName && groupJoinReq.val().groupId == item.id){
                        groupJoinRequest.push({...groupJoinReq.val(), id: groupJoinReq.key})
                    }
                })
                setJoinReqLIst(groupJoinRequest)
            })
            // console.log(item);
        }
        // console.log(joinReqList);
    // get data from database end
    // handleRemove join Req start
    const handleRemoveJoinReq = (item)=>{
        remove(ref(db, "groupJoinRequest/" +item.id));
    };
    // handleRemove join Req end
    // create grpupmember coloction start
    const handleacceptJoinReq = (item)=>{
        set(push(ref(db, "groupMember")),{
            groupName: item.groupName,
            adminName: item.adminName,
            groupId: item.groupId,
            adminId: item.adminName,
            memberName: item.requestByName,
            memberEmail: item.requestByEmail,
            memberId: item.requstById
        }).then( ()=>{
            remove(ref(db, "groupJoinRequest/" + item.id))
        })
        // console.log();
    }
    // create grpupmember coloction end
    // get data from database group info start
    const handlegroupInfo =(item)=>{
        setShowInfo(true)
        const groupInfoRef =ref(db, "groupMember")
        onValue(groupInfoRef,(snapshort)=>{
            let groupMemberList = []
            snapshort.forEach( (groupInf)=>{
                if(data.uid == groupInf.val().adminId && groupInf.val().groupId == item.id){
                    groupMemberList.push({...groupInf.val(), id: groupInf.key})
                }
            })
            setGroupInfoList(groupMemberList);
            console.log(item);
        })
    }
    // get data from database group info end
    // remove Mygroup data start
    const handleRemoveGroup =(item)=>{
        if(data.uid == item.adminName){
            remove(ref(db, "groups/" + item.id))
        }
        console.log(item);
    };
    // remove Mygroup data end
    // remove  group member start
    const handleRemoveMember =(item)=>{
        if(data.uid == item.adminName){
            remove(ref(db, "groupMember/" +item.id))
        }
    }
    // remove  group member end
    // handleGroupMsg start 
    const handleSendInfo = (item)=>{
        console.log(item);
    }
    // handleGroupMsg end
    

    return (
        <div className="list">
            <div className="list_header">
                <h2 className="text-secondary font-bold">My Groups</h2>
                {
                    showRequest?
                    <button onClick={()=>setShowRequest(false)} className="button_v_2 text-[10px]">Back</button>
                    :
                    showInfo?
                    <button onClick={()=>setShowInfo(false)} className="button_v_2 text-[10px]">Back</button>
                    :
                    <BsThreeDotsVertical className="text-secondary"></BsThreeDotsVertical> 
                    
                }

            </div>
            {
                showRequest?
                <div className="list_items">
                    <h4 className="text-secondary text-center underline">Join Request List</h4>
                    {
                        joinReqList.length == 0?
                        <h4 className="text-secondary">no members.........</h4>
                        :
                        joinReqList.map( (item, i)=>{
                            return(
                                <div  key={i} className="item flex justify-between w-full">
                                    <div className="dtls">
                                        <div className="profile_img">
                                            <img src="../../public/profile_img.png" alt="#" />
                                        </div>
                                        <div className="text">
                                            <div>
                                                <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.requestByName}</h3>
                                                <p className="text-secondary text-[11px]">{item.requestByEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="buttons">
                                        <button onClick={()=> handleacceptJoinReq(item)} className="button_v_2 text-[10px]">Accept</button>
                                        <button onClick={ ()=> handleRemoveJoinReq(item)}  className="button_v_3 text-[10px]">Delete</button>
                                    </div>    
                                </div>
                                )
                        })
                    }
                </div>
                :
                (
                    showInfo?
                    <div className="list_items">
                    <h4 className="text-secondary text-center underline">Group Member List</h4>
                    {
                        groupInfoList.length ==0?
                        <h4 className="text-secondary lowercase ">No Member......</h4>
                        :
                        groupInfoList.map( (item, i)=>{
                            return(
                                <div key={i} className="item flex justify-between w-full">
                                    <div className="dtls">
                                        <div className="profile_img">
                                            <img src="../../public/profile_img.png" alt="#" />
                                        </div>
                                        <div className="text">
                                            <div>
                                                <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.memberName}</h3>
                                                <p className="text-secondary text-[11px]">{item.memberEmail}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="buttons">
                                        <button onClick={ ()=>handleRemoveMember(item)} className="button_v_3 text-[14px]">Ban</button>
                                    </div>    
                                </div>
                            )
                        })
                    }
                    </div>
                :
                <div  className="list_items">
                {
                    myGroupList.length == 0?
                    <h1 className="text-secondary lowercase">no groups.....</h1>
                    :
                    myGroupList.map( (item, i)=>{
                        return(
                                <div onClick={()=> handleSendInfo(item)} key={i} className="item">
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
                                        <button onClick={ ()=> handlegroupInfo(item)} className="button_v_2 text-[10px]">Info</button>
                                        <button onClick={()=> handleGroupRequest(item)} className="button_v_4 text-[10px]">Request</button>
                                        <button onClick={ ()=> handleRemoveGroup(item)} className="button_v_3 text-[10px]">Delete</button>
                                    </div>    
                                </div>
                        )
                    })
                }
                </div>
                )
            }
        </div>
    );
};

export default MyGroupList;