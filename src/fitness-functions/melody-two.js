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

    // If there are strings of successive notes in the melody (with a max of 3 for example) then score this higher
    const consecutiveCountThreshold = 4;
    let consecutiveCount = 0;
    for (let i in melody) {
        if (i > 0) {
            if (melody[i] === melody[i - 1]) {
                consecutiveCount++;
            } else {
                consecutiveCount = 0;
            }
            if (consecutiveCount > 0 && consecutiveCount < consecutiveCountThreshold) {
                score++;
            }
        }
    }

    if ([scale[5], scale[6]].includes(melody[melody.length - 2])) {
        score++;
    }

    // If the last note in the melody is the first note in the scale, increase the score
    if (melody[melody.length - 1] === scale[0]) {
        score++;
    }

    return score;

};