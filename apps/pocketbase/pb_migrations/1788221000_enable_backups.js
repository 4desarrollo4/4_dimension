/// <reference path="../pb_data/types.d.ts" />

/*
  Copias de seguridad automáticas.

  Las solicitudes de contacto viven en un único archivo SQLite dentro de
  pb_data. Sin copias, perder ese archivo es perder todos los contactos que ha
  generado el sitio, sin forma de recuperarlos.

  Diaria a las 03:00, conservando las últimas 7.

  ⚠️ SIN PROBAR — ver docs/06-backlog.md → P0-07.
  📌 Las copias se guardan en el propio servidor. Para que sirvan de verdad ante
     un fallo del disco hay que configurar además el destino S3 en los ajustes
     de PocketBase, o descargarlas periódicamente.
*/

migrate((app) => {
    const settings = app.settings();

    settings.backups.cron = '0 3 * * *';
    settings.backups.cronMaxKeep = 7;

    app.save(settings);
}, (app) => {
    const settings = app.settings();

    settings.backups.cron = '';

    app.save(settings);
});
