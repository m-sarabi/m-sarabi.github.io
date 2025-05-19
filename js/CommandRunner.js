class CommandRunner {
    /**
     *
     * @param {TerminalUI} terminalUI
     * @param {TypeWriter} typeWriter
     */
    constructor(terminalUI, typeWriter) {
        this.terminalUI = terminalUI;
        this.typeWriter = typeWriter;

        terminalUI.onCommand = (command) => this.run(command);

        document.addEventListener('click', () => {
            if (this.typeWriter.isTyping) this.typeWriter.speedUp();
        }, {capture: true});

        this.commands = {
            'help': {
                title: 'help',
                execute: this.helpCommand.bind(this),
                description: 'Show this help message',
            },
            'about': {
                title: 'about',
                execute: this.aboutCommand.bind(this),
                description: 'Learn about me',
            },
            'clear': {
                title: 'clear',
                execute: this.clearCommand.bind(this),
                description: 'Clear all text on the terminal',
            },
            'play': {
                title: 'play [game]',
                execute: this.playCommand.bind(this),
                description: 'Play a game',
            },
        };
    }

    async generateOutput(text, error = false, spaces = [true, false]) {
        const output = document.createElement('div');
        output.className = 'command-output';
        if (error) output.classList.add('error');
        this.terminalUI.appendOutput(output);
        await this.typeWriter.type(text, output, false, spaces);
    }

    async run(command) {
        if (command && this.terminalUI.commandHistory[this.terminalUI.commandHistory.length - 1] !== command) {
            this.terminalUI.commandHistory.push(command);
        }
        const notFound = async (command) => {
            await this.generateOutput(`Command \'${command}\' not found. Type 'help' for a list of commands.`, true);
        };

        const incorrectUsage = async (command) => {
            await this.generateOutput(`Usage: ${this.commands[command].title}`, true);
        };
        const [base, ...args] = command.split(' ');
        this.terminalUI.historyIndex = this.terminalUI.commandHistory.length;
        if (this.commands[base]) {
            // await this.commands[command].execute();
            switch (base) {
                case 'help':
                    await this.helpCommand();
                    break;
                case 'about':
                    await this.aboutCommand();
                    break;
                case 'clear':
                    await this.clearCommand();
                    break;
                case 'play':
                    if (!args[0]) {
                        await incorrectUsage(base);
                        return;
                    }
                    await this.playCommand(args[0]);
                    break;
                default:
                    await notFound(command);
            }
        } else {
            await notFound(command);
        }
    }

    async helpCommand() {
        let message = 'Available commands:\n\n';
        const commands = Object.keys(this.commands);
        commands.sort();
        for (const command of commands) {
            message += `${this.commands[command].title.padEnd(22)} - ${this.commands[command].description}\n`;
        }
        await this.generateOutput(message.trim());
    }

    async aboutCommand() {
        const message = `
Hello! I am Mohammad Sarabi, a software developer with a passion for creating innovative solutions.
I specialize in frontend development, Android development, and data analysis.
I'm also interested in game development and AI.`.trim();
        await this.generateOutput(message);
    }

    async clearCommand() {
        this.terminalUI.clearOutput();
    }

    async playCommand(game) {
        await this.generateOutput(`Playing ${game}...`);
    }
}