import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Globe } from 'lucide-react';
import Reveal from '../components/Reveal';
import PageTransition from '../components/PageTransition';
import pocketbaseClient from '@/lib/pocketbaseClient';

const initialForm = { name: '', company: '', email: '', phone: '', line: 'calzado', message: '', consent: false, website: '' };

// Un envío legítimo no se completa en menos de esto. Los bots sí.
const SEGUNDOS_MINIMOS = 3;

// El número se guarda tal como lo escribe la persona, pero para validarlo y
// para armar el enlace de WhatsApp solo interesan los dígitos.
const soloDigitos = (valor) => String(valor ?? '').replace(/\D/g, '');

const inputClass =
    'w-full border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors duration-200 focus:border-primary';

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
            await pocketbaseClient.collection('contact_requests').create({
                name: form.name.trim(),
                company: form.company.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                line: form.line,
                message: form.message.trim(),
                // Prueba del consentimiento, exigida por la Ley 1581 de 2012.
                // La colección declara `consent` como booleano requerido, así que
                // el servidor rechaza cualquier registro sin autorización.
                consent: true,
                consent_at: new Date().toISOString(),
            });
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
                    content="Datos de contacto de 4D Cuarta Dimensión ES S.A.S.: correo comercial, teléfono y oficina principal en Bogotá D.C., Colombia."
                />
            </Helmet>
            <Seo
                title="Contacto — 4D Cuarta Dimensión ES S.A.S."
                description="Datos de contacto de 4D Cuarta Dimensión ES S.A.S.: correo comercial, teléfono y oficina principal en Bogotá D.C., Colombia."
            />
            <JsonLd migas={[{ nombre: 'Contacto', ruta: '/contacto' }]} />

            <section className="mx-auto max-w-6xl px-6 pb-20 pt-32 md:pt-40">
                <Reveal>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Contacto</p>
                    <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                        Dónde y cómo <span className="text-primary">encontrarnos</span>.
                    </h1>
                </Reveal>

                <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
                    <Reveal delay={0.1}>
                        {status === 'success' ? (
                            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center border border-border/70 bg-card/40 p-10 text-center">
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
                                            : <p className="text-xs text-muted-foreground/70">Inclúyelo con indicativo del país para poder escribirte por WhatsApp.</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="line" className="text-sm font-semibold">Línea de interés</label>
                                    <select id="line" value={form.line} onChange={set('line')} className={`${inputClass} block sm:max-w-xs`}>
                                        <option value="calzado">Calzado</option>
                                        <option value="ropa">Ropa</option>
                                        <option value="dotaciones">Dotaciones</option>
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
                                    <p className="text-xs leading-relaxed text-muted-foreground/80">
                                        Los datos no se comparten con terceros ni se usan con fines publicitarios. Puedes consultarlos, actualizarlos o solicitar su eliminación en cualquier momento escribiendo a{' '}
                                        <a href="mailto:comercial@cuartadimension.co" className="underline transition-colors duration-200 hover:text-primary">
                                            comercial@cuartadimension.co
                                        </a>
                                        . Ley 1581 de 2012.
                                    </p>
                                </div>
                                {status === 'error' && (
                                    <p className="border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                        No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos directamente a comercial@cuartadimension.co.
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
                        <aside className="space-y-8 border border-border/70 bg-card/40 p-8">
                            <h2 className="text-lg font-bold tracking-tight">Datos de contacto</h2>
                            <ul className="space-y-5 text-sm">
                                <li className="flex items-start gap-3">
                                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Comercial</p>
                                        <a href="mailto:comercial@cuartadimension.co" className="text-muted-foreground transition-colors duration-200 hover:text-primary">
                                            comercial@cuartadimension.co
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Teléfono</p>
                                        <a href="tel:+576017434400" className="text-muted-foreground transition-colors duration-200 hover:text-primary">
                                            +57 (601) 743 4400
                                        </a>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Oficina principal</p>
                                        <p className="text-muted-foreground">Bogotá D.C., Colombia</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Globe className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Cobertura internacional</p>
                                        <p className="text-muted-foreground">Latinoamérica · Norteamérica · Europa</p>
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
