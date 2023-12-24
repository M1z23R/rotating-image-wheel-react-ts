import { useState } from "react";
import ImageWheelComponent from "./Components/ImageWheelComponent";

function App() {
  const [imageUrls, setImageUrls] = useState<{ label: string; src: string }[]>([
    { label: "0-480x320.jpg", src: "0-480x320.jpg" },
    { label: "1-480x320.jpg", src: "1-480x320.jpg" },
    { label: "2-480x320.jpg", src: "2-480x320.jpg" },
    { label: "3-480x320.jpg", src: "3-480x320.jpg" },
    { label: "4-480x320.jpg", src: "4-480x320.jpg" },
    { label: "5-480x320.jpg", src: "5-480x320.jpg" },
    { label: "6-480x320.jpg", src: "6-480x320.jpg" },
    { label: "7-480x320.jpg", src: "7-480x320.jpg" },
  ]);

  const [gap, setGap] = useState<number>(20);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [rotateSpeed, setRotateSpeed] = useState<number>(20);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files?.[0]) {
      return;
    }
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageUrls((c) => [
        ...c,
        { label: e.target.files![0].name, src: reader.result as string },
      ]);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  const [imgWidth, setImgWidth] = useState<number>(480);
  const [imgHeight, setImgHeight] = useState<number>(320);

  return (
    <div>
      <label>Gap (px)</label>
      <input
        min={0}
        max={100}
        step={1}
        type="range"
        value={gap}
        onChange={(e) => setGap(+e.target.value)}
      />
      <ul>
        {imageUrls.map((image, i) => (
          <li key={i}>
            {image.label}
            <button
              onClick={() => setImageUrls((c) => c.filter((y) => y !== image))}
            >
              X
            </button>
          </li>
        ))}
      </ul>
      <div>
        <label>Add image</label>
        <input type="file" onChange={onFileChange} />
      </div>
      <div>
        <label>Auto rotate</label>
        <input
          type="checkbox"
          checked={autoRotate}
          value={undefined}
          onChange={(e) => setAutoRotate(e.target.checked)}
        />
      </div>
      <div>
        <label>Rotating speed (px)</label>
        <input
          disabled={!autoRotate}
          min={0}
          max={100}
          step={1}
          type="range"
          value={rotateSpeed}
          onChange={(e) => setRotateSpeed(+e.target.value)}
        />
      </div>

      <div>
        <label>Width</label>
        <input
          type="number"
          value={imgWidth}
          onChange={(e) => setImgWidth(+e.target.value)}
        />
      </div>
      <div>
        <label>Width</label>
        <input
          type="number"
          value={imgHeight}
          onChange={(e) => setImgHeight(+e.target.value)}
        />
      </div>
      <div
        style={{
          height: "100vh",
          flexDirection: "column",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageWheelComponent
          imageSize={{ width: imgWidth, height: imgHeight }}
          imageUrls={imageUrls}
          gap={gap}
          autoRotate={autoRotate}
          rotateSpeed={rotateSpeed}
        />
      </div>
    </div>
  );
}

export default App;
