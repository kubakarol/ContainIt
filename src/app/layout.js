// app/layout.js

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
  