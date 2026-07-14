import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SEVERITY_COLORS = {
  'Low': '#16A34A',
  'Medium': '#D97706',
  'High': '#EA580C',
  'Severe': '#DC2626',
  'Extremely Severe': '#7F1D1D',
};

const RESOURCE_COLORS = {
  'Fire Truck': '#DC2626',
  'Ambulance': '#16A34A',
  'Police': '#2563EB',
  'Rescue Team': '#7C3AED',
};

function createColorIcon(color, label = '') {
  return L.divIcon({
    className: '',
    html: `<div style="
      background:${color};
      color:white;
      border-radius:50%;
      width:28px;
      height:28px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:13px;
      border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,.3);
      font-weight:bold;
    ">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function MapCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom]);
  return null;
}

export default function GISMap({
  center = [11.0168, 76.9558],
  zoom = 11,
  incidents = [],
  resources = [],
  height = 400,
  showRadius = false,
  radiusKm = 5,
  draggableMarker = false,
  onMarkerDragEnd = null,
  activeBroadcasts = [],
}) {
  return (
    <div className="map-container" style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        <MapCenter center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Draggable location picker marker */}
        {draggableMarker && (
          <Marker
            position={center}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const position = e.target.getLatLng();
                if (onMarkerDragEnd) {
                  onMarkerDragEnd(position.lat, position.lng);
                }
              }
            }}
          >
            <Popup>Drag me to adjust the location</Popup>
          </Marker>
        )}

        {/* Incident markers */}
        {incidents.map(inc => {
          const isBroadcasting = activeBroadcasts.includes(inc.id);
          return (
          <Marker
            key={inc.id}
            position={[inc.location.lat, inc.location.lng]}
            icon={isBroadcasting ? L.divIcon({
              className: 'broadcast-tower-icon',
              html: '📡',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            }) : createColorIcon(SEVERITY_COLORS[inc.severity] || '#6B7280', '⚠')}
          >
            <Popup>
              <div style={{ minWidth: 200 }}>
                <strong style={{ fontSize: '13px' }}>{inc.title}</strong>
                <br />
                <span style={{ fontSize: '11px', color: '#6B7280' }}>{inc.id} · {inc.severity}</span>
                <br />
                <span style={{ fontSize: '11px' }}>{inc.location.address}</span>
                <br />
                <span style={{ fontSize: '11px', background: '#FEE2E2', color: '#DC2626', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                  {inc.status}
                </span>
              </div>
            </Popup>
            {showRadius && (
              <Circle
                center={[inc.location.lat, inc.location.lng]}
                radius={radiusKm * 1000}
                color={SEVERITY_COLORS[inc.severity] || '#6B7280'}
                fillOpacity={0.08}
                weight={2}
              />
            )}
          </Marker>
        )})}

        {/* Resource markers */}
        {resources.map(res => (
          <Marker
            key={res.id}
            position={[res.lat, res.lng]}
            icon={createColorIcon(RESOURCE_COLORS[res.type] || '#374151',
              res.type === 'Fire Truck' ? '🚒' :
              res.type === 'Ambulance' ? '🚑' :
              res.type === 'Police' ? '🚔' : '🚁'
            )}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <strong style={{ fontSize: '13px' }}>{res.type}</strong>
                <br />
                <span style={{ fontSize: '11px', color: '#6B7280' }}>{res.vehicleNo}</span>
                <br />
                {res.officer && <span style={{ fontSize: '11px' }}>Officer: {res.officer}</span>}
                <br />
                <span style={{
                  fontSize: '11px',
                  background: res.status === 'On Scene' ? '#DCFCE7' : '#DBEAFE',
                  color: res.status === 'On Scene' ? '#16A34A' : '#2563EB',
                  padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px'
                }}>
                  {res.status} {res.eta > 0 ? `· ETA ${res.eta}m` : ''}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
