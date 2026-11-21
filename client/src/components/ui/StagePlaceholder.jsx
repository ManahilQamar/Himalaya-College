// Temporary body for pages that get built in later stages.
export default function StagePlaceholder({ stage, children }) {
  return (
    <section className="section-y">
      <div className="container-x">
        <div className="rounded-xl border border-dashed border-navy-200 bg-paper p-8 text-navy-600">
          <p className="font-semibold text-navy-800">Content for this page is built in {stage}.</p>
          {children && <p className="mt-2">{children}</p>}
        </div>
      </div>
    </section>
  );
}


