"use client";

import Image from "next/image";
import "./Profile.css";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    city: string;
    country: string;
    name: string;
    bio: string;
    image: string;
  };
}

const Profile = ({ user }: Props) => {
  const [followed, setFollowed] = useState(false);

  return (
    <div className="profileRight">
      <div className="profileRightTop">
        <div className="profileCover">
          <img
            className="profileCoverImg"
            src="/uploads/cover.jpg"
            alt="cover_pic"
          />
          <img
            className="profileUserImg"
            src={user.image}
            alt="logo"
            width={28}
            height={28}
          />
        </div>
        <div className="profileInfo">
          <h4 className="profileInfoName">{user.name}</h4>
          <span className="profileInfoDesc">@{user.username}</span>
          <span className="profileInfoLoc">{user.bio}</span>
          <span className="profileInfoDescy">
            {user.city}, {user.country}
          </span>
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
