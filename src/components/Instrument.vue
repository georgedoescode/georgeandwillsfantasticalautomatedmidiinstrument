<template>
    <div class="instrument">
        <!-- <div class="viz">
            <MelodyVisualisation
                v-if="!!noteStream.length"
                :key="visualisationKey"
                :melody="noteStream"
            />
        </div> -->
        <div class="instrument-header">
            <h2 class="heading">Instrument</h2>
            <button @click="generateMelodies" class="regenerate">
                Regenerate
            </button>
        </div>
        <div class="current-note">
            <p>
                Current note: <strong>{{ currentNoteLabel }}</strong>
            </p>
        </div>
        <NoteCollection @update="setNotes" />
        <div class="code">
            <codemirror
                :value="fitnessFunctionString"
                @input="updateFitnessFunction"
            ></codemirror>
        </div>
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
            },
            windowDimensions() {
                return {
                    w: window.innerWidth,
                    h: window.innerHeight
                };
            }
        },
        watch: {
            conductor(pulse) {
                // midi clocks pulse 24x per quater note
                if (pulse % 24 === 0) {
                    // console.log("quarter note niceeeee");
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
                console.log("play this.noteStream", this.noteStream);
                const note = this.noteStream[index];
                if (note === null) return;
                // If note isn't 0 and isn't the same as the previous note
                if (
                    this.noteStream[index - 1] || // AND if there was a previous note it wasn't the same as this one
                    note !== this.noteStream[index - 1]
                ) {
                    if (this.currentNote)
                        this.output.stopNote(this.currentNote); // Stop the current note if there is one
                    this.currentNote = note; // Reset the current note
                    console.log("Playing", note);
                    this.output.playNote(note.midi);
                }
            }
        }
    };
</script>

<style scoped>
    .instrument {
        position: relative;
        width: 768px;

        padding: 32px 24px;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        margin: auto;
    }

    .instrument-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .instrument .heading {
        position: relative;
        color: #243b53;
        letter-spacing: -0.05em;
        margin-bottom: 32px;
        padding-bottom: 16px;
    }

    .instrument .heading:before {
        position: absolute;
        content: "";
        bottom: 0;
        left: 0;
        height: 2px;
        width: 48px;
        background: #f0f4f8;
    }

    .regenerate {
        background: #102a43;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        border: 2px solid #102a43;
        color: #f0f4f8;
        cursor: pointer;
        outline: none;
    }

    .regenerate:hover {
        background: #fff;
        border: 2px solid #102a43;
        color: #102a43;
    }

    .current-note {
        margin-bottom: 32px;
    }
</style>

<style>
    .CodeMirror-gutters {
        background: #fff;
        border-right: 1px solid #f0f4f8;
    }

    .CodeMirror-linenumber {
        color: #829ab1;
    }

    .CodeMirror {
        color: #102a43;
    }
</style>
