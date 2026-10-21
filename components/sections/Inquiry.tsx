"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/ui/Icon";
import Reveal from "@/components/ui/Reveal";
import Panel from "@/components/split/Panel";
import { configStore, useConfig } from "@/lib/configStore";
import { budgets, propertyTypes, serviceLabels, summarize, timelines, validate, type Errors, type Inquiry as Data } from "@/lib/inquiry";
import { addOns, nfcProduct, themes, tourTiers, webTiers, type ServiceId, type Theme } from "@/lib/pricing";
import { site, telHref } from "@/lib/site";

const STEPS = ["Leistung", "Details", "Kontakt", "Übersicht"];

const EMPTY: Data = {
  services: [],
  nfc: { theme: "white", qty: 10, business: "" },
  web: { tier: "", url: "" },
  roomtour: { tier: "", property: "", area: "" },
  addOns: [],
  budget: "",
  timeline: "",
  message: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  contactPref: "email",
  consent: false,
  website: "",
};

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent"; id: string; viaMail: boolean } | { kind: "error"; message: string };

const serviceIcons: Record<ServiceId, string> = { nfc: "nfc", web: "web", roomtour: "roomtour" };
const serviceHints: Record<ServiceId, string> = {
  nfc: "Runde Acryl-Platten mit NFC-Chip",
  web: "Moderne Websites ab 300 €",
  roomtour: "360°-Rundgänge & Videos ab 300 €",
};

