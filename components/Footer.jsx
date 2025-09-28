"use client";

import { memo } from "react";
import {
  FiGithub,
  FiInstagram,
  FiLinkedin,
  FiGlobe,
} from "react-icons/fi";
import { FaFacebook, FaXTwitter, FaYoutube } from "react-icons/fa6";

/* ---------------- icon map same as header ---------------- */
const ICONS = {
  github: FiGithub,
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  facebook: FaFacebook,
  x: FaXTwitter,
  youtube: FaYoutube,
  website: FiGlobe,
};

// normalize user URLs
function normalizeUrl(u) {
  if (!u) return "#";
  const s = String(u).trim();
  if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) return s;
  return `https://${s.replace(/^\/+/, "")}`;
}

function Footer({
  name = "Portfolio",
  description = "Frontend developer passionate about building modern, interactive, responsive web experiences.",
  contacts = [], // same shape as header: [{ provider, url, label }]
}) {
  const visibleContacts = contacts.filter((c) => ICONS[c.provider]);

  return (
    <footer className="bg-black text-white py-16 px-6 mt-20">
      <div className="max-w-6xl mx-auto">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand & tagline */}
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
              {name}
            </h2>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-200">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#about"
                  className="text-gray-500 hover:text-violet-400 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  className="text-gray-500 hover:text-violet-400 transition-colors"
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className="text-gray-500 hover:text-violet-400 transition-colors"
                >
                  Experience
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-gray-500 hover:text-violet-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-purple-200">
              Connect
            </h3>
            <div className="flex space-x-5">
              {visibleContacts.map((c, i) => {
                const Icon = ICONS[c.provider];
                const href = normalizeUrl(c.url);
                return (
                  <a
                    key={`${c.provider}-${i}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={c.label || c.provider}
                    className="text-gray-500 hover:text-violet-400 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-sm">
            © 2025 Mv7mood. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
