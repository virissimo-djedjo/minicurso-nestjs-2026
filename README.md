# Minicurso NestJS 2026 (UDESC)

Uma rede social pequena feita em aula: cadastro, login com JWT, foto de perfil, endereço por CEP com cache e um feed com publicações e comentários. O back-end é NestJS 11 com Fastify e Postgres; o front-end é Vue 3, na pasta `client/`.

## O que precisa estar instalado

- **Node 22** (testado no 22.21.1 e no 22.22.1). Confira com `node -v`.
- **Git** com o **Git Bash** (no Windows, todos os comandos abaixo são no Git Bash).
- **PostgreSQL 14** com o **pgAdmin 4**.

Docker é opcional: só serve para subir o Redis e o MinIO do bloco extra (ver [Redis e MinIO](#redis-e-minio-opcional)).

## Primeira vez

### 1. Baixar o projeto e instalar as dependências

```bash
git clone <url-do-repositório>
cd minicurso-nestjs-2026
npm ci
npm ci --prefix client
```

Use `npm ci`, não `npm install`: ele instala exatamente as versões do `package-lock.json`, e todo mundo da sala fica com o mesmo código.

### 2. Criar o banco no pgAdmin

1. No pgAdmin, clique com o botão direito em **Databases** → **Create** → **Database...**, dê o nome `minicurso` e salve.
2. Selecione o banco `minicurso` e abra **Tools** → **Query Tool**.
3. Abra o arquivo `database/schema.sql` (ícone de pasta do Query Tool), e execute com **F5**.

As tabelas (`usuario`, `endereco`, `publicacao`, `comentario` e as outras) devem aparecer em **Schemas** → **public** → **Tables**.

### 3. Criar o `.env`

```bash
cp .env.example .env
```

Abra o `.env` e troque:

- `DB_PASSWORD` pela senha do seu Postgres;
- `JWT_SECRET` por um texto longo qualquer (é a chave que assina o token de login).

O resto já vem pronto para rodar sem Docker: imagens salvas na pasta `uploads/` (`STORAGE_PROVIDER=local`) e cache em memória (`CACHE_PROVIDER=memory`).

### 4. Subir

Em um terminal, a API (porta 3030):

```bash
npm run start:dev
```

Em outro terminal, o front-end (porta 5173, já encaminha as chamadas para a API):

```bash
npm run dev --prefix client
```

Abra http://localhost:5173. Para a API servir o front-end sozinha em http://localhost:3030, gere o build uma vez com `npm run build --prefix client`.

## Tags de cada bloco

Cada bloco da aula tem duas tags. Se você se perder ou quiser só acompanhar, pule direto para o código do ponto em que a aula está.

| Bloco | Assunto | Começo do bloco | Fim do bloco |
|---|---|---|---|
| 1 | Arquitetura e cadastro | `bloco-1` | `bloco-1-ao-vivo` |
| 2 | Login e guards | `bloco-2` | `bloco-2-ao-vivo` |
| 3 | Testes e desafio dos value objects | `bloco-3` | `bloco-3-ao-vivo` |
| 4 | Upload da foto de perfil | `bloco-4` | `bloco-4-ao-vivo` |
| 5 | ViaCEP e Cache-Aside | `bloco-5` | `bloco-5-ao-vivo` |
| 6 | Publicações e comentários | `bloco-6` | `bloco-6-ao-vivo` |
| | Projeto completo | | `final` |

Para ir até uma tag, guarde antes o que você fez numa branch sua (senão o git recusa a troca):

```bash
git switch -c meu-bloco-2
git add -A
git commit -m "minha versão do bloco 2"
```

E então crie uma branch a partir da tag:

```bash
git switch -c acompanhando-bloco-3 bloco-3
```

Se o `package.json` mudou entre as tags, rode `npm ci` (e `npm ci --prefix client`) de novo.

## Testando a API pelo Git Bash

```bash
curl -X POST localhost:3030/usuarios \
  -H 'content-type: application/json' \
  -d '{"nome":"Maria","sobrenome":"Teste","nomeUsuario":"maria.teste","email":"maria@exemplo.com","senha":"segredo123","cpf":"52998224725","dataNascimento":"2000-05-10","cep":"01001000"}'

TOKEN=$(curl -s -X POST localhost:3030/auth/login \
  -H 'content-type: application/json' \
  -d '{"email":"maria@exemplo.com","senha":"segredo123"}' | sed 's/.*"accessToken":"\([^"]*\)".*/\1/')

curl localhost:3030/usuarios/me -H "Authorization: Bearer $TOKEN"
curl localhost:3030/enderecos/88015100
curl -X POST localhost:3030/publicacoes -H "Authorization: Bearer $TOKEN" -F 'conteudo=Primeira publicação!'
curl 'localhost:3030/publicacoes?page=1&limit=20' -H "Authorization: Bearer $TOKEN"
```

## Testes

```bash
npx jest src/modules
```

## Redis e MinIO (opcional)

Quem tem Docker sobe o Postgres, o Redis e o MinIO com:

```bash
docker compose up -d
```

- **Redis:** troque para `CACHE_PROVIDER=redis` no `.env`. As chaves aparecem com `docker compose exec redis redis-cli keys 'endereco:*'`.
- **MinIO:** troque para `STORAGE_PROVIDER=s3`. No console (http://localhost:9001, usuário e senha do `.env`), crie o bucket `minicurso` e deixe o acesso como público para leitura.

Nada no código muda: o módulo escolhe o adapter pela variável de ambiente.

## Rotas

| Método | Rota | Precisa de login |
|---|---|---|
| `POST` | `/usuarios` | não |
| `POST` | `/auth/login` | não |
| `GET` | `/usuarios/me` | sim |
| `PUT` | `/usuarios/me/imagem-perfil` | sim |
| `GET` | `/usuarios/:nomeUsuario` | sim |
| `GET` | `/enderecos/:cep` | não |
| `POST` | `/publicacoes` | sim |
| `GET` | `/publicacoes?page=1&limit=20` | sim |
| `DELETE` | `/publicacoes/:publicacaoId` | sim, só quem publicou |
| `POST` | `/publicacoes/:publicacaoId/comentarios` | sim |
| `GET` | `/publicacoes/:publicacaoId/comentarios` | sim |
