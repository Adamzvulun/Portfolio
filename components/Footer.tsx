export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-neutral-200 mt-24">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs uppercase tracking-widest text-neutral-500">
        <span>© {year} Adam Zvulun</span>
        <span className="font-serif normal-case tracking-normal text-base text-neutral-700">
          Photography
        </span>
      </div>
    </footer>
  );
}
