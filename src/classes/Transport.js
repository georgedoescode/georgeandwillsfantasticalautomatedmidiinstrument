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

        this.MIDIInput.onmidimessage = e => this.onMIDIClockTick(e);
    }

    onMIDIClockTick(e) {
        if (e.data[0] === 248) {
            this.store.commit("progressTransport");
        }
    }
}
