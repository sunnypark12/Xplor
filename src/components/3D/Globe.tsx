import React, { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

interface TripData {
  id: string;
  lat: number;
  lng: number;
  location: string;
  duration: number;
  occasion: string;
  travelerType: string;
  image: string;
}

interface GlobeProps {
  width?: number;
  height?: number;
}

const GlobeComponent: React.FC<GlobeProps> = ({
  width = window.innerWidth,
  height = window.innerHeight,
}) => {
  const globeRef = useRef<any>(null);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);

  // Mock trip data with real coordinates and proper travel personality types
  const mockTrips: TripData[] = [
    {
      id: "1",
      lat: 20.7128,
      lng: -87.0060,
      location: "Yucatan Peninsula",
      duration: 3,
      occasion: "Anniversary",
      travelerType: "Thrill-Seeker",
      image: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=400"
    },
    {
      id: "2", 
      lat: 48.8566,
      lng: 2.3522,
      location: "Paris",
      duration: 5,
      occasion: "Honeymoon",
      travelerType: "Luxury Jetsetter",
      image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=400"
    },
    {
      id: "3",
      lat: 35.6762,
      lng: 139.6503,
      location: "Tokyo",
      duration: 7,
      occasion: "Solo Adventure",
      travelerType: "Cultural Explorer",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400"
    },
    {
      id: "4",
      lat: -33.8688,
      lng: 151.2093,
      location: "Sydney",
      duration: 4,
      occasion: "Family Vacation",
      travelerType: "Family Memory-Maker",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
    },
    {
      id: "5",
      lat: 41.9028,
      lng: 12.4964,
      location: "Rome",
      duration: 6,
      occasion: "Cultural Trip",
      travelerType: "Cultural Explorer",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400"
    },
    {
      id: "6",
      lat: -22.9068,
      lng: -43.1729,
      location: "Rio de Janeiro",
      duration: 8,
      occasion: "Group Trip",
      travelerType: "Social Butterfly",
      image: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400"
    },
    {
      id: "7",
      lat: 27.1751,
      lng: 78.0421,
      location: "Agra",
      duration: 2,
      occasion: "Weekend Getaway",
      travelerType: "Offbeat Explorer",
      image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400"
    },
    {
      id: "8",
      lat: 13.7563,
      lng: 100.5018,
      location: "Bangkok",
      duration: 10,
      occasion: "Backpacking",
      travelerType: "Budget Backpacker",
      image: "https://images.unsplash.com/photo-1563492065-1a4b9c2b9d0e?w=400"
    },
    {
      id: "9",
      lat: -17.8216,
      lng: -149.4985,
      location: "Bora Bora",
      duration: 5,
      occasion: "Relaxation",
      travelerType: "Serenity Seeker",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400"
    },
    {
      id: "10",
      lat: 41.3851,
      lng: 2.1734,
      location: "Barcelona",
      duration: 6,
      occasion: "Food Tour",
      travelerType: "Culinary Explorer",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400"
    }
  ];

  useEffect(() => {
    if (!globeRef.current) return;

    // smooth autorotation & starting POV
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    globeRef.current.pointOfView({ lat: 0, lng: 0, altitude: 2.5 }, 0); // Increased altitude to zoom out
  }, []);

  // Popup component with glass-card design
  const TripPopup = ({ trip, onClose }: { trip: TripData; onClose: () => void }) => (
    <div className="trip-popup-glass">
      {/* Close button */}
      <button onClick={onClose} className="trip-popup-close">
        ×
      </button>

      {/* Heart icon */}
      <div className="trip-popup-heart">
        ♡
      </div>

      {/* Background image with overlay */}
      <div 
        className="trip-popup-image"
        style={{ backgroundImage: `url(${trip.image})` }}
      >
        <div className="trip-popup-overlay" />
        
        {/* Location and traveler type */}
        <div className="trip-popup-location">
          <h2>{trip.location}</h2>
          <p className="trip-popup-traveler-type">{trip.travelerType}</p>
        </div>
      </div>

      {/* Bottom section with duration and occasion */}
      <div className="trip-popup-details">
        <div className="trip-popup-duration">
          <div className="trip-popup-duration-label">Duration:</div>
          <div className="trip-popup-duration-value">
            {trip.duration}
            <span className="trip-popup-duration-days">DAYS</span>
          </div>
        </div>
        
        <div className="trip-popup-occasion">
          <div className="trip-popup-divider"></div>
          <div className="trip-popup-occasion-label">Occasion:</div>
          <div className="trip-popup-occasion-value">{trip.occasion}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "60vw", // Reduced width to fit on left side
        height: "100vh",
        background: "transparent",
        pointerEvents: "auto",
      }}
    >
      <Globe
        ref={globeRef}
        width={width * 0.6} // Scale width to match container
        height={height}
        backgroundColor="rgba(0,0,0,0)"     // keep the page background
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
        showAtmosphere={false}
        enablePointerInteraction={true}
        pointsData={mockTrips}
        pointAltitude={0.1}
        pointColor={() => '#ff6b6b'}
        pointRadius={0.8}
        pointResolution={8}
        onPointClick={(point) => {
          setSelectedTrip(point as TripData);
        }}
        pointLabel={(point) => {
          const trip = point as TripData;
          return `${trip.location} - ${trip.occasion}`;
        }}
      />
      
      {/* Render popup if a trip is selected */}
      {selectedTrip && (
        <TripPopup 
          trip={selectedTrip} 
          onClose={() => setSelectedTrip(null)} 
        />
      )}
    </div>
  );
};

export default GlobeComponent;
