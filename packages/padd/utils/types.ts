export type CLIOptions = {
  path: string;
  packs: string[];
  extras: boolean;
};

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
  extras: {
    dependencies?: string[];
    devDependencies?: string[];
  };
};

export type DocType = {
  name: string;
  type: "doc";
  folder: string;
};

export type ListType = {
  [key: string]: Omit<AppType | DocType, "name">;
};
