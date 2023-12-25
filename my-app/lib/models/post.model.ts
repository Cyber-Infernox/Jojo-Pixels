import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  // id: {
  //   type: String,
  //   required: true,
  // },
  text: {
    type: String,
    required: true,
  },
  author: String,
  // {
  //   // In Mongoose, mongoose.Schema.Types.ObjectId is a specific data type used to define a schema property that will hold a reference to another document in a different collection within a MongoDB database.
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  image: String,
  // community: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Community",
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // groupId: {
  //   type: String,
  // },
  // parentId: {
  //   type: String,
  // },
  // children: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Thread", // One thread can have more than one threads (Recursion of threads)
  //   },
  // ],
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
