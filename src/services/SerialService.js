export class SerialService {
    constructor() {
        this.port = null;
        this.reader = null;
        this.writer = null;
        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder();
        this.keepReading = false;
        this.onDataCallback = null;
        this.onDisconnectCallback = null;
        this.buffer = '';

        // Auto-detect physical disconnection
        if ("serial" in navigator) {
            navigator.serial.addEventListener('disconnect', (event) => {
                if (this.port && event.target === this.port) {
                    console.log("SerialService: Device disconnected physically");
                    this.disconnect();
                }
            });
        }
    }

    async connect(baudRate = 230400) {
        if ("serial" in navigator) {
            try {
                this.port = await navigator.serial.requestPort();
                await this.port.open({ baudRate });
                this.keepReading = true;
                this.readLoop();
                return true;
            } catch (error) {
                console.error("User cancelled or error opening port:", error);
                return false;
            }
        } else {
            console.error("Web Serial API not supported");
            return false;
        }
    }

    async disconnect() {
        this.keepReading = false;
        try {
            if (this.reader) {
                await this.reader.cancel().catch(e => console.warn("Reader cancel failed (device likely invalid):", e));
                this.reader = null;
            }
            if (this.writer) {
                await this.writer.releaseLock();
                this.writer = null;
            }
            if (this.port) {
                await this.port.close().catch(e => console.warn("Port close failed (device likely gone):", e));
                this.port = null;
            }
        } catch (e) {
            console.warn("Error during disconnect clean-up:", e);
        } finally {
            if (this.onDisconnectCallback) {
                this.onDisconnectCallback();
            }
        }
    }

    async readLoop() {
        while (this.port && this.port.readable && this.keepReading) {
            this.reader = this.port.readable.getReader();
            try {
                while (true) {
                    const { value, done } = await this.reader.read();
                    if (done) {
                        break;
                    }
                    if (value) {
                        const chunk = this.decoder.decode(value);
                        this.handleData(chunk);
                    }
                }
            } catch (error) {
                console.error("Read error:", error);
            } finally {
                this.reader.releaseLock();
            }
        }
    }

    handleData(chunk) {
        this.buffer += chunk.replace(/\r/g, ''); // Strip all carriage returns
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop(); // Keep incomplete line in buffer

        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && this.onDataCallback) {
                this.onDataCallback(trimmed);
            }
        });
    }

    async send(data) {
        if (this.port && this.port.writable) {
            const writer = this.port.writable.getWriter();
            await writer.write(this.encoder.encode(data));
            writer.releaseLock();
        }
    }

    setDataCallback(callback) {
        this.onDataCallback = callback;
    }

    setDisconnectCallback(callback) {
        this.onDisconnectCallback = callback;
    }
}

export const serialService = new SerialService();
