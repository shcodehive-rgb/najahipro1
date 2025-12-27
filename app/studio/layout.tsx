import type React from "react"

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="m-0 p-0 antialiased">
        {children}
      </body>
    </html>
  )
}