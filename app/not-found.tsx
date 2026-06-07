import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <p className="text-6xl font-bold tracking-wider text-neutral-900">404</p>
      <p className="mt-4 text-sm uppercase tracking-[0.25em] text-neutral-500">
        Page not found
      </p>
      <p className="mt-6 max-w-sm text-neutral-600">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <Link
        href="/"
        className="mt-10 border border-neutral-900 px-6 py-3 text-xs uppercase tracking-[0.2em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
      >
        Back to gallery
      </Link>
    </div>
  );
}
