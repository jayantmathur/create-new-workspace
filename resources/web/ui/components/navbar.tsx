import { HTMLAttributes, cloneElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, User, Library } from "lucide-react";

import Logo from "@/public/icons/icon.svg";
import { buttonVariants } from "./ui/button";
import { cn } from "@/lib/utils";

const pages = [
  {
    name: "home",
    href: "/",
    icon: <Home />,
  },
  {
    name: "about",
    href: "/about",
    // icon: <User />,
    icon: (
      <div>
        <Image src={Logo} alt="My logo" className="m-0 w-4 h-4" />
      </div>
    ),
  },
  {
    name: "projects",
    href: "/content",
    icon: <Library />,
  },
];

const Component = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      className,
      "flex flex-nowrap rounded-lg bg-background/90 border sm:border-none",
    )}
    {...props}
  >
    {pages.map(({ name, href, icon }) => (
      <Link
        href={href}
        key={name}
        className={cn(buttonVariants({ variant: "link" }), "no-underline")}
      >
        <div className="flex gap-2">
          {cloneElement(icon, { className: "-m-1 p-1" })}
          <div className="capitalize hidden sm:inline">{name}</div>
        </div>
      </Link>
    ))}
  </div>
);

export default Component;
