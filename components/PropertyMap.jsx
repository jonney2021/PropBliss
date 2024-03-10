"use client";
import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl";
import { setDefaults, fromAddress } from "react-geocode";
import Spinner from "./Spinner";
import Image from "next/image";
import pin from "@/assets/images/pin.svg";

const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    // zoom: 12,
    zoom: 15,
    width: "100%",
    height: "500px",
  });
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: "en",
    region: "us",
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        if (res && res.results && res.results.length > 0) {
          const { lat, lng } = res.results[0].geometry.location;
          setLat(lat);
          setLng(lng);
          setViewport({
            ...viewport,
            latitude: lat,
            longitude: lng,
          });
        } else {
          console.error("Geocoding failed or returned zero results:", res);
          setGeocodeError(true);
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
        setLoading(false);
      }
    };
    fetchCoords();
  }, []);

  if (loading) return <Spinner loading={loading} />;
  if (geocodeError) {
    //Handle case where geocding failed
    if (geocodeError) {
      return <div className="text-xl">No location data found</div>;
    }
  }

  return (
    !loading && (
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapLib={import("mapbox-gl")}
        // initialViewState={{
        //   longtitude: lng,
        //   latitude: lat,
        //   zoom: 15,
        // }}
        {...viewport}
        style={{ width: "100%", height: 500 }}
        mapStyle="mapbox://styles/mapbox/streets-v9"
      >
        <Marker longitude={lng} latitude={lat} anchor="bottom">
          <Image src={pin} alt="location" width={40} height={40} />
        </Marker>
      </Map>
    )
  );
};
export default PropertyMap;
