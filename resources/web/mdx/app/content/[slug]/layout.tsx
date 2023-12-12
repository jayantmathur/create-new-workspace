import BackButton from "../components/backbutton";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackButton className="fixed z-50 sm:bottom-4 sm:left-4 sm:translate-x-0 bottom-14 left-1/2 -translate-x-1/2" />
      <div className="grid place-items-center">
        <div className="prose dark:prose-invert">{children}</div>
      </div>
    </>
  );
}
