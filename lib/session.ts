export type ImageItem = {
  url: string;
  prompt: string;
  style: string;
};

export type Session = {
  id: string;
  title: string;
  images: ImageItem[];
};

export function createSession(prompt: string): Session {
  return {
    id: crypto.randomUUID(),
    title: prompt.slice(0, 32) || "New session",
    images: [],
  };
}
