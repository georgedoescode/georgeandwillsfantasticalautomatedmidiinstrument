<template>
    <div>
        <Instrument />
    </div>
</template>

<script>
    import Instrument from "./components/Instrument.vue";

    export default {
        components: {
            Instrument
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
