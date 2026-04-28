export const dynamic = "force-dynamic";

async function getProdutos() {
  try {
    const res = await fetch(
      "https://kcydlzerrhezpcxkqonx.supabase.co/rest/v1/produtos?select=*&ativo=eq.true&order=id.desc&limit=8",
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_KEY,
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const produtos = await getProdutos();

  return (
    <main>
      <h1>Geovana Acessórios</h1>
      <h2>Novidades</h2>

      {produtos.map((item) => (
        <div key={item.id}>
          <img src={item.imagem_url} width="200" />
          <p>{item.nome}</p>
          <p>R$ {item.preco_venda}</p>
        </div>
      ))}
    </main>
  );
}
