import Album from "@/components/shared/Album/Album";
import "./Gallery.css";
import { currentUser } from "@clerk/nextjs";
import { fetchUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

interface Post {
  _id: string;
  text: string;
  image: string;
  // Add other properties based on your post object structure
}

interface Result {
  posts: Post[];
  // Other properties in your result object
}

interface GalleryProps {
  result: Result;
}

const Gallery: React.FC<GalleryProps> = async ({ result }) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { posts } = result;

  return (
    <div id="Gallery" className="">
      {posts.length === 0 ? (
        <p className="no-result">No posts found</p>
      ) : (
        <>
          {posts.map((post: Post) => (
            <Album key={post._id} text={post.text} url={post.image} />
          ))}
        </>
      )}
    </div>
  );
};

export default Gallery;
