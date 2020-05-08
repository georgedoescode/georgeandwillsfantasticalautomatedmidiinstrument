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
        <codemirror
            :value="fitnessFunctionString"
            @input="updateFitnessFunction"
        ></codemirror>
    </div>
</template>

<script>
    import NoteCollection from "./NoteCollection.vue";
    import MelodyVisualisation from "./MelodyVisualisation.vue";
    import MelodyFactory from "../classes/MelodyFactory";
    import MelodyOne from "../fitness-functions/melody-one";
    import MelodyTwo from "../fitness-functions/melody-two";
    import VueCodemirror from "vue-codemirror";
    import "codemirror/lib/codemirror.css";
    import { Midi } from "@tonaljs/tonal";
    import webmidi from "webmidi";

    export default {
        data: function() {
            return {
                melodyFactory: null,
                fitnessFunction: MelodyOne,
                notes: [],
                noteStream: [],
                streamInterval: null,
                currentNoteIndex: 0,
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
            fitnessFunctionString: function() {
                return this.fitnessFunction.toString();
            },
            currentNoteLabel: function() {
                return Midi.midiToNoteName(this.currentNote);
            },
            settings: function() {
                return {
                    geneLength: 16, // Amount of notes in a melody
                    geneValues: this.notes.concat([0]), // 'Notes' available
                    populationCount: 16, // How many melodies to create
                    generationCount: 100, // How much to breed (develop) them
                    fitnessFunction: this.fitnessFunction // The creative bit
                };
            }
        },
        methods: {
            updateFitnessFunction: function(fnc) {
                console.log("updateFitnessFunction");
                try {
                    eval("this.fitnessFunction = " + fnc);
                    this.generateMelodies();
                } catch (e) {
                    console.warn("Error updating fitness function.", e);
                }
            },
            setNotes: function(notes) {
                this.notes = notes.map(n => Midi.toMidi(n));
                this.generateMelodies();
            },
            generateMelodies: function() {
                console.log("fitness function", this.settings.fitnessFunction);
                this.melodyFactory = new MelodyFactory(this.settings);
                const melodies = this.melodyFactory.createMelodies();
                this.noteStream = melodies.reduce((a, m) => a.concat(m), []);
                console.log("this.noteStream", this.noteStream);
                this.visualisationKey = Math.random(); // Horrible hack to refresh the visualisation
            },
            start: function() {
                this.playing = true;
                webmidi.enable(err => {
                    const output = webmidi.outputs[0];
                    console.log(webmidi);
                    this.streamInterval = setInterval(() => {
                        if (
                            this.currentNoteIndex >
                            this.noteStream.length - 1
                        ) {
                            this.currentNoteIndex = 0;
                        }

                        this.currentNoteIndex++;
                        const note = this.noteStream[this.currentNoteIndex];

                        // If note isn't 0 and isn't the same as the previous note
                        if (
                            note !== 0 &&
                            this.noteStream[this.currentNoteIndex - 1] &&
                            note !== this.noteStream[this.currentNoteIndex - 1]
                        ) {
                            this.currentNote = note;
                            output.playNote(note);
                        }
                    }, 60000 / (this.tempo * this.notesPerBar));
                });
            },
            stop: function() {
                webmidi.disable();
                clearInterval(this.streamInterval);
                this.streamInterval = null;
                this.playing = false;
                this.currentNoteIndex = 0;
            }
        }
    };
</script>

<style>
    body {
        height: 100vh;
        overflow: scroll;
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
