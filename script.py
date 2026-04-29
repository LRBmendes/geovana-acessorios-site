import requests
import re
import json
import time
from bs4 import BeautifulSoup
import os

SUPABASE_URL = "https://kcydlzerrhezpcxkqonx.supabase.co"
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

BASE_URL = "https://catalogo.innosystem.com.br/atacadoaj_g2"

TOTAL_INSERIDOS = 0

for pagina in range(1, 19):

    url = f"{BASE_URL}?pagina={pagina}"
    print(f"\nLENDO PAGINA {pagina}")

    html = requests.get(url, timeout=30).text
    soup = BeautifulSoup(html, "html.parser")

    cards = soup.select("div.margem")

    print("Produtos encontrados:", len(cards))

    for card in cards:

        try:
            nome = ""
            preco = 0
            categoria = ""
            codigo = ""
            imagem = ""

            n = card.select_one(".tnom")
            if n:
                nome = n.get_text(" ", strip=True)

            p = card.select_one(".tprc")
            if p:
                txt = p.get_text(" ", strip=True)
                txt = re.sub(r'[^0-9,\.]', '', txt)
                txt = txt.replace('.', '').replace(',', '.')
                preco = float(txt)

            c = card.select_one(".tcat")
            if c:
                categoria = c.get_text(" ", strip=True)

            m = re.search(r'c[oó]d\.?\s*(\d+)', card.get_text(" ", strip=True).lower())
            if m:
                codigo = m.group(1)

            img = card.select_one("img")
            if img:
                imagem = img.get("src", "")
                if imagem.startswith("/"):
                    imagem = "https://catalogo.innosystem.com.br" + imagem

            if not nome:
                continue

            preco_venda = round(preco * 2.2, 2)

            payload = {
                "nome": nome,
                "codigo": codigo,
                "categoria": categoria,
                "preco_custo": preco,
                "preco_venda": preco_venda,
                "imagem_url": imagem,
                "produto_url": url,
                "ativo": True
            }

            r = requests.post(
                SUPABASE_URL + "/rest/v1/produtos",
                headers=HEADERS,
                data=json.dumps(payload),
                timeout=30
            )

            if r.status_code in [200, 201]:
                TOTAL_INSERIDOS += 1
                print("OK:", nome[:50])
            else:
                print("ERRO:", r.status_code, nome[:50])

        except Exception as e:
            print("FALHA:", e)

    time.sleep(1)

print("\nTOTAL INSERIDOS:", TOTAL_INSERIDOS)
