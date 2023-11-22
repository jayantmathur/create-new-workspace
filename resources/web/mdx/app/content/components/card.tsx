import { HTMLAttributes } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@nextui-org/button";
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
        <div className="relative w-full">
          <Image
            src={src}
            alt={alt}
            {...imageProps}
            fill
            // className="object-contain m-0"
          />
        </div>
      )}
      <div className={cn("[&>*]:m-0", className)} {...props}>
        <h2>{title}</h2>
        <p className={cn("opacity-50 text-xs", rhm.className)}>{date}</p>
        <p className="py-2">{description}</p>
        {keywords && (
          <div className="flex flex-row gap-2 py-2 flex-wrap">
            {keywords.map((tag) => (
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
    </div>
  );
};

export default Card;
