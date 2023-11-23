import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

const BackButton = () => (
  <Link
    href="/content"
    className={cn(
      buttonVariants({ variant: "destructive" }),
      "no-underline fixed bottom-4 left-4 z-50 flex gap-2",
    )}
  >
    <ArrowRightOnRectangleIcon className="w-4 rotate-180" />
    <div className="capitalize hidden sm:inline">Back</div>
  </Link>
);

export default BackButton;
