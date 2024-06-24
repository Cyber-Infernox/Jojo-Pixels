"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Post from "../models/post.model";
import mongoose from "mongoose";

export async function fetchGlobalPosts() {
  connectToDB();

  // Create a query to fetch the posts of an user
  const postsQuery = Post.find().sort({ createdAt: "desc" }).populate({
    path: "author",
    model: User,
  });

  const posts = await postsQuery.exec();

  return { posts };
}

export async function fetchPosts(userId: String) {
  connectToDB();

  // Create a query to fetch the posts of an user
  const postsQuery = Post.find({ author: userId })
    .sort({ createdAt: "desc" })
    .populate({
      path: "author",
      model: User,
    });

  const posts = await postsQuery.exec();

  return { posts };
}

interface Params {
  text: string;
  image: string;
  author: string;
  path: string;
}

export async function createPost({ text, author, path, image }: Params) {
  try {
    connectToDB();

    const createdPost = await Post.create({
      text,
      author,
      image,
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

interface Paramsy {
  userObject: string;
  postId: string;
  userId: string;
  path: string;
}

export async function deletePost({
  userObject,
  postId,
  userId,
  path,
}: Paramsy): Promise<void> {
  try {
    await connectToDB();

    // Delete the post
    const deletedPost = await Post.findOneAndDelete({ _id: postId });

    if (!deletedPost) {
      throw new Error("Post not found");
    }

    // Remove the post ID from the user's posts array
    const updatedUser = await User.findOneAndUpdate(
      { _id: userObject },
      { $pull: { posts: postId } },
      { upsert: true, new: true }
    );

    if (!updatedUser) {
      throw new Error("Post not found");
    }

    // Revalidate the path if needed
    if (path) {
      revalidatePath(path);
    }
  } catch (error) {
    console.error(`Failed to delete post: ${error}`);
    throw error;
  }
}

export async function setLike({
  userObject,
  postId,
  userId,
  path,
}: Paramsy): Promise<number> {
  try {
    await connectToDB();

    // Validate postId and userId
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(userObject)
    ) {
      throw new Error("Invalid postId or userId");
    }

    // Retrieve the post from the database
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      throw new Error("Post not found");
    }

    // Check if userObject is already in the likes array
    const userLiked = post.likes.includes(userObject);

    // Return 1 if user liked the post, otherwise return 0
    return userLiked ? 1 : 0;

    // Continue with the rest of your logic
    await revalidatePath(path);
  } catch (error) {
    console.error(`Failed to set like: ${error}`);
    throw error;
  }
}

export async function getLikesCount({
  postId,
}: {
  postId: string;
}): Promise<number> {
  try {
    await connectToDB();

    // Validate postId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid postId");
    }

    // Retrieve the post from the database
    const post = await Post.findOne({ _id: postId });

    if (!post) {
      throw new Error("Post not found");
    }

    // Return the length of the likes array
    return post.likes.length;
  } catch (error) {
    console.error(`Failed to get likes count: ${error}`);
    throw error;
  }
}

export async function likePost({
  userObject,
  postId,
  userId,
  path,
}: Paramsy): Promise<void> {
  try {
    await connectToDB();

    // Validate postId and userId
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(userObject)
    ) {
      throw new Error("Invalid postId or userId");
    }

    // console.log("postId:", postId);
    // console.log("userId:", userObject);

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $addToSet: { likes: userObject },
      },
      { upsert: true, new: true }
    );

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    await revalidatePath(path);
  } catch (error) {
    console.error(`Failed to like post: ${error}`);
    throw error;
  }
}

export async function unlikePost({
  userObject,
  postId,
  userId,
  path,
}: Paramsy): Promise<void> {
  try {
    await connectToDB();

    // Validate postId and userId
    if (
      !mongoose.Types.ObjectId.isValid(postId) ||
      !mongoose.Types.ObjectId.isValid(userObject)
    ) {
      throw new Error("Invalid postId or userId");
    }

    // console.log("postId:", postId);
    // console.log("userId:", userObject);

    const updatedPost = await Post.findOneAndUpdate(
      { _id: postId },
      {
        $pull: { likes: userObject },
      },
      { upsert: true, new: true }
    );

    if (!updatedPost) {
      throw new Error("Post not found");
    }

    await revalidatePath(path);
  } catch (error) {
    console.error(`Failed to like post: ${error}`);
    throw error;
  }
}
