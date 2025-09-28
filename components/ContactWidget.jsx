"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

/**
 * ContactWidget
 * - Name, Email, Message
 * - Basic validation
 * - Sends via `mailto:` to ownerEmail
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - ownerEmail?: string
 */
export default function ContactWidget({ open, onClose, ownerEmail = "" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState({});

  // reset form when opening
  useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setMsg("");
      setErrors({});
    }
  }, [open]);

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Required";
    if (!email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Invalid email";
    if (!msg.trim()) e.msg = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSendEmail = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    const subject = `Collab with ${name}`;
    const body = `Hi,\n\n${msg}\n\n— ${name}\nEmail: ${email}`;
    const url =
      `mailto:${encodeURIComponent(ownerEmail)}?` +
      `subject=${encodeURIComponent(subject)}&` +
      `body=${encodeURIComponent(body)}`;

    window.location.href = url;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="contact-widget"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-widget-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[120] flex items-center justify-center p-4 pointer-events-auto"
          onMouseDown={onClose} // click outside closes
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 30, stiffness: 200, duration: 0.8 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6"
            onMouseDown={(e) => e.stopPropagation()} // prevent overlay close
          >
            <div className="flex justify-between items-center mb-4">
              <h1 id="contact-widget-title" className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Get In Touch
              </h1>
              <button onClick={onClose} aria-label="Close">
                <FiX className="h-5 w-5 text-gray-900 dark:text-gray-100" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSendEmail}>
              <div>
                <label
                  htmlFor="cw-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="cw-name"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label
                  htmlFor="cw-email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="cw-email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label
                  htmlFor="cw-message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="cw-message"
                  rows={4}
                  placeholder="What do you need help with?"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-violet-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
                {errors.msg && <p className="mt-1 text-xs text-red-500">{errors.msg}</p>}
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-4 py-2 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg text-white font-semibold"
              >
                Send Email
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
