<template>
    <div id="app">
        <header>
            <div class="midi-clock">
                <p class="transport">
                    {{ "CLOCK: " + conductor }}
                </p>
                <div class="midi-opts">
                    <div>
                        <span>CLOCK input</span>
                        <v-select
                            label="name"
                            :options="inputs"
                            v-model="selectedInput"
                            @input="handleInputChange"
                        />
                    </div>
                </div>
            </div>
            <div class="midi-opts">
                <div>
                    <span>MIDI output</span>
                    <v-select
                        label="name"
                        :options="outputs"
                        v-model="selectedOutput"
                        @input="handleOutputChange"
                    />
                </div>
            </div>
        </header>
        <Instrument :output="selectedOutput" />
    </div>
</template>

<script>
    import Instrument from "./components/Instrument.vue";
    import Transport from "./classes/Transport";
    import webmidi from "webmidi";

    export default {
        data: function() {
            return {
                inputs: [],
                outputs: [],
                selectedInput: null,
                selectedOutput: null,
                transport: null
            };
        },
        components: {
            Instrument
        },
        computed: {
            conductor() {
                return this.$store.state.transportPosition;
            }
        },
        methods: {
            handleInputChange(e) {
                this.selectedInput = e;
                this.transportPosition.setInput(this.selectedInput);
            },
            handleOutputChange(e) {
                this.selectedOutput = e;
            }
        },
        beforeCreate() {
            webmidi.enable(err => {
                this.inputs = webmidi.inputs;
                this.outputs = webmidi.outputs;
                this.selectedOutput = this.outputs[0];
                this.selectedInput = this.inputs[0];

                this.transport = new Transport(this.$store, this.selectedInput);
            });
        }
    };
</script>

<style scoped>
    #app {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        font-family: system-ui;
        color: #243b53;
    }

    header {
        display: flex;
        align-items: center;
        width: 100%;
        background: #fff;
        padding: 12px 24px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        flex-shrink: 0;
        margin-bottom: 32px;
    }

    .transport {
        line-height: 1;
        color: #627d98;
        font-size: 12px;
        width: 96px;
        /* margin-left: 16px; */
    }

    .midi-clock {
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .midi-opts {
        display: flex;
        margin-left: auto;
    }

    .midi-opts > div {
        flex-shrink: 0;
        margin-left: 16px;
        min-width: 256px;
    }

    .midi-opts > div > span {
        font-size: 12px;
        margin-bottom: 8px;
        display: block;
    }
</style>
