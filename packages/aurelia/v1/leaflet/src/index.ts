import { FrameworkConfiguration } from 'aurelia-framework';

export class GoogleMapsPluginOptions {
    apiKey!: string;
    libraries?: string[];
    callbackName?: string;
}
export interface LatLng { lat: number; lng: number; }
export interface MarkerOptions { position: LatLng; title?: string; data?: any; }


export function configure(
    config: FrameworkConfiguration,
    options: GoogleMapsPluginOptions
) {
    config.container.registerInstance(GoogleMapsPluginOptions, options);
    config.globalResources(PLATFORM.moduleName('./google-map'));
}