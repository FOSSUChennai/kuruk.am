import type React from "react"
import type { Viewport } from "next"
import { Bricolage_Grotesque } from "next/font/google"
import { Providers } from "@/context"
import { MeshGradientComponent } from "@/components/mesh-gradient"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import Script from "next/script"

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage-grotesque",
  subsets: ["latin"],
  preload: true,
})

export const dynamic = "force-static"
export const revalidate = 30

export const viewport: Viewport = {
  maximumScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      <link rel="icon" href="/favicon.ico" />
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="45028187-b981-47d2-9c78-73970e653e4a"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${bricolageGrotesque.className} antialiased max-w-screen min-h-svh bg-slate-1 text-slate-12`}>
        <Providers defaultTheme="system">
          <MeshGradientComponent
            colors={[
              "#06B051", // Green
              "#FFFFFF", // White
              "#000000", // Black
              "#FFFFFF", // White
            ]}
            speed={1.5}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 0,
              width: "100%",
              height: "100%",
            }}
          />
          <div className="max-w-screen-sm mx-auto w-full relative z-[1] flex flex-col min-h-screen">
            <div className="px-5 gap-8 flex flex-col flex-1">
              <main className="flex justify-center">{children}</main>
            </div>
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

export const metadata = {
  title: "kuruk.am - URL Shortener",
  description: "Transform your long URLs into clean, shareable links",
}
