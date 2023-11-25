import { cloneElement } from "react";
import Link from "next/link";
import { Home, User, Library } from "lucide-react";
import { TabsProps } from "@radix-ui/react-tabs";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    icon: <User />,
  },
  {
    name: "projects",
    href: "/content",
    icon: <Library />,
  },
];

const Component = ({ className, ...props }: TabsProps) => (
  <Tabs className={cn(className)} {...props}>
    <TabsList className="flex gap-2">
      {pages.map(({ name, href, icon }) => (
        <Link href={href} key={name} className="no-underline">
          <TabsTrigger value={name} className="flex gap-2 hover:bg-primary/5">
            {cloneElement(icon, { className: "-m-1 p-1" })}
            <div className="capitalize hidden sm:inline">{name}</div>
          </TabsTrigger>
        </Link>
      ))}
    </TabsList>
  </Tabs>
);

export default Component;
