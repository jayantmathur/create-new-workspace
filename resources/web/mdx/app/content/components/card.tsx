import { HTMLAttributes } from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";
import { Metadata } from "@/app/content/types";
import { rhm } from "@/config/fonts";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & { meta: Metadata; slug: string };

const Card = ({ meta, slug, className, ...props }: Props) => (
  <div className={cn("[&>*]:m-0", className)} {...props}>
    <h2>{meta.title}</h2>
    <p className={cn("opacity-50 text-xs", rhm.className)}>
      {meta.publishedAt}
    </p>
    <p className="py-2">{meta.description}</p>
    {meta.keywords && (
      <div className="flex flex-row gap-2 py-2 flex-wrap">
        {meta.keywords.map((tag) => (
          <Button
            key={tag}
            color="primary"
            variant="bordered"
            className="uppercase pointer-events-none"
            size="sm"
            radius="sm"
          >
            {tag}
          </Button>
        ))}
      </div>
    )}
    <Link href={`/content/${slug}`}>
      <Button className="mt-2">Read More</Button>
    </Link>
  </div>
);

export default Card;
