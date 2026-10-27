-- =========================================================================
--  Migración 2026-10-26 · Añadir la línea «Insumos» al formulario
--
--  ⚠️ ORDEN OBLIGATORIO AL DESPLEGAR
--
--    1. PRIMERO ejecutar este archivo en phpMyAdmin (pestaña «SQL»).
--    2. DESPUÉS subir el sitio nuevo (contacto.php y el formulario).
--
--  Si se hace al revés, durante ese rato las solicitudes de Insumos fallarían
--  al guardarse: MySQL en modo estricto rechaza un valor que no está en el
--  ENUM. Las demás líneas seguirían funcionando.
--
--  Es seguro ejecutarlo dos veces y no toca ningún dato existente: solo añade
--  un valor permitido. Se añade AL FINAL de la lista a propósito: así MySQL lo
--  aplica sin reconstruir la tabla.
-- =========================================================================

ALTER TABLE contact_requests
    MODIFY line ENUM('calzado', 'ropa', 'dotaciones', 'otro', 'insumos') NOT NULL DEFAULT 'calzado';
