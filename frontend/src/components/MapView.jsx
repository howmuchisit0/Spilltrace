import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Polyline, Marker, useMap, Tooltip } from 'react-leaflet';
import L from 'leaflet';

function getCentroid(polygon) {
  if (!polygon || polygon.length === 0) return [0, 0];
  let latSum = 0;
  let lngSum = 0;
  polygon.forEach(([lat, lng]) => {
    latSum += lat;
    lngSum += lng;
  });
  return [latSum / polygon.length, lngSum / polygon.length];
}

const spillDetectedIcon = L.divIcon({
  className: 'custom-sonar-beacon-container',
  html: `
    <div class="sonar-beacon">
      <div class="sonar-wave wave1"></div>
      <div class="sonar-wave wave2"></div>
      <div class="sonar-core"></div>
      <div class="sonar-badge">Detection site</div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});

const estimatedOriginIcon = L.divIcon({
  className: 'custom-origin-marker-container',
  html: `
    <div class="origin-marker">
      <div class="origin-dot"></div>
      <div class="origin-badge">Est. origin</div>
    </div>
  `,
  iconSize: [0, 0],
  iconAnchor: [0, 0]
});

function FitBounds({ data, selectedVesselId }) {
  const map = useMap();

  useEffect(() => {
    let points = [];
    let paddingOptions = { padding: [40, 40] };

    if (selectedVesselId) {
      const vessel = data.vessels.find(v => v.vessel_id === selectedVesselId);
      if (vessel) {
        points = vessel.track.map(p => [p[0], p[1]]);
        paddingOptions = {
          paddingTopLeft: [50, 50],
          paddingBottomRight: [500, 50],
          duration: 1.2
        };
      }
    } else {
      points = [
        ...data.spill.polygon,
        [data.drift.estimated_origin.lat, data.drift.estimated_origin.lon],
        ...data.drift.hindcast_path.map(p => [p[0], p[1]]),
        ...data.drift.forecast_path.map(p => [p[0], p[1]]),
        ...data.vessels.flatMap(v => v.track.map(p => [p[0], p[1]])),
      ];
      paddingOptions = { padding: [70, 70], duration: 1.2 };
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.flyToBounds(bounds, paddingOptions);
    }
  }, [data, selectedVesselId, map]);

  return null;
}

export default function MapView({ data, selectedVesselId }) {
  const spillCentroid = useMemo(() => getCentroid(data.spill.polygon), [data.spill.polygon]);
  const estimatedOrigin = [data.drift.estimated_origin.lat, data.drift.estimated_origin.lon];

  return (
    <MapContainer center={spillCentroid} zoom={11} style={{ height: '100%', width: '100%', backgroundColor: '#111318' }} zoomControl={false}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        className="dark-map-tiles"
      />

      <FitBounds data={data} selectedVesselId={selectedVesselId} />

      <Marker position={spillCentroid} icon={spillDetectedIcon} />
      <Marker position={estimatedOrigin} icon={estimatedOriginIcon} />

      {/* Spill polygon — muted fill, subtle border */}
      <Polygon positions={data.spill.polygon} pathOptions={{ color: '#c2873a', fillColor: '#c2873a', fillOpacity: 0.1, weight: 1.5, opacity: 0.6 }} />

      {/* Hindcast path — muted blue, dashed */}
      <Polyline className="animated-path" positions={data.drift.hindcast_path.map(p => [p[0], p[1]])} pathOptions={{ color: '#6b93b8', dashArray: '4, 6', weight: 1.5, opacity: 0.7 }} />
      <Polyline positions={data.drift.hindcast_path.map(p => [p[0], p[1]])} pathOptions={{ color: 'transparent', weight: 20 }}>
        <Tooltip sticky className="dark-tooltip">Hindcast path</Tooltip>
      </Polyline>

      {/* Forecast path — muted green, dashed */}
      <Polyline className="animated-path" positions={data.drift.forecast_path.map(p => [p[0], p[1]])} pathOptions={{ color: '#5a9e7c', dashArray: '4, 6', weight: 1.5, opacity: 0.7 }} />
      <Polyline positions={data.drift.forecast_path.map(p => [p[0], p[1]])} pathOptions={{ color: 'transparent', weight: 20 }}>
        <Tooltip sticky className="dark-tooltip">Forecast path</Tooltip>
      </Polyline>

      {/* Vessel tracks */}
      {data.vessels.map((vessel) => {
        const isSelected = vessel.vessel_id === selectedVesselId;
        return [
          <Polyline
            key={`track-${vessel.vessel_id}`}
            positions={vessel.track.map(p => [p[0], p[1]])}
            pathOptions={{
              color: isSelected ? '#6b93b8' : '#4a4e57',
              weight: isSelected ? 2.5 : 1.5,
              opacity: isSelected ? 0.9 : 0.35
            }}
          />,
          <Polyline
            key={`hover-${vessel.vessel_id}`}
            positions={vessel.track.map(p => [p[0], p[1]])}
            pathOptions={{ color: 'transparent', weight: 20 }}
          >
            <Tooltip sticky className="dark-tooltip">
              {vessel.name || vessel.vessel_id}
            </Tooltip>
          </Polyline>
        ];
      })}
    </MapContainer>
  );
}