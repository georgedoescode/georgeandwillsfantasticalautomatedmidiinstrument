<template>
    <div class="note-collection">
        <h3>Note Collection</h3>
        <div class="selectors">
            <div>
                <span class="selector-label">Base note:</span>
                <v-select
                    label="base note"
                    :options="allNotes"
                    v-model="baseNote"
                />
            </div>
            <div>
                <span class="selector-label">Scale:</span>
                <v-select label="scale" :options="scales" v-model="scaleName" />
            </div>
        </div>
    </div>
</template>

<script>
    import { Interval, Midi, Note, Scale } from "@tonaljs/tonal";

    export default {
        data: function() {
            return {
                scaleName: "aeolian",
                baseNote: "d4",
                octaveCount: 3
            };
        },
        watch: {
            notes: function() {
                this.emitUpdate();
            }
        },
        created: function() {
            this.emitUpdate();
        },
        computed: {
            scale: function() {
                return Scale.get(`${this.baseNote} ${this.scaleName}`);
            },
            notes: function() {
                const middleOctave = ~~this.baseNote.match(/\d+/)[0];
                const startOctave =
                    middleOctave - Math.floor(this.octaveCount / 2);
                const baseNotes = this.scale.notes.map(n => n.match(/\D+/)[0]);
                let notes = [];
                for (
                    let o = startOctave;
                    o < startOctave + this.octaveCount;
                    o++
                ) {
                    notes = notes.concat(baseNotes.map(n => Note.get(n + o)));
                }
                return notes;
            },
            scales: function() {
                return Scale.names();
            },
            allNotes: function() {
                return [...Array(128).keys()].map(Note.fromMidi);
            }
        },
        methods: {
            emitUpdate: function() {
                this.$emit("update", { notes: this.notes, scale: this.scale });
            }
        }
    };
</script>

<style scoped>
    h3 {
        margin-bottom: 16px;
    }
    .selectors {
        display: flex;
        margin-bottom: 32px;
    }

    .selectors > div {
        width: 50%;
    }

    .selector-label {
        display: block;
        margin-bottom: 8px;
        color: #486581;
    }

    .selectors > div:first-child {
        margin-right: 16px;
    }
</style>

<style>
    .vs__dropdown-toggle {
        border: 1px solid #d9e2ec !important;
    }
</style>
