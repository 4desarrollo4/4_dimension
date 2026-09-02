/// <reference path="../pb_data/types.d.ts" />

/*
  Límite específico para el formulario de contacto.

  El límite general de /api es de 200 peticiones cada 5 minutos, lo que permite
  unos 2.400 envíos por hora desde una sola IP: suficiente para llenar la base
  de basura. Una persona real no manda más de un puñado de mensajes al día.

  Se conservan las reglas existentes y solo se añade la nueva al principio,
  porque PocketBase aplica la primera que coincide.

  ⚠️ SIN PROBAR — ver docs/06-backlog.md → P0-07.
*/

const REGLA_CONTACTO = {
    label: 'POST /api/collections/contact_requests/records',
    audience: '',
    duration: 60 * 60, // 1 hora
    maxRequests: 5,
};

migrate((app) => {
    const settings = app.settings();
    const reglas = settings.rateLimits.rules || [];

    if (!reglas.some((r) => r.label === REGLA_CONTACTO.label)) {
        settings.rateLimits.enabled = true;
        settings.rateLimits.rules = [REGLA_CONTACTO, ...reglas];
        app.save(settings);
    }
}, (app) => {
    const settings = app.settings();

    settings.rateLimits.rules = (settings.rateLimits.rules || []).filter(
        (r) => r.label !== REGLA_CONTACTO.label,
    );

    app.save(settings);
});
