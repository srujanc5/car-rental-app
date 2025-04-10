"use client";

import Link from "next/link";
import {
  Home,
  CarFront,
  LogIn,
  LogOut,
  CalendarDays,
  UserCircle,
  X,
} from "lucide-react";
import { UserButton, useUser, SignOutButton } from "@clerk/nextjs";

export default function Sidebar({ onClose }) {
  const { user, isSignedIn } = useUser();

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/bookings", label: "My Bookings", icon: <CalendarDays className="h-5 w-5" /> },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose(); // Close sidebar on mobile when a link is clicked
  };

  return (
    <aside className="h-screen w-64 border-r bg-white p-4 flex flex-col justify-between shadow-md">
      <div>
        {/* Top Section with Brand + Close Button on Mobile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CarFront className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">Rent Car</h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-gray-500 hover:text-black"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="space-y-2">
          {navItems.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-gray-100 transition"
            >
              {icon}
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Info or Sign In */}
      <div className="space-y-3">
        {isSignedIn ? (
          <>
            <div className="flex items-center gap-2 text-sm">
              <UserButton afterSignOutUrl="/" />
              <div>
                <p className="font-medium">{user.fullName || "User"}</p>
                <p className="text-xs text-gray-500">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <SignOutButton>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded hover:bg-red-100 transition">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </SignOutButton>
          </>
        ) : (
          <Link
            href="/sign-in"
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 rounded hover:bg-blue-100 transition"
          >
            <LogIn className="h-4 w-4" />
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}
