import Link from "next/link";
import { Button } from "@nextui-org/button";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

const BackButton = () => (
  <Link href="/content">
    <Button
      color="warning"
      variant="flat"
      className="fixed bottom-4 left-4 z-50"
      startContent={
        <ArrowRightOnRectangleIcon className="h-full rotate-180 p-1" />
      }
      // size="sm"
    >
      <span className="capitalize hidden sm:inline">Back</span>
    </Button>
  </Link>
);

export default BackButton;
