import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/forms/AccountProfile";

async function Page() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
    return null;
  } // to avoid typescript warnings

  const userInfo = await fetchUser(user.id);
  // console.log(userInfo);
  if (userInfo?.onboarding) redirect("/");

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user?.username,
    city: userInfo ? userInfo?.city : "",
    country: userInfo ? userInfo?.country : "",
    name: userInfo ? userInfo?.name : user.firstName || "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now, to use Pixels.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile
          user={JSON.parse(JSON.stringify(userData))}
          btnTitle="Continue"
        />
      </section>
    </main>
  );
}

export default Page;
