import { _EVENT_ACTIONS } from "../constants";
export async function ready(doc = document) {
    return new Promise((resolve, reject) => {
        try {
            if (doc.readyState === 'loading') {
                let listener = () => {
                    doc.removeEventListener(_EVENT_ACTIONS.DOMContentLoaded, listener);
                    resolve(doc);
                };
                doc.addEventListener(_EVENT_ACTIONS.DOMContentLoaded, listener);
            }
            else {
                resolve(doc);
            }
        }
        catch (err) {
            reject(err);
        }
    });
}
//# sourceMappingURL=document.js.map