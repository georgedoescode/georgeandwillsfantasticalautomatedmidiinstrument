<template>
    <div>
        <p>Note Collection</p>
        <div>
            <span>Scale:</span>
            <v-select label="scale" :options="scales" v-model="scale" />
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
                scale: "aeolian",
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
            notes: function() {
                const scale = Scale.get(`${this.baseNote} ${this.scale}`);
                let notes = [];
                for (let i = 0; i < this.octaveCount; i++) {
                    notes = notes.concat(
                        scale.notes.map(n => {
                            let note = Note.transpose(
                                n,
                                Interval.fromSemitones(i * 12)
                            );
                            //note.info = Note.get(n);
                            return note;
                        })
                    );
                }
                console.log("notes", notes);
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
                console.log("emitUpdate", this.notes);
                this.$emit("update", this.notes);
            }
        }
    };
</script>

<style></style>
