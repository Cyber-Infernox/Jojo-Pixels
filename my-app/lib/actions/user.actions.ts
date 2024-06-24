"use server";

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import User from "../models/user.model";
import Post from "../models/post.model";

import { connectToDB } from "../mongoose";

export async function fetchUser(userId: string) {
  try {
    connectToDB();

    return await User.findOne({ id: userId });
  } catch (error: any) {
    // throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

interface Params {
  userId: string;
  username: string;
  city: string;
  country: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  city,
  country,
  image,
}: Params): Promise<void> {
  try {
    connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        city,
        country,
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );

    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    // throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

// Almost similar to Thead (search + pagination) and Community (search + pagination)
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectToDB();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function getLikes(userId: string) {
  try {
    await connectToDB();

    // Find all posts created by the user
    const userPosts = await Post.find({ author: userId }).populate({
      path: "likes",
      model: User,
      select: "name image id _id",
    });

    // Collect all likes from the user's posts
    const likes = userPosts.reduce((acc, post) => {
      return acc.concat(post.likes);
    }, []);

    return likes;
  } catch (error) {
    console.error("Error fetching likes: ", error);
    throw error;
  }
}

interface FollowParams {
  userId: string;
  followerId: string;
  follow: boolean;
}

export async function updateFollowStatus({
  userId,
  followerId,
  follow,
}: FollowParams) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      throw new Error("User or follower not found");
    }

    if (follow) {
      if (!user.followers.includes(followerId)) {
        user.followers.push(followerId);
      }
      if (!follower.followings.includes(userId)) {
        follower.followings.push(userId);
      }
    } else {
      const followerIndex = user.followers.indexOf(followerId);
      if (followerIndex > -1) {
        user.followers.splice(followerIndex, 1);
      }
      const followingindex = follower.followings.indexOf(userId);
      if (followingindex > -1) {
        follower.followings.splice(followingindex, 1);
      }
    }

    await user.save();
    await follower.save();

    return { message: "Follow status updated successfully" };
  } catch (error) {
    console.error("Error updating follow status:", error);
    throw error;
  }
}

export async function checkFollowStatus({
  userId,
  followerId,
}: {
  userId: string;
  followerId: string;
}) {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const isFollowing = user.followers.includes(followerId);

    return { isFollowing };
  } catch (error) {
    console.error("Error checking follow status:", error);
    throw error;
  }
}

export async function getFollowerCount(userId: string) {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const followerCount = user.followers.length;

    return { followerCount };
  } catch (error) {
    console.error("Error getting follower count:", error);
    throw error;
  }
}

export async function getFollowingCount(userId: string) {
  try {
    await connectToDB();

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const followingCount = user.followings.length;

    return { followingCount };
  } catch (error) {
    console.error("Error getting following count:", error);
    throw error;
  }
}

export async function getTotalLikes(userId: string): Promise<number> {
  await connectToDB();

  // Fetch all posts by the user
  const posts = await Post.find({ author: userId });

  // Sum up the likes from all posts
  const totalLikes = posts.reduce((sum, post) => sum + post.likes.length, 0);

  return totalLikes;
}
