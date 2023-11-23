import { HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Metadata } from "@/app/content/types";
import { rhm } from "@/config/fonts";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement> & { meta: Metadata; slug: string };

const Card = ({ meta, slug, className, ...props }: Props) => {
  const { title, description, date, keywords, image } = meta;

  const { src, alt, width, height, ...imageProps } = image;

  return (
    <div className={cn("flex [&>*]:flex-grow flex-wrap gap-8", className)}>
      {src && alt && (
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            fill
            className="m-0 dark:invert"
            {...imageProps}
          />
        </div>
      )}
      <div className={cn("[&>*]:m-0 basis-96", className)} {...props}>
        <h2>{title}</h2>
        <p className={cn("opacity-50 text-xs", rhm.className)}>{date}</p>
        <p className="py-2">{description}</p>
        {keywords && (
          <div className="flex flex-row gap-2 py-2 flex-wrap">
            {keywords.map((tag) => (
              <div
                key={tag}
                className="uppercase pointer-events-none border-2 px-4 py-2 opacity-75 rounded-sm text-xs"
              >
                {tag}
              </div>
            ))}
          </div>
        )}
        <div className="pt-2">
          <Link
            href={`/content/${slug}`}
            className={cn(
              buttonVariants({ variant: "default" }),
              "no-underline",
            )}
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
