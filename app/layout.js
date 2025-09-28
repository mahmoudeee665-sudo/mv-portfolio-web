import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

// app/layout.js
export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-neutral-950 text-neutral-100 antialiased"
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
