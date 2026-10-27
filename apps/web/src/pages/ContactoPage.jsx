import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Globe } from 'lucide-react';
import Reveal from '../components/Reveal';
import PageTransition from '../components/PageTransition';
import { EMAIL, MAILTO, WHATSAPP_URL, MAPS_URL, TELEFONO_VISIBLE, DIRECCION_CALLE, DIRECCION_CIUDAD } from '../lib/contacto';

const initialForm = { name: '', company: '', email: '', phone: '', line: 'calzado', message: '', consent: false, website: '' };

// Guarda la solicitud y dispara los dos correos. Es una ruta relativa: en
// producción la sirve el mismo hosting, y en desarrollo `vite.config.js` la
// redirige al servidor de PHP local. Ver docs/07-decisiones.md → ADR-012.
const ENDPOINT = '/api/contacto.php';

// Un envío legítimo no se completa en menos de esto. Los bots sí.
const SEGUNDOS_MINIMOS = 3;

// El número se guarda tal como lo escribe la persona, pero para validarlo y
// para armar el enlace de WhatsApp solo interesan los dígitos.
const soloDigitos = (valor) => String(valor ?? '').replace(/\D/g, '');

const inputClass =
    'w-full border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors duration-200 focus:border-primary';

export default function ContactoPage() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');
    const abiertoEn = useRef(Date.now());

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    const setChecked = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));

    const validate = () => {
        const next = {};
        if (form.name.trim().length < 2) next.name = 'Escribe tu nombre.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Ingresa un correo válido.';
        // Permisiva a propósito: el sitio recibe contactos internacionales y una
        // validación estricta rechazaría números perfectamente válidos.
        if (soloDigitos(form.phone).length < 7) next.phone = 'Ingresa un número de contacto válido, con indicativo.';
        if (form.message.trim().length < 10) next.message = 'El mensaje debe tener al menos 10 caracteres.';
        if (!form.consent) next.consent = 'Necesitamos tu autorización para tratar estos datos.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Trampa antibots: el campo está oculto y ninguna persona lo rellena.
        // Y nadie escribe un mensaje de verdad en menos de tres segundos.
        // No avisamos de que se detectó nada: al bot se le responde "éxito" y
        // no se envía nada, para que no aprenda a esquivarlo.
        const esBot = form.website !== '' || (Date.now() - abiertoEn.current) / 1000 < SEGUNDOS_MINIMOS;

        if (esBot) {
            setStatus('success');
            return;
        }

        setStatus('sending');
        try {
            const respuesta = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name.trim(),
                    company: form.company.trim(),
                    email: form.email.trim(),
                    phone: form.phone.trim(),
                    line: form.line,
                    message: form.message.trim(),
                    // Prueba del consentimiento, exigida por la Ley 1581 de 2012.
                    // El servidor la vuelve a exigir y guarda la marca de tiempo:
                    // sin autorización no se registra nada.
                    consent: true,
                    website: form.website,
                }),
            });

            // El endpoint responde 200 aunque falle el correo: la solicitud ya
            // quedó guardada, y para quien escribe eso es un envío correcto.
            // Ver apps/web/public/api/contacto.php.
            // 429: el mismo cliente superó el tope de envíos por hora (ver
            // contacto.php). No es un error del sitio: se le ofrece otra vía.
            if (respuesta.status === 429) {
                setStatus('limite');
                return;
            }
            if (!respuesta.ok) {
                throw new Error('El servidor respondió ' + respuesta.status);
            }

            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    return (
        <PageTransition>
            <Helmet>
                <title>Contacto — 4D Cuarta Dimensión ES S.A.S.</title>
                <meta
                    name="description"
                    content="Datos de contacto de 4D Cuarta Dimensión ES S.A.S.: correo, teléfono y oficina principal en la Cra. 34a #27a-22 sur, Bogotá D.C."
                />
            </Helmet>
            <Seo
                title="Contacto — 4D Cuarta Dimensión ES S.A.S."
                description="Datos de contacto de 4D Cuarta Dimensión ES S.A.S.: correo, teléfono y oficina principal en la Cra. 34a #27a-22 sur, Bogotá D.C."
            />
            <JsonLd migas={[{ nombre: 'Contacto', ruta: '/contacto' }]} />

            <section className="mx-auto max-w-6xl px-6 pb-20 pt-32 md:pt-40">
                {/* Entrada por CSS, no con Reveal: con Reveal el H1 se publicaba con
                    opacity:0 en el HTML prerenderizado (2026-10-26). Ver 04-diseno.md. */}
                <p className="rise-in text-xs font-semibold uppercase tracking-[0.3em] text-primary">Contacto</p>
                <h1 className="rise-solid mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                    Dónde y cómo <span className="text-primary">encontrarnos</span>.
                </h1>

                <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
                    <Reveal delay={0.1}>
                        {status === 'success' ? (
                            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center border border-primary/40 bg-card/40 p-10 text-center">
                                <CheckCircle2 className="h-12 w-12 text-primary" />
                                <h2 className="mt-6 text-2xl font-extrabold tracking-tight">Mensaje recibido.</h2>
                                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                    Respondemos en 24 a 48 horas hábiles.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setForm(initialForm);
                                        setStatus('idle');
                                    }}
                                    className="mt-8 border border-foreground/25 px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-200 hover:border-primary hover:text-primary active:scale-[0.98]"
                                >
                                    Enviar otro mensaje
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={onSubmit} noValidate className="space-y-6">
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-semibold">Nombre *</label>
                                        <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="Nombre y apellido" className={inputClass} autoComplete="name" />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="company" className="text-sm font-semibold">Empresa</label>
                                        <input id="company" type="text" value={form.company} onChange={set('company')} placeholder="Nombre de la empresa" className={inputClass} autoComplete="organization" />
                                    </div>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold">Correo corporativo *</label>
                                        <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="nombre@empresa.com" className={inputClass} autoComplete="email" />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-semibold">Teléfono o WhatsApp *</label>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={form.phone}
                                            onChange={set('phone')}
                                            placeholder="+57 300 123 4567"
                                            className={inputClass}
                                            autoComplete="tel"
                                            inputMode="tel"
                                        />
                                        {errors.phone
                                            ? <p className="text-xs text-destructive">{errors.phone}</p>
                                            : <p className="text-xs text-muted-foreground">Inclúyelo con indicativo del país para poder escribirte por WhatsApp.</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="line" className="text-sm font-semibold">Línea de interés</label>
                                    <select id="line" value={form.line} onChange={set('line')} className={`${inputClass} block sm:max-w-xs`}>
                                        <option value="calzado">Calzado</option>
                                        <option value="ropa">Ropa</option>
                                        <option value="dotaciones">Dotaciones</option>
                                        <option value="insumos">Insumos</option>
                                        <option value="otro">Otro proyecto</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold">Mensaje *</label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        value={form.message}
                                        onChange={set('message')}
                                        placeholder="Escribe tu mensaje."
                                        className={`${inputClass} resize-y`}
                                    />
                                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                                </div>
                                {/* Trampa antibots. No es `display:none` a propósito:
                                    muchos bots ignoran los campos ocultos así. */}
                                <div className="sr-only" aria-hidden="true">
                                    <label htmlFor="website">No rellenes este campo</label>
                                    <input
                                        id="website"
                                        type="text"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={form.website}
                                        onChange={set('website')}
                                    />
                                </div>

                                <div className="space-y-3 border-t border-border/60 pt-6">
                                    <label htmlFor="consent" className="flex cursor-pointer items-start gap-3">
                                        <input
                                            id="consent"
                                            type="checkbox"
                                            checked={form.consent}
                                            onChange={setChecked('consent')}
                                            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-primary"
                                        />
                                        <span className="text-sm leading-relaxed text-muted-foreground">
                                            Autorizo a <strong className="font-semibold text-foreground">4D Cuarta Dimensión ES S.A.S.</strong> a tratar los datos personales de este formulario con la única finalidad de responder a mi solicitud. *
                                        </span>
                                    </label>
                                    {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        Los datos no se comparten con terceros ni se usan con fines publicitarios. Puedes consultarlos, actualizarlos o solicitar su eliminación en cualquier momento escribiendo a{' '}
                                        <a href={MAILTO} className="enlace-texto">
                                            {EMAIL}
                                        </a>
                                        . Ley 1581 de 2012.
                                    </p>
                                </div>
                                {status === 'limite' && (
                                    <p className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                        Recibimos varias solicitudes desde tu conexión en la última hora. Escríbenos directamente a{' '}
                                        <a href={MAILTO} className="enlace-texto">{EMAIL}</a> o por{' '}
                                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="enlace-texto">WhatsApp</a>.
                                    </p>
                                )}
                                {status === 'error' && (
                                    <p className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                        No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos directamente a{' '}
                                        <a href={MAILTO} className="enlace-texto">{EMAIL}</a>.
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-semibold tracking-wide text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60"
                                >
                                    {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}
                                </button>
                            </form>
                        )}
                    </Reveal>

                    <Reveal delay={0.2}>
                        <aside className="space-y-8 border border-primary/40 bg-card/40 p-8">
                            <h2 className="text-lg font-bold tracking-tight">Datos de contacto</h2>
                            <ul className="space-y-5 text-sm">
                                <li className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Comercial</p>
                                        <a href={MAILTO} className="enlace">
                                            {EMAIL}
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Teléfono</p>
                                        {/* Abre WhatsApp con el mensaje, como en la home y el footer
                                            (antes era `tel:`, distinto del resto del sitio). */}
                                        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="enlace">
                                            {TELEFONO_VISIBLE}
                                            <span className="sr-only"> — escribir por WhatsApp</span>
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Oficina principal</p>
                                        {/* Antes era texto plano: ahora abre Maps, como en el resto del sitio. */}
                                        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="enlace">
                                            {DIRECCION_CALLE}
                                            <br />
                                            {DIRECCION_CIUDAD}
                                            <span className="sr-only"> — ver en Google Maps</span>
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Cobertura internacional</p>
                                        <p className="text-muted-foreground">Colombia · Latinoamérica · Centroamérica</p>
                                    </div>
                                </li>
                            </ul>
                            <p className="border-t border-border/60 pt-6 text-xs leading-relaxed text-muted-foreground">
                                Respondemos en 24 a 48 horas hábiles.
                            </p>
                        </aside>
                    </Reveal>
                </div>
            </section>
        </PageTransition>
    );
}
