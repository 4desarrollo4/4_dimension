<?php

/*
 * PLANTILLA. Copia este archivo como `config.php` en la misma carpeta y
 * rellena los valores. `config.php` está en .gitignore a propósito: lleva
 * contraseñas y NO debe subirse al repositorio.
 *
 *     cp config.example.php config.php
 *
 * ⚠️ Al volver a subir el sitio al hosting, NO borres el `config.php` que ya
 *    está en el servidor: el build no lo genera, lo pusiste tú una vez.
 *
 * ── Dónde salen estos datos ─────────────────────────────────────────────
 *
 *   MySQL   hPanel → Bases de datos → MySQL. Al crear la base te da el
 *           nombre, el usuario y la contraseña. El host casi siempre es
 *           `localhost` en alojamiento compartido.
 *
 *   Correo  hPanel → Correos → Cuentas de correo. La contraseña es la del
 *           buzón info@4dimensionsas.com.
 *           Host y puerto NO se cambian: ver la nota en smtp.php sobre por
 *           qué smtp.gmail.com no sirve aunque la contraseña sea correcta.
 */

declare(strict_types=1);

return [
    'db' => [
        'host'   => 'localhost',
        'nombre' => 'CAMBIAR_nombre_de_la_base',
        'user'   => 'CAMBIAR_usuario',
        'clave'  => 'CAMBIAR_contrasena',
    ],

    'smtp' => [
        'host'   => 'smtp.hostinger.com',
        'puerto' => 465,
        'user'   => 'info@4dimensionsas.com',
        'clave'  => 'CAMBIAR_contrasena_del_buzon',
    ],

    // Remitente y destino del aviso interno. Son el mismo buzón: el acuse
    // sale de ahí y el aviso llega ahí.
    'correo' => [
        'de_nombre'  => '4D Cuarta Dimensión',
        'de_correo'  => 'info@4dimensionsas.com',
        'aviso_a'    => 'info@4dimensionsas.com',
    ],

    /*
     * Solicitudes permitidas por IP en una hora.
     *
     * No es antispam de lujo: es protección del cupo de correo. El buzón
     * tiene un límite de envíos por hora y cada solicitud consume DOS. Un bot
     * insistente podría agotarlo y dejar sin acuse a un cliente real.
     * Al topar el límite la solicitud SÍ se guarda; lo único que se omite son
     * los correos. Nunca se pierde una solicitud por esto.
     */
    'limite_por_hora' => 5,

    /*
     * Tope duro por cliente y hora (2026-10-26). Por ENCIMA de este número la
     * solicitud se rechaza sin guardarse. Existe para que un bot no pueda
     * llenar la base de datos: antes no había ninguno y en pruebas 60 envíos
     * seguidos se guardaron los 60. Ninguna persona real llega a 20 en una hora.
     */
    'tope_por_hora' => 20,
];
