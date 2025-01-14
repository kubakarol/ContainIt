// app/layout.js
import "bootstrap/dist/css/bootstrap.min.css";

export default function RootLayout({ children }) {
    return (
      <html lang="pl">
        <head>
          <title>ContainIt</title>
        </head>
        <body>
          {children}
        </body>
      </html>
    );
  }
  