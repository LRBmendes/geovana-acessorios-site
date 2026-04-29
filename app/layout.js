// app/layout.js

export const metadata = {
  title: "Geovana Acessórios | Elegância que encanta",
  description:
    "Loja online de acessórios femininos premium. Prata, semijoias e peças selecionadas com atendimento via WhatsApp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#f8f5f1",
          color: "#4e3d31",
          fontFamily: "Georgia, serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
