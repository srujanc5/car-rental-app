"use client";

import { useState } from "react";
import Sidebar from "@/components/SideBar";
import { Menu } from "lucide-react";

export default function ClientWrapper({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div>
      {/* Sidebar: Always visible on large screens, toggleable on small */}
      <div className="hidden lg:block fixed top-0 left-0 h-screen w-64 z-40">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="relative z-50 w-64 bg-white h-full shadow-lg">
            <Sidebar onClose={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Toggle Button on small screens */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-white border p-2 rounded shadow-md"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Main content */}
      <main className="lg:ml-64 p-4">{children}</main>
    </div>
  );
}