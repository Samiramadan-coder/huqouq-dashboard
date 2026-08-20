"use client";

import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type LocationValue = {
  latitude: number;
  longitude: number;
};

type LocationMapProps = {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
};

const getIconUrl = (icon: string | { src: string }) => {
  return typeof icon === "string" ? icon : icon.src;
};

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: getIconUrl(markerIcon2x),
  iconUrl: getIconUrl(markerIcon),
  shadowUrl: getIconUrl(markerShadow),
});

function RecenterMap({ value }: { value: LocationValue }) {
  const map = useMap();

  useEffect(() => {
    map.setView([value.latitude, value.longitude], map.getZoom());
  }, [map, value.latitude, value.longitude]);

  return null;
}

function LocationMarker({ value, onChange }: LocationMapProps) {
  useMapEvents({
    click(e) {
      onChange({
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      });
    },
  });

  return <Marker position={[value.latitude, value.longitude]} />;
}

export default function LocationMap({ value, onChange }: LocationMapProps) {
  return (
    <MapContainer
      center={[value.latitude, value.longitude]}
      zoom={13}
      className="h-72 w-full rounded-md"
    >
      <TileLayer
        attribution="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <RecenterMap value={value} />
      <LocationMarker value={value} onChange={onChange} />
    </MapContainer>
  );
}
