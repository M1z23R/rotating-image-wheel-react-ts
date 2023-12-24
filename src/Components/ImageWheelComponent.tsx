import "./ImageWheelComponent.css";
import { useEffect, useMemo, useState } from "react";

interface Props {
  imageSize: { width: number; height: number };
  imageUrls: { label: string; src: string }[];
  gap?: number;
  autoRotate?: boolean;
  rotateSpeed?: number;
}
const ImageWheelComponent = ({
  imageUrls,
  imageSize,
  gap = 20,
  autoRotate = false,
  rotateSpeed = 0,
}: Props) => {
  const [angle, setAngle] = useState<number>(0);

  const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

  const distance = useMemo(
    () =>
      imageSize.height /
        (2 * Math.tan(degreesToRadians(360 / (imageUrls.length * 2)))) +
      gap,
    [imageUrls, imageSize, gap]
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

    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  });

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log(e.button);
    if (e.button === 0) {
      setDragging(true);
      setStartY(e.clientY);
    }
  };
  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragging(false);
    setStartY(e.touches[0].clientY);
    setLastAngle(angle);
  };
  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (dragging) {
      setAngle(lastAngle + ((startY - e.touches[0].clientY) % 360));
    }
  };
  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setDragging(true);
    setStartY(e.touches[0].clientY);
  };

  useEffect(() => {
    const id = setInterval(() => {
      if (autoRotate && !dragging) {
        setAngle((c) => (c - 1) % 360);
      }
    }, rotateSpeed);

    return () => {
      clearInterval(id);
    };
  }, [autoRotate, rotateSpeed, dragging]);

  return (
    <div
      onMouseDown={onMouseDown}
      onTouchMove={onTouchMove}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        border: "1px solid red",
        width: `${imageSize.width}px`,
        height: `${imageSize.height}px`,
      }}
    >
      {imageUrls.map((image, i) => (
        <div
          key={i}
          className="image-div"
          style={{
            height: imageSize.height,
            width: imageSize.width,
            transform: `rotateX(${getRotationAngle(
              i
            )}deg) translateZ(${distance}px)`,
            display:
              (getRotationAngle(i) >= 0 && getRotationAngle(i) <= 90) ||
              (getRotationAngle(i) >= 270 && getRotationAngle(i) <= 360)
                ? "block"
                : "none",
            zIndex: Math.abs(getRotationAngle(i) - 180),
            // (getRotationAngle(i) >= 0 && getRotationAngle(i) <= 90) ||
            // (getRotationAngle(i) >= 270 && getRotationAngle(i) <= 360)
            //   ? 0
            //   : -1,
          }}
        >
          <img src={image.src} />
        </div>
      ))}
    </div>
  );
};

export default ImageWheelComponent;
