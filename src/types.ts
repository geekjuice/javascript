export type Bag<T> = Record<string, T>;

export type Files = string[];

export type Options = {
  dry: boolean;
  yes: boolean;
};

export type Action = (options?: Options, files?: string[]) => Promise<void>;

export type Actions = Record<string, Action>;
