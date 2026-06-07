"use client";

import { useState, FormEvent } from "react";

type Props = { formspreeId: string };

type Status = "idle" | "sending" | "ok" | "error";

export default function ContactForm({ formspreeId }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const configured = formspreeId.length > 0;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) return;

    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("ok");
        form.reset();
      } else {
        const body = await res.json().catch(() => ({}));
        setErrorMsg(body?.errors?.[0]?.message ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="rounded border border-neutral-200 p-8 text-center">
        <p className="font-serif text-2xl">Thank you.</p>
        <p className="mt-2 text-neutral-600">I&apos;ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {!configured && (
        <p className="rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Contact form is not yet configured. Set <code className="font-mono">NEXT_PUBLIC_FORMSPREE_ID</code>{" "}
          in <code className="font-mono">.env.local</code> (or Vercel env vars). See README for steps.
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        <span className="uppercase tracking-widest text-neutral-500">Name</span>
        <input
          required
          name="name"
          type="text"
          className="border border-neutral-300 px-3 py-2 focus:border-neutral-900 outline-none"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="uppercase tracking-widest text-neutral-500">Email</span>
        <input
          required
          name="email"
          type="email"
          className="border border-neutral-300 px-3 py-2 focus:border-neutral-900 outline-none"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span className="uppercase tracking-widest text-neutral-500">Message</span>
        <textarea
          required
          name="message"
          rows={6}
          className="border border-neutral-300 px-3 py-2 focus:border-neutral-900 outline-none resize-y"
        />
      </label>

      <button
        type="submit"
        disabled={!configured || status === "sending"}
        className="mt-2 bg-neutral-900 text-white px-6 py-3 text-sm uppercase tracking-widest hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Send"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-700">{errorMsg}</p>
      )}
    </form>
  );
}
