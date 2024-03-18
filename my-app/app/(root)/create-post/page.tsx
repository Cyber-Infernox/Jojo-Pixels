import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Post from "@/components/forms/PostPicture";
import { fetchUser } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // fetch organization list created by user
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    city: userInfo ? userInfo?.city : "",
    country: userInfo ? userInfo?.country : "",
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <>
      <h1 className="head-text mb-[-20px] text-black font-extrabold text-center">
        Create Post
      </h1>

      <Post
        user={JSON.parse(JSON.stringify(userData))}
        userId={JSON.parse(JSON.stringify(userInfo._id))}
      />
    </>
  );
}

export default Page;
