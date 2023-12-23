"use client";

import Image from "next/image";
import "./Profile.css";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Profile = () => {
  const [followed, setFollowed] = useState(false);

  return (
    <div className="profileRight">
      <div className="profileRightTop">
        <div className="profileCover">
          <Image
            className="profileCoverImg"
            src="/uploads/cover.jpeg"
            alt="logo"
            width={28}
            height={28}
          />
          <Image
            className="profileUserImg"
            src="/uploads/profile.jpeg"
            alt="logo"
            width={28}
            height={28}
          />
        </div>
        <div className="profileInfo">
          <h4 className="profileInfoName">Mrinal Kar</h4>
          <span className="profileInfoDesc">Capturing all the way...</span>
          <span className="profileInfoLoc">Kolkata, India</span>
          <button className="rightbarFollowButton">
            {followed ? (
              <div className="rightbarFollowText">Unfollow</div>
            ) : (
              <div className="rightbarFollowText">Follow</div>
            )}
            {followed ? <RemoveIcon /> : <AddIcon />}
          </button>
          <div className="profileInfoLoc">
            <span className="mr-[20px]">
              10 - <b>Followers</b>
            </span>
            <span className="mr-[20px]">
              10 - <b>Photo Likes</b>
            </span>
            <span className="mr-[20px]">
              10 - <b>Followings</b>
            </span>
          </div>
        </div>
      </div>
      {/* <div className="profileRightBottom">
              <Feed username={params.username} />
              <Rightbar user={user} />
            </div> */}
    </div>
  );
};

export default Profile;
