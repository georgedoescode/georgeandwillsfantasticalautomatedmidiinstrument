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
                // console.log(this.scale);
                let notes = [];
                for (let i = 0; i < this.octaveCount; i++) {
                    notes = notes.concat(
                        this.scale.notes.map(n => {
                            console.log(Note.get(n));
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
                this.$emit("update", { notes: this.notes, scale: this.scale });
            }
        }
    };
</script>

<style></style>
