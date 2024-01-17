import Navbar from '../components/Navbar';
import FriendList from '../components/FriendList';
import MyGroupList from '../components/MyGroupList';
import { CiMenuKebab } from "react-icons/ci";
import { IoIosSend } from "react-icons/io";
import { Link } from 'react-router-dom';
import { FaRegImages } from "react-icons/fa6";
import { MdEmojiEmotions } from "react-icons/md";
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const Chat = () => {
    const db = getDatabase();
    const [ msg, setMsg ] = useState("");
    const [ msgList, setMsgList ] = useState([]);
    const data = useSelector( (state) => state.userloginInfo.userInfo);
    const activeChatInfo = useSelector( (state)=> state.activeChatSlice)
    // handlemsg start
    const handleMsg = (e)=>{
        setMsg(e.target.value);
    }
    // handlemsg end
    // send data to database start 
    const handleSendMsg = ()=>{
        if(activeChatInfo.active?.status == "single"){
            set(push(ref(db, "singleMessage")),{
                whoSendId : data.uid,
                whoSendName : data.displayName,
                whoRecivedId : activeChatInfo.active.id,
                whoRecivedName : activeChatInfo.active.displayName,
                msg : msg,
                date : `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
                time : `${new Date().getHours() %12} : ${new Date().getMinutes()}  ${new Date().getHours() >= 12? "Am" : "pm" }`
            }).then( ()=> {
                console.log("done")
            })
        }
        else{
            console.log("not done");
        }
    };
    // send data to database end
    // get singleMsg data from database start 
    useEffect( ()=>{
        const singleMsgRef = ref(db, "singleMessage")
        onValue(singleMsgRef, (snapshort) =>{
            let messages =[];
            snapshort.forEach((item) =>{
                if(item.val().whoSendId == data.uid && item.val().whoRecivedId == activeChatInfo.active.id || item.val().whoRecivedId == data.uid && item.val().whoSendId == activeChatInfo.active.id){
                    messages.push({...item.val() , id: item.key})
                }
            })
            setMsgList(messages)
        })
    },[activeChatInfo.active.id]);
    // console.log(msgList);
    // get singleMsg data from database end

    return (
        <>
            <Navbar></Navbar>
            <div id='chat' className='container px-[100px] h-screen'>
                <div className='flex justify-between'>
                    <div className='left w-[38%] flex flex-col gap-5'>
                        <div className='item rounded-lg'>
                            <FriendList></FriendList>
                        </div>
                        <div className='item rounded-lg'>
                            <MyGroupList></MyGroupList>
                        </div>
                    </div>
                    <div className='w-[58%]'>
                        <div className="item rounded-lg">
                            <div className="chat_box h-[600px]">
                                <div className="info py-5 px-10 flex justify-between items-center  border-b-secondary border-[1px]">
                                    <div className='flex items-center'>
                                        <div className="profile_img w-[60px] h-[60px] rounded-full overflow-hidden">
                                            <img className='w-full h-full' src="../../public/profile_img.png" alt="#" />
                                        </div>
                                        <h4 className='text-3xl capitalize text-secondary ms-5'>{activeChatInfo.active.displayName}</h4>
                                    </div>
                                    <div className="icone">
                                        <CiMenuKebab className='text-secondary text-3xl'/>
                                    </div>
                                </div>
                                <div className="chat_msg_box relative">
                                {   
                                    activeChatInfo.active.status == "single"?
                                    (

                                        <div className='chat_msgs w-full flex flex-col px-5 h-[420px] !overflow-y-scroll'>
                                            {
                                                msgList.map( (item, i)=>{
                                                    return(
                                                        item.whoRecivedId == data.uid?
                                                            <div key={i} className="left_msg w-full flex justify-start items-center my-5 ">
                                                                <div className="profile_img w-[30px] h-[30px] rounded-full overflow-hidden">
                                                                    <img className='w-full h-full' src="../../public/profile_img.png" alt="#" />
                                                                </div>
                                                                <div className=''>
                                                                    <p className='pera ms-5 px-2 bg-secondary p-[10px] text-left'>{item.msg}</p>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div key={i}  className="right_msg w-full flex justify-end mb-5 ps-[40px] items-center">
                                                                {/* <div className=''> */}
                                                                    <p className='pera me-5 px-2  bg-secondary  text-right'>{item.msg}</p>
                                                                {/* </div> */}
                                                                <div className="profile_img w-[30px] h-[30px] rounded-full overflow-hidden">
                                                                    <img className='w-full h-full' src="../../public/profile_img.png" alt="#" />
                                                                </div>
                                                            </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                    :
                                    <h3>group</h3>
                                }
                                        <div className='chat_input_box flex justify-between items-center px-10 h-[80px] w-full border-[1px] border-t-secondary absolute top-[420px] z-50'>
                                            <div className="input_box w-[70%]">
                                                <input onChange={handleMsg} type="text" />
                                            </div>
                                            <div className="buttons w-[25%] flex justify-between items-center">
                                                <div className="left flex gap-5 items-center">
                                                    <Link>
                                                        <MdEmojiEmotions className='text-4xl text-secondary' />
                                                    </Link>
                                                    <Link to=''>
                                                        <FaRegImages className='text-4xl text-secondary' />
                                                    </Link>
                                                </div>
                                                <div className="right p-2 flex justify-center items-start w-[50px] h-[50px] border-[1px] border-secondary rounded-full">
                                                    {
                                                        msg.length <=0?
                                                        <IoIosSend className='text-3xl text-secondary' />
                                                        :
                                                        <IoIosSend onClick={handleSendMsg} className='text-3xl text-primary' />
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;