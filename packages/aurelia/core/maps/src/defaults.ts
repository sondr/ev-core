import { LatLng } from "./interfaces";

export const defaultMapOptions = {
    center: { lat: 59.908894, lng: 10.749456 } as LatLng,
    zoom: 13
};

export const defaultTileLayerOptions = {
    urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    options: {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }
};