type Props = {
  imageUrl: string | null;
};

export default function ImageResult({ imageUrl }: Props) {
  if (!imageUrl) return null;

  return (
    <img
      src={imageUrl}
      alt="Generated"
      className="w-full rounded-md"
    />
  );
}
