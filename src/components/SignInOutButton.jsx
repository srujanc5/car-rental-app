"use client";

import { Button } from "@/components/ui/button";
import { useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignInOutButton() {
    const { signOut } = useClerk();
    const router = useRouter();
    return (
      <>
      <SignedIn>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => signOut(() => (window.location.href = "/"))}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </SignedIn>
      <SignedOut>
      <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.push("/sign-in")}
        >
          Sign In
        </Button>
      </SignedOut>
      </>
    );
  }