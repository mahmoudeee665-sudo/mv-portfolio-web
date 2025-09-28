"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiGlobe,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { FaFacebook, FaXTwitter, FaYoutube } from "react-icons/fa6";

import ContactWidget from "@/components/ContactWidget";         // ← extracted widget
import { CONTACT_EVENT } from "@/lib/contactBus";               // ← event bus

const NAV = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
  { id: "experience", label: "Experience" },
];

const HEADER_OFFSET = 96;

const ICONS = {
  github: FiGithub,
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  facebook: FaFacebook,
  x: FaXTwitter, // X (Twitter)
  youtube: FaYoutube,
  website: FiGlobe,
};

// Normalize user-entered URLs: add https:// if missing
function normalizeUrl(u) {
  if (!u) return "#";
  const s = String(u).trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) return s;
  return `https://${s.replace(/^\/+/, "")}`;
}

// Build link from a contact item
function hrefForContact(c) {
  if (!c) return "#";
  if (c.url) return normalizeUrl(c.url);
  return "#";
}

export default function Header({
  brand = "MV7mood",
  contacts = [],        // [{ provider, url, label, isPrimary }]
  primaryEmail = "",    // optional: can be used inside ContactWidget if you want
  nav = NAV,
}) {
  const [isOpen, setIsOpen] = useState(false);      // mobile menu
  const [scrolled, setScrolled] = useState(false);  // glass intensity
  const [contactOpen, setContactOpen] = useState(false); // shared widget state

  const toggleMenu = () => setIsOpen((s) => !s);
  const refreshSite = () => window.location.reload();

  // Sticky style on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen for global "open contact" event (from ContactSection or anywhere)
  useEffect(() => {
    const handler = () => setContactOpen(true);
    window.addEventListener(CONTACT_EVENT, handler);
    return () => window.removeEventListener(CONTACT_EVENT, handler);
  }, []);

  // Close mobile menu when opening contact
  useEffect(() => {
    if (contactOpen) setIsOpen(false);
  }, [contactOpen]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setIsOpen(false);
    requestAnimationFrame(() => {
      const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  };

  // Show only contacts we have icons for
  const visibleContacts = contacts.filter((c) => ICONS[c.provider]);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-[100] pointer-events-none">
        <div className="px-3 pt-3 sm:px-4 sm:pt-4">
          <div
            className={[
              "mx-auto max-w-6xl pointer-events-auto",
              "rounded-2xl sm:rounded-3xl",
              "border relative",
              scrolled
                ? "backdrop-blur-xl bg-white/70 dark:bg-zinc-900/55 border-white/30 dark:border-white/10 shadow-xl shadow-black/5"
                : "backdrop-blur-md bg-white/35 dark:bg-zinc-900/35 border-white/20 dark:border-white/10 shadow-lg shadow-black/5",
            ].join(" ")}
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/60 dark:bg-white/10 rounded-t-3xl" />
            <span className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(120%_60%_at_50%_-20%,rgba(255,255,255,0.35),transparent)] dark:bg-[radial-gradient(120%_60%_at_50%_-20%,rgba(255,255,255,0.07),transparent)]" />

            <div className="relative h-16 md:h-18 lg:h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
              {/* Desktop brand pill */}
              <motion.button
                onClick={refreshSite}
                aria-label="Refresh page"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.2 }}
                className="hidden md:flex items-center group"
              >
                <div className="relative overflow-hidden rounded-full backdrop-blur-xl ring-1 ring-white/40 dark:ring-white/10 border border-white/40 dark:border-white/5 bg-gradient-to-r from-white/25 via-white/15 to-white/20 dark:from-white/10 dark:via-white/5 dark:to-white/10 shadow-[0_8px_30px_rgba(80,35,180,0.15)] px-4 md:px-5 py-2">
                  <motion.span
                    aria-hidden
                    className="absolute -inset-x-10 -inset-y-8 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ repeat: Infinity, duration: 3.2, ease: "linear", delay: 0.6 }}
                    style={{
                      maskImage: "radial-gradient(40% 50% at 50% 50%, #000 55%, transparent)",
                    }}
                  />
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute -left-6 -top-6 h-16 w-16 rounded-full bg-violet-500/25 blur-2xl"
                    animate={{ y: [0, -6, 0], x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  />
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -bottom-6 h-16 w-16 rounded-full bg-pink-500/25 blur-2xl"
                    animate={{ y: [0, 6, 0], x: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 0.2 }}
                  />
                  <span className="relative z-10 font-extrabold tracking-tight select-none text-transparent bg-clip-text bg-gradient-to-r from-violet-100 via-fuchsia-100 to-pink-100">
                    {brand}
                  </span>
                </div>
              </motion.button>

              {/* Mobile brand */}
              <div className="absolute inset-x-0 flex justify-center md:hidden pointer-events-none">
                <motion.button
                  onClick={refreshSite}
                  aria-label="Refresh page"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="group pointer-events-auto"
                >
                  <div className="relative overflow-hidden rounded-full backdrop-blur-xl ring-1 ring-white/40 dark:ring-white/10 border border-white/40 dark:border-white/5 bg-gradient-to-r from-white/25 via-white/15 to-white/20 dark:from-white/10 dark:via-white/5 dark:to-white/10 shadow-[0_8px_30px_rgba(80,35,180,0.15)] px-4 py-2">
                    <span className="relative z-10 font-extrabold tracking-tight select-none text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500">
                      {brand}
                    </span>
                  </div>
                </motion.button>
              </div>

              {/* Desktop nav */}
              <nav className="hidden lg:flex items-center space-x-6">
                {nav.map((item, index) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.5 + index * 0.08 }}
                    className="relative font-medium text-slate-700 dark:text-violet-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-violet-500 hover:to-fuchsia-500 transition-colors duration-300 group"
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-fuchsia-500 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                ))}
              </nav>

              {/* Socials + Contact (desktop) */}
              <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
                {visibleContacts.map((c, i) => {
                  const Icon = ICONS[c.provider] || FiGlobe;
                  const href = hrefForContact(c);
                  return (
                    <motion.a
                      key={`${c.provider}-${i}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.55 + i * 0.05, duration: 0.4 }}
                      href={href}
                      target={/^https?:\/\//i.test(href) ? "_blank" : undefined}
                      rel={/^https?:\/\//i.test(href) ? "noopener noreferrer" : undefined}
                      aria-label={c.label || c.provider}
                      className="text-slate-700 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      title={c.label || c.provider}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}

                <motion.button
                  onClick={() => setContactOpen(true)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.4, type: "spring", stiffness: 120, damping: 16 }}
                  className="ml-1 px-4 py-2 rounded-xl bg-gradient-to-r from-gray-300 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-violet-700 dark:text-violet-300 font-semibold hover:from-violet-700 hover:to-purple-700 hover:text-white transition-all duration-500"
                  aria-haspopup="dialog"
                  aria-controls="contact-widget"
                >
                  Collab with Me
                </motion.button>
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden items-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMenu}
                  className="text-slate-800 dark:text-slate-200"
                  aria-label="Toggle navigation menu"
                  aria-expanded={isOpen}
                  aria-controls="mobile-nav"
                >
                  {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
                </motion.button>
              </div>
            </div>

            {/* Mobile sheet */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  id="mobile-nav"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="md:hidden px-4 sm:px-6 pb-4"
                >
                  <div className="mt-2 rounded-xl bg-white/90 dark:bg-zinc-900/85 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-lg overflow-hidden">
                    <nav className="flex flex-col divide-y divide-white/20 dark:divide-white/10">
                      {nav.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          onClick={(e) => handleNavClick(e, item.id)}
                          className="font-medium text-slate-800 dark:text-slate-300 py-3 px-4"
                        >
                          {item.label}
                        </a>
                      ))}
                    </nav>

                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/30 dark:border-white/10">
                      <div className="flex space-x-4">
                        {visibleContacts.map((c, i) => {
                          const Icon = ICONS[c.provider] || FiGlobe;
                          const href = hrefForContact(c);
                          return (
                            <a
                              key={`m-${c.provider}-${i}`}
                              href={href}
                              target={/^https?:\/\//i.test(href) ? "_blank" : undefined}
                              rel={/^https?:\/\//i.test(href) ? "noopener noreferrer" : undefined}
                              aria-label={c.label || c.provider}
                              title={c.label || c.provider}
                            >
                              <Icon className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                            </a>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setContactOpen(true);
                        }}
                        className="px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-violet-400 font-bold text-white text-sm"
                        aria-haspopup="dialog"
                        aria-controls="contact-widget"
                      >
                        Contact Me
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* One shared instance of the extracted widget */}
      <ContactWidget
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        /* You can pass primaryEmail or any props here if your widget needs them:
           ownerEmail={primaryEmail}
        */
      />
    </>
  );
}
