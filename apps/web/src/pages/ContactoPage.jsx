import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Globe } from 'lucide-react';
import Reveal from '../components/Reveal';
import PageTransition from '../components/PageTransition';
import pocketbaseClient from '@/lib/pocketbaseClient';

const initialForm = { name: '', company: '', email: '', line: 'calzado', message: '' };

const inputClass =
    'w-full border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors duration-200 focus:border-primary';

export default function ContactoPage() {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle');

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

    const validate = () => {
        const next = {};
        if (form.name.trim().length < 2) next.name = 'Cuéntanos tu nombre.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Ingresa un correo válido.';
        if (form.message.trim().length < 10) next.message = 'Cuéntanos un poco más sobre tu proyecto (mínimo 10 caracteres).';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus('sending');
        try {
            await pocketbaseClient.collection('contact_requests').create({
                name: form.name.trim(),
                company: form.company.trim(),
                email: form.email.trim(),
                line: form.line,
                message: form.message.trim(),
            });
            setStatus('success');
        } catch {
            setStatus('error');
        }
    };

    return (
        <PageTransition>
            <Helmet>
                <title>Contacto — Hablemos de tu proyecto | 4D Cuarta Dimensión</title>
                <meta
                    name="description"
                    content="Hablemos sobre el reto que quieres convertir en una oportunidad. Cotiza tu proyecto de calzado, ropa o dotaciones con 4D Cuarta Dimensión."
                />
            </Helmet>

            <section className="mx-auto max-w-6xl px-6 pb-20 pt-32 md:pt-40">
                <Reveal>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">Contacto</p>
                    <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
                        Hablemos sobre el reto que quieres convertir en una <span className="text-primary">oportunidad</span>.
                    </h1>
                </Reveal>

                <div className="mt-14 grid gap-14 lg:grid-cols-[1.3fr_1fr]">
                    <Reveal delay={0.1}>
                        {status === 'success' ? (
                            <div className="flex h-full min-h-[24rem] flex-col items-center justify-center border border-border/70 bg-card/40 p-10 text-center">
                                <CheckCircle2 className="h-12 w-12 text-primary" />
                                <h2 className="mt-6 text-2xl font-extrabold tracking-tight">Mensaje recibido.</h2>
                                <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                                    Nuestro equipo comercial te contactará en las próximas 24 a 48 horas hábiles para hablar de tu proyecto.
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
                                        <input id="name" type="text" value={form.name} onChange={set('name')} placeholder="Tu nombre" className={inputClass} autoComplete="name" />
                                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="company" className="text-sm font-semibold">Empresa</label>
                                        <input id="company" type="text" value={form.company} onChange={set('company')} placeholder="Nombre de tu empresa" className={inputClass} autoComplete="organization" />
                                    </div>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-semibold">Correo corporativo *</label>
                                        <input id="email" type="email" value={form.email} onChange={set('email')} placeholder="nombre@empresa.com" className={inputClass} autoComplete="email" />
                                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="line" className="text-sm font-semibold">Línea de interés</label>
                                        <select id="line" value={form.line} onChange={set('line')} className={inputClass}>
                                            <option value="calzado">Calzado</option>
                                            <option value="ropa">Ropa</option>
                                            <option value="dotaciones">Dotaciones</option>
                                            <option value="otro">Otro proyecto</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-semibold">Tu proyecto *</label>
                                    <textarea
                                        id="message"
                                        rows={6}
                                        value={form.message}
                                        onChange={set('message')}
                                        placeholder="Qué quieres desarrollar, volúmenes estimados, países de destino, tiempos…"
                                        className={`${inputClass} resize-y`}
                                    />
                                    {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
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
                                        <p className="text-muted-foreground">comercial@cuartadimension.co</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold">Teléfono</p>
                                        <p className="text-muted-foreground">+57 (601) 743 4400</p>
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
                                Respondemos en 24 a 48 horas hábiles. Si tu proyecto tiene una fecha límite, cuéntanosla en el mensaje.
                            </p>
                        </aside>
                    </Reveal>
                </div>
            </section>
        </PageTransition>
    );
}
