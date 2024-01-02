import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Gallery from "@/components/shared/Gallery/Gallery";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchGlobalPosts } from "@/lib/actions/post.actions";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchGlobalPosts();
  // console.log(result);

  // const userData = {
  //   id: user.id,
  //   objectId: userInfo?._id,
  //   username: userInfo ? userInfo?.username : user.username,
  //   city: userInfo ? userInfo?.city : "",
  //   country: userInfo ? userInfo?.country : "",
  //   name: userInfo ? userInfo?.name : user.firstName ?? "",
  //   image: userInfo ? userInfo?.image : user.imageUrl,
  //   bio: userInfo ? userInfo?.bio : "",
  // };

  return (
    <main className="">
      <h1 className="text-center font-bold mb-3">Photos</h1>
      <Gallery result={result} />
    </main>
  );
}
