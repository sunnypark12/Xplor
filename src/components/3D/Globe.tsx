import React, { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

interface GlobeProps {
  width?: number;
  height?: number;
}

const GlobeComponent: React.FC<GlobeProps> = ({
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  const globeRef = useRef<any>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // smooth autorotation & starting POV
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 1 }, 0);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100vw",
        height: "100vh",
        background: "transparent",
        pointerEvents: "auto",
      }}
    >
      <Globe
        ref={globeRef}
        width={width}
        height={height}
        backgroundColor="rgba(0,0,0,0)"     // keep the page background
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        showAtmosphere={false}
        enablePointerInteraction={true}
        onGlobeClick={(p) => console.log("Globe click:", p)}
        onGlobeRightClick={(p) => console.log("Globe right click:", p)}
      />
    </div>
  );
};

export default GlobeComponent;
