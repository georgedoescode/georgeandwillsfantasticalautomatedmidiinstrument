/**
 * Assess the melody passed into the function by
 * building up a score based on certain aspects
 * of the melody and returning this score for the
 * melodytic algorithm to use to breed 'better' melodies.
 */
export default (melody, scale) => {
    let score = 0; // Initialise score variable

    if (melody[0] !== 0) score++; // If the first note in the melody is an 'on' note then +1

    if (melody[0] === scale[1]) score++; // If the first note is the first note of the scale then +1

    if ([scale[1], scale[3], scale[5]].includes(melody[4])) score++; // If the 5th note is note 1, 3, or 5 in the scale then +1

    if ([scale[1], scale[3], scale[5]].includes(melody[8])) score++; // If the 9th note is note 1, 3, or 5 in the scale then +1

    if ([scale[1], scale[3], scale[5]].includes(melody[12])) score++; // If the 13th note is note 1, 3, or 5 in the scale then +1

    const idealZeroCount = 8; // If the count of 'off' notes is closer to 8 then increase the score
    const zeroCount = melody.reduce((a, v) => a + (!!(v == 0) ? 1 : 0), 0);
    score -= Math.abs(idealZeroCount - zeroCount);

    return score;
};
