import { TagManager } from './gtm/tag-manager';
export function configure(aurelia, configCallback) {
    const instance = aurelia.container.get(TagManager);
    if (configCallback !== undefined && typeof (configCallback) === 'function') {
        configCallback(instance);
    }
}
export { TagManager };

//# sourceMappingURL=index.js.map
