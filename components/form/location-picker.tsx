"use client";

import dynamic from "next/dynamic";

type LocationValue = {
  latitude: number;
  longitude: number;
};

type LocationPickerProps = {
  value: LocationValue;
  onChange: (value: LocationValue) => void;
};

const LocationMap = dynamic(() => import("./location-map"), {
  ssr: false,
  loading: () => <div className="h-72 w-full rounded-md bg-muted" />,
});

export default function LocationPicker(props: LocationPickerProps) {
  return <LocationMap {...props} />;
}
