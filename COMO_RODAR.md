# Era X - Rodando com banco local

Este projeto agora pode rodar com um backend local em Python e banco SQLite.

## Iniciar

No terminal do VS Code, dentro da pasta do projeto:

```powershell
python server.py
```

Se a porta 5500 já estiver ocupada:

```powershell
$env:PORT="5501"; python server.py
```

Abra:

```text
http://localhost:5500
```

ou, se usou 5501:

```text
http://localhost:5501
```

## Conta inicial

Usuário:

```text
admin
```

Senha:

```text
EraX-Admin-2026!
```

Essa conta é a primeira administradora. Ela pode criar outras contas pelo painel `admin.html`.

## Banco

O banco é criado automaticamente na primeira execução:

```text
era_x.db
```

Ele guarda:

- usuários
- sessões
- personagens/NPCs/criaturas

## Extensões úteis no VS Code

Recomendadas:

- SQLite Viewer, de Florian Klampfer
- SQLite, de alexcvzz
- Python, da Microsoft

Com elas, você consegue abrir o `era_x.db` direto no VS Code para visualizar tabelas.
