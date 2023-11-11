import { HTMLAttributes } from "react";
import { Metadata } from "@/app/content/types";

type Props = HTMLAttributes<HTMLDivElement> & { meta: Metadata };

const Card = ({ meta, ...props }: Props) => (
  <div {...props}>
    <div>{meta.title}</div>
    <div>{meta.publishedAt}</div>
    <div>{meta.description}</div>
  </div>
);

export default Card;
