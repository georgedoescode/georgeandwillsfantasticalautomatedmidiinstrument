<template>
    <div>
        <p>Instrument</p>
        <div>
            <MelodyVisualisation
                v-if="!!noteStream.length"
                :key="visualisationKey"
                :height="200"
                :melody="noteStream"
            />
        </div>
        <div>
            <button v-if="!playing" @click="start">Play</button>
            <button v-if="playing" @click="stop">Stop</button>
        </div>
        <div>
            <button @click="generateMelodies">Regenerate</button>
        </div>
        <div>
            <p v-if="playing">{{ currentNoteLabel }}</p>
        </div>
        <NoteCollection @update="setNotes" />
    </div>
</template>

<script>
    import NoteCollection from "./NoteCollection.vue";
    import MelodyVisualisation from "./MelodyVisualisation.vue";
    import MelodyFactory from "../classes/MelodyFactory";
    import { Midi } from "@tonaljs/tonal";
    import webmidi from "webmidi";

    export default {
        data: function() {
            return {
                melodyFactory: null,
                notes: [],
                noteStream: [],
                streamInterval: null,
                currentNote: 0,
                playing: false,
                loop: true,
                tempo: 120,
                notesPerBar: 1,
                visualisationKey: Math.random()
            };
        },
        components: {
            MelodyVisualisation: MelodyVisualisation,
            NoteCollection: NoteCollection
        },
        mounted: function() {
            this.generateMelodies();
        },
        computed: {
            currentNoteLabel: function() {
                return Midi.midiToNoteName(this.currentNote);
            },
            settings: function() {
                return {
                    geneLength: 16, // Amount of notes in a melody
                    geneValues: this.notes, // 'Notes' available
                    populationCount: 8, // How many melodies to create
                    generationCount: 10, // How much to breed (develop) them
                    fitnessFunction: this.willsGloriousFitnessFunction // The creative bit
                };
            }
        },
        methods: {
            setNotes: function(notes) {
                console.log("setNotes", notes);
                this.notes = notes.map(n => Midi.toMidi(n));
            },
            generateMelodies: function() {
                console.log("generateMelodies", this.settings);
                this.melodyFactory = new MelodyFactory(this.settings);
                const melodies = this.melodyFactory.createMelodies();
                this.noteStream = melodies.reduce((a, m) => a.concat(m), []);
                this.visualisationKey = Math.random(); // Horrible hack
                console.log("new note stream", this.noteStream);
            },
            start: function() {
                this.playing = true;
                webmidi.enable(err => {
                    const output = webmidi.outputs[0];
                    console.log(webmidi);
                    let melody = this.noteStream.slice();
                    this.streamInterval = setInterval(() => {
                        if (melody.length === 0) {
                            if (loop) {
                                melody = this.noteStream.slice();
                            } else {
                                clearInterval(interval);
                            }
                        }
                        const value = melody.shift();
                        const note = value === 0 ? 0 : value; // If 0 dont play
                        console.log(note);
                        this.currentNote = note;
                        output.playNote(note);
                    }, 60000 / (this.tempo * this.notesPerBar));
                });
            },
            stop: function() {
                webmidi.disable();
                clearInterval(this.streamInterval);
                this.streamInterval = null;
                this.playing = false;
            },
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
