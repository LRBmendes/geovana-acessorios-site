export const dynamic = "force-dynamic";

const VERSAO = "v1.0.6";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY;

// =======================
// Busca configurações
// =======================
async function getConfiguracoes() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/configuracoes?select=*`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    }
  );

  const data = await res.json();

  const config = {};

  data.forEach((item) => {
    config[item.chave] = item.valor;
  });

  return config;
}

// =======================
// Busca produtos
// =======================
async function getProdutos() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/produtos?select=*&ativo=eq.true&order=id.desc&limit=8`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
      cache: "no-store",
    }
  );

  return await res.json();
}

// =======================
// Preço vendedor
// =======================
function calcularPreco(custo, markup) {
  let valor = Number(custo) * Number(markup);

  // arredonda para xx,90
  valor = Math.ceil(valor);
  valor = valor - 0.10;

  return valor.toFixed(2);
}

// =======================
// Página
// =======================
export default async function Home() {
  const produtos = await getProdutos();
  const config = await getConfiguracoes();

 const markup = Number(config.markup_padrao) || 2.7;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f7f1e8",
        fontFamily: "Georgia, serif",
        color: "#5f5347",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          background: "#fff",
        }}
      >
        <img
          src="/logo.jpeg"
          alt="Logo"
          style={{ width: "90px", borderRadius: "8px" }}
        />

        <a
          href="https://wa.me/5567999481768"
          target="_blank"
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

      <section style={{ padding: "50px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "52px", marginBottom: "10px" }}>
          Geovana Acessórios
        </h1>

        <p>Peças modernas e elegantes</p>

        <p style={{ marginTop: "10px", opacity: 0.7 }}>
          Versão do site: {VERSAO}
        </p>
      </section>

      <section style={{ padding: "20px" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "42px",
          }}
        >
          Novidades
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {produtos.map((item) => {
            const precoFinal = calcularPreco(
              item.preco_custo,
              markup
            );

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
                    height: "250px",
                    objectFit: "cover",
                    borderRadius: "12px",
                  }}
                />

                <h3
                  style={{
                    fontSize: "18px",
                    marginTop: "12px",
                    minHeight: "55px",
                  }}
                >
                  {item.nome}
                </h3>

                <p
                  style={{
                    fontSize: "28px",
                    fontWeight: "bold",
                    marginBottom: "15px",
                  }}
                >
                  R$ {precoFinal.replace(".", ",")}
                </p>

                <a
                  href={`https://wa.me/5567999481768?text=Olá,%20tenho%20interesse%20em:%20${encodeURIComponent(
                    item.nome
                  )}`}
                  target="_blank"
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
          })}
        </div>
      </section>
    </main>
  );
}
