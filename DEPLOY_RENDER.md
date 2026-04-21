# Deploy no Render Free

Este projeto ja esta preparado para subir como um Web Service Python no Render.

## Arquivos importantes

- `server.py`: servidor Python que entrega o site, APIs, login e SQLite.
- `render.yaml`: blueprint opcional do Render.
- `requirements.txt`: lista de dependencias. Hoje o projeto usa apenas biblioteca padrao.
- `.gitignore`: evita subir banco local, logs e cache.

## Passo a passo rapido

1. Suba a pasta do projeto para um repositorio no GitHub.
2. No Render, crie um novo **Web Service** usando esse repositorio.
3. Use o plano **Free**.
4. Configure:

```text
Build Command: pip install -r requirements.txt
Start Command: python server.py
Health Check Path: /healthz
```

5. Em **Environment Variables**, defina:

```text
ADMIN_USERNAME=admin
ADMIN_PASSWORD=coloque-uma-senha-forte-aqui
```

O Render tambem define `PORT` automaticamente. O `server.py` ja usa essa porta.

## Aviso importante sobre Render Free

O Render Free pode dormir apos um periodo sem acessos. A primeira abertura depois disso pode demorar um pouco.

Tambem existe uma limitacao importante: no plano gratuito, o banco SQLite local (`era_x.db`) nao deve ser tratado como armazenamento permanente confiavel. Ele funciona para teste e demonstracao, mas alteracoes feitas pelo painel podem ser perdidas em reinicios ou redeploys.

Para usar o painel admin de forma permanente no futuro, o melhor proximo passo e migrar o banco para Supabase/Postgres ou usar um plano com armazenamento persistente.

## Banco

Se nenhum banco existir no ambiente, o servidor cria automaticamente:

- usuario admin inicial
- sessoes
- personagens
- tags
- vinculos entre personagens e tags

As credenciais iniciais vem de `ADMIN_USERNAME` e `ADMIN_PASSWORD`.
