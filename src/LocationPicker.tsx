import { useEffect, useRef, useState } from "react";
import maplibregl, { setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
setWorkerUrl(workerUrl);
import "maplibre-gl/dist/maplibre-gl.css";
import { Crosshair, MapPin, Navigation, X } from "lucide-react";
import { CAMPUS_CENTER, MAP_STYLE, type PinLocation } from "./data";

type Props = {
  open: boolean;
  title: string;
  helper: string;
  initial: PinLocation | null;
  onClose: () => void;
  onConfirm: (location: PinLocation) => void;
};

export default function LocationPicker({
  open,
  title,
  helper,
  initial,
  onClose,
  onConfirm,
}: Props) {
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [draft, setDraft] = useState<PinLocation>({
    lat: initial?.lat ?? CAMPUS_CENTER.lat,
    lng: initial?.lng ?? CAMPUS_CENTER.lng,
    landmark: initial?.landmark ?? "",
  });
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!open) return;
    setDraft({
      lat: initial?.lat ?? CAMPUS_CENTER.lat,
      lng: initial?.lng ?? CAMPUS_CENTER.lng,
      landmark: initial?.landmark ?? "",
    });
    setLocationError("");
    setMapError(false);
  }, [open, initial]);

  useEffect(() => {
    if (!open || !mapNode.current || mapRef.current) return;

    const start = [
      initial?.lng ?? CAMPUS_CENTER.lng,
      initial?.lat ?? CAMPUS_CENTER.lat,
    ] as [number, number];

    const map = new maplibregl.Map({
      container: mapNode.current,
      style: MAP_STYLE,
      center: start,
      zoom: initial ? 16 : 15,
    });

    mapRef.current = map;
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    const marker = new maplibregl.Marker({
      color: "#0b633d",
      draggable: true,
    })
      .setLngLat(start)
      .addTo(map);

    markerRef.current = marker;

    const updateDraft = () => {
      const position = marker.getLngLat();
      setDraft((previous) => ({
        ...previous,
        lat: position.lat,
        lng: position.lng,
      }));
    };

    marker.on("dragend", updateDraft);
    map.on("click", (event) => {
      marker.setLngLat(event.lngLat);
      updateDraft();
    });
    map.on("error", () => setMapError(true));
    map.once("load", () => map.resize());

    return () => {
      marker.remove();
      map.remove();
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => mapRef.current?.resize());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Location is not available on this device. Move the pin on the map instead.");
      return;
    }

    setLocating(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const next = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        markerRef.current?.setLngLat([next.lng, next.lat]);
        mapRef.current?.flyTo({ center: [next.lng, next.lat], zoom: 17, duration: 700 });
        setDraft((previous) => ({ ...previous, ...next }));
        setLocating(false);
      },
      () => {
        setLocationError("We couldn't access your location. Move the pin to your meeting point.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 },
    );
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop map-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="location-modal" role="dialog" aria-modal="true" aria-labelledby="location-title">
        <header className="modal-heading location-heading">
          <div>
            <span className="eyebrow">DELIVERY LOCATION</span>
            <h2 id="location-title">{title}</h2>
            <p>{helper}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close location picker">
            <X size={19} />
          </button>
        </header>

        <div className="map-wrap">
          <div className="map-toolbar">
            <button className="use-location-button" onClick={useMyLocation} disabled={locating}>
              <Crosshair size={15} />
              {locating ? "Finding you…" : "Use my location"}
            </button>
            <span className="map-hint"><MapPin size={13} /> Move the pin to your spot</span>
          </div>
          <div className="map-canvas" ref={mapNode} />
          {mapError && (
            <div className="map-error">
              Map tiles are taking longer to load. You can still try again or close this window.
            </div>
          )}
        </div>

        <div className="location-form">
          <div className="pin-summary">
            <span className="pin-summary-icon"><MapPin size={17} /></span>
            <div>
              <strong>Selected map point</strong>
              <span>{draft.lat.toFixed(5)}, {draft.lng.toFixed(5)}</span>
            </div>
            <a
              href={"https://www.google.com/maps?q=" + draft.lat + "," + draft.lng}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Preview
            </a>
          </div>

          <label className="field-label" htmlFor="landmark">Add a landmark <span>Optional, but helpful</span></label>
          <input
            id="landmark"
            className="text-field"
            value={draft.landmark}
            onChange={(event) => setDraft((previous) => ({ ...previous, landmark: event.target.value }))}
            placeholder="e.g. Outside the library, Block A entrance"
            maxLength={100}
          />
          {locationError && <p className="field-error">{locationError}</p>}
          <button className="primary-button full-button" onClick={() => onConfirm(draft)}>
            Confirm this location <Navigation size={16} />
          </button>
          <p className="map-attribution-note">Map data © OpenStreetMap contributors · OpenMapTiles</p>
        </div>
      </section>
    </div>
  );
}