import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Gallery from "@/components/shared/Gallery/Gallery";
import { fetchUser } from "@/lib/actions/user.actions";

export default async function Home() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <main className="">
      <h1 className="text-center font-bold mb-3">Photos</h1>
      <Gallery />
    </main>
  );
}
