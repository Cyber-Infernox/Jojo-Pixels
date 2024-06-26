import {
  UserButton,
  OrganizationSwitcher,
  SignOutButton,
  SignedIn,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Pixels</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="md:hidden mr-[13px]">
          {/* Code within the SignedIn block will only appear when you are signed in */}
          <SignedIn>
            <SignOutButton>
              <div className="flex cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </div>
            </SignOutButton>
          </SignedIn>
        </div>

        <div className="ml-[17px]">
          <UserButton
            appearance={{
              baseTheme: dark,
            }}
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
