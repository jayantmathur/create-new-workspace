import BackButton from "../components/backbutton";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BackButton className="fixed bottom-2 left-2 z-50" />
      <div className="grid place-items-center">
        <div className="prose dark:prose-invert">{children}</div>
      </div>
    </>
  );
}
