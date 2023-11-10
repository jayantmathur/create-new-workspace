type Metadata = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  publishedAt?: string;
};

type MDXImport = typeof import("*.mdx") & {
  metadata?: Metadata;
};

export type { MDXImport, Metadata };
