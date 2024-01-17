import { Database, getDatabase, onValue, push, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import SyncLoader from "react-spinners/SyncLoader";


const GroupList = () => {
    const db =getDatabase();
    const data = useSelector( (state) => state.userloginInfo.userInfo);
    const [gropList, setGroupList] = useState([]);
    const [gropJoinReqList, setGroupJoinReqList] = useState([]);
    const [groupFullName, setGrooupFullName]= useState("");
    const [groupTagName, setGrooupTagName]= useState("");
    const [fullNameError, setFullNameError] =useState("");
    const [tagNameError, setTagNameError] =useState("");
    const [show, setShow] = useState(false);
    const [loadding, setLoading] =useState(false);
    // handle GroupFullName start
    const handleGroupName =(e)=>{
        setGrooupFullName(e.target.value)
        setFullNameError("")
    };
    // handle GroupFullName end
    // handle GroupFullBio start
    const handleGroupBio =(e)=>{
        setGrooupTagName(e.target.value)
        setTagNameError("")
    };
    // handle GroupFullBio end
    // create GroupList database colection start 
    const handleGroupSubmit= (e)=>{
        e.preventDefault()
        if(groupFullName == ""){
            setFullNameError("enter Name")
        }
        else if(groupTagName == ""){
            setTagNameError("enter Tag name")
        }else{
            setLoading(true)
            set(push(ref(db, "groups")),{
                groupName: groupFullName,
                groupTagName: groupTagName,
                adminName: data.uid
            }).then( ()=>{
                setShow(false);
                setLoading(false)
                setGrooupFullName("")
                setGrooupTagName("")
            })
        }
    };
    // create GroupList database colection end
    // get dataFrom Database start
    useEffect( ()=>{
        const groupsRef =ref(db, "groups");
        onValue(groupsRef, (snapshort)=>{
            let groups =[]
            snapshort.forEach((item)=>{
                if(data.uid != item.val().adminName){
                    groups.push({...item.val(), id: item.key})
                }
            })
            setGroupList(groups);
        })
    },[]);
    // get dataFrom Database end
    // create group request database colection start
    const handleJoinRequest=(item)=>{
        set(push(ref(db, "groupJoinRequest")),{
            groupName: item.groupName,
            adminName: item.adminName,
            groupId: item.id,
            groupTagName: item.groupTagName,
            requestByName: data.displayName,
            requstById: data.uid,
            requestByEmail: data.email
        })
    }
    // create group request database colection end
    // get data from database groupList Member colaction start
    useEffect( ()=>{
        const groupreqRef =ref(db, "groupJoinRequest")
        onValue(groupreqRef, (snapshort)=>{
            let memberList = []
            snapshort.forEach( (joinList)=>{
                if(joinList.val().requstById== data.uid){
                    memberList.push( {...joinList.val() , id: joinList.key})
                }
            })
            setGroupJoinReqList(memberList)
        })
    },[])
    console.log(gropJoinReqList);
    // get data from database groupList Member colaction end
    
    return (
        <div className="list">
            <div className="list_header">
                <h2 className="text-secondary font-bold">Groups</h2>
                {
                    show ?
                    <button onClick={()=> {setShow(!show), setLoading(false)}} className="button_v_3 !text-[12px]">Cancle</button>
                    :
                    <button onClick={()=> setShow(!show)} className="button_v_2 !text-[12px]">Create Group</button>
                }
                {/* <BsThreeDotsVertical className="text-secondary"></BsThreeDotsVertical> */}
            </div>
            <div className="list_items">
                {
                    !show ?
                    (   
                        gropList.length == 0?
                        <h1 className="text-secondary lowercase">no Groups............</h1>
                        :
                        <div>
                        {
                            gropList.map( (item, i)=>{
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
                                        {
                                            // gropJoinReqList.includes(gropJoinReqList.groupId+data.uid)?
                                            // gropJoinReqList.includes(gropJoinReqList.adminName == data.uid)?
                                            // gropJoinReqList.map( (item)=>{
                                            //     return(
                                            //         if()
                                            //     )
                                            // })
                                            // <button  className="button_v_4">Cencle</button>
                                            // :
                                            <button onClick={()=> handleJoinRequest(item)} className="button_v_4">Join</button>
                                        }
                                    </div>    
                                    </div>
                                )
                            })
                        }
                        </div>
                    )
                    :
                    <div className="h-screen text-center p-10">
                        <form onSubmit={ handleGroupSubmit } action="#">
                            <h4 className="text-3xl text-secondary mb-3">Enter Group Deatils</h4>
                            <input onChange={handleGroupName} type="text" placeholder="ender Groop name" />
                            <p className="text-left text-[red]">{fullNameError}</p>
                            <input onChange={handleGroupBio} className="my-2" type="text" placeholder="ender Groop Bio" />
                            <p className="text-left text-[red]">{tagNameError}</p>
                            {
                                !loadding?
                                <button className="button_v_1 !py-1 text-[18px] mt-3">Submit</button>
                                :
                                <div className="border-[1px] w-[100px] py-[9px] rounded-lg mx-auto flex justify-center items-center">
                                <SyncLoader color="#fff" />
                                </div>   
                            }
                        </form>
                    </div>
                }
            </div>
        </div>
    );
};

export default GroupList;