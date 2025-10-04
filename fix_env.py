from pathlib import Path
p = Path('.env')
if not p.exists():
    print(".env não encontrado")
    raise SystemExit(1)

lines = p.read_text().splitlines()
out = []
i = 0
while i < len(lines):
    line = lines[i]
    if line.startswith("VITE_SUPABASE_URL="):
        out.append(line)
        i += 1
        continue
    if line.startswith("VITE_SUPABASE_ANON_KEY="):
        # inicia a captura da chave
        key_rest = line.split("=", 1)[1]
        i += 1
        # junta todas as linhas seguintes até encontrar outra VITE_ ou EOF
        while i < len(lines) and not lines[i].startswith("VITE_"):
            part = lines[i]
            # remove espaços laterais e barras backslash literais
            part = part.strip().replace("\\", "")
            key_rest += part
            i += 1
        # remove espaços/residuos e quebras em qualquer lugar
        key_clean = key_rest.replace("\n", "").replace("\r", "").replace(" ", "")
        out.append("VITE_SUPABASE_ANON_KEY=" + key_clean)
        continue
    # linhas quaisquer (preserva)
    out.append(line)
    i += 1

# escreve arquivo novo
Path('.env.fixed2').write_text("\n".join(out) + "\n")
print("Criei .env.fixed2 com a chave reconstruída.")
