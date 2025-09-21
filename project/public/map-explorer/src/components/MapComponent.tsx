
import React, { useEffect, useRef, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface College {
  id: number;
  name: string;
  district: string;
  type: string;
  lat: number;
  lng: number;
  established: number;
  courses: number;
  website?: string;
}

interface MapComponentProps {
  colleges: College[];
  selectedCollege: College | null;
  onCollegeSelect: (college: College) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ colleges, selectedCollege, onCollegeSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  const apiKey = 'AIzaSyDbtP-vQy-wftWtzoeiOlqZwF0p8gf_awM';

  // Load Google Maps script
  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      initializeMap();
      return;
    }

    // Check if script is already being loaded
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;

    window.initMap = () => {
      console.log('Google Maps loaded successfully');
      setMapLoaded(true);
      initializeMap();
    };

    script.onerror = (error) => {
      console.error('Failed to load Google Maps:', error);
      setMapError('Failed to load Google Maps. Please check your internet connection and API key.');
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup function
      if (window.initMap) {
        delete window.initMap;
      }
    };
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps) {
      console.error('Map container or Google Maps not available');
      return;
    }

    try {
      // Tamil Nadu center coordinates
      const tamilNaduCenter = { lat: 11.1271, lng: 78.6569 };

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 7,
        center: tamilNaduCenter,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      });

      mapInstanceRef.current = map;
      console.log('Map initialized successfully');
      updateMarkers();
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Error initializing the map. Please refresh the page.');
    }
  };

  const updateMarkers = () => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) {
      console.log('Map or Google Maps not ready for markers');
      return;
    }

    try {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers for colleges
      colleges.forEach(college => {
        const marker = new window.google.maps.Marker({
          position: { lat: college.lat, lng: college.lng },
          map: mapInstanceRef.current,
          title: college.name,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">${college.name}</h3>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;"><strong>District:</strong> ${college.district}</p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;"><strong>Type:</strong> ${college.type}</p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;"><strong>Established:</strong> ${college.established}</p>
              <p style="margin: 4px 0; color: #6b7280; font-size: 14px;"><strong>Courses:</strong> ${college.courses}+</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
          onCollegeSelect(college);
        });

        markersRef.current.push(marker);
      });

      console.log(`Added ${colleges.length} markers to the map`);
    } catch (error) {
      console.error('Error adding markers:', error);
    }
  };

  // Update markers when colleges change
  useEffect(() => {
    if (mapLoaded && mapInstanceRef.current) {
      updateMarkers();
    }
  }, [colleges, mapLoaded]);

  // Center map on selected college
  useEffect(() => {
    if (selectedCollege && mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat: selectedCollege.lat, lng: selectedCollege.lng });
      mapInstanceRef.current.setZoom(10);
    }
  }, [selectedCollege]);

  if (mapError) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{mapError}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 rounded-lg border border-gray-200"
        style={{ minHeight: '400px' }}
      >
        {!mapLoaded && (
          <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Loading Tamil Nadu colleges map...</p>
              <p className="text-sm text-gray-500 mt-2">Please wait while we load the map</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
