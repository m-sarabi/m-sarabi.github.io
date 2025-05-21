class TerminalUI {
    constructor(outputId, inputId) {
        this.output = document.getElementById(outputId);
        this.input = document.getElementById(inputId);

        this.initInput();
        this.observeOutput();
        this.commandHistory = [];
        this.historyIndex = 0;
    }

    appendOutput(element) {
        this.output.appendChild(element);
    }

    clearOutput() {
        this.output.innerHTML = '';
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }

    disableInput(disabled) {
        this.input.disabled = disabled;
    }

    focusInput() {
        this.input.focus();
    }

    initInput() {
        this.input.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') { // enter key to run command
                const command = this.input.value.trim();
                this.input.value = '';
                this.disableInput(true);
                await this.onCommand(command);
                this.disableInput(false);
                this.focusInput();
            } else if (e.key === 'ArrowUp') { // up key to go back in command history
                e.preventDefault();
                if (this.commandHistory.length > 0) {
                    this.historyIndex = Math.max(0, this.historyIndex - 1);
                    this.input.value = this.commandHistory[this.historyIndex];
                }
            } else if (e.key === 'ArrowDown') { // down key to go forward in command history
                e.preventDefault();
                if (this.commandHistory.length > 0) {
                    this.historyIndex = Math.min(this.commandHistory.length - 1, this.historyIndex + 1);
                    this.input.value = this.commandHistory[this.historyIndex];
                }
            }
        });
    }

    observeOutput() {
        const observer = new MutationObserver(() => {
            this.scrollToBottom();
        });
        observer.observe(this.output, {childList: true, subtree: true});
    }

    async onCommand(command) {
        // will be assigned by CommandRunner
    }
}