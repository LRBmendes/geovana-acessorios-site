import requests
import re
import json
import time
import os
from bs4 import BeautifulSoup

# =====================================================
# GEOVANA ACESSÓRIOS ROBÔ V2 PROFISSIONAL
# Fonte oficial:
# https://catalogo.innosystem.com.br/atacadoaj_g2
#
# MELHORIAS:
# ✅ UPSERT (não duplica)
# ✅ Mantém 18 páginas fixas
# ✅ Atualiza preço/imagem/categoria
# ✅ Preço psicológico final ,90
# ✅ Logs claros
# ✅ Retry simples
# ✅ Seguro para GitHub Actions
# =====================================================

SUPABASE_URL = "https://kcydlzerrhezpcxkqonx.supabase.co"
SUPABASE_KEY = os.environ["SUPABASE_KEY"]

BASE_URL = "https://catalogo.innosystem.com.br/atacadoaj_g2"
TOTAL_PAGINAS = 18

# =====================================================
# HEADERS SUPABASE
# =====================================================
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "resolution=merge-duplicates"
}

# =====================================================
# CONTADORES
# =====================================================
TOTAL_SUCESSO = 0
TOTAL_ERRO = 0
TOTAL_LIDOS = 0

# =====================================================
# HELPERS
# =====================================================
def limpar_numero(txt):
    txt = re.sub(r"[^0-9,\.]", "", txt)
    txt = txt.replace(".", "").replace(",", ".")
    try:
        return float(txt)
    except:
        return 0


def preco_psicologico(valor):
    """
    Ex:
    61.38 -> 61.90
    87.00 -> 87.90
    """
    if valor <= 0:
        return 0

    inteiro = int(valor)
    return float(f"{inteiro}.90")


def preco_venda(custo):
    bruto = custo * 2.2
    return preco_psicologico(bruto)


def request_html(url, tentativas=3):
    for tentativa in range(tentativas):
        try:
            r = requests.get(url, timeout=30)
            r.raise_for_status()
            return r.text
        except Exception as e:
            print(f"Tentativa {tentativa+1} falhou: {e}")
            time.sleep(2)

    return ""


def upsert_produto(payload):
    global TOTAL_SUCESSO, TOTAL_ERRO

    try:
        r = requests.post(
            f"{SUPABASE_URL}/rest/v1/produtos?on_conflict=codigo",
            headers=HEADERS,
            data=json.dumps(payload),
            timeout=30
        )

        if r.status_code in [200, 201]:
            TOTAL_SUCESSO += 1
            return True
        else:
            TOTAL_ERRO += 1
            print("ERRO:", r.status_code, r.text[:300])
            return False

    except Exception as e:
        TOTAL_ERRO += 1
        print("ERRO REQUEST:", e)
        return False


# =====================================================
# LOOP PRINCIPAL
# =====================================================
print("====================================")
print("ROBÔ GEOVANA ACESSÓRIOS V2 INICIADO")
print("====================================")

for pagina in range(1, TOTAL_PAGINAS + 1):

    url = f"{BASE_URL}?pagina={pagina}"

    print("\n------------------------------------")
    print(f"LENDO PÁGINA {pagina}/{TOTAL_PAGINAS}")
    print("------------------------------------")

    html = request_html(url)

    if not html:
        print("Página vazia / erro.")
        continue

    soup = BeautifulSoup(html, "html.parser")
    cards = soup.select("div.margem")

    print("Produtos encontrados:", len(cards))

    if len(cards) == 0:
        continue

    for card in cards:

        try:
            nome = ""
            preco = 0
            categoria = ""
            codigo = ""
            imagem = ""

            # Nome
            n = card.select_one(".tnom")
            if n:
                nome = n.get_text(" ", strip=True)

            if not nome:
                continue

            # Preço
            p = card.select_one(".tprc")
            if p:
                preco = limpar_numero(
                    p.get_text(" ", strip=True)
                )

            # Categoria
            c = card.select_one(".tcat")
            if c:
                categoria = c.get_text(" ", strip=True)

            # Código
            texto_total = card.get_text(" ", strip=True)

            m = re.search(
                r'c[oó]d\.?\s*(\d+)',
                texto_total.lower()
            )

            if m:
                codigo = m.group(1)

            if not codigo:
                continue

            # Imagem
            img = card.select_one("img")

            if img:
                imagem = img.get("src", "").strip()

                if imagem.startswith("/"):
                    imagem = "https://catalogo.innosystem.com.br" + imagem

            venda = preco_venda(preco)

            payload = {
                "nome": nome,
                "codigo": codigo,
                "categoria": categoria,
                "preco_custo": preco,
                "preco_venda": venda,
                "imagem_url": imagem,
                "produto_url": url,
                "ativo": True
            }

            ok = upsert_produto(payload)

            if ok:
                TOTAL_LIDOS += 1
                print(f"OK {codigo} - {nome[:55]}")

        except Exception as e:
            TOTAL_ERRO += 1
            print("FALHA CARD:", e)

    time.sleep(1)

# =====================================================
# FINAL
# =====================================================
print("\n====================================")
print("ROBÔ FINALIZADO")
print("====================================")
print("Produtos processados:", TOTAL_LIDOS)
print("Sucesso:", TOTAL_SUCESSO)
print("Erros:", TOTAL_ERRO)
print("====================================")
