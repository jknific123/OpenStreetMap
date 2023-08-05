export interface TagOptions {
  name: string;
  description: string;
  tags: Record<string, string[]>;
  selected: boolean;
}
