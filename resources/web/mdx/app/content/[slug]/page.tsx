import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getBlog } from "../lib/functions";

const Page = async ({ params }: { params: { slug: string } }) => {
  const slug = params.slug;
  const blog = await getBlog(slug);

  if (!blog) redirect("/content");

  const Content = blog?.content;

  return <Content />;
};

export default Page;

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> => {
  // read route params
  const { slug } = params;
  const blog = await getBlog(slug);

  if (!blog) return {};

  const { metadata } = blog;

  return { ...metadata };
};
