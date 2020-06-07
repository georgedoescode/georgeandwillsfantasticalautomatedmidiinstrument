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
            <button @click="generateMelodies">Regenerate</button>
        </div>
        <div>
            <p>{{ currentNoteLabel }}</p>
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

    export default {
        props: {
            output: { required: true }
        },
        data: function() {
            return {
                melodyFactory: null,
                fitnessFunction: MelodyOne,
                notes: [],
                noteStream: [],
                streamInterval: null,
                currentNote: 0,
                scale: null,
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
                    geneValues: this.notes.concat([null]), // 'Notes' available (null being OFF note)
                    populationCount: 16, // How many melodies to create
                    generationCount: 100, // How much to breed (develop) them
                    fitnessFunction: this.fitnessFunction, // The creative bit
                    scale: this.scale
                };
            },
            conductor() {
                return this.$store.state.transportPosition;
            }
        },
        watch: {
            conductor(pulse) {
                // midi clocks pulse 24x per quater note
                if (pulse % 24 === 0) {
                    console.log("quarter note niceeeee");
                    this.play(pulse);
                }
            }
        },
        methods: {
            updateFitnessFunction: function(fnc) {
                try {
                    eval("this.fitnessFunction = " + fnc);
                    this.generateMelodies();
                } catch (e) {
                    console.warn("Error updating fitness function.", e);
                }
            },
            setNotes: function(e) {
                this.notes = e.notes;
                this.scale = e.scale;
                this.generateMelodies();
            },
            generateMelodies: function() {
                this.melodyFactory = new MelodyFactory(this.settings);
                const melodies = this.melodyFactory.createMelodies();
                this.noteStream = melodies.reduce((a, m) => a.concat(m), []);
                this.visualisationKey = Math.random(); // Horrible hack to refresh the visualisation
            },
            play: function(index) {
                const note = this.noteStream[index];
                if (note === null) return;
                // If note isn't 0 and isn't the same as the previous note
                if (
                    this.noteStream[index - 1] || // AND if there was a previous note it wasn't the same as this one
                    note !== this.noteStream[index - 1]
                ) {
                    if (this.currentNote) output.stopNote(this.currentNote); // Stop the current note if there is one
                    this.currentNote = note; // Reset the current note
                    console.log("Playing", note);
                    this.output.playNote(note.midi);
                }
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
