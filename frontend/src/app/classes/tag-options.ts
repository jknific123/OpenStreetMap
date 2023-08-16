export interface TagOptions {
  name: string;
  description: string;
  descriptionENG: string;
  tags: Record<string, string[]>;
  selected: boolean;
}
