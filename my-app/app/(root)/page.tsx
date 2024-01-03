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

  return (
    <main className="">
      <h1 className="text-center font-bold mb-3">Photos</h1>
      <Gallery result={result} />
    </main>
  );
}
