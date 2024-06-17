// MapComponent.tsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const MapComponent: React.FC = () => {
    const [geopoints, setGeopoints] = useState<[number, number][]>([]);

    const handleMapClick = (e: any) => {
        const { lat, lng } = e.latlng;
        setGeopoints(prevGeopoints => [...prevGeopoints, [lat, lng]]);
    };

    // @ts-ignore
    return (
        <></>
    );
};

export default MapComponent;
