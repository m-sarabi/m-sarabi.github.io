document.addEventListener('DOMContentLoaded', () => {
    const terminalUI = new TerminalUI('terminal-output', 'terminal-input');
    const typeWriter = new TypeWriter();
    const runner = new CommandRunner(terminalUI, typeWriter);

    const welcome = `
Welcome to Mohammad Sarabi's Terminal!

Type 'help' for a list of available commands.`.trim();

    terminalUI.disableInput(true);
    runner.generateOutput(welcome, false, [false, false]).then(() => terminalUI.disableInput(false));

    // start the matrix effect
    if (typeof RainChar !== 'undefined') {
        new RainChar({
            id: 'matrix',
            font: 'Consolas',
            charSize: [5, 30],
            charSpacing: 0.5,
            charChangeFreq: 0.5,
            fg: '#18a824',
            preRender: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        }).start();
    } else { // fallback to a plain black overlay
        const matrixPlaceholder = document.createElement('div');
        matrixPlaceholder.id = 'matrix';
        matrixPlaceholder.style.backgroundColor = 'black';
        document.body.appendChild(matrixPlaceholder);
    }
});