<template>
    <div>
        <p>Note Collection</p>
        <div>
            <span>Scale:</span>
            <v-select label="scale" :options="scales" v-model="scaleName" />
        </div>
        <div>
            <span>Base note:</span>
            <v-select
                label="base note"
                :options="allNotes"
                v-model="baseNote"
            />
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

<style></style>
