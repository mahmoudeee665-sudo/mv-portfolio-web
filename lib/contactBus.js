export const CONTACT_EVENT = "open-contact-widget";

export function openContactWidget(detail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONTACT_EVENT, { detail }));
}
