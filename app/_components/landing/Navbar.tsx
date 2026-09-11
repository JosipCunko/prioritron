"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import BrandMark from "../BrandMark";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMenuOpen(false);
    }

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      {isMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 md:hidden bg-background-700/50"
          aria-label="Close mobile menu"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav className="fixed top-0 inset-x-0 z-50 bg-background-700/80 backdrop-blur-md border-b border-primary-500/20 shadow-lg shadow-primary-500/5">
        <div className="py-4 px-6 md:px-10 lg:px-16">
          <div className="container mx-auto flex justify-between items-center">
            <Link
              href="/"
              aria-label="Prioritron"
              className="flex items-center group shrink-0"
            >
              <BrandMark className="group-hover:opacity-90 transition-opacity" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6 items-center">
              <Link
                href="https://prioritron.dev#images"
                className="text-text-low hover:text-primary-300 hover:text-glow transition-all duration-200 text-base font-medium"
              >
                _Preview
              </Link>

              <Link
                href="https://prioritron.dev#features"
                className="text-text-low hover:text-primary-300 hover:text-glow transition-all duration-200 text-base font-medium"
              >
                _Features
              </Link>
              <Link
                href="https://prioritron.dev#pricing"
                className="text-text-low hover:text-primary-300 hover:text-glow transition-all duration-200 text-base font-medium"
              >
                _Pricing
              </Link>
              <Link
                href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJZbjrwqZhdlnFdSGkCDrWzqCMDPVlffTKZHKVLxQZMgcDQKGsDlMZLDDlpjDpczSXcjtmg"
                className="text-text-low hover:text-primary-300 hover:text-glow transition-all duration-200 text-base font-medium"
              >
                _Contact_Us
              </Link>
              <Link
                href="/login"
                className="bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/50 text-primary-300 font-semibold py-2 px-5 rounded-md transition-all duration-200 text-base hover:shadow-md hover:shadow-primary-500/20"
              >
                [Engage]
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex flex-col space-y-1 focus:outline-none"
              onClick={toggleMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMenuOpen}
            >
              <span
                className={`block w-6 h-0.5 bg-primary-300 transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-primary-300 transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-primary-300 transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu — in-flow inside the fixed bar, so it overlays the page */}
        <div
          className={`md:hidden overflow-hidden bg-background-700 px-6 transition-all duration-300 ${
            isMenuOpen
              ? "max-h-96 opacity-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="container mx-auto pt-4 pb-4 space-y-3">
            <Link
              href="/#images"
              className="block text-text-low hover:text-primary-300 hover:text-glow transition-all duration-200 text-base font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              _Preview
            </Link>

            <Link
              href="/#features"
              className="block text-text-low hover:text-primary-300 hover:text-glow transition-all duration-200 text-base font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              _Features
            </Link>
            <Link
              href="/#pricing"
              className="block text-text-low hover:text-primary-300 hover:text-glow transition-all duration-200 text-base font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              _Pricing
            </Link>
            <Link
              href="https://mail.google.com/mail/u/0/#inbox?compose=CllgCJZbjrwqZhdlnFdSGkCDrWzqCMDPVlffTKZHKVLxQZMgcDQKGsDlMZLDDlpjDpczSXcjtmg"
              className="block text-text-low hover:text-primary-300 hover:text-glow transition-all duration-200 text-base font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              _Contact
            </Link>
            <Link
              href="/login"
              className="inline-block bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/50 text-primary-300 font-semibold py-2 px-5 rounded-md transition-all duration-200 text-base hover:shadow-md hover:shadow-primary-500/20 mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              [Engage]
            </Link>
          </div>
        </div>
      </nav>

      <div className="h-[72px] shrink-0" aria-hidden="true" />
    </>
  );
}
