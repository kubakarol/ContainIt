"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";

export default function RootLayout({ children }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="pl">
      <head>
        <title>ContainIt</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
