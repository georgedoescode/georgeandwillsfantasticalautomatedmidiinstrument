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
        const availableInputs = [];
        for (const input of inputs) {
            // console.log(input)
            availableInputs.push(input.name);
            if (input.name === this.inputName) {
                this.MIDIInput = input;
                break;
            }
        }
        if (this.MIDIInput === null) {
            console.warn("Please pick a MIDI bus", availableInputs);
        }

        this.MIDIInput.onmidimessage = e => this.onMIDIClockMessage(e);
    }

    onMIDIClockMessage(e) {
        // console.log('onMIDIClockMessage', e);
        // "stop" message value is 252
        if (e.data[0] === 252) {
            this.store.commit("resetTransport");
        }

        // "clock" message value is 248
        if (e.data[0] === 248) {
            this.store.commit("progressTransport");
        }
    }
}
