import Button from '../ui/Button';

export default function ApplyBand() {
  return (
    <section className="bg-[#173B7A]">
      <div className="container-x flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div>
          <h2 className="text-3xl text-white">Thinking about joining us?</h2>
          <p className="mt-2 max-w-xl text-white">
            Tell us which program interests you. The admissions team will contact you with the next steps.
          </p>
        </div>
        <Button to="/admissions#interest" variant="secondary">Express your interest</Button>
      </div>
    </section>
  );
}



