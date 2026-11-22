const ReturnsPage = () => {
  return (
    <main className="bg-ivory min-h-[100svh] pb-16">
      {/* Navbar offset */}
      <div className="h-14 md:h-16" />

      {/* Page title */}
      <header className="px-6 md:px-10 pt-8 md:pt-10 pb-6">
        <h1 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111]">
          Returns
        </h1>
      </header>

      <section className="flex flex-col items-center justify-center pt-10 pb-16 px-6">
        <h2 className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[#111] mb-4">
          No returns yet
        </h2>
        <p className="font-sans text-[12px] text-[#999]">
          Any items you return will appear here.
        </p>
      </section>
    </main>
  );
};

export default ReturnsPage;
