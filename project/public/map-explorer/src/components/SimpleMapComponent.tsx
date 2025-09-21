import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from 'lucide-react';
import SearchBar from './SearchBar';
import { districts } from '@/data';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Tooltip, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import './SimpleMapComponent.css';
import customDistrict from '@/data/districts/custom_district.json';

declare global {
  interface Window {
    google: any;
    initSimpleMap: () => void;
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
  pincode?: string;
  review?: string;
}

interface SimpleMapComponentProps {
  colleges: College[];
}

// Vibrant color palette for districts
const DISTRICT_COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6',
  '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3',
  '#808000', '#ffd8b1', '#000075', '#808080', '#ffb300', '#00bfae', '#ff6f61', '#8e24aa',
  '#43a047', '#fb8c00', '#3949ab', '#00acc1', '#c62828', '#ad1457', '#6d4c41', '#009688',
  '#7e57c2', '#cddc39', '#ff7043', '#26a69a', '#ec407a', '#ab47bc', '#5c6bc0', '#d4e157'
];

// Use the exact district names from the GeoJSON for color mapping
const GEOJSON_DISTRICTS = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanniyakumari", "Karur", "Madurai", "The Nilgiris", "Namakkal", "Perambalur", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Theni", "Tenkasi", "Thiruvarur", "Tiruchirappalli", "Tirunelveli", "Tiruppur", "Tirupathur", "Thiruvallur", "Tiruvannamalai", "Tuticorin", "Vellore", "Villupuram", "Virudhunagar", "Krishnagiri", "Nagapattinam", "Mayiladuthurai", "Kanchipuram", "Thanjavur"
];
const districtColorMap = Object.fromEntries(
  GEOJSON_DISTRICTS.map((district, i) => [district, DISTRICT_COLORS[i % DISTRICT_COLORS.length]])
);

// Define a red marker icon for the selected college
const redMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Define a large red marker icon for the selected college
const largeRedMarkerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [38, 60], // larger size
  iconAnchor: [19, 60],
  popupAnchor: [1, -50],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [60, 60],
});

// Helper to normalize district names
const normalizeDistrict = (name) => (name || '').trim().toLowerCase();

