import { CarGal } from './car-gal';
import { Config } from './interfaces';
import { Configure } from './config';

function init(config?: Config) {
    return new CarGal(Configure(config));
}

export * as ICarGal from './interfaces';
export { CarGal, init };
export { cargalDefaultOpts } from './config/options';