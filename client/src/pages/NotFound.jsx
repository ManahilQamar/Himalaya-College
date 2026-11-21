import Seo from '../components/ui/Seo';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <section className="section-y">
      <Seo title="Page not found" />
      <div className="container-x text-center">
        <h1 className="text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-navy-500">
          This page does not exist or was moved. Use the menu, or go back to the home page.
        </p>
        <Button to="/" className="mt-8">Go to home page</Button>
      </div>
    </section>
  );
}