export default function Inquiry() {
  const [data, setData] = useState<Data>(EMPTY);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Carry the configurator selection into the wizard whenever it changes.
  const cfg = useConfig((s) => s);
  useEffect(() => {
    setData((d) => ({
      ...d,
      services: Array.from(new Set([...d.services, ...cfg.inquiryServices])),
      nfc: { theme: cfg.theme, qty: cfg.qty, business: cfg.business },
      web: { ...d.web, tier: cfg.webTier ?? d.web.tier },
      roomtour: { ...d.roomtour, tier: cfg.tourTier ?? d.roomtour.tier },
      addOns: cfg.addOns,
    }));
  }, [cfg.inquiryServices, cfg.theme, cfg.qty, cfg.business, cfg.webTier, cfg.tourTier, cfg.addOns]);

  const patch = (p: Partial<Data>) => setData((d) => ({ ...d, ...p }));
  const clearError = (key: string) => setErrors(({ [key]: _, ...rest }) => rest);

  const go = (to: number) => {
    if (to > step) {
      const e = validate(data, step);
      setErrors(e);
      if (Object.keys(e).length) return;
    }
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const toggleService = (s: ServiceId) => {
    clearError("services");
    patch({ services: data.services.includes(s) ? data.services.filter((x) => x !== s) : [...data.services, s] });
  };

  const openMail = (d: Data) => {
    const subject = `Anfrage: ${d.services.map((s) => serviceLabels[s]).join(" + ")}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summarize(d))}`;
  };

  const submit = async () => {
    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length) {
      const firstStep = e.services ? 0 : Object.keys(e).some((k) => k.includes(".") || k === "message") ? 1 : 2;
      setDir(-1);
      setStep(firstStep);
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) return setStatus({ kind: "sent", id: json.id, viaMail: false });
      if (json.errors) {
        setErrors(json.errors);
        setStatus({ kind: "error", message: "Bitte prüfen Sie Ihre Angaben." });
        return;
      }
      if (json.fallback) {
        openMail(data);
        return setStatus({ kind: "sent", id: json.id ?? "", viaMail: true });
      }
      setStatus({ kind: "error", message: json.error ?? "Senden fehlgeschlagen. Bitte versuchen Sie es erneut." });
    } catch {
      // Offline or static hosting without API: hand over to the mail client.
      openMail(data);
      setStatus({ kind: "sent", id: "", viaMail: true });
    }
  };

  const reset = () => {
    setData({ ...EMPTY });
    configStore.set({ inquiryServices: [] });
    setStep(0);
    setStatus({ kind: "idle" });
  };

  return (
    <Panel
      id="anfrage"
      className="bg-sand/60"
      title="Erzählen Sie uns von Ihrem Vorhaben."
      lead="In vier kurzen Schritten zu Ihrem Angebot. Unverbindlich, und wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen."
    >
      <div className="grid gap-4 2xl:grid-cols-[1fr_300px]">
        <Reveal className="card overflow-hidden bg-white">
          {status.kind === "sent" ? (
            <Success status={status} onReset={reset} onMail={() => openMail(data)} name={data.name} />
          ) : (
            <>
              <Progress step={step} onJump={(i) => i < step && go(i)} />
              <div className="relative min-h-[440px] overflow-hidden px-5 pb-6 pt-4 sm:px-10">
                <AnimatePresence mode="wait" custom={dir} initial={false}>
                  <motion.div
                    key={step}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -40 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {step === 0 && (
                      <StepServices selected={data.services} onToggle={toggleService} error={errors.services} />
                    )}
                    {step === 1 && <StepDetails data={data} patch={patch} errors={errors} clearError={clearError} />}
                    {step === 2 && <StepContact data={data} patch={patch} errors={errors} clearError={clearError} />}
                    {step === 3 && <StepSummary data={data} onEdit={(i) => go(i)} />}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-5 sm:px-10">
                <button
                  type="button"
                  onClick={() => go(step - 1)}
                  disabled={step === 0}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-ink-muted transition hover:text-ink disabled:pointer-events-none disabled:opacity-0"
                >
                  <Icon name="back" className="h-4 w-4" /> Zurück
                </button>
                {status.kind === "error" && <p className="hidden text-sm text-google-red sm:block" role="alert">{status.message}</p>}
                {step < 3 ? (
                  <button type="button" onClick={() => go(step + 1)} className="btn-primary">
                    Weiter <Icon name="arrow" className="h-4 w-4" />
                  </button>
                ) : (
                  <button type="button" onClick={submit} disabled={status.kind === "sending"} className="btn-primary disabled:opacity-70">
                    {status.kind === "sending" ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Wird gesendet…
                      </>
                    ) : (
                      <>
                        Anfrage absenden <Icon name="arrow" className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
              {status.kind === "error" && <p className="px-5 pb-5 text-sm text-google-red sm:hidden" role="alert">{status.message}</p>}
            </>
          )}
        </Reveal>

        <Reveal delay={0.15} className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-1 2xl:content-start">
          <div className="card p-6">
            <p className="eyebrow">Direkter Draht</p>
            <ul className="mt-5 space-y-4">
              {site.founders.map((f) => (
                <li key={f.name}>
                  <p className="font-heading text-base font-bold text-ink">{f.name}</p>
                  <a href={telHref(f.phone)} className="mt-1 inline-flex items-center gap-2 text-sm text-ink-muted transition hover:text-brand">
                    <Icon name="phone" className="h-4 w-4 text-brand" /> {f.phone}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-sm text-ink-muted transition hover:text-brand">
                  <Icon name="mail" className="h-4 w-4 text-brand" /> {site.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2 text-sm text-ink-muted">
                <Icon name="pin" className="h-4 w-4 text-brand" /> {site.city}
              </li>
            </ul>
          </div>
          <div className="card p-6 text-sm leading-relaxed text-ink-muted">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <Icon name="lock" className="h-4 w-4 text-brand" /> Ihre Daten sind sicher
            </p>
            <p className="mt-2">Verschlüsselte Übertragung, keine Weitergabe an Dritte. Wir nutzen Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage.</p>
          </div>
        </Reveal>
      </div>
    </Panel>
  );
}

/* ----------------------------------------------------------------------- steps */

function Progress({ step, onJump }: { step: number; onJump: (i: number) => void }) {
  return (
    <ol className="flex items-center gap-2 px-5 pt-8 sm:px-10">
      {STEPS.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-2">
          <button
            type="button"
            onClick={() => onJump(i)}
            aria-current={i === step ? "step" : undefined}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-bold transition ${
              i < step ? "border-brand bg-ink text-paper" : i === step ? "border-brand text-brand shadow-ring" : "border-line text-ink-faint"
            }`}
          >
            {i < step ? <Icon name="check" className="h-4 w-4" /> : i + 1}
          </button>
          <span className={`hidden text-xs font-semibold uppercase tracking-[0.15em] md:block ${i === step ? "text-ink" : "text-ink-faint"}`}>{label}</span>
          {i < STEPS.length - 1 && (
            <span className="relative h-px flex-1 bg-line">
              <motion.span className="absolute inset-y-0 left-0 bg-brand" animate={{ width: i < step ? "100%" : "0%" }} transition={{ duration: 0.5 }} />
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

function StepTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="mb-7 mt-4">
      <h3 className="font-heading text-2xl font-extrabold tracking-tight text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink-muted">{text}</p>
    </div>
  );
}

function StepServices({ selected, onToggle, error }: { selected: ServiceId[]; onToggle: (s: ServiceId) => void; error?: string }) {
  return (
    <div>
      <StepTitle title="Wofür interessieren Sie sich?" text="Mehrfachauswahl möglich, wir schnüren Ihnen gern ein Komplettpaket." />
      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(serviceLabels) as ServiceId[]).map((s) => {
          const on = selected.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => onToggle(s)}
              aria-pressed={on}
              className={`group relative rounded-2xl border p-5 text-left transition duration-300 ${
                on ? "border-brand bg-brand/10 shadow-ring" : "border-line bg-white hover:border-brand/40"
              }`}
            >
              <span className={`absolute right-4 top-4 grid h-6 w-6 place-items-center rounded-full border transition ${on ? "border-brand bg-ink text-paper" : "border-line"}`}>
                {on && <Icon name="check" className="h-3.5 w-3.5" />}
              </span>
              <span className={`grid h-12 w-12 place-items-center rounded-xl border border-sage/20 bg-sage-light text-sage`}>
                <Icon name={serviceIcons[s]} className="h-6 w-6" />
              </span>
              <span className="mt-5 block font-semibold leading-snug text-ink">{serviceLabels[s]}</span>
              <span className="mt-1 block text-xs text-ink-muted">{serviceHints[s]}</span>
            </button>
          );
        })}
      </div>
      <FieldError msg={error} />
    </div>
  );
}

type StepProps = { data: Data; patch: (p: Partial<Data>) => void; errors: Errors; clearError: (k: string) => void };

function StepDetails({ data, patch, errors, clearError }: StepProps) {
  const has = (s: ServiceId) => data.services.includes(s);
  return (
    <div>
      <StepTitle title="Ein paar Details" text="Damit wir Ihr Angebot passgenau vorbereiten können." />
      <div className="space-y-8">
        {has("nfc") && (
          <Group title="NFC Review Disc" icon="nfc">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Design" value={data.nfc.theme} onChange={(v) => patch({ nfc: { ...data.nfc, theme: v } })}>
                {(Object.keys(themes) as Theme[]).map((k) => (
                  <option key={k} value={k}>{themes[k].label}</option>
                ))}
              </Select>
              <Input
                label="Stückzahl *"
                type="number"
                inputMode="numeric"
                min={1}
                value={String(data.nfc.qty)}
                error={errors["nfc.qty"]}
                onChange={(v) => {
                  clearError("nfc.qty");
                  patch({ nfc: { ...data.nfc, qty: Number(v) } });
                }}
              />
            </div>
          </Group>
        )}
        {has("web") && (
          <Group title="Website" icon="web">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Paket *"
                value={data.web.tier}
                error={errors["web.tier"]}
                onChange={(v) => {
                  clearError("web.tier");
                  patch({ web: { ...data.web, tier: v } });
                }}
              >
                <option value="">Bitte wählen</option>
                {webTiers.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </Select>
              <Input
                label="Bestehende Website (optional)"
                value={data.web.url}
                placeholder="www.ihre-firma.de"
                error={errors["web.url"]}
                onChange={(v) => {
                  clearError("web.url");
                  patch({ web: { ...data.web, url: v } });
                }}
              />
            </div>
          </Group>
        )}
        {has("roomtour") && (
          <Group title="Roomtour" icon="roomtour">
            <div className="grid gap-4 sm:grid-cols-3">
              <Select
                label="Objektart *"
                value={data.roomtour.property}
                error={errors["roomtour.property"]}
                onChange={(v) => {
                  clearError("roomtour.property");
                  patch({ roomtour: { ...data.roomtour, property: v } });
                }}
              >
                <option value="">Bitte wählen</option>
                {propertyTypes.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </Select>
              <Input label="Fläche in m²" type="number" inputMode="numeric" min={1} value={data.roomtour.area} onChange={(v) => patch({ roomtour: { ...data.roomtour, area: v } })} />
              <Select label="Paket" value={data.roomtour.tier} onChange={(v) => patch({ roomtour: { ...data.roomtour, tier: v } })}>
                <option value="">Beratung gewünscht</option>
                {tourTiers.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </Select>
            </div>
          </Group>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Budget" value={data.budget} onChange={(v) => patch({ budget: v })}>
            <option value="">Keine Angabe</option>
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </Select>
          <Select label="Zeitrahmen" value={data.timeline} onChange={(v) => patch({ timeline: v })}>
            <option value="">Keine Angabe</option>
            {timelines.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </Select>
        </div>
        <Textarea
          label="Ihre Nachricht (optional)"
          value={data.message}
          error={errors.message}
          placeholder="Erzählen Sie uns kurz von Ihrem Vorhaben …"
          onChange={(v) => {
            clearError("message");
            patch({ message: v });
          }}
        />
      </div>
    </div>
  );
}

function StepContact({ data, patch, errors, clearError }: StepProps) {
  const field = (key: "name" | "company" | "email" | "phone") => ({
    value: data[key],
    error: errors[key],
    onChange: (v: string) => {
      clearError(key);
      patch({ [key]: v });
    },
  });
  return (
    <div>
      <StepTitle title="Wie erreichen wir Sie?" text="Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name *" autoComplete="name" {...field("name")} />
        <Input label="Unternehmen" autoComplete="organization" {...field("company")} />
        <Input label="E-Mail *" type="email" autoComplete="email" {...field("email")} />
        <Input label="Telefon" type="tel" autoComplete="tel" {...field("phone")} />
      </div>
      <div className="mt-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-ink-muted">Bevorzugter Kontaktweg</p>
        <div className="inline-flex rounded-full border border-line bg-sand p-1">
          {(["email", "phone"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                clearError("phone");
                patch({ contactPref: p });
              }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${data.contactPref === p ? "bg-ink text-paper" : "text-ink-muted hover:text-ink"}`}
            >
              {p === "email" ? "E-Mail" : "Rückruf"}
            </button>
          ))}
        </div>
      </div>
      {/* Honeypot – hidden from humans. */}
      <input type="text" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => patch({ website: e.target.value })} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden />
      <label className="mt-8 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => {
            clearError("consent");
            patch({ consent: e.target.checked });
          }}
          className="checkbox mt-0.5"
        />
        <span>
          Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert und verarbeitet werden. Details in der{" "}
          <a href="/datenschutz" className="text-brand underline-offset-4 hover:underline">
            Datenschutzerklärung
          </a>
          . *
        </span>
      </label>
      <FieldError msg={errors.consent} />
    </div>
  );
}

