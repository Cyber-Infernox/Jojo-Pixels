"use client";

import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import "./Album.css";

import { fetchUser } from "@/lib/actions/user.actions";
import { deletePost } from "@/lib/actions/post.actions";
import { likePost } from "@/lib/actions/post.actions";
import { unlikePost } from "@/lib/actions/post.actions";
import { setLike } from "@/lib/actions/post.actions";
import { getLikesCount } from "@/lib/actions/post.actions";

interface Props {
  userObject: string;
  currUser: string;
  postId: string;
  userId: string;
  text: string;
  url: string;
}

const Album = ({ userObject, currUser, postId, userId, text, url }: Props) => {
  const router = useRouter();
  const [model, setModel] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [liked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const pathname = usePathname();

  // console.log(currUser);
  // console.log(userId);
  // console.log(postId);

  useEffect(() => {
    setLike({
      userObject: userObject,
      postId: postId,
      userId: userId,
      path: pathname,
    })
      .then((result) => {
        setIsLiked(result === 1 ? true : false);
      })
      .catch((error) => {
        console.error("Failed to check if post is liked:", error);
      });
  }, []);

  useEffect(() => {
    getLikesCount({
      postId: postId,
    })
      .then((result) => {
        setLikes(result);
      })
      .catch((error) => {
        console.error("Failed to check if post is liked:", error);
      });
  }, []);

  const handleLike = async () => {
    try {
      await likePost({
        userObject: userObject,
        postId: postId,
        userId: userId,
        path: pathname,
      });

      console.log("liked");
      setIsLiked(true);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnlike = async () => {
    try {
      await unlikePost({
        userObject: userObject,
        postId: postId,
        userId: userId,
        path: pathname,
      });

      console.log("unliked");
      setIsLiked(false);
      location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (currUser === userId) {
      await deletePost({
        userObject: userObject,
        postId: postId,
        userId: userId,
        path: pathname,
      });

      location.reload();
    } else {
      alert("You cannot delete other's posts!!");
    }
  };

  return (
    <>
      <div className={model ? "model open" : "model"}>
        <Image
          src="/assets/close.svg"
          alt="close"
          width={18}
          height={18}
          className="closure"
          onClick={() => setModel(false)}
        />
        <Image src={url} alt="logo" width={700} height={700} />
      </div>
      <div>
        {/* <h1>Photo title: {photo.title}</h1> */}
        <div
          id="pics"
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Image src={url} alt="logo" width={600} height={600} />
          <div className="absolute inset-0 hover:bg-gray-900 hover:bg-opacity-75 transition ease-in-out duration-700">
            <div
              id="svge"
              className={
                isHovering
                  ? "flex flex-col items-center justify-center h-full relative"
                  : "hidden"
              }
            >
              <span className="text-white mb-[30px]">{text}</span>
              <div className="flex items-center justify-center">
                <OpenInFullIcon
                  className="mr-14"
                  sx={{ color: "white" }}
                  onClick={() => setModel(true)}
                />
                <div className="mr-14 text-white">
                  {liked ? (
                    <FavoriteIcon
                      className="mr-2"
                      sx={{ color: "white" }}
                      onClick={handleUnlike}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      className="mr-2"
                      sx={{ color: "white" }}
                      onClick={handleLike}
                    />
                  )}
                  {likes} {likes === 1 ? "Like" : "Likes"}
                </div>
                <DeleteIcon sx={{ color: "white" }} onClick={handleDelete} />
              </div>
            </div>
          </div>
        </div>
        {/* <p>{photo.date}</p> */}
        {/* <p>{photo.createdAt}</p> */}
      </div>
    </>
  );
};

export default Album;
