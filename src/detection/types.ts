/** One occurrence in an exact text snapshot; offsets are UTF-16, end exclusive. */
export type Finding = {
  id: string;
  category: "person" | "email" | "phone" | "identifier";
  start: number;
  end: number;
  text: string;
  confidence?: number;
  detector: "rule" | "model";
};
