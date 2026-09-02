/// <reference path="../pb_data/types.d.ts" />

/*
  Registra el consentimiento del titular en cada solicitud de contacto.

  Hasta ahora la casilla de autorización vivía solo en el navegador: cualquiera
  podía enviar un POST directo a la API saltándosela, y ni siquiera cuando se
  marcaba quedaba constancia. Sin prueba de la autorización no se cumple la
  Ley 1581 de 2012.

  `consent` es un booleano REQUERIDO: en PocketBase un booleano requerido debe
  ser verdadero, así que la propia base de datos rechaza cualquier registro sin
  autorización. La comprobación deja de depender del frontend.

  ⚠️ SIN PROBAR — ver docs/06-backlog.md → P0-07.
  ⚠️ ORDEN DE DESPLIEGUE: esta migración va ANTES de publicar el frontend que
     envía `consent`. Al revés, el formulario mandaría un campo que la colección
     todavía no conoce.
*/

migrate((app) => {
    const collection = app.findCollectionByNameOrId('contact_requests');

    collection.fields.add(
        new BoolField({
            name: 'consent',
            required: true,
        }),
    );

    collection.fields.add(
        new DateField({
            name: 'consent_at',
            required: false,
        }),
    );

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId('contact_requests');

    collection.fields.removeByName('consent');
    collection.fields.removeByName('consent_at');

    app.save(collection);
});
