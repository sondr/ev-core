export class A11y {
    static focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    static trapFocus(element: HTMLElement, e: KeyboardEvent) {
        const focusableContent = element.querySelectorAll<HTMLElement>(this.focusableSelectors);
        const first = focusableContent[0];
        const last = focusableContent[focusableContent.length - 1];

        if (e.key !== 'Tab') return;

        if (e.shiftKey) { // Shift + Tab
            if (document.activeElement === first) {
                last.focus();
                e.preventDefault();
            }
        } else { // Tab
            if (document.activeElement === last) {
                first.focus();
                e.preventDefault();
            }
        }
    }

    static setRole(element: HTMLElement, role: string) {
        element.setAttribute('role', role);
    }

    static setLabel(element: HTMLElement, label: string) {
        element.setAttribute('aria-label', label);
    }

    static hide(element: HTMLElement) {
        element.setAttribute('aria-hidden', 'true');
    }

    static show(element: HTMLElement) {
        element.removeAttribute('aria-hidden');
    }
}
