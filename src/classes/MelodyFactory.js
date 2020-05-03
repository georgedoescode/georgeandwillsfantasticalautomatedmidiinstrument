import GeneticAlgorithm from "tournament-selection-genetic-algorithm";

export default class MelodyFactory {
    /**
     * Construct the factory!
     */
    constructor(settings = {}) {
        const defaults = this.getDefaultSettings();
        this.settings = Object.assign({}, defaults, settings);
    }

    /**
     * Create Melodies
     * Creates a series of melodies based on
     * the settings currently in place.
     * @return {array} Array of melodies
     */
    createMelodies() {
        // Instantiate the GeneticAlgorithm
        const ga = new GeneticAlgorithm(
            this.settings.geneLength,
            this.settings.geneValues
        );
        // Set crossover function in GA
        ga.crossoverFn = ga[this.settings.crossoverType];
        // Set mutation probability on each new breed
        ga.mutationProbability = this.settings.mutationProbability;
        // Set demes boolean in GA
        ga.demes = this.settings.demes;
        // Set the fitness function
        ga.fitness = g =>
            this.settings.fitnessFunction(g, this.settings.geneValues);
        // Run the genetic algorithm to produce the melodies
        ga.run(this.settings.populationCount, this.settings.generationCount);
        // Return the melodies
        return ga.population;
    }

    /**
     * Update basic settings of the factory.
     * @param {Object} settings Holds settings with values to update.
     * @return {Object} Updated settings.
     */
    updateSettings(settings) {
        // Update any settings in the 'settings' argument
        this.settings = Object.assign({}, this.settings, settings);
        // Return the updated settings object for reference
        return this.settings;
    }

    /**
     * Basic default settings to help initially set up
     * a simple example of a genetic algorithm.
     * @return {Object} Default settings.
     */
    getDefaultSettings() {
        return {
            /**
             * Length of each gene in the population.
             * {number} Integer
             */
            geneLength: 10,

            /**
             * Values that each gene can be made up of.
             * {array} Array of Integers
             */
            geneValues: [0, 1],

            /**
             * Number of genes in the population.
             * {number} Integer
             */
            populationCount: 100,

            /**
             * Number of generations to breed.
             * {number} Integer
             */
            generationCount: 100,

            /**
             * Likeliness of mutation of each new gene when bred.
             * {number} <= 1
             */
            mutationProbability: 0.01,

            /**
             * Crossover function to use.
             * {string} either:
             * - 'singlePointCrossover' Single splice combining two genes.
             * - 'twoPointCrossover'    Two splices combining two genes.
             * - 'uniformCrossover'     Random selection of values from each gene.
             * - 'noCrossover'          Preserve winner only.
             */
            crossoverType: "twoPointCrossover",

            /**
             * Breed members of the population that are
             * close to each other in the array of genes.
             * (Excellent for generating incrementally changing melodies)
             */
            demes: true,

            /**
             * Function to judge the quality of a gene.
             * {function}
             */
            fitnessFunction: g => g.reduce((a, v) => a + v, 0)
        };
    }
}
