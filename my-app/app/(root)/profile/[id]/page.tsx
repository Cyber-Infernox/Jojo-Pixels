import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Gallery from "@/components/shared/Gallery/Gallery";
import Profile from "@/components/shared/Profile/Profile";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchPosts } from "@/lib/actions/post.actions";

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const pageInfo = await fetchUser(params.id);

  const userData = {
    id: pageInfo.id,
    objectId: pageInfo?._id,
    username: pageInfo ? pageInfo?.username : user.username,
    city: pageInfo ? pageInfo?.city : "",
    country: pageInfo ? pageInfo?.country : "",
    name: pageInfo ? pageInfo?.name : user.firstName ?? "",
    image: pageInfo ? pageInfo?.image : user.imageUrl,
    bio: pageInfo ? pageInfo?.bio : "",
  };

  const result = await fetchPosts(pageInfo._id);
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
