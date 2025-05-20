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
    // noinspection JSUnresolvedReference
    if (typeof RainChar !== 'undefined') {
        // noinspection JSUnresolvedReference
        new RainChar({
            id: 'matrix',
            font: 'Consolas',
            charSize: [5, 30],
            charRange: [[0x3041, 0x3096], [0x30a1, 0x30f6]],
            charSpacing: 1,
            charChangeFreq: 0.5,
            densityFactor: 100,
            fps: 15,
            fg: '#18a824',
            preRender: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        }).start();
    } else { // fallback
        const matrixPlaceholder = document.createElement('div');
        matrixPlaceholder.id = 'matrix';
        matrixPlaceholder.style.backgroundColor = 'black';
        document.body.appendChild(matrixPlaceholder);
    }
});