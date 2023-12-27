import Album from "@/components/shared/Album/Album";
import "./Gallery.css";
import { fetchPosts } from "@/lib/actions/post.actions";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

const Gallery = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(userInfo._id);
  // console.log(result);

  return (
    <div id="Gallery" className="">
      {result.posts.length === 0 ? (
        <p className="no-result">No posts found</p>
      ) : (
        <>
          {result.posts.map((post) => (
            <Album key={post._id} text={post.text} url={post.image} />
          ))}
        </>
      )}
    </div>
  );
};

export default Gallery;
