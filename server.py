from __future__ import annotations

import hashlib
import hmac
import json
import mimetypes
import os
import secrets
import sqlite3
import time
import urllib.parse
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DB_PATH = Path(os.environ.get("DB_PATH", ROOT / "era_x.db")).resolve()
SESSION_SECONDS = 60 * 60 * 12
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "EraX-Admin-2026!")


SEED_CHARACTERS = [
    {
        "slug": "curupira",
        "name": "Curupira",
        "title": "Guardião dos caminhos trocados",
        "type": "entidade",
        "region": "Mata dos Caminhos Trocados",
        "tag": "mata, proteção, rastros",
        "desc": "Guardião que pune invasores da floresta e dobra trilhas contra quem caça por crueldade.",
        "historia": "Na Era X, o Curupira vigia territórios onde pactos antigos foram quebrados. Suas pegadas invertidas indicam que uma trilha deixou de obedecer à lógica comum.",
        "poderes": "Rastro Invertido, Fúria da Mata e Labirinto Vivo. Ótimo para proles de perseguição, proteção e controle de terreno.",
        "curiosidades": "Pode ser mentor, antagonista ou juiz espiritual para personagens ligados à floresta.",
        "image": "imagens/curupira.jpg",
        "color": "#e3a331",
    },
    {
        "slug": "caipora",
        "name": "Caipora",
        "title": "Protetora da caça e dos bichos",
        "type": "entidade",
        "region": "Serra da Caça Antiga",
        "tag": "animais, acordo, caça",
        "desc": "Encantada que cobra respeito de caçadores e protege criaturas perseguidas sem necessidade.",
        "historia": "A Caipora aparece quando uma caçada deixa de ser necessidade e vira vaidade. Quem negocia com respeito pode receber passagem segura.",
        "poderes": "Chamado animal, sabotagem de armas, leitura de intenção predatória e bênçãos de sobrevivência.",
        "curiosidades": "Funciona como patrona de proles ligadas a rastreamento, montaria e proteção animal.",
        "image": "imagens/caipora v2.jpg",
        "color": "#70b96f",
    },
    {
        "slug": "anhanga",
        "name": "Anhangá",
        "title": "Sombra da discórdia",
        "type": "entidade",
        "region": "Brejo de Anhangá",
        "tag": "medo, culpa, pacto",
        "desc": "Força sombria que se alimenta de medo, inveja e promessas feitas em desespero.",
        "historia": "Anhangá viu a aproximação entre entidades e humanos como profanação. Desde então, tenta transformar fragilidade em domínio.",
        "poderes": "Olhar de Culpa, Chifre de Presságio e Pacto de Breu. Poder forte, cobrança forte.",
        "curiosidades": "É uma ameaça central para campanhas sombrias, políticas ou de corrupção espiritual.",
        "image": "imagens/anhanga.jpg",
        "color": "#d75b4b",
    },
    {
        "slug": "boitata",
        "name": "Boitatá",
        "title": "Fogo que vigia a mata",
        "type": "criatura",
        "region": "Veredas Incendiadas",
        "tag": "fogo, luz, punição",
        "desc": "Ser flamejante que protege campos e florestas contra destruição sem propósito.",
        "historia": "O Boitatá surge como luz impossível no escuro, cegando invasores e queimando marcas de profanação.",
        "poderes": "Luz viva, fogo protetor, cegueira espiritual e rastreamento de destruição recente.",
        "curiosidades": "Serve bem como chefe de evento, guardião territorial ou criatura de julgamento.",
        "image": "imagens/boitata.jpg",
        "color": "#ff9c33",
    },
    {
        "slug": "matinta-pereira",
        "name": "Matinta Pereira",
        "title": "A velha do assobio",
        "type": "entidade",
        "region": "Vilas de Janela Fechada",
        "tag": "assobio, promessa, noite",
        "desc": "Assombração que anuncia presença pelo assobio e cobra promessas feitas à meia-noite.",
        "historia": "Quem promete tabaco, café ou favor para calar o assobio precisa pagar. Na Era X, a Matinta coleciona dívidas herdadas.",
        "poderes": "Assobio distante, maldição de promessa, invisibilidade noturna e cobrança espiritual.",
        "curiosidades": "Boa para mistério, dívida familiar e eventos em vila pequena.",
        "image": "imagens/matinta perera.jpg",
        "color": "#a879d6",
    },
    {
        "slug": "corpo-seco",
        "name": "Corpo-Seco",
        "title": "Maldição que a terra recusou",
        "type": "criatura",
        "region": "Cemitério do Chão Amargo",
        "tag": "morto-vivo, maldição, culpa",
        "desc": "Cadáver amaldiçoado que nem a terra aceita, movido por rancor e dívida moral.",
        "historia": "O Corpo-Seco surge quando alguém foi tão cruel em vida que o próprio chão rejeitou seu descanso.",
        "poderes": "Resistência a dor, toque de apodrecimento, medo em área fechada e retorno persistente.",
        "curiosidades": "Funciona como inimigo recorrente, punição ancestral ou consequência de pacto quebrado.",
        "image": "imagens/corpo seco.jpg",
        "color": "#b0a07d",
    },
    {
        "slug": "mapinguari",
        "name": "Mapinguari",
        "title": "Predador da mata profunda",
        "type": "criatura",
        "region": "Fundão sem Trilha",
        "tag": "força, floresta, horror",
        "desc": "Criatura gigantesca da mata fechada, temida por força brutal e resistência anormal.",
        "historia": "O Mapinguari aparece quando a floresta decide que diálogo não basta mais.",
        "poderes": "Força colossal, couraça natural, rugido paralisante e rastreamento por cheiro.",
        "curiosidades": "Use como ameaça de alto nível ou punição por invasões repetidas.",
        "image": "imagens/mapiringua.jpg",
        "color": "#8ab66b",
    },
    {
        "slug": "aguia-mortalha",
        "name": "Águia Mortalha",
        "title": "Presságio de morte no alto",
        "type": "criatura",
        "region": "Penhascos do Mau Agouro",
        "tag": "presságio, céu, morte",
        "desc": "Ave de mau agouro que aparece antes de tragédias e marca alvos para espíritos famintos.",
        "historia": "Alguns dizem que ela não causa a morte, apenas reconhece quem já foi prometido a ela.",
        "poderes": "Visão de presságio, rasante de pânico, marca espiritual e voo silencioso.",
        "curiosidades": "Ótima para anunciar eventos, caçadas e consequências de escolhas ruins.",
        "image": "imagens/águia mortalha.jpg",
        "color": "#d8d2bd",
    },
    {
        "slug": "onca-encantada",
        "name": "Onça Encantada",
        "title": "Caçadora da noite antiga",
        "type": "criatura",
        "region": "Mata de Olhos Dourados",
        "tag": "caça, força, silêncio",
        "desc": "Predadora espiritual que caça invasores e testa coragem de proles recém-despertas.",
        "historia": "Quando a Onça Encantada ruge, a mata inteira prende a respiração.",
        "poderes": "Furtividade absoluta, salto brutal, faro espiritual e domínio de território.",
        "curiosidades": "Use a imagem tigre como placeholder até você trazer uma onça própria.",
        "image": "imagens/tigre.jpg",
        "color": "#e0a64b",
    },
    {
        "slug": "brasil-fantastico",
        "name": "Brasil Fantástico",
        "title": "Região viva de lendas cruzadas",
        "type": "prole",
        "region": "Mapa Oculto",
        "tag": "cenário, travessia, mito",
        "desc": "Núcleo narrativo para reunir lendas regionais, portais, vilas ocultas e encontros entre proles.",
        "historia": "Não é uma criatura só: é o Brasil invisível que aparece quando a campanha precisa atravessar fronteiras míticas.",
        "poderes": "Use como ficha de cenário: eventos, clima espiritual, favores regionais e efeitos de território.",
        "curiosidades": "A imagem fantástico brasil pode virar capa de seção, mapa ou entidade coletiva.",
        "image": "imagens/fantástico brasil.jpg",
        "color": "#64c7a5",
    },
]


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    iterations = 210_000
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, iterations)
    return f"pbkdf2_sha256${iterations}${salt.hex()}${digest.hex()}"


