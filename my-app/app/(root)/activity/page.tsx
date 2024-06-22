// Define a User type
interface User {
  _id: string;
  name: string;
  image: string;
}

// Define an Activity type
interface Activity {
  id: string;
  _id: string;
  image: string;
  name: string;
}

// Assuming fetchUser and getLikes are already typed, you don't need to redefine them here

// Now, your Page component with types applied:
import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { fetchUser, getLikes } from "@/lib/actions/user.actions";

async function Page() {
  const user = await currentUser();
  if (!user) return null; // Ensure we handle the case where there's no user

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) {
    redirect("/onboarding");
    return null; // Ensure the component stops rendering after redirect
  }

  const activities = await getLikes(userInfo._id);
  // console.log(activities);
  // console.log(userInfo._id);

  return (
    <>
      <h1 className="ml-[10px] head-text text-black">Activity</h1>

      <section className="mt-6 flex flex-col bg-gray-400 gap-[10px] p-8 rounded-2xl">
        {activities.length > 0 ? (
          activities.map((activity: Activity) => (
            <Link key={activity._id} href={`/profile/${activity.id}`}>
              {JSON.stringify(activity._id) !==
                JSON.stringify(userInfo._id) && (
                <article className="activity-card">
                  <Image
                    src={activity.image}
                    alt="user_logo"
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="ml-2 mr-1 text-primary-500">
                      {activity.name}
                    </span>
                    liked your post
                  </p>
                </article>
              )}
            </Link>
          ))
        ) : (
          <p className="!text-base-regular text-light-3">No activity yet</p>
        )}
      </section>
    </>
  );
}

export default Page;
