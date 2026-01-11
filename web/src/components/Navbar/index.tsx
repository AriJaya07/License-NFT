"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "My NFTs", path: "/profile" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Form Submit", path: "/user-submit" },
    { name: "Admin", path: "/admin" },
  ];

  const mobileLinks = [
    { name: "Home", path: "/" },
    { name: "My NFTs", path: "/profile" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Mint", path: "/mint" },
    { name: "List", path: "/list" },
    { name: "Form Submit", path: "/user-submit" },
    { name: "Admin", path: "/admin" },
  ];

  const isActive = (path: string) => pathname === path;

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Left: Brand + Desktop Links */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Brand */}
              <Link
                href="/"
                className="shrink-0 inline-flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-50 transition-colors duration-200"
                aria-label="Homepage"
              >
                <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-sm" />
                <span className="font-bold text-gray-900 hidden sm:inline text-lg">
                  NFT
                </span>
              </Link>

              {/* Desktop Links */}
              <div className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`relative text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                      isActive(link.path)
                        ? "text-indigo-600 bg-indigo-50"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.name}
                    {isActive(link.path) && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600" />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Connect Button + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Desktop Connect Button */}
              <div className="hidden sm:block shrink-0">
                <ConnectButton />
              </div>

              {/* Mobile Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Toggle menu"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md" />
              <span className="text-xl font-bold text-gray-900">NFT</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-2">
              {mobileLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={closeMenu}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 min-h-[44px] ${
                    isActive(link.path)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Mobile Menu Footer with Connect Button */}
          <div className="p-6 border-t border-gray-200 sm:hidden">
            <div className="w-full">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
