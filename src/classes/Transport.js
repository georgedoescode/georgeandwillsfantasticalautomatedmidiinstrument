export default class {
    constructor(store, inputName) {
        this.store = store;
        this.MIDIInput = null;
        this.inputName = inputName;

        this.setup();
    }

    async setup() {
        const access = await navigator.requestMIDIAccess();
        const inputs = access.inputs.values();

        for (const input of inputs) {
            if (input.name === this.inputName) {
                this.MIDIInput = input;
                break;
            }
        }

        this.MIDIInput.onmidimessage = e => this.onMIDIClockMessage(e);
    }

    onMIDIClockMessage(e) {
        // "stop" message value is 252
        if (e.data[0] === 252) {
            this.store.commit("resetTransport");
            return;
        }
        // "clock" message value is 248
        if (e.data[0] === 248) {
            this.store.commit("progressTransport");
        }
    }
}
