-- =========================================================================
--  4D Cuarta Dimensión — tabla de solicitudes de contacto
--
--  Traslado a MySQL de la colección `contact_requests` de PocketBase, que en
--  alojamiento compartido no se puede ejecutar (es un binario de Go que
--  necesita un proceso vivo). Ver docs/07-decisiones.md → ADR-012.
--
--  ── Cómo se aplica ──────────────────────────────────────────────────────
--
--  1. En hPanel de Hostinger: Bases de datos → MySQL → crear base y usuario.
--  2. Entrar a phpMyAdmin, elegir la base, pestaña «Importar», subir este
--     archivo. O pegar su contenido en la pestaña «SQL».
--  3. Copiar el nombre de la base, el usuario y la contraseña a
--     apps/web/public/api/config.php.
--
--  ⚠️ Este archivo NO va dentro de public/: si estuviera ahí, cualquiera
--     podría descargarlo desde el navegador.
-- =========================================================================

CREATE TABLE IF NOT EXISTS contact_requests (
    id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

    -- Los mismos campos y límites que declaraban las migraciones de
    -- PocketBase, para que un registro viejo y uno nuevo sean comparables.
    name        VARCHAR(120)    NOT NULL,
    company     VARCHAR(160)        NULL,
    email       VARCHAR(255)    NOT NULL,
    phone       VARCHAR(40)     NOT NULL,
    -- 'insumos' se añadió el 2026-10-26 (db/migraciones/2026-10-26-linea-insumos.sql).
    line        ENUM('calzado', 'ropa', 'dotaciones', 'otro', 'insumos') NOT NULL DEFAULT 'calzado',
    message     TEXT            NOT NULL,

    -- Prueba del consentimiento, exigida por la Ley 1581 de 2012. El
    -- Decreto 1074 de 2015 obliga al responsable a CONSERVAR esta prueba:
    -- es la razón de más peso para tener base de datos y no solo correos.
    consent     TINYINT(1)      NOT NULL,
    consent_at  DATETIME        NOT NULL,

    created     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Huella de la IP, no la IP. Sirve para frenar a un bot que intente
    -- agotar el cupo de correo del buzón, sin guardar un dato personal más
    -- del que hace falta. Es irreversible: no se puede volver a la IP.
    ip_hash     CHAR(64)            NULL,

    -- Se guarda ANTES de enviar los correos y se actualiza después. Si un
    -- envío falla, la solicitud sigue aquí y este campo dice qué pasó.
    -- Sin esto, un fallo de SMTP sería invisible.
    mail_status VARCHAR(32)     NOT NULL DEFAULT 'pendiente',

    PRIMARY KEY (id),
    KEY idx_created (created),
    KEY idx_ip_created (ip_hash, created)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
