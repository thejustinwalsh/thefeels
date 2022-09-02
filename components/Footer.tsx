import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Footer() {
  const session = useSession();

  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div></div>
      <div>
        <span className="footer-title">Explore</span>
        <a className="link link-hover">Daily Vibe</a>
        <a className="link link-hover">Timeline</a>
        {session.data && <a className="link link-hover">Sign Out</a>}
      </div>
      <div>
        <span className="footer-title">Follow Me</span>
        <a className="link link-hover">Github</a>
        <a className="link link-hover">LinkedIn</a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
      </div>
    </footer>
  );
}
