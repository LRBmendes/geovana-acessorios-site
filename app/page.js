export const revalidate = 60;

const VERSAO = "v1.0.8";

const SUPABASE_URL = "https://kcydlzerrhezpcxkqonx.supabase.co";

// ==========================
// BUSCAR PRODUTOS
// ==========================
async function getProdutos() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/produtos?select=*&ativo=eq.true&order=id.desc&limit=8`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    return [];
  }
}

// ==========================
// BUSCAR CONFIGURAÇÕES
// ==========================
async function getConfiguracoes() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/configuracoes?select=*`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return {};

    const data = await res.json();

    const config = {};

    data.forEach((item) => {
      config[item.chave] = item.valor;
    });

    return config;
  } catch (error) {
    return {};
  }
}

// ==========================
// HOME
// ==========================
export default async function Home() {
  const produtos = await getProdutos();
  const config = await getConfiguracoes();

  const markup = Number(config.markup_padrao) || 2.2;
  const frete = Number(config.frete_medio) || 0;
  const taxa = Number(config.taxa_extra) || 0;
  const arredondamento = Number(config.arredondamento) || 0.9;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f1e8",
        fontFamily: "Georgia, serif",
        color: "#5f5347",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px",
          background: "#fff",
        }}
      >
        <img
          src="/logo.jpeg"
          alt="Logo"
          style={{
            width: "90px",
            borderRadius: "8px",
          }}
        />

        <a
          href="https://wa.me/5567999481768"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#b79d7b",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: "30px",
            textDecoration: "none",
          }}
        >
          WhatsApp
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          padding: "50px 20px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            marginBottom: "10px",
          }}
        >
          Geovana Acessórios
        </h1>

        <p>Peças modernas e elegantes</p>

        <p
          style={{
            marginTop: "15px",
            fontSize: "14px",
            opacity: 0.7,
          }}
        >
          Versão do site: {VERSAO}
        </p>
      </section>

      {/* PRODUTOS */}
      <section style={{ padding: "20px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "38px",
          }}
        >
          Novidades
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {produtos.length > 0 ? (
            produtos.map((item) => {
              const precoBase = Number(item.preco_custo) || 0;

              let precoFinal =
                precoBase * markup + frete + taxa;

              precoFinal =
                Math.floor(precoFinal) + arredondamento;

              return (
                <div
                  key={item.id}
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    padding: "15px",
                    boxShadow: "0 10px 25px rgba(0,0,0,.05)",
                  }}
                >
                  <img
                    src={item.imagem_url}
                    alt={item.nome}
                    style={{
                      width: "100%",
                      height: "230px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />

                  <h3
                    style={{
                      fontSize: "16px",
                      minHeight: "50px",
                      marginTop: "10px",
                    }}
                  >
                    {item.nome}
                  </h3>

                  <p
                    style={{
                      fontWeight: "bold",
                      fontSize: "18px",
                      marginBottom: "15px",
                    }}
                  >
                    R$ {precoFinal.toFixed(2).replace(".", ",")}
                  </p>

                  <a
                    href={`https://wa.me/5567999481768?text=Olá,%20tenho%20interesse%20em:%20${encodeURIComponent(
                      item.nome
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "block",
                      background: "#5f5347",
                      color: "#fff",
                      padding: "12px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    Comprar no WhatsApp
                  </a>
                </div>
              );
            })
          ) : (
            <p
              style={{
                textAlign: "center",
                gridColumn: "1 / -1",
                fontSize: "18px",
              }}
            >
              Nenhum produto disponível no momento.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
