import { MockImage } from "./image.mock";

export const MockMetric = ({
  imageUrl,
  alt,
  value,
  title,
  textStyles,
}: {
  imageUrl: string;
  alt: string;
  value: string;
  title: string;
  textStyles?: string;
}) => {
  return (
    <div className={textStyles} data-testid="metric">
      <MockImage src={imageUrl} alt={alt} />
      {value} {title}
    </div>
  );
};
