import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { clerkAuthAppearance } from "@/lib/clerk-appearance";
import "../../clerk-auth.css";

export default function SignUpPage() {
  return (
    <div
      data-theme="dark"
      className="clerk-auth-page relative flex min-h-screen flex-col items-center justify-center bg-[#0f1218] px-4 py-12"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(219,185,74,0.1),transparent_70%)]"
        aria-hidden
      />

      <Link href="/" className="relative z-10 mb-8 flex flex-col items-center gap-2">
        <Image
          src="/logo2.png"
          alt="Aureus Trade Capital"
          width={120}
          height={120}
          className="h-12 w-auto object-contain"
        />
        <span className="font-heading text-sm font-semibold tracking-wide text-[#a8a29e]">
          Aureus Trade Capital
        </span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        <SignUp appearance={clerkAuthAppearance} />
      </div>

      <Link
        href="/"
        className="relative z-10 mt-8 text-sm text-[#a8a29e] transition hover:text-[#dbb94a]"
      >
        ← Back to home
      </Link>
    </div>
  );
}
