export class DynamicStylesheet {
    private styleElement: HTMLStyleElement;

    constructor() {
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'arugal-dynamic-styles';
        document.head.appendChild(this.styleElement);
    }

    public update(rules: string) {
        this.styleElement.textContent = rules;
    }

    public dispose() {
        if (this.styleElement.parentElement) {
            this.styleElement.parentElement.removeChild(this.styleElement);
        }
    }
}
