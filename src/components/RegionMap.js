import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import PropTypes from 'prop-types';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const getMarkerIcon = (type) => {
  const iconSize = [25, 41];
  const iconAnchor = [12, 41];
  const popupAnchor = [1, -34];
 
  switch(type) {
    case 'university':
      return new L.Icon({
        iconUrl: '/icons/university.png',
        iconSize: iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor,
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      });
    case 'company':
      return new L.Icon({
        iconUrl: '/icons/company.png',
        iconSize: iconSize,
        iconAnchor: iconAnchor,
        popupAnchor: popupAnchor,
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      });
    default:
      return new L.Icon.Default();
  }
};


const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
 
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
 
  return null;
};


const RegionMap = ({ selectedRegion, growthProjection }) => {
  const [mapError, setMapError] = useState(null);
 
  const defaultCenter = [51.505, -0.09];
  const defaultZoom = 6;
 
  useEffect(() => {
    setMapError(null);
  }, [selectedRegion]);
 
  if (mapError) {
    return (
      <div className="map-error" style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Error loading map: {mapError}</p>
      </div>
    );
  }


  if (!selectedRegion) {
    return (
      <div className="map-container" style={{ height: '400px', width: '100%' }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Popup>
            <div>
              <h5>No region selected</h5>
              <p>Please select a region to view details</p>
            </div>
          </Popup>
        </MapContainer>
      </div>
    );
  }


  return (
    <div className="map-container" style={{ height: '400px', width: '100%' }}>
      <MapContainer
        center={selectedRegion.center || defaultCenter}
        zoom={selectedRegion.zoom || defaultZoom}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance) => {
          mapInstance.on('error', (e) => {
            console.error('Map error:', e);
            setMapError(e.message || 'Unknown map error');
          });
        }}
      >
        <MapUpdater
          center={selectedRegion.center}
          zoom={selectedRegion.zoom}
        />
       
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
       
        {selectedRegion.existingAssets && selectedRegion.existingAssets.map((asset, index) => (
          <Marker
            key={`asset-${asset.name}-${index}`}
            position={asset.location}
            icon={getMarkerIcon(asset.type)}
          >
            <Popup>
              <div>
                <h5>{asset.name}</h5>
                <p>Type: {asset.type}</p>
                <p>Strength: {asset.strength}/10</p>
              </div>
            </Popup>
          </Marker>
        ))}
       
        {growthProjection && growthProjection.hotspots &&
          growthProjection.hotspots.map((spot, index) => (
            <Circle
              key={`growth-${spot.location[0]}-${spot.location[1]}-${index}`}
              center={spot.location}
              radius={spot.intensity * 300}
              pathOptions={{
                fillColor: 'blue',
                fillOpacity: 0.3,
                weight: 1,
                color: 'blue'
              }}
            >
              <Popup>
                <div>
                  <h5>Growth Hotspot</h5>
                  <p>Projected New Jobs: {spot.jobs}</p>
                  <p>Projected New Companies: {spot.companies}</p>
                </div>
              </Popup>
            </Circle>
          ))
        }
      </MapContainer>
    </div>
  );
};


RegionMap.propTypes = {
  selectedRegion: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    existingAssets: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        location: PropTypes.arrayOf(PropTypes.number).isRequired,
        strength: PropTypes.number
      })
    )
  }),
  growthProjection: PropTypes.shape({
    hotspots: PropTypes.arrayOf(
      PropTypes.shape({
        location: PropTypes.arrayOf(PropTypes.number).isRequired,
        intensity: PropTypes.number.isRequired,
        jobs: PropTypes.number,
        companies: PropTypes.number
      })
    )
  })
};


RegionMap.defaultProps = {
  selectedRegion: null,
  growthProjection: null
};


export default RegionMap;