def verify_password(password: str, stored: str) -> bool:
    try:
      algorithm, iterations, salt_hex, digest_hex = stored.split("$", 3)
      if algorithm != "pbkdf2_sha256":
          return False
      digest = hashlib.pbkdf2_hmac(
          "sha256",
          password.encode("utf-8"),
          bytes.fromhex(salt_hex),
          int(iterations),
      )
      return hmac.compare_digest(digest.hex(), digest_hex)
    except ValueError:
      return False


def init_db() -> None:
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT NOT NULL UNIQUE,
              password_hash TEXT NOT NULL,
              role TEXT NOT NULL CHECK(role IN ('admin', 'editor')),
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sessions (
              token TEXT PRIMARY KEY,
              user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              expires_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS characters (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              slug TEXT UNIQUE,
              name TEXT NOT NULL,
              title TEXT DEFAULT '',
              type TEXT NOT NULL DEFAULT 'entidade',
              region TEXT DEFAULT '',
              tag TEXT DEFAULT '',
              desc TEXT DEFAULT '',
              historia TEXT DEFAULT '',
              poderes TEXT DEFAULT '',
              curiosidades TEXT DEFAULT '',
              image TEXT DEFAULT '',
              color TEXT DEFAULT '#e3a331',
              seed INTEGER NOT NULL DEFAULT 0,
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS tags (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL UNIQUE,
              color TEXT NOT NULL DEFAULT '#e3a331',
              created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS character_tags (
              character_id INTEGER NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
              tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
              PRIMARY KEY (character_id, tag_id)
            );
            """
        )

        user_count = conn.execute("SELECT COUNT(*) AS total FROM users").fetchone()["total"]
        if user_count == 0:
            conn.execute(
                "INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'admin')",
                (ADMIN_USERNAME, hash_password(ADMIN_PASSWORD)),
            )

        for character in SEED_CHARACTERS:
            conn.execute(
                """
                INSERT OR IGNORE INTO characters
                (slug, name, title, type, region, tag, desc, historia, poderes, curiosidades, image, color, seed)
                VALUES
                (:slug, :name, :title, :type, :region, :tag, :desc, :historia, :poderes, :curiosidades, :image, :color, 1)
                """,
                character,
            )

        rows = conn.execute("SELECT id, tag FROM characters WHERE tag != ''").fetchall()
        for row in rows:
            for tag_name in split_tags(row["tag"]):
                tag_id = ensure_tag(conn, tag_name)
                conn.execute(
                    "INSERT OR IGNORE INTO character_tags (character_id, tag_id) VALUES (?, ?)",
                    (row["id"], tag_id),
                )


def json_response(handler: BaseHTTPRequestHandler, status: int, payload: dict | list, extra_headers=None) -> None:
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    handler.send_response(status)
    handler.send_header("Content-Type", "application/json; charset=utf-8")
    handler.send_header("Content-Length", str(len(body)))
    if extra_headers:
        for key, value in extra_headers.items():
            handler.send_header(key, value)
    handler.end_headers()
    handler.wfile.write(body)


def read_json(handler: BaseHTTPRequestHandler) -> dict:
    length = int(handler.headers.get("Content-Length", "0"))
    if length <= 0:
        return {}
    raw = handler.rfile.read(length)
    return json.loads(raw.decode("utf-8"))


def row_to_character(row: sqlite3.Row) -> dict:
    data = dict(row)
    data["seed"] = bool(data.get("seed"))
    return data


def split_tags(raw: str) -> list[str]:
    tags = []
    for item in (raw or "").replace(";", ",").split(","):
        name = item.strip()
        if name and name.lower() not in [tag.lower() for tag in tags]:
            tags.append(name)
    return tags


def ensure_tag(conn: sqlite3.Connection, name: str, color: str = "#e3a331") -> int:
    conn.execute(
        "INSERT OR IGNORE INTO tags (name, color) VALUES (?, ?)",
        (name.strip(), color or "#e3a331"),
    )
    row = conn.execute("SELECT id FROM tags WHERE lower(name) = lower(?)", (name.strip(),)).fetchone()
    return int(row["id"])


class EraXHandler(BaseHTTPRequestHandler):
    server_version = "EraXLocal/1.0"

    def do_GET(self) -> None:
        path = urllib.parse.urlparse(self.path).path
        if path == "/healthz":
            return json_response(self, 200, {"ok": True})
        if path == "/api/me":
            return self.api_me()
        if path == "/api/users":
            return self.api_users()
        if path == "/api/characters":
            return self.api_characters()
        if path == "/api/tags":
            return self.api_tags()
        if path == "/api/assets":
            return self.api_assets()
        return self.serve_static(path)

    def do_POST(self) -> None:
        path = urllib.parse.urlparse(self.path).path
        if path == "/api/login":
            return self.api_login()
        if path == "/api/logout":
            return self.api_logout()
        if path == "/api/users":
            return self.api_create_user()
        if path == "/api/characters":
            return self.api_create_character()
        if path == "/api/tags":
            return self.api_create_tag()
        if path.startswith("/api/characters/") and path.endswith("/tags"):
            parts = path.strip("/").split("/")
            if len(parts) == 4:
                return self.api_set_character_tags(parts[2])
        return json_response(self, 404, {"error": "Rota não encontrada."})

    def do_DELETE(self) -> None:
        path = urllib.parse.urlparse(self.path).path
        if path.startswith("/api/characters/"):
            return self.api_delete_character(path.rsplit("/", 1)[-1])
        if path.startswith("/api/tags/"):
            return self.api_delete_tag(path.rsplit("/", 1)[-1])
        return json_response(self, 404, {"error": "Rota não encontrada."})

    def current_user(self) -> dict | None:
        raw_cookie = self.headers.get("Cookie", "")
        jar = cookies.SimpleCookie(raw_cookie)
        token = jar.get("era_x_session")
        if not token:
            return None

        now = int(time.time())
        with connect() as conn:
            row = conn.execute(
                """
                SELECT users.id, users.username, users.role
                FROM sessions
                JOIN users ON users.id = sessions.user_id
                WHERE sessions.token = ? AND sessions.expires_at > ?
                """,
                (token.value, now),
            ).fetchone()
        return dict(row) if row else None

    def require_user(self, roles=("admin", "editor")) -> dict | None:
        user = self.current_user()
        if not user:
            json_response(self, 401, {"error": "Faça login para continuar."})
            return None
        if user["role"] not in roles:
            json_response(self, 403, {"error": "Seu cargo não permite esta ação."})
            return None
        return user

    def api_me(self) -> None:
        json_response(self, 200, {"user": self.current_user()})

    def api_login(self) -> None:
        data = read_json(self)
        username = str(data.get("username", "")).strip()
        password = str(data.get("password", ""))

        with connect() as conn:
            user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
            if not user or not verify_password(password, user["password_hash"]):
                return json_response(self, 401, {"error": "Usuário ou senha inválidos."})

            token = secrets.token_urlsafe(32)
            expires_at = int(time.time()) + SESSION_SECONDS
            conn.execute(
                "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)",
                (token, user["id"], expires_at),
            )

        cookie = f"era_x_session={token}; HttpOnly; SameSite=Lax; Path=/; Max-Age={SESSION_SECONDS}"
        json_response(
            self,
            200,
            {"user": {"id": user["id"], "username": user["username"], "role": user["role"]}},
            {"Set-Cookie": cookie},
        )

    def api_logout(self) -> None:
        raw_cookie = self.headers.get("Cookie", "")
        jar = cookies.SimpleCookie(raw_cookie)
        token = jar.get("era_x_session")
        if token:
            with connect() as conn:
                conn.execute("DELETE FROM sessions WHERE token = ?", (token.value,))
        json_response(
            self,
            200,
            {"ok": True},
            {"Set-Cookie": "era_x_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"},
        )

    def api_users(self) -> None:
        if not self.require_user(("admin",)):
            return
        with connect() as conn:
            rows = conn.execute("SELECT id, username, role, created_at FROM users ORDER BY created_at DESC").fetchall()
        json_response(self, 200, {"users": [dict(row) for row in rows]})

    def api_create_user(self) -> None:
        if not self.require_user(("admin",)):
            return
        data = read_json(self)
        username = str(data.get("username", "")).strip()
        password = str(data.get("password", ""))
        role = str(data.get("role", "editor")).strip()

        if role not in ("admin", "editor"):
            return json_response(self, 400, {"error": "Cargo inválido."})
        if len(username) < 3 or len(password) < 8:
            return json_response(self, 400, {"error": "Usuário precisa de 3 letras e senha de 8 caracteres."})

        try:
            with connect() as conn:
                conn.execute(
                    "INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
                    (username, hash_password(password), role),
                )
        except sqlite3.IntegrityError:
            return json_response(self, 409, {"error": "Já existe uma conta com esse usuário."})

        json_response(self, 201, {"ok": True})

    def api_characters(self) -> None:
        with connect() as conn:
            rows = conn.execute(
                """
                SELECT
                  characters.*,
                  COALESCE(GROUP_CONCAT(tags.name, ', '), characters.tag) AS tag
                FROM characters
                LEFT JOIN character_tags ON character_tags.character_id = characters.id
                LEFT JOIN tags ON tags.id = character_tags.tag_id
                GROUP BY characters.id
                ORDER BY characters.seed DESC, characters.name ASC
                """
            ).fetchall()
        json_response(self, 200, {"characters": [row_to_character(row) for row in rows]})

    def api_tags(self) -> None:
        with connect() as conn:
            rows = conn.execute(
                """
                SELECT tags.id, tags.name, tags.color, COUNT(character_tags.character_id) AS uses
                FROM tags
                LEFT JOIN character_tags ON character_tags.tag_id = tags.id
                GROUP BY tags.id
                ORDER BY tags.name COLLATE NOCASE
                """
            ).fetchall()
        json_response(self, 200, {"tags": [dict(row) for row in rows]})

    def api_create_tag(self) -> None:
        if not self.require_user(("admin", "editor")):
            return
        data = read_json(self)
        name = str(data.get("name", "")).strip()
        color = str(data.get("color", "#e3a331")).strip() or "#e3a331"
        if len(name) < 2:
            return json_response(self, 400, {"error": "A tag precisa ter pelo menos 2 caracteres."})
        try:
            with connect() as conn:
                ensure_tag(conn, name, color)
        except sqlite3.IntegrityError:
            return json_response(self, 409, {"error": "Essa tag já existe."})
        json_response(self, 201, {"ok": True})

    def api_set_character_tags(self, raw_id: str) -> None:
        if not self.require_user(("admin", "editor")):
            return
        try:
            character_id = int(raw_id)
        except ValueError:
            return json_response(self, 400, {"error": "ID de personagem inválido."})
        data = read_json(self)
        tag_ids = data.get("tagIds", [])
        if not isinstance(tag_ids, list):
            return json_response(self, 400, {"error": "Envie uma lista de tags."})

        clean_ids = []
        for tag_id in tag_ids:
            try:
                clean_ids.append(int(tag_id))
            except (TypeError, ValueError):
                return json_response(self, 400, {"error": "Uma das tags é inválida."})

        with connect() as conn:
            exists = conn.execute("SELECT id FROM characters WHERE id = ?", (character_id,)).fetchone()
            if not exists:
                return json_response(self, 404, {"error": "Personagem não encontrado."})
            valid_rows = conn.execute(
                f"SELECT id, name FROM tags WHERE id IN ({','.join('?' for _ in clean_ids)})" if clean_ids else "SELECT id, name FROM tags WHERE 0",
                clean_ids,
            ).fetchall()
            valid_ids = [int(row["id"]) for row in valid_rows]
            tag_names = [row["name"] for row in valid_rows]
            conn.execute("DELETE FROM character_tags WHERE character_id = ?", (character_id,))
            for tag_id in valid_ids:
                conn.execute(
                    "INSERT INTO character_tags (character_id, tag_id) VALUES (?, ?)",
                    (character_id, tag_id),
                )
            conn.execute("UPDATE characters SET tag = ? WHERE id = ?", (", ".join(tag_names), character_id))
        json_response(self, 200, {"ok": True})

    def api_delete_tag(self, raw_id: str) -> None:
        if not self.require_user(("admin",)):
            return
        try:
            tag_id = int(raw_id)
        except ValueError:
            return json_response(self, 400, {"error": "ID de tag inválido."})
        with connect() as conn:
            conn.execute("DELETE FROM character_tags WHERE tag_id = ?", (tag_id,))
            conn.execute("DELETE FROM tags WHERE id = ?", (tag_id,))
            rows = conn.execute("SELECT id FROM characters").fetchall()
            for row in rows:
                tag_rows = conn.execute(
                    """
                    SELECT tags.name
                    FROM tags
                    JOIN character_tags ON character_tags.tag_id = tags.id
                    WHERE character_tags.character_id = ?
                    ORDER BY tags.name COLLATE NOCASE
                    """,
                    (row["id"],),
                ).fetchall()
                conn.execute(
                    "UPDATE characters SET tag = ? WHERE id = ?",
                    (", ".join(tag["name"] for tag in tag_rows), row["id"]),
                )
        json_response(self, 200, {"ok": True})

    def api_create_character(self) -> None:
        if not self.require_user(("admin", "editor")):
            return
        data = read_json(self)
        name = str(data.get("name", "")).strip()
        desc = str(data.get("desc", "")).strip()
        if not name or not desc:
            return json_response(self, 400, {"error": "Preencha nome e descrição."})

        payload = {
            "slug": f"custom-{secrets.token_hex(6)}",
            "name": name,
            "title": str(data.get("title", "")).strip(),
            "type": str(data.get("type", "entidade")).strip() or "entidade",
            "region": str(data.get("region", "")).strip(),
            "tag": str(data.get("tag", "")).strip(),
            "desc": desc,
            "historia": str(data.get("historia", "")).strip(),
            "poderes": str(data.get("poderes", "")).strip(),
            "curiosidades": str(data.get("curiosidades", "")).strip(),
            "image": str(data.get("image", "")).strip(),
            "color": str(data.get("color", "#e3a331")).strip() or "#e3a331",
        }
        with connect() as conn:
            cursor = conn.execute(
                """
                INSERT INTO characters
                (slug, name, title, type, region, tag, desc, historia, poderes, curiosidades, image, color)
                VALUES
                (:slug, :name, :title, :type, :region, :tag, :desc, :historia, :poderes, :curiosidades, :image, :color)
                """,
                payload,
            )
            character_id = cursor.lastrowid
            for tag_name in split_tags(payload["tag"]):
                tag_id = ensure_tag(conn, tag_name)
                conn.execute(
                    "INSERT OR IGNORE INTO character_tags (character_id, tag_id) VALUES (?, ?)",
                    (character_id, tag_id),
                )
        json_response(self, 201, {"ok": True})

    def api_delete_character(self, raw_id: str) -> None:
        if not self.require_user(("admin", "editor")):
            return
        try:
            character_id = int(raw_id)
        except ValueError:
            return json_response(self, 400, {"error": "ID inválido."})
        with connect() as conn:
            conn.execute("DELETE FROM characters WHERE id = ?", (character_id,))
        json_response(self, 200, {"ok": True})

    def api_assets(self) -> None:
        image_dir = ROOT / "imagens"
        extensions = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
        assets = []
        if image_dir.exists():
            for path in sorted(image_dir.iterdir(), key=lambda item: item.name.lower()):
                if path.is_file() and path.suffix.lower() in extensions:
                    assets.append({"name": path.name, "path": f"imagens/{path.name}"})
        json_response(self, 200, {"assets": assets})

    def serve_static(self, raw_path: str) -> None:
        path = urllib.parse.unquote(raw_path)
        if path == "/":
            path = "/index.html"
        target = (ROOT / path.lstrip("/")).resolve()
        if not str(target).startswith(str(ROOT)) or not target.exists() or target.is_dir():
            self.send_error(404)
            return
        content_type = mimetypes.guess_type(str(target))[0] or "application/octet-stream"
        body = target.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    init_db()
    port = int(os.environ.get("PORT", "5500"))
    server = ThreadingHTTPServer(("", port), EraXHandler)
    print(f"Era X rodando na porta {port}")
    print(f"Admin inicial: {ADMIN_USERNAME} (senha definida por ADMIN_PASSWORD)")
    print(f"Banco SQLite: {DB_PATH}")
    server.serve_forever()


if __name__ == "__main__":
    main()
