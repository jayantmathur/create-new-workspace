export type AppType = {
  name: string;
  type: "app";
  folder?: string;
  scripts?: {
    [key: string]: string;
  };
  dependencies?: string[];
  devDependencies?: string[];
  postinstalls?: string[];
  extras?: string[];
};

export type DocType = {
  name: string;
  type: "doc";
  folder: string;
};

export type ListType = {
  [key: string]: Omit<AppType | DocType, "name">;
};
