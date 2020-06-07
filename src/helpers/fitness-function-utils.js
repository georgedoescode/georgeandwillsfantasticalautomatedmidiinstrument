import {
    Interval
} from "@tonaljs/tonal";

export default {
    /**
     * Returns the interval and distance between two notes
     * Intervals: "1P", "2M", "3M", "4P", "5P", "6m", "7m"
     * (1 (root), 2 Major second, 3 Major third, perfect 4th, pervect fifth, minor sixth, minor seventh)
     * @param {String} note1 e.g. "C4"
     * @param {String} note2 e.g. "G4"
     * @returns {interval,distance}
     */
    getDistance: (note1, note2) => {
        const distance = Interval.distance(note1, note2);
        return {
            interval: distance => distance.match(/\D+/)[0],
            distance
        };
    },

    /**
     * Returns just the numbers from a string
     * @param {String} str e.g. "C4"
     * @returns {Number} e.g. 4
     */
    getDigits: str => str.match(/\d+/)[0],

    /**
     * Returns just the letters from a string
     * @param {String} str e.g. "C4"
     * @returns {String} e.g. "C"
     */
    getLetters: str => str.match(/\D+/)[0]
};