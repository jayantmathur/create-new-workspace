import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

const BackButton = () => (
  <Link href="/content">
    <Button variant="ghost" className="fixed bottom-4 left-4 z-50">
      <ArrowRightOnRectangleIcon className="h-full rotate-180 p-1" />
      <span className="capitalize hidden sm:inline">Back</span>
    </Button>
  </Link>
);

export default BackButton;
