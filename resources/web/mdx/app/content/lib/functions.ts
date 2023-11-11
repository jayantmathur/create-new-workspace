import { MDXImport, Blog } from "../types";
import { readdir } from "fs/promises";
import { resolve } from "path";

const path = resolve(process.cwd(), "app/content/posts");

const getAllBlogs = async () =>
  await readdir(path).then((files) =>
    files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(".mdx", "")),
  );

const getBlog = async (slug: string) => {
  const file = await getAllBlogs().then((files) =>
    files.find((file) => file === slug),
  );

  if (!file) return;

  const blog = (await import(`../posts/${file}.mdx`)) as MDXImport;

  return {
    content: blog.default,
    metadata: blog.metadata,
    slug: file,
  } as Blog;
};

export { getBlog, getAllBlogs };
