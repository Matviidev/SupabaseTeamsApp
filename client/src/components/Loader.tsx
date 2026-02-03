import { Spinner } from "./ui/shadcn-io/spinner";

function AppLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <Spinner variant="bars" className="text-stone-200" size={60} />
    </div>
  );
}

export default AppLoader;
