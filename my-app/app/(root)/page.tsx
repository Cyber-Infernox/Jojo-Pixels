import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Gallery from "@/components/shared/Gallery/Gallery";
import Profile from "@/components/shared/Profile/Profile";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <main className="">
      <Profile user={userData} />
      <h1 className="text-center font-bold mb-3">Photos</h1>
      <Gallery />
    </main>
  );
}
