<template>
    <div id="app">
        <header>
            <p class="transport">
                {{ "Transport position: " + conductor }}
            </p>
        </header>
        <Instrument :output="this.outputs[0]" />
    </div>
</template>

<script>
    import Instrument from "./components/Instrument.vue";
    import Transport from "./classes/Transport";
    import webmidi from "webmidi";

    export default {
        data: function() {
            return {
                outputs: []
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
        beforeCreate() {
            this.transport = new Transport(this.$store, "GAWFAMI IAC Bus 1");
            // console.log("this.transport", this.transport);
            webmidi.enable(err => {
                this.outputs = webmidi.outputs;
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
        height: 64px;
        padding: 0 24px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        flex-shrink: 0;
        margin-bottom: 32px;
    }

    .transport {
        line-height: 1;
        color: #627d98;
        font-size: 14px;
    }
</style>
