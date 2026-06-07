import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Adam Zvulun",
  description: "Get in touch with Adam Zvulun for bookings or inquiries.",
};

export default function Page() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold uppercase tracking-wider">Get in touch</h1>
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-neutral-500">
          Bookings, prints, and inquiries
        </p>
      </header>

      <ContactForm formspreeId={formspreeId} />

      <p className="mt-8 text-center text-sm text-neutral-500">
        Or email{" "}
        <a className="underline" href="mailto:adam.zvulun@gmail.com">
          adam.zvulun@gmail.com
        </a>
      </p>
    </div>
  );
}
