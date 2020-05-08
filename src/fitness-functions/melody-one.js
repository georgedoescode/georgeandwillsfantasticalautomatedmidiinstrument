// Melody example (melody)  : [86, 72, 93, 72, 74, 0, 88, 0, 81, 88, 84, 81, 72, 74, 93, 93]
// Scale example (scale)    : [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 0]

/** 
 * Assess the melody passed into the function by
 * building up a score based on certain aspects
 * of the melody and returning this score for the
 * melodytic algorithm to use to breed 'better' melodies.
 */
export default (melody, scale) => {
    let score = 0; // Initialise score variable

    if (melody[0] !== 0) score++; // If the first note in the melody is an 'on' note then +1

    if (melody[0] === scale[0]) score++; // If the first note is the first note of the scale then +1

    // If the 1st, 5th, 9th etc. note is note 1, 3, or 5 in the scale then +1
    melody.map((note, index) => {
        if (index % 4 === 0) {
            if ([scale[0], scale[2], scale[4]].includes(note)) score++;
        }
    });

    const idealZeroCount = 8; // If the count of 'off' notes is closer to 8 then increase the score
    const zeroCount = melody.reduce((a, v) => a + (!!(v == 0) ? 1 : 0), 0);
    score -= Math.abs(idealZeroCount - zeroCount);

    return score;
};