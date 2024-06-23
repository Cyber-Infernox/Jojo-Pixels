"use client";

import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import "./Profile.css";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

import {
  updateFollowStatus,
  checkFollowStatus,
  getFollowerCount,
} from "@/lib/actions/user.actions";

interface UserProps {
  currUserId: string;
  id: string;
  objectId: string;
  username: string;
  city: string;
  country: string;
  name: string;
  bio: string;
  image: string;
}

interface Props {
  user: UserProps;
}

const Profile = ({ user }: Props) => {
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const [followStatusResponse, followerCountResponse] = await Promise.all(
          [
            checkFollowStatus({
              userId: user.objectId,
              followerId: user.currUserId,
            }),
            getFollowerCount(user.objectId),
          ]
        );

        setFollowed(followStatusResponse.isFollowing);
        setFollowerCount(followerCountResponse.followerCount);
      } catch (error) {
        console.error("Error fetching follow status or follower count:", error);
      }
    };

    fetchFollowStatus();
  }, [user]);

  const handleFollowClick = async () => {
    setLoading(true);
    try {
      const response = await updateFollowStatus({
        userId: user.objectId,
        followerId: user.currUserId,
        follow: !followed,
      });

      setFollowed(!followed);
      setFollowerCount((prevCount) =>
        followed ? prevCount - 1 : prevCount + 1
      );
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profileRight">
      <div className="profileRightTop">
        <div className="profileCover">
          <Image
            className="profileCoverImg"
            src="/uploads/cover.jpg"
            alt="cover_pic"
            width={500}
            height={300}
          />
          <Image
            className="profileUserImg"
            src={user.image}
            alt="logo"
            width={100}
            height={100}
          />
        </div>
        <div className="profileInfo">
          <h4 className="profileInfoName">{user.name}</h4>
          <span className="profileInfoDesc">@{user.username}</span>
          <span className="profileInfoLoc">{user.bio}</span>
          <span className="profileInfoDescy">
            {user.city}, {user.country}
          </span>
          <button
            className="rightbarFollowButton"
            onClick={handleFollowClick}
            disabled={loading}
          >
            {followed ? (
              <div className="rightbarFollowText">Unfollow</div>
            ) : (
              <div className="rightbarFollowText">Follow</div>
            )}
            {followed ? <RemoveIcon /> : <AddIcon />}
          </button>
          <div className="profileInfoLoc">
            <span className="mr-[20px]">
              {followerCount} - <b>Followers</b>
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
    </div>
  );
};

export default Profile;