function StepSummary({ data, onEdit }: { data: Data; onEdit: (step: number) => void }) {
  const tier = (list: { id: string; label: string }[], id: string) => list.find((t) => t.id === id)?.label ?? "Beratung";
  const rows: [string, string, number][] = [
    ["Leistungen", data.services.map((s) => serviceLabels[s]).join(", "), 0],
  ];
  if (data.services.includes("nfc"))
    rows.push(["NFC", `${data.nfc.qty} × ${nfcProduct.label} · ${themes[data.nfc.theme as Theme]?.label}${data.nfc.business ? ` · „${data.nfc.business}“` : ""}`, 1]);
  if (data.services.includes("web")) rows.push(["Website", `${tier(webTiers, data.web.tier)}${data.web.url ? ` · ${data.web.url}` : ""}`, 1]);
  if (data.services.includes("roomtour"))
    rows.push(["Roomtour", `${data.roomtour.property}${data.roomtour.area ? ` · ${data.roomtour.area} m²` : ""} · ${tier(tourTiers, data.roomtour.tier)}`, 1]);
  const extras = addOns.filter((a) => data.addOns.includes(a.id) && data.services.includes(a.for)).map((a) => a.label);
  if (extras.length) rows.push(["Extras", extras.join(", "), 1]);
  if (data.budget || data.timeline) rows.push(["Rahmen", [data.budget, data.timeline].filter(Boolean).join(" · "), 1]);
  rows.push(["Kontakt", [data.name, data.company, data.email, data.phone].filter(Boolean).join(" · "), 2]);

  return (
    <div>
      <StepTitle title="Alles korrekt?" text="Prüfen Sie Ihre Angaben und senden Sie die Anfrage ab." />
      <dl className="divide-y divide-line rounded-2xl border border-line">
        {rows.map(([k, v, s]) => (
          <div key={k} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
            <dt className="w-28 shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-ink-muted">{k}</dt>
            <dd className="flex-1 text-sm text-ink">{v}</dd>
            <button type="button" onClick={() => onEdit(s)} className="self-start text-xs font-semibold text-brand hover:text-brand sm:self-auto">
              Ändern
            </button>
          </div>
        ))}
      </dl>
      {data.message && <p className="mt-4 rounded-2xl border border-line p-5 text-sm italic text-ink-muted">„{data.message}“</p>}
    </div>
  );
}

