import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Footer() {
  const session = useSession();

  return (
    <footer className="footer p-10 bg-neutral text-neutral-content">
      <div></div>
      <div>
        <span className="footer-title">Explore</span>
        <Link className="link link-hover" href="/vibe">
          Current vibe
        </Link>
        <Link className="link link-hover" href="/timeline">
          Timeline
        </Link>
        {session.data && <a className="link link-hover">Sign out</a>}
      </div>
      <div>
        <span className="footer-title">Follow Me</span>
        <a className="link link-hover" href="https://github.com/thejustinwalsh">
          Github
        </a>
        <a
          className="link link-hover"
          href="https://www.linkedin.com/in/justinwalsh/"
        >
          LinkedIn
        </a>
      </div>
      <div>
        <span className="footer-title">Legal</span>
        <Link className="link link-hover" href="/terms">
          Terms of service
        </Link>
        <Link className="link link-hover" href="/privacy">
          Privacy policy
        </Link>
      </div>
    </footer>
  );
}
