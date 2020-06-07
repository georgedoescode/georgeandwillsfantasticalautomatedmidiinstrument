/**
 * Assess the melody passed into the function by
 * building up a score based on certain aspects
 * of the melody and returning this score for the
 * melodytic algorithm to use to breed 'better' melodies.
 * @param melody {Array[Note]} (tonalJS class)
 * @param scale {Scale} (tonalJS class)
 * @param utils {Object} utility functions
 * @returns {Number} score
 */
export default (melody, scale, utils) => {
    const baseNote = scale.tonic;

    let score = 0; // Initialise score variable

    // If the first note in the melody is an 'on' note then +1
    if (melody[0] !== null) score++;

    // If the first note is root of the scale then +1
    if (
        melody[0] &&
        utils.getDistance(baseNote, melody[0].name).distance === "1P"
    )
        score++;

    // If the last note is a perfect note in the scale
    if (
        melody[melody.length - 1] &&
        utils.getDistance(baseNote, melody[melody.length - 1].name).interval ===
            "P"
    )
        score++;

    // If the 1st, 5th, 9th etc. note are a perfect note
    melody.map((note, index) => {
        if (note && index % 4 === 0) {
            if (utils.getDistance(baseNote, note.name).interval === "P")
                score++;
        }
    });

    // If notes that are between the 1st, 5th, 9th etc. notes are a major note
    melody.map((note, index) => {
        if (note && index % 4 !== 0) {
            if (utils.getDistance(baseNote, note.name).interval === "M")
                score++;
        }
    });

    const idealZeroCount = 6; // If the count of 'off' notes is closer to 8 then increase the score
    const zeroCount = melody.reduce((a, v) => a + (v === null ? 1 : 0), 0);
    score -= Math.abs(idealZeroCount - zeroCount);

    return score;
};