const SimpleMapComponent: React.FC<SimpleMapComponentProps> = ({ colleges }) => {
  const [filteredColleges, setFilteredColleges] = useState<College[]>(colleges);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<{ [id: number]: any }>({});
  const [resetKey, setResetKey] = useState(0); // for resetting map view
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(null);
  const [districtGeoJson, setDistrictGeoJson] = useState<any>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState(null);
  // Recent searches state
  const [recentSearches, setRecentSearches] = useState<College[]>([]);
  // Theme state
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  // Update recent searches when a college is selected
  useEffect(() => {
    if (selectedCollege) {
      setRecentSearches(prev => {
        // Remove if already present
        const filtered = prev.filter(c => c.id !== selectedCollege.id);
        // Add to front, keep max 7
        return [selectedCollege, ...filtered].slice(0, 7);
      });
    }
  }, [selectedCollege]);

  // Remove filter logic: always use colleges array
  useEffect(() => {
    setFilteredColleges(colleges);
  }, [colleges]);

  // Center and animate selected marker, but always show all filtered markers
  useEffect(() => {
    if (selectedCollege && mapRef.current) {
      const { lat, lng } = selectedCollege;
      if (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat > -90 && lat < 90 &&
        lng > -180 && lng < 180
      ) {
        mapRef.current.setView([lat, lng], 14, { animate: true });
      } else {
        console.warn('Invalid coordinates for selected college:', selectedCollege);
      }
    }
  }, [selectedCollege]);

  // Reset view handler
  const handleResetView = () => {
    setSelectedCollege(null);
    setResetKey(prev => prev + 1);
    if (mapRef.current) {
      mapRef.current.setView(tamilNaduCenter, 7, { animate: true });
    }
  };

  // Clear selectedCollege if it is not in the colleges list
  useEffect(() => {
    if (
      selectedCollege &&
      !colleges.some((c) => c.id === selectedCollege.id)
    ) {
      setSelectedCollege(null);
    }
  }, [colleges, selectedCollege]);

  // Compute one marker per district (use first college in each district)
  const districtMarkers = useMemo(() => {
    const markerMap = {};
    colleges.forEach(college => {
      if (!markerMap[college.district]) {
        markerMap[college.district] = college;
      }
    });
    return Object.values(markerMap);
  }, [colleges]);

  const getDistrictColor = (district) => {
    const key = Object.keys(districtColorMap).find(
      k => k.trim().toLowerCase() === (district || '').trim().toLowerCase()
    );
    return key ? districtColorMap[key] : '#ff6600'; // fallback to bright orange
  };

  // Update districtStyle to highlight only the searched college's district when selected
  const districtStyle = (feature) => {
    const district = feature.properties.dist;
    const normDistrict = normalizeDistrict(district);
    if (selectedCollege) {
      // Only highlight the selected college's district
      const isSelected = normDistrict === normalizeDistrict(selectedCollege.district);
      if (isSelected) {
        return {
          color: getDistrictColor(district),
          weight: 4,
          fillColor: getDistrictColor(district),
          fillOpacity: 0.7,
          dashArray: '2',
        };
      }
      // All other districts: neutral
      return {
        color: '#2563eb',
        weight: 1.5,
        fillColor: '#f3f4f6',
        fillOpacity: 0.2,
        dashArray: '',
      };
    }
    // No college selected: allow hover highlight
    const isHovered = hoveredDistrict && normDistrict === normalizeDistrict(hoveredDistrict);
    if (isHovered) {
      return {
        color: getDistrictColor(district),
        weight: 4,
        fillColor: getDistrictColor(district),
        fillOpacity: 0.7,
        dashArray: '2',
      };
    }
    return {
      color: '#2563eb',
      weight: 1.5,
      fillColor: '#f3f4f6',
      fillOpacity: 0.2,
      dashArray: '',
    };
  };

  // Update onEachDistrict to disable hover/click when a college is selected
  const onEachDistrict = (feature, layer) => {
    layer.on({
      click: () => {
        if (!selectedCollege) {
        setSelectedDistrictName(normalizeDistrict(feature.properties.dist));
        }
      },
      mouseover: (e) => {
        if (!selectedCollege) {
          setHoveredDistrict(feature.properties.dist);
          e.target.setStyle({ weight: 4, fillOpacity: 0.7, color: getDistrictColor(feature.properties.dist), fillColor: getDistrictColor(feature.properties.dist) });
          layer.openTooltip();
        }
      },
      mouseout: (e) => {
        if (!selectedCollege) {
          setHoveredDistrict(null);
          layer.closeTooltip();
          e.target.setStyle({ weight: 1.5, fillOpacity: 0.2 });
        }
      },
    });
    layer.bindTooltip(feature.properties.dist, { sticky: true });
  };

  // Fetch the GeoJSON at runtime
  useEffect(() => {
    fetch('/src/data/districts/tamil_nadu_districts.geojson')
      .then((res) => res.json())
      .then((data) => setDistrictGeoJson(data));
  }, []);

  // When a college is selected, highlight its district (normalized)
  useEffect(() => {
    if (selectedCollege) {
      setSelectedDistrictName(normalizeDistrict(selectedCollege.district));
    } else {
      setSelectedDistrictName(null);
    }
  }, [selectedCollege]);

  // Make sure tamilNaduCenter and tamilNaduBounds are defined
  const tamilNaduCenter: [number, number] = [11.1271, 78.6569];
  const tamilNaduBounds = useMemo(() => L.latLngBounds([
    [8.0, 76.0], // SW
    [13.5, 80.5], // NE
  ]), []);

  // Restore getMarkerIcon for marker rendering
  const getMarkerIcon = (district, isSelected = false) => {
    const color = isSelected ? '#e53935' : districtColorMap[district] || '#2563eb';
    const size = isSelected ? 48 : 36;
    const pulse = isSelected
      ? `<circle cx="${size/2}" cy="${size/2+2}" r="16" fill="${color}" opacity="0.18">
           <animate attributeName="r" from="16" to="24" dur="1s" repeatCount="indefinite" />
           <animate attributeName="opacity" from="0.18" to="0" dur="1s" repeatCount="indefinite" />
         </circle>`
      : '';
    return L.divIcon({
      className: isSelected ? 'selected-marker' : '',
      html: `
        <svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.25"/>
          </filter>
          ${pulse}
          <ellipse cx="18" cy="32" rx="7" ry="3" fill="${color}" opacity="0.3" />
          <path filter="url(#shadow)" d="M18 4C11.9249 4 7 8.92487 7 15C7 23.5 18 32 18 32C18 32 29 23.5 29 15C29 8.92487 24.0751 4 18 4Z" fill="${color}"/>
          <circle cx="18" cy="15" r="5" fill="white" stroke="${color}" stroke-width="2"/>
        </svg>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size],
      popupAnchor: [0, -size],
    });
  };

  return (
    <>
      {/* Remove Theme Toggle Button */}
      {/* Map Title - outside map container for no overlap */}
      <div className="w-full flex justify-center mt-4 mb-2">
        <h1 style={{
          fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
          fontWeight: 700,
          fontSize: '1.25rem',
          color: '#1e293b',
          letterSpacing: '0.01em',
          background: '#e3f2fd',
          borderRadius: '1rem',
          boxShadow: '0 2px 12px 0 rgba(30,41,59,0.07)',
          padding: '0.5rem 1.5rem',
          margin: 0,
        }}>
          TNEA College Map Explorer
        </h1>
      </div>
      <div className="w-full h-screen relative" style={{ background: '#e3f2fd', paddingTop: '1.5rem' }}>
      {/* Dashboard and District Legend - grouped, but legend lower for suggestions */}
      <div className="absolute z-[2000] left-4 top-6 max-w-xs w-[370px]">
        {/* Dashboard (search/filter bar) */}
        <div className="rounded-lg shadow-xl bg-white/90 backdrop-blur-lg border border-gray-200 p-2 flex items-center gap-2 glass-dashboard">
          <div className="flex-1">
            <SearchBar
              colleges={colleges}
              onFilteredColleges={setFilteredColleges}
              onCollegeSelect={setSelectedCollege}
              districts={districts}
            />
          </div>
        </div>
      </div>
      {/* Recent Searches Sidebar (left) */}
      <div className="absolute z-[1500] left-4 top-28 w-[320px] bg-white/95 rounded-2xl shadow-xl border border-gray-200 p-4 flex flex-col gap-2"
        style={{backdropFilter: 'blur(4px)', maxHeight: '60vh', overflowY: 'auto'}}>
        <div className="font-semibold text-blue-900 text-base mb-2">Recent Searches</div>
        {recentSearches.length === 0 && (
          <div className="text-gray-500 text-sm">No recent searches yet.</div>
        )}
        {recentSearches.map(college => (
          <div
            key={college.id}
            className="relative cursor-pointer hover:bg-blue-50 rounded px-2 py-1 flex items-center group"
            onClick={() => setSelectedCollege(college)}
          >
            <div className="flex-1">
              <div className="font-medium">{college.name}</div>
              <div className="text-xs text-gray-500">{college.district}</div>
            </div>
            <button
              className="ml-2 text-gray-400 hover:text-red-500 opacity-70 group-hover:opacity-100 transition p-1 rounded"
              style={{ fontSize: '1.1em' }}
              onClick={e => {
                e.stopPropagation();
                setRecentSearches(prev => prev.filter(c => c.id !== college.id));
              }}
              title="Remove from recent searches"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      {/* District Legend (colors) - moved further down */}
      <div className="absolute z-[1000] right-4 top-24 rounded-2xl shadow-2xl px-4 py-2 flex flex-col gap-1 border border-gray-200 w-[320px] backdrop-blur-md glass-legend"
        style={{ background: '#fff', border: '2px solid #b6d4fe', boxShadow: '0 4px 24px 0 rgba(30,41,59,0.10)' }}>
        <div className="font-semibold text-gray-700 text-xs mb-1" style={{fontSize: '1em'}}>Districts ({GEOJSON_DISTRICTS.length})</div>
        <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-xs" style={{fontSize: '0.98em'}}>
          {GEOJSON_DISTRICTS.map((district) => (
            <span key={district} className="flex items-center gap-2 truncate">
              <span style={{background: districtColorMap[district], width: 13, height: 13, borderRadius: 7, display: 'inline-block', border: '1px solid #ccc', marginRight: 4}}></span>
              <span className="truncate text-gray-800" title={district} style={{fontSize: '0.98em'}}>{district}</span>
            </span>
          ))}
        </div>
        <div className="mt-1 font-semibold text-gray-700 text-xs" style={{fontSize: '0.93em'}}>Districts shown: {GEOJSON_DISTRICTS.length}</div>
      </div>
      {/* Map area - fills the rest, no top padding */}
      <div className="w-full h-full">
        <MapContainer
          key={resetKey}
          center={tamilNaduCenter}
          zoom={7}
          minZoom={6}
          maxZoom={16}
          style={{ height: '100%', width: '100%' }}
          maxBounds={tamilNaduBounds}
          zoomControl={false}
          boxZoom={false}
          keyboard={false}
          doubleClickZoom={false}
          whenCreated={mapInstance => { mapRef.current = mapInstance; }}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <ZoomControl position="bottomright" />
          {/* Render all Tamil Nadu district polygons, always show for highlighting */}
          {districtGeoJson && (
            <GeoJSON key={selectedDistrictName || 'all'} data={districtGeoJson as any} style={districtStyle} onEachFeature={onEachDistrict} />
          )}
          {/* Show only the selected college marker if a college is selected */}
          {selectedCollege && (
            <Marker
              key={selectedCollege.id}
              position={[selectedCollege.lat, selectedCollege.lng]}
              icon={getMarkerIcon(selectedCollege.district, true)}
            >
              <Popup>
                <div>
                  <strong>{selectedCollege.name}</strong><br/>
                  District: {selectedCollege.district}<br/>
                  Type: {selectedCollege.type}<br/>
                  {selectedCollege.website && (
                    <span>Website: <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer">{selectedCollege.website}</a><br/></span>
                  )}
                  {selectedCollege.pincode && <span>Pincode: {selectedCollege.pincode}<br/></span>}
                  {selectedCollege.review && <span>Review: {selectedCollege.review}<br/></span>}
                </div>
              </Popup>
            </Marker>
          )}
          {/* Floating Reset/Home Button */}
          <div className="leaflet-top leaflet-right z-[1200]">
            <button
              className="m-4 p-3 rounded-full bg-white/90 shadow-lg border border-gray-200 hover:bg-blue-100 transition-all"
              style={{ outline: 'none', border: 'none', cursor: 'pointer' }}
              onClick={handleResetView}
              title="Reset View"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 5V3m0 2a7 7 0 1 1-7 7H3m9-9a9 9 0 1 0 9 9h-2" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </MapContainer>
      </div>
      {/* Show district name label when a college is selected */}
      {selectedCollege && (
        <div className="absolute left-1/2 top-20 z-[2100] -translate-x-1/2 bg-white/90 rounded-lg shadow-lg px-6 py-2 border border-blue-200 text-lg font-bold text-blue-800" style={{pointerEvents: 'none'}}>
          District: {selectedCollege.district}
        </div>
      )}
      {/* College details below the map */}
      {selectedCollege && (
        <div className="w-full max-w-2xl mx-auto mt-4 p-4 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col gap-2">
          <div className="text-xl font-bold text-blue-800">{selectedCollege.name}</div>
          <div><b>District:</b> {selectedCollege.district}</div>
          <div><b>Type:</b> {selectedCollege.type}</div>
          {selectedCollege.website && (
            <div><b>Website:</b> <a href={selectedCollege.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{selectedCollege.website}</a></div>
          )}
          {selectedCollege.pincode && <div><b>Pincode:</b> {selectedCollege.pincode}</div>}
          {selectedCollege.review && <div><b>Review:</b> {selectedCollege.review}</div>}
        </div>
      )}
      {/* Brighten search bar in dark mode */}
      <style>{`
        .dark input[type="text"] {
          background: #23272f !important;
          color: #f3f6fa !important;
          border-color: #3b4252 !important;
        }
        .dark input[type="text"]::placeholder {
          color: #bfc9db !important;
        }
      `}</style>
    </div>
    </>
  );
};

export default SimpleMapComponent;
