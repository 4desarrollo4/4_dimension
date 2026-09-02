/// <reference path="../pb_data/types.d.ts" />

/*
  Teléfono de contacto en las solicitudes.

  Pedido por el propietario: con el correo solo se puede responder por correo.
  Con el número se puede llamar o escribir por WhatsApp, que en Colombia es el
  canal real de una conversación comercial.

  Se guarda como texto, no como número: los indicativos empiezan por "+" y hay
  quien escribe espacios, guiones o paréntesis. El enlace de WhatsApp se arma
  quitando todo lo que no sea dígito, en contact-notify.pb.js.

  ⚠️ SIN PROBAR — ver docs/06-backlog.md → P0-07.
  ⚠️ ORDEN DE DESPLIEGUE: esta migración va ANTES de publicar el frontend que
     envía `phone`.
*/

migrate((app) => {
    const collection = app.findCollectionByNameOrId('contact_requests');

    collection.fields.add(
        new TextField({
            name: 'phone',
            required: true,
            min: 7,
            max: 40,
        }),
    );

    app.save(collection);
}, (app) => {
    const collection = app.findCollectionByNameOrId('contact_requests');

    collection.fields.removeByName('phone');

    app.save(collection);
});
