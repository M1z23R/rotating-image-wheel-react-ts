import ImageWheelComponent from "./Components/ImageWheelComponent";

function App() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ImageWheelComponent
        imageSize={{ width: 200, height: 100 }}
        imageUrls={[
          "0-480x320.jpg",
          "1-480x320.jpg",
          "2-480x320.jpg",
          "3-480x320.jpg",
          "4-480x320.jpg",
          "5-480x320.jpg",
          "6-480x320.jpg",
          "7-480x320.jpg",
        ]}
      />
    </div>
  );
}

export default App;
