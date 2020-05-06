<template>
    <div>
        <Instrument />
        <button @click="addInstrument">Add</button>
        <p>
            {{ "Transport position: " + transportPosition }}
        </p>
    </div>
</template>

<script>
    import Instrument from "./components/Instrument.vue";
    import Transport from "./classes/Transport";

    export default {
        components: {
            Instrument
        },
        data: function() {
            return {
                instrumentCount: 1
            };
        },
        computed: {
            instruments: function() {},
            transportPosition() {
                return this.$store.state.transportPosition;
            }
        },
        watch: {
            transportPosition(pulse) {
                // midi clocks pulse 24x per quater note
                if (pulse % 24 === 0) {
                    console.log("quater note niceeeee");
                }
            }
        },
        methods: {
            addInstrument: function() {
                this.instrumentCount++;
            }
        },
        beforeCreate() {
            this.transport = new Transport(this.$store, "Georges MIDI Bus 1");
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

    button {
        display: block;
        margin: 10px auto;
        padding: 4px 6px;
        border: 1px solid rgba(60, 60, 60, 0.26);
        border-radius: 4px;
    }
</style>
