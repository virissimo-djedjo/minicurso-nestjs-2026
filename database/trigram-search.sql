CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX busca_usuario_perfil ON
public.usuario
	USING GIN (
	nome_usuario gin_trgm_ops
)
WHERE
deleted_at IS NULL;

CREATE INDEX busca_usuario_perfil_nome ON
public.usuario
	USING GIN (
	nome gin_trgm_ops,
	sobrenome gin_trgm_ops,
	nome_usuario gin_trgm_ops
)
WHERE
deleted_at IS NULL;
