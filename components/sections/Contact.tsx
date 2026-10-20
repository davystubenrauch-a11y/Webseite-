"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCard, finishes } from "@/lib/cardStore";
import { site } from "@/lib/site";
import { Arrow } from "./Hero";

const services = ["Smart Review Cards", "Website Development", "Airbnb Walkthrough", "Full Brand Package"];
const slots = ["09:00", "10:00", "11:00", "12:30", "14:00", "15:00", "16:00", "17:30"];
const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Deterministic "already booked" slots so the calendar feels alive. */
function isTaken(date: Date, slot: string) {
  const seed = date.getFullYear() * 372 + date.getMonth() * 31 + date.getDate() + slot.charCodeAt(1) * 7 + slot.charCodeAt(4);
  return (Math.sin(seed) * 10000) % 1 > 0.62;
}

function buildMonth(view: Date) {
  const first = new Date(view.getFullYear(), view.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // Monday-first grid
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = Array(offset).fill(null);
  for (let d = 1; d <= days; d++) cells.push(new Date(view.getFullYear(), view.getMonth(), d));
  while (cells.length % 7) cells.push(null);
  return cells;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function icsStamp(d: Date) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function makeIcs(start: Date, title: string, description: string) {
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//f&d solutions//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@fd-solutions`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`,
    `DTEND:${icsStamp(end)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  return URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
}

export default function Contact() {
  const card = useCard((s) => s);
  const [today, setToday] = useState<Date | null>(null);
  const [view, setView] = useState<Date | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [chosen, setChosen] = useState<string[]>([services[0]]);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [done, setDone] = useState(false);
  const [icsUrl, setIcsUrl] = useState<string | null>(null);

  // Dates are resolved on the client to avoid server/client timezone mismatches.
  useEffect(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    setToday(now);
    setView(new Date(now.getFullYear(), now.getMonth(), 1));
  }, []);

  useEffect(() => {
    if (card.order && !chosen.includes(services[0])) setChosen((c) => [services[0], ...c]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card.order]);

  useEffect(() => () => {
    if (icsUrl) URL.revokeObjectURL(icsUrl);
  }, [icsUrl]);

  const cells = useMemo(() => (view ? buildMonth(view) : []), [view]);
  const company = form.company || (card.name !== "Your Business" ? card.name : "");

  const summary = [
    `Services: ${chosen.join(", ")}`,
    company && `Company: ${company}`,
    card.order && `Card order: ${card.order.qty}× ${finishes[card.finish].label} "${card.name}" (€${card.order.total})`,
    form.message && `Notes: ${form.message}`,
  ]
    .filter(Boolean)
    .join("\n");

  const canSubmit = date && slot && form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && chosen.length > 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !date || !slot) return;
    const [h, m] = slot.split(":").map(Number);
    const start = new Date(date);
    start.setHours(h, m, 0, 0);
    setIcsUrl(makeIcs(start, "Strategy call · f&d solutions", `${summary}\nGuest: ${form.name} <${form.email}>`));
    setDone(true);
  };

  const mailto = date && slot
    ? `mailto:${site.contactEmail}?subject=${encodeURIComponent(
        `Booking request — ${date.toDateString()} ${slot}`,
      )}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n${summary}`)}`
    : "#";

  const disabled = (d: Date) => !today || d < today || d.getDay() === 0 || sameDay(d, today);

  return (
    <section id="contact" className="relative overflow-x-clip py-28 sm:py-36">
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gold/10 blur-[160px]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="eyebrow" data-reveal>
              05 — Contact &amp; Booking
            </span>
            <h2 className="section-title mt-5" data-reveal>
              Reserve your <span className="text-gold italic">strategy call</span>.
            </h2>
          </div>
          <p className="text-white/60 lg:pb-2" data-reveal>
            Thirty minutes with a founder. We audit your reviews, website and listings live — and leave you with a
            clear plan, whether you work with us or not.
          </p>
        </div>

        <div className="glass rim mt-14 overflow-hidden" data-reveal>
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center px-6 py-20 text-center"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -40 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
                  className="grid h-20 w-20 place-items-center rounded-full bg-gold-metal text-3xl text-navy-900 shadow-rim-lg"
                >
                  ✓
                </motion.div>
                <h3 className="mt-8 font-serif text-4xl font-semibold text-white">You&apos;re on the books, {form.name.split(" ")[0]}.</h3>
                <p className="mt-3 max-w-md text-white/60">
                  {date?.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} at {slot} (your local time). Add it to your
                  calendar and send us the request to confirm.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {icsUrl && (
                    <a href={icsUrl} download="fd-solutions-call.ics" className="btn-gold">
                      Add to calendar
                    </a>
                  )}
                  <a href={mailto} className="btn-glass">
                    Send confirmation email
                  </a>
                  <button
                    className="btn-glass"
                    onClick={() => {
                      setDone(false);
                      setSlot(null);
                    }}
                  >
                    Change time
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} className="grid lg:grid-cols-[1.05fr_1fr]">
                {/* Calendar */}
                <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-2xl font-semibold text-white">
                      {view?.toLocaleDateString("en-GB", { month: "long", year: "numeric" }) ?? " "}
                    </h3>
                    <div className="flex gap-2">
                      {[-1, 1].map((dir) => (
                        <button
                          type="button"
                          key={dir}
                          aria-label={dir < 0 ? "Previous month" : "Next month"}
                          disabled={dir < 0 && !!view && !!today && view <= new Date(today.getFullYear(), today.getMonth(), 1)}
                          onClick={() => view && setView(new Date(view.getFullYear(), view.getMonth() + dir, 1))}
                          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/70 transition hover:border-gold/60 hover:text-white disabled:opacity-30"
                        >
                          <span className={dir < 0 ? "rotate-180" : ""}>
                            <Arrow />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-7 gap-1.5 text-center">
                    {weekdays.map((w) => (
                      <span key={w} className="pb-2 text-[10px] font-semibold uppercase tracking-widest text-white/35">
                        {w}
                      </span>
                    ))}
                    {cells.map((d, i) =>
                      d ? (
                        <button
                          type="button"
                          key={i}
                          disabled={disabled(d)}
                          onClick={() => {
                            setDate(d);
                            setSlot(null);
                          }}
                          className={`relative aspect-square rounded-xl text-sm tabular-nums transition ${
                            date && sameDay(d, date)
                              ? "font-semibold text-navy-900"
                              : disabled(d)
                                ? "text-white/20"
                                : "text-white/80 hover:bg-white/10"
                          }`}
                        >
                          {date && sameDay(d, date) && (
                            <motion.span layoutId="day" className="absolute inset-0 rounded-xl bg-gold-metal shadow-rim" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                          )}
                          <span className="relative">{d.getDate()}</span>
                          {today && sameDay(d, today) && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-royal" />}
                        </button>
                      ) : (
                        <span key={i} />
                      ),
                    )}
                  </div>

                  <div className="mt-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">
                      {date ? `Available · ${date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}` : "Pick a date to see times"}
                    </p>
                    <div className="mt-3 grid grid-cols-4 gap-2">
                      {slots.map((s) => {
                        const taken = !date || isTaken(date, s);
                        return (
                          <button
                            type="button"
                            key={s}
                            disabled={taken}
                            onClick={() => setSlot(s)}
                            className={`rounded-xl border py-2.5 text-sm tabular-nums transition ${
                              slot === s
                                ? "border-gold bg-gold/20 text-white shadow-rim"
                                : taken
                                  ? "border-white/5 text-white/20 line-through"
                                  : "border-white/10 text-white/75 hover:border-gold/50"
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-5 p-6 sm:p-8">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">I&apos;m interested in</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {services.map((s) => {
                        const on = chosen.includes(s);
                        return (
                          <button
                            type="button"
                            key={s}
                            aria-pressed={on}
                            onClick={() => setChosen((c) => (on ? c.filter((x) => x !== s) : [...c, s]))}
                            className={`rounded-full border px-4 py-2 text-xs transition ${
                              on ? "border-gold bg-gold/15 text-white" : "border-white/10 text-white/60 hover:border-white/30"
                            }`}
                          >
                            {on ? "✓ " : "+ "}
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <AnimatePresence>
                    {card.order && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-gold/[0.06] p-4">
                          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold/60 bg-navy-800 font-serif text-sm italic text-gold">f&amp;d</span>
                          <div className="text-sm">
                            <p className="text-white">
                              {card.order.qty}× {finishes[card.finish].label} card · “{card.name}”
                            </p>
                            <p className="text-white/50">Reserved batch · €{card.order.total} · proof sent after the call</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} autoComplete="name" required />
                    <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} autoComplete="email" required />
                  </div>
                  <Field
                    label="Company"
                    value={form.company}
                    placeholder={card.name !== "Your Business" ? card.name : ""}
                    onChange={(v) => setForm({ ...form, company: v })}
                    autoComplete="organization"
                  />
                  <label className="block">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">Anything we should know?</span>
                    <textarea
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-navy-900/60 px-4 py-3 text-white outline-none transition focus:border-gold/60 focus:shadow-rim"
                    />
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <p className="text-sm text-white/60">
                      {date && slot ? (
                        <>
                          <span className="text-white">{date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</span> ·{" "}
                          <span className="text-white">{slot}</span> · 30 min · Video call
                        </>
                      ) : (
                        "Select a date and time"
                      )}
                    </p>
                    <button type="submit" disabled={!canSubmit} className="btn-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0">
                      Confirm booking <Arrow />
                    </button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-navy-900/60 px-4 py-3 text-white outline-none transition placeholder:text-white/25 focus:border-gold/60 focus:shadow-rim"
        {...rest}
      />
    </label>
  );
}
