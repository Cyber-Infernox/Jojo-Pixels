import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Gallery from "@/components/shared/Gallery/Gallery";
import Profile from "@/components/shared/Profile/Profile";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchPosts } from "@/lib/actions/post.actions";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    city: userInfo ? userInfo?.city : "",
    country: userInfo ? userInfo?.country : "",
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    image: userInfo ? userInfo?.image : user.imageUrl,
    bio: userInfo ? userInfo?.bio : "",
  };

  const result = await fetchPosts(userInfo._id);
  // console.log(result.author);

  return (
    <main className="">
      <Profile user={JSON.parse(JSON.stringify(userData))} />
      <h1 className="mt-[20px] text-center font-bold mb-3">Photos</h1>
      <div className="mt-[-30px]">
        <Gallery result={JSON.parse(JSON.stringify(result))} />
      </div>
    </main>
  );
}
