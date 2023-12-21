import { useSelector } from "react-redux";
import BlockList from "../../components/BlockList";
import FriendList from "../../components/FriendList";
import FriendRequestList from "../../components/FriendRequestList";
import GroupList from "../../components/GroupList";
import MyGroupList from "../../components/MyGroupList";
import Navbar from "../../components/Navbar";
import UserList from "../../components/UserList";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
    const naviget = useNavigate()
    const data = useSelector( (state) => (state.userloginInfo.userInfo))
    // console.log(data)
    // create private Route start
    useEffect( () => {
        if(!data){
            naviget('/')
        }
    },[]);
    // create private Route end

    return (

        <>
        <Navbar></Navbar>
        <div id='home'>
            <div className="main">
                <div className="item">
                    <GroupList></GroupList>
                </div>
                <div className="item">
                    <FriendList></FriendList>
                </div>
                <div className="item">
                    <UserList></UserList>
                </div>
                <div className="item">
                    <FriendRequestList></FriendRequestList>
                </div>
                <div className="item">
                    <MyGroupList></MyGroupList>
                </div>
                <div className="item">
                    <BlockList></BlockList>
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;