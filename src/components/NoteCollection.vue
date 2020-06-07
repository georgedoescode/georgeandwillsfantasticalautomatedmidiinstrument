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
                // console.log(this.scale);
                let notes = [];
                for (let i = 0; i < this.octaveCount; i++) {
                    notes = notes.concat(
                        this.scale.notes.map(n => {
                            // console.log(Note.get(n));
                            let note = Note.transpose(
                                n,
                                Interval.fromSemitones(i * 12)
                            );
                            //note.info = Note.get(n);
                            return note;
                        })
                    );
                }
                // console.log("notes", notes);
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
                // console.log("emitUpdate", this.notes);
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
