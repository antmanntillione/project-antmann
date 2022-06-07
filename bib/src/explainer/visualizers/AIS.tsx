import React from "react";
import { Instance } from "../../api";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
  Popup,
} from "react-leaflet";
import { latLngBounds, LatLng, icon, Point } from "leaflet";
import "./AIS.css";
import shipSvg from "./ship.svg";
import { useTranslation } from "react-i18next";

const ShipIcon = icon({
  iconUrl: shipSvg,
  iconSize: new Point(40, 40),
});

export const AISVisualizer = (props: {
  data: Instance;
  feature_names: Array<string>;
  divergent?: Array<[index: number, importance: number]>;
}) => {
  const { t } = useTranslation();
  const path = React.useMemo(() => {
    let latField = null;
    let lonField = null;

    let path: Array<LatLng> = [];

    props.feature_names.forEach((feature, index) => {
      if (feature === "lat") {
        latField = index;
      } else if (feature === "lon") {
        lonField = index;
      }
    });

    if (latField === null || lonField === null) {
      return path;
    }

    for (const sample of props.data) {
      path.push(new LatLng(sample[latField + 1], sample[lonField + 1]));
    }

    return path;
  }, [props.data, props.feature_names]);

  const splicedPaths: Array<{
    color: string;
    positions: Array<LatLng>;
  }> = React.useMemo(() => {
    if (props.divergent === undefined) {
      return [{ color: "blue", positions: path, opacity: 1.0 }];
    } else {
      let all_paths: Array<{
        color: string;
        positions: Array<LatLng>;
      }> = [];
      const slice_width = Math.ceil(path.length / props.divergent.length);

      for (let i = 0; i < props.divergent.length; i++) {
        const importance = props.divergent.find((slice) => slice[0] === i);
        all_paths.push({
          color: importance![1] > 0 ? "green" : "red",
          positions: path.slice(
            i * slice_width,
            Math.min((i + 1) * slice_width + 1, path.length)
          ),
        });
      }

      return all_paths;
    }
  }, [props.divergent, path]);

  if (props.divergent) {
    return (
      <>
        <h4>{t("explainer.results.mapping_on_instance")}</h4>
        <MapContainer zoom={13} scrollWheelZoom={false}>
          <TileLayer
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <TileLayer
            attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
          />
          <Trajectory paths={splicedPaths} />
        </MapContainer>
      </>
    );
  } else {
    return (
      <>
        <h4>{t("explainer.results.selected_instance")}</h4>
        <MapContainer zoom={13} scrollWheelZoom={false}>
          <TileLayer
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <TileLayer
            attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
            url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
          />
          <Trajectory paths={splicedPaths} />
        </MapContainer>
      </>
    );
  }
};

const Trajectory = (props: {
  paths: Array<{
    color: string;
    positions: Array<LatLng>;
  }>;
}) => {
  const bounds = React.useMemo(
    () => latLngBounds(props.paths.flatMap((x) => x.positions)),
    [props.paths]
  );

  const map = useMap();
  const { t } = useTranslation();

  React.useEffect(() => {
    map.fitBounds(bounds);
  }, [bounds, map]);

  return (
    <>
      {props.paths.map(({ positions, ...rest }, index) => (
        <Polyline key={index} positions={positions} pathOptions={{ ...rest }} />
      ))}
      <Marker
        position={props.paths.slice(-1)[0].positions.slice(-1)[0]}
        icon={ShipIcon}
      >
        <Popup>{t("explainer.results.last_position")}</Popup>
      </Marker>
    </>
  );
};
