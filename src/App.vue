<template>
    <div>
        {{ "Transport position: " + transportPosition }}
        <p>georgeandwillsfantasticalautomatedmidiinstrument</p>
        <p>current note: {{ currentNote }}</p>
    </div>
</template>

<script>
    import MelodyFactory from "./classes/MelodyFactory";
    import Transport from "./classes/Transport";
    import webmidi from "webmidi";

    export default {
        data: function() {
            return {
                settings: {
                    geneLength: 16, // Amount of notes in a melody
                    geneValues: [0, 1, 3, 5, 6, 8, 10, 11, 12], // [0, 2, 4, 5, 7, 9, 11, 12], // 'Notes' available
                    populationCount: 8, // How many melodies to create
                    generationCount: 10, // How much to breed (develop) them
                    fitnessFunction: this.willsGloriousFitnessFunction // The creative bit
                },
                melodyFactory: null,
                currentNote: 0
            };
        },

        watch: {
            transportPosition(currentValue) {
                // MIDI clocks emit 24 pulses per quarter note at n tempo
                if (currentValue % 24 === 0) {
                    console.log("play note here");
                }
            }
        },

        mounted: function() {
            this.transport = new Transport(this.$store, "Georges MIDI Bus 1");
            this.melodyFactory = new MelodyFactory(this.settings);
            const melodies = this.melodyFactory.createMelodies();
            console.log("WILL", melodies);
            webmidi.enable(err => {
                const output = webmidi.outputs[0];
                console.log(webmidi);
                const melody = melodies.reduce((a, m) => a.concat(m), []);
                const interval = setInterval(() => {
                    if (melody.length === 0) clearInterval(interval);
                    const value = melody.shift();
                    const note = value === 0 ? 0 : value + 60; // If 0 dont play
                    console.log(note);
                    this.currentNote = note;
                    output.playNote(note);
                }, 250);
            });
        },
        methods: {
            /**
             * Assess the gene passed into the function by
             * building up a score based on certain aspects
             * of the gene and returning this score for the
             * genetic algorithm to use to breed 'better' melodies.
             */
            willsGloriousFitnessFunction: function(gene) {
                let score = 0;
                if (gene[0] !== 0) score++;

                if (gene[0] === this.settings.geneValues[1]) score++;

                if (
                    [
                        this.settings.geneValues[1],
                        this.settings.geneValues[3],
                        this.settings.geneValues[5]
                    ].indexOf(gene[4]) !== -1
                )
                    score++;

                if (
                    [
                        this.settings.geneValues[1],
                        this.settings.geneValues[3],
                        this.settings.geneValues[5]
                    ].indexOf(gene[8]) !== -1
                )
                    score++;

                if (
                    [
                        this.settings.geneValues[1],
                        this.settings.geneValues[3],
                        this.settings.geneValues[5]
                    ].indexOf(gene[12]) !== -1
                )
                    score++;

                const idealZeroCount = 8;
                const zeroCount = gene.reduce(
                    (a, v) => a + (!!(v == 0) ? 1 : 0),
                    0
                );
                score -= Math.abs(idealZeroCount - zeroCount);

                return score;
            }
        },
        computed: {
            transportPosition() {
                return this.$store.state.transportPosition;
            }
        }
    };
</script>

<style>
    body {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Avenir, system-ui;
        color: #222;
        padding: 1em;
    }

    p {
        font-size: calc(1em + 1vw);
        word-wrap: break-word;
        width: 100%;
        text-align: center;
        margin: 1rem 0;
    }
</style>
