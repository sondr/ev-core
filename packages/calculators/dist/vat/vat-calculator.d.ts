export interface VatCalculationResult {
    /** Price excluding VAT */
    net: number;
    /** VAT amount */
    vat: number;
    /** Price including VAT */
    gross: number;
}
export type RoundingFn = (value: number, precision?: number) => number;
export interface VATOptions {
    /** VAT multiplier factor, e.g. 1.25 for 25% VAT */
    readonly factor: number;
    /** Number of decimal places to round to; default is 2 */
    readonly precision?: number;
    /** Rounding function; defaults to half-up */
    readonly roundFn?: RoundingFn;
}
export declare class VATCalculator {
    private factor;
    private precision;
    private roundFn;
    constructor({ factor, precision, roundFn }: VATOptions);
    /** True half-up rounding for positive & negative numbers */
    private static halfUp;
    /**
     * Calculate full VAT breakdown from a net price.
     * @param netPrice Price excluding VAT
     */
    calculateFromNet(netPrice: number): VatCalculationResult;
    /**
     * Calculate full VAT breakdown from a gross price.
     * @param grossPrice Price including VAT
     */
    calculateFromGross(grossPrice: number): VatCalculationResult;
    getFactor: () => number;
    getPrecision: () => number;
    setFactor(value: number): this;
    setRounding(fn: RoundingFn): this;
    setPrecision(value: number): this;
}
//# sourceMappingURL=vat-calculator.d.ts.map