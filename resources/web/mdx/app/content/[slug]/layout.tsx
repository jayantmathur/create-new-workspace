import BackButton from "../components/backbutton";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid place-items-center py-10">
      <div className="prose dark:prose-invert">
        <BackButton />
        {children}
      </div>
    </div>
  );
}
