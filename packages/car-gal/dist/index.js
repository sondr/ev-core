import { CarGal } from './car-gal';
import { Configure } from './config';
export function init(config) {
    return new CarGal(Configure(config));
}
//# sourceMappingURL=index.js.map