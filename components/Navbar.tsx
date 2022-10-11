import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeModal from "./ThemeModal";
import ProfileModal from "./ProfileModal";

type Props = {};

export default function Navbar({}: Props) {
  const session = useSession();

  const [showSettings, setShowSettings] = useState(false);
  const toggleSettings = useCallback(() => {
    setShowSettings((settings) => !settings);
  }, []);

  const [showProfile, setShowProfile] = useState(false);
  const toggleProfile = useCallback(() => {
    if (session.data?.user) {
      setShowProfile((profile) => !profile);
    }
  }, [session.data]);

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-none">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost btn-circle">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href="/vibe">Current Vibe</Link>
              </li>
              <li>
                <Link href="/timeline">Timeline</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1">
          <Link href="/vibe">
            <button className="btn btn-ghost normal-case text-2xl">
              the<span className="text-primary">FEELS</span>
            </button>
          </Link>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                {session.data ? (
                  <Image
                    src={session.data.user?.image!}
                    alt=""
                    width={432}
                    height={432}
                  />
                ) : (
                  <span className="text-3xl">?</span>
                )}
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a onClick={toggleProfile}>
                  {session.data?.user?.name ?? "Not Signed In"}
                </a>
              </li>
              <li>
                <a onClick={toggleSettings}>Theme</a>
              </li>
              <li>
                <a onClick={() => signOut({ callbackUrl: "/" })}>Sign Out</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <ThemeModal isOpen={showSettings} onClose={toggleSettings} />
      <ProfileModal
        isOpen={showProfile}
        onClose={toggleProfile}
        name={session.data?.user?.name ?? ""}
        email={session.data?.user?.email ?? ""}
      />
    </>
  );
}