function Success({ status, onReset, onMail, name }: { status: Extract<Status, { kind: "sent" }>; onReset: () => void; onMail: () => void; name: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[560px] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="relative grid h-24 w-24 place-items-center">
        <svg viewBox="0 0 52 52" className="h-24 w-24" aria-hidden>
          <motion.circle cx="26" cy="26" r="24" fill="none" stroke="#4A5D52" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
          <motion.path d="M15 27l7 7 15-15" fill="none" stroke="#4A5D52" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
        </svg>
      </div>
      <h3 className="mt-8 font-heading text-3xl font-extrabold tracking-tight text-ink">
        {status.viaMail ? "Fast geschafft" : "Vielen Dank"}
        {name ? `, ${name.split(" ")[0]}` : ""}!
      </h3>
      <p className="mt-4 max-w-md leading-relaxed text-ink-muted">
        {status.viaMail
          ? "Wir haben Ihr E-Mail-Programm mit der fertigen Anfrage geöffnet. Bitte senden Sie die Nachricht dort noch ab."
          : "Ihre Anfrage ist bei uns eingegangen. Wir melden uns innerhalb von 24 Stunden persönlich bei Ihnen."}
      </p>
      {status.id && !status.viaMail && <p className="mt-4 text-xs uppercase tracking-[0.25em] text-brand">Referenz {status.id}</p>}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {status.viaMail && (
          <button type="button" onClick={onMail} className="btn-primary">
            E-Mail erneut öffnen
          </button>
        )}
        <button type="button" onClick={onReset} className="btn-secondary">
          Neue Anfrage
        </button>
      </div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------- form fields */

function Group({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-4 flex items-center gap-2 text-sm font-semibold text-brand-dark">
        <Icon name={icon} className="h-4 w-4" /> {title}
      </legend>
      {children}
    </fieldset>
  );
}

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs text-[#ff8a80]" role="alert">
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> & { label: string; error?: string; onChange: (v: string) => void };

function Input({ label, error, onChange, ...rest }: InputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">{label}</span>
      <input {...rest} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} className={`input ${error ? "!border-[#ff8a80]/70" : ""}`} />
      <FieldError msg={error} />
    </label>
  );
}

function Select({ label, value, onChange, error, children }: { label: string; value: string; onChange: (v: string) => void; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} className={`input select ${error ? "!border-[#ff8a80]/70" : ""}`}>
        {children}
      </select>
      <FieldError msg={error} />
    </label>
  );
}

function Textarea({ label, value, onChange, error, placeholder }: { label: string; value: string; onChange: (v: string) => void; error?: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-muted">
        {label}
        <span className="normal-case tracking-normal">{value.length}/2000</span>
      </span>
      <textarea value={value} rows={4} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={`input resize-none ${error ? "!border-[#ff8a80]/70" : ""}`} />
      <FieldError msg={error} />
    </label>
  );
}
