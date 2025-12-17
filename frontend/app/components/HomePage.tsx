import Script from "next/script";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      {/* Load the model-viewer web component */}
      <Script
        type="module"
        src="https://unpkg.com/@google/model-viewer@latest/dist/model-viewer.min.js"
        strategy="beforeInteractive"
      />

      {/* 3D model centered on the page */}
      {(() => {
        const ModelViewer: any = "model-viewer";
        return (
          <ModelViewer
            src="assets\heart+with+brain+3d+model.glb"
            alt="Heart with brain 3D model"
            camera-controls
            autoplay
            camera-orbit="90deg 90deg auto"
            style={{
              width: "1200px",
              height: "750px",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
        );
      })()}
    </div>
  );
}
