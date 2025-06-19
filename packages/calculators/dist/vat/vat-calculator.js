// VATCalculator.ts
export class VATCalculator {
    constructor({ factor, precision = 2, roundFn = VATCalculator.halfUp }) {
        this.getFactor = () => this.factor;
        this.getPrecision = () => this.precision;
        if (factor <= 1) {
            throw new Error("VAT factor must be greater than 1");
        }
        if (precision < 0) {
            throw new Error("Precision must be non-negative");
        }
        this.setFactor(factor);
        this.setPrecision(precision);
        this.setRounding(roundFn);
    }
    /** True half-up rounding for positive & negative numbers */
    static halfUp(value, precision = 2) {
        const k = 10 ** precision;
        const sign = Math.sign(value) || 1;
        const abs = Math.abs(value);
        return sign * (Math.floor(abs * k + 0.5) / k);
    }
    /**
     * Calculate full VAT breakdown from a net price.
     * @param netPrice Price excluding VAT
     */
    calculateFromNet(netPrice) {
        const net = this.roundFn(netPrice, this.precision);
        const vat = this.roundFn(net * (this.factor - 1), this.precision);
        const gross = this.roundFn(net + vat, this.precision);
        return { net, vat, gross };
    }
    /**
     * Calculate full VAT breakdown from a gross price.
     * @param grossPrice Price including VAT
     */
    calculateFromGross(grossPrice) {
        const gross = this.roundFn(grossPrice, this.precision);
        const net = this.roundFn(gross / this.factor, this.precision);
        const vat = this.roundFn(gross - net, this.precision);
        return { net, vat, gross };
    }
    setFactor(value) {
        this.factor = value;
        return this;
    }
    setRounding(fn) {
        this.roundFn = fn ?? VATCalculator.halfUp;
        return this;
    }
    setPrecision(value) {
        this.precision = value ?? 2;
        return this;
    }
}
//# sourceMappingURL=vat-calculator.js.map