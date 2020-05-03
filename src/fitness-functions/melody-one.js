/**
 * Assess the gene passed into the function by
 * building up a score based on certain aspects
 * of the gene and returning this score for the
 * genetic algorithm to use to breed 'better' melodies.
 */
export default (gene, values) => {
    let score = 0;
    if (gene[0] !== 0) score++;

    if (gene[0] === values[1]) score++;

    if ([values[1], values[3], values[5]].indexOf(gene[4]) !== -1) score++;

    if ([values[1], values[3], values[5]].indexOf(gene[8]) !== -1) score++;

    if ([values[1], values[3], values[5]].indexOf(gene[12]) !== -1) score++;

    const idealZeroCount = 8;
    const zeroCount = gene.reduce((a, v) => a + (!!(v == 0) ? 1 : 0), 0);
    score -= Math.abs(idealZeroCount - zeroCount);

    return score;
};
