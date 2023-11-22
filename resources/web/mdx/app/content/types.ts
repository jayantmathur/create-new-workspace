type Metadata = {
  title: string;
  description: string;
  keywords: string[];
  image: string;
  url: string;
  publishedAt: string;
};

type MDXImport = typeof import("*.mdx") & {
  metadata: Partial<Metadata>;
};

type Blog = {
  content: typeof import("*.mdx").default;
  metadata: Metadata;
  slug: string;
};

export type { MDXImport, Metadata, Blog };
