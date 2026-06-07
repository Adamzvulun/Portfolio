import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Adam Zvulun",
  description: "Get in touch with Adam Zvulun for bookings or inquiries.",
};

export default function Page() {
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "";

  return (
    <div className="mx-auto max-w-2xl px-6 pb-12">
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
