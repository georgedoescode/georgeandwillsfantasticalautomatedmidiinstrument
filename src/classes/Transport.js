export default class {
    constructor(store, input) {
        this.store = store;
        this.availableInputs = [];

        this.setInput(input);
        this.setup();
    }

    async setup() {
        const access = await navigator.requestMIDIAccess();
        const inputs = access.inputs.values();

        for (const input of inputs) {
            this.availableInputs.push(input);
        }

        if (this.MIDIInput === null) {
            console.warn("Please pick a MIDI bus", this.availableInputs);
        }

        this.MIDIInput.addListener("clock", "all", e => {
            this.store.commit("progressTransport");
        });

        this.MIDIInput.addListener("stop", "all", e => {
            this.store.commit("resetTransport");
        });
    }

    setInput(input) {
        this.MIDIInput = input;
    }
}
