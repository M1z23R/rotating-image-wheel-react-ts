import "./ImageWheelComponent.css";
import { useEffect, useMemo, useState } from "react";

interface Props {
  imageSize: { width: number; height: number };
  imageUrls: string[];
  gap?: number;
}
const ImageWheelComponent = ({ imageUrls, imageSize, gap = 20 }: Props) => {
  const [angle, setAngle] = useState<number>(0);

  const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

  const distance = useMemo(
    () =>
      imageSize.width /
        (4 * Math.tan(degreesToRadians(360 / (imageUrls.length * 2)))) +
      gap,
    [imageUrls, imageSize]
  );

  const innerAngle = useMemo(
    () => 360 / imageUrls.length,
    [imageUrls, imageSize]
  );

  const getRotationAngle = (i: number) => {
    return (i * innerAngle + angle + 360) % 360;
  };

  const [startY, setStartY] = useState<number>(0);
  const [dragging, setDragging] = useState<boolean>(false);
  const [lastAngle, setLastAngle] = useState<number>(0);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      setDragging(false);
      setStartY(e.clientY);
      setLastAngle(angle);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (dragging) {
        setAngle(lastAngle + ((startY - e.clientY) % 360));
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      setDragging(true);
      setStartY(e.clientY);
    };

    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
    };
  });
  return (
    <div
      style={{
        width: `${imageSize.width}px`,
        height: `${imageSize.height + distance}px`,
      }}
    >
      {imageUrls.map((image, i) => (
        <div
          key={i}
          className="image-div"
          style={{
            transform: `rotateX(${getRotationAngle(
              i
            )}deg) translateZ(${distance}px)`,
            display:
              (getRotationAngle(i) >= 0 && getRotationAngle(i) <= 90) ||
              (getRotationAngle(i) >= 270 && getRotationAngle(i) <= 360)
                ? "block"
                : "none",
          }}
        >
          <img src={image} />
        </div>
      ))}
    </div>
  );
};

export default ImageWheelComponent;
