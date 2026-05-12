export const metadata = {
  title: "Geovana Acessórios | Semijoias e peças femininas premium",
  description:
    "Loja online de acessórios femininos, prata e semijoias premium com peças selecionadas, garantia e atendimento personalizado pelo WhatsApp.",
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
}
