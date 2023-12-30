import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";

const BlockList = () => {
    const data = useSelector( (state) => state.userloginInfo.userInfo);
    const db =getDatabase()
    const [blockList, setBlockList] = useState([]);
    // get data from blockList start
    useEffect( ()=>{
        const blockListRef =ref(db, "blockList")
        onValue(blockListRef, (snapshort)=>{
            let blockFriend =[];
            snapshort.forEach( (item)=>{
                if(data.uid == item.val().blockById || item.val().blockID == data.uid){
                    blockFriend.push({...item.val(), id: item.key})
                    // console.log(item.id);
                }
            })
            setBlockList(blockFriend)
        })
    },[])
    // get data from blockList end
    const handleUnblock = (item)=>{
        // console.log(item.id);
        if(data.uid == item.blockById){
            set(push(ref(db, "frinds")),{
                senderId: item.blockById,
                senderName:item.blockByName,
                receverId:item.blockID,
                receverName:item.blockName,
            })
            .then( ()=>{
                remove(ref(db, "blockList/" + item.id))
                // console.log(listItem.id);
            })
        }else{
            set(push(ref(db, "frinds")),{
                receverId: item.blockById,
                receverName: item.blockByName,
                senderName:item.blockName,
                senderId:item.blockID,
            })
            .then( ()=>{
                remove(ref(db, "blockList/" + item.id))
                // console.log(listItem.id);
            })
            // .catch( (error)=>{
            //     console.log(error);
            // })
        }
    };

    return (
        <div className="list">
            <div className="list_header">
                <h2 className="text-secondary font-bold">Block User : <span>{blockList.length}</span></h2>
                <BsThreeDotsVertical className="text-secondary"></BsThreeDotsVertical>
            </div>
            {
                blockList.length == 0?
                <h3 className="text-secondary lowercase">no block User.......</h3>
                :
                <div className="list_items">
                {
                    blockList.map( (item, i)=>{
                        return(
                        <div key={i} className="item">
                            <div className="dtls">
                                <div className="profile_img">
                                    <img src="../../public/profile_img.png" alt="#" />
                                </div>
                                <div className="text">
                                    <div>
                                        {
                                            data.uid == item.blockById?
                                            <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.blockName}</h3>
                                            :
                                            <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">{item.blockByName}</h3>
                                        }
                                        <p className="text-[14px] text-secondary font-normal font-Poppins">hello</p>
                                    </div>
                                </div>
                            </div>
                            <div className="buttons">
                                {
                                    data.uid == item.blockById?
                                    
                                    <button onClick={ ()=> handleUnblock(item)} className="button_v_4">Unblock</button>
                                    :
                                    <button className="button_v_4">You are block</button>
                                }
                            </div>    
                        </div>
                        )
                    })
                }
            </div>
            }
        </div>
    );
};

export default BlockList;