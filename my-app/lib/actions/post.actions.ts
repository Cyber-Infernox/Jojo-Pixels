"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../mongoose";

import User from "../models/user.model";
import Post from "../models/post.model";
import Community from "../models/community.model";

export async function fetchGlobalPosts() {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  // const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts of an user
  const postsQuery = Post.find()
    .sort({ createdAt: "desc" })
    // .skip(skipAmount)
    // .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    });
  // .populate({
  //   path: "children", // Populate the children field
  //   populate: {
  //     path: "author", // Populate the author field within children
  //     model: User,
  //     select: "_id name parentId image", // Select only _id and username fields of the author
  //   },
  // });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  // const totalPostsCount = await Post.countDocuments({
  //   parentId: { $in: [null, undefined] },
  // }); // Get the total count of posts

  const posts = await postsQuery.exec();

  // const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts };
}

export async function fetchPosts(userId: String) {
  connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  // const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts of an user
  const postsQuery = Post.find({ author: userId })
    .sort({ createdAt: "desc" })
    // .skip(skipAmount)
    // .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    });
  // .populate({
  //   path: "children", // Populate the children field
  //   populate: {
  //     path: "author", // Populate the author field within children
  //     model: User,
  //     select: "_id name parentId image", // Select only _id and username fields of the author
  //   },
  // });

  // Count the total number of top-level posts (threads) i.e., threads that are not comments.
  // const totalPostsCount = await Post.countDocuments({
  //   parentId: { $in: [null, undefined] },
  // }); // Get the total count of posts

  const posts = await postsQuery.exec();

  // const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts };
}

interface Params {
  text: string;
  image: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createPost({
  text,
  author,
  communityId,
  path,
  image,
}: Params) {
  try {
    connectToDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdPost = await Post.create({
      text,
      author,
      image,
      community: communityIdObject ? communityIdObject : null, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { posts: createdPost._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

// async function fetchAllChildThreads(threadId: string): Promise<any[]> {
//   const childThreads = await Thread.find({ parentId: threadId });

//   const descendantThreads = [];
//   for (const childThread of childThreads) {
//     const descendants = await fetchAllChildThreads(childThread._id);
//     descendantThreads.push(childThread, ...descendants);
//   }

//   return descendantThreads;
// }

export async function deletePost(
  postId: string,
  userId: string,
  path: string
): Promise<void> {
  try {
    connectToDB();

    // Find the thread to be deleted (the main thread)
    const posty = await Post.findOne({ id: postId }).populate({
      path: "author",
      model: User,
    });
    // .populate({
    //   path: "communities",
    //   model: Community,
    // });

    if (!posty) {
      throw new Error("Post not found");
    }

    // Fetch all child threads and their descendants recursively
    // const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    // const descendantThreadIds = [
    //   id,
    //   ...descendantThreads.map((thread) => thread._id),
    // ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    // const uniqueAuthorIds = new Set(
    //   [
    //     ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
    //     mainThread.author?._id?.toString(),
    //   ].filter((id) => id !== undefined)
    // );

    // const uniqueCommunityIds = new Set(
    //   [
    //     ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
    //     mainThread.community?._id?.toString(),
    //   ].filter((id) => id !== undefined)
    // );

    // Recursively delete child threads and their descendants
    await Post.deleteOne({ id: postId });

    // Update User model
    await User.findOneAndUpdate(
      { id: userId },
      { $pull: { posts: { $in: postId } } }
    );

    // // Update Community model
    // await Community.updateOne(
    //   { _id: { $in: Array.from(uniqueCommunityIds) } },
    //   { $pull: { threads: { $in: descendantThreadIds } } }
    // );

    revalidatePath(path);
  } catch (error: any) {
    // throw new Error(`Failed to delete post: ${error.message}`);
  }
}

// export async function fetchThreadById(threadId: string) {
//   connectToDB();

//   try {
//     const thread = await Thread.findById(threadId)
//       .populate({
//         path: "author",
//         model: User,
//         select: "_id id name image",
//       }) // Populate the author field with _id and username
//       .populate({
//         path: "community",
//         model: Community,
//         select: "_id id name image",
//       }) // Populate the community field with _id and name
//       .populate({
//         path: "children", // Populate the children field
//         populate: [
//           {
//             path: "author", // Populate the author field within children
//             model: User,
//             select: "_id id name parentId image", // Select only _id and username fields of the author
//           },
//           {
//             path: "children", // Populate the children field within children
//             model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
//             populate: {
//               path: "author", // Populate the author field within nested children
//               model: User,
//               select: "_id id name parentId image", // Select only _id and username fields of the author
//             },
//           },
//         ],
//       })
//       .exec();

//     return thread;
//   } catch (err) {
//     console.error("Error while fetching thread:", err);
//     throw new Error("Unable to fetch thread");
//   }
// }

// export async function addCommentToThread(
//   threadId: string,
//   commentText: string,
//   userId: string,
//   path: string
// ) {
//   connectToDB();

//   try {
//     // Find the original thread by its ID
//     const originalThread = await Thread.findById(threadId);

//     if (!originalThread) {
//       throw new Error("Thread not found");
//     }

//     // Create the new comment thread
//     const commentThread = new Thread({
//       text: commentText,
//       author: userId,
//       parentId: threadId, // Set the parentId to the original thread's ID
//     });

//     // Save the comment thread to the database
//     const savedCommentThread = await commentThread.save();

//     // Add the comment thread's ID to the original thread's children array
//     originalThread.children.push(savedCommentThread._id);

//     // Save the updated original thread to the database
//     await originalThread.save();

//     revalidatePath(path);
//   } catch (err) {
//     console.error("Error while adding comment:", err);
//     throw new Error("Unable to add comment");
//   }
// }
