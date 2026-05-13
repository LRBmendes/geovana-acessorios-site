export const metadata = {
  metadataBase: new URL("https://geovana-acessorios-site.vercel.app"),
  title: "Geovana Semi Joias | Boutique feminina premium",
  description:
    "Semi joias femininas premium com curadoria elegante, acabamento sofisticado e atendimento personalizado pelo WhatsApp.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/geovana-gv-mark.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
  openGraph: {
    title: "Geovana Semi Joias",
    description: "Boutique premium de semi joias femininas com curadoria elegante.",
    url: "https://geovana-acessorios-site.vercel.app",
    siteName: "Geovana Semi Joias",
    images: [
      {
        url: "/og-geovana-gv.png",
        width: 1200,
        height: 630,
        alt: "Logo GV dourada da Geovana Semi Joias",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geovana Semi Joias",
    description: "Semi joias femininas premium com curadoria elegante.",
    images: ["/og-geovana-gv.png"],
  },
};

export const viewport = {
  themeColor: "#d5c1a4",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#faf7f1",
          color: "#46372d",
          fontFamily:
            "'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
