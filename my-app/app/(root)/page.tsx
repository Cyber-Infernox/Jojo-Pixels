import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Gallery from "@/components/shared/Gallery/Gallery";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchGlobalPosts } from "@/lib/actions/post.actions";

export default async function Home() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchGlobalPosts();
  // console.log(result);

  return (
    <main className="">
      <h1 className="head-text mb-[-20px] text-black font-extrabold text-center">
        Photos
      </h1>
      <Gallery result={result} />
    </main>
  );
}
