import { BsThreeDotsVertical } from "react-icons/bs";

const GroupList = () => {
    return (
        <div className="list">
            <div className="list_header">
                <h2 className="text-secondary font-bold">Groups</h2>
                <BsThreeDotsVertical className="text-secondary"></BsThreeDotsVertical>
            </div>
            <div className="list_items">
                <div className="item">
                    <div className="dtls">
                        <div className="profile_img">
                            <img src="../../public/profile_img.png" alt="#" />
                        </div>
                        <div className="text">
                            <div>
                                <h3 className="text-[16px] text-secondary font-medium font-roboto capitalize">Zihad hasan</h3>
                                <p className="text-[14px] text-secondary font-normal font-Poppins">hello</p>
                            </div>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="button_v_4">Join</button>
                    </div>    
                </div>
            </div>
        </div>
    );
};

export default GroupList;