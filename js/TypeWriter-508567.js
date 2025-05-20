class TypeWriter {
    constructor(speed = 25, batchSize = 1) {
        this.defaultSpeed = speed;
        this.batchSize = batchSize;
        this.speed = speed;
        this.isTyping = false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    createElementFromHTML(htmlString) {
        const tagMatch = htmlString.match(/^<\s*([a-z0-9-]+)/i);
        if (!tagMatch) return null;
        const tagName = tagMatch[1];
        const container = document.createElement('div');
        container.innerHTML = htmlString.trim() + `</${tagName}>`;
        return container.firstElementChild;
    }

    async type(text, element, nested = false, spaces = [true, false]) {
        this.isTyping = true;
        const userSelect = element.parentElement.style.userSelect;
        element.parentElement.style.userSelect = 'none';
        let count = 0;
        if (spaces[0]) text = '\n' + text;
        if (spaces[1]) text += '\n ';

        const lines = text.split('\n');

        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines[i].length; j++) {
                if (lines[i][j] === ' ') {
                    let space = 1;
                    while (lines[i][j + space] === ' ') space++;
                    element.innerHTML += ' '.repeat(space);
                    j += space - 1;
                } else if (lines[i][j] === '<') {
                    const tag = lines[i].substring(j + 1, lines[i].indexOf('>', j + 1));
                    const newElement = this.createElementFromHTML(`<${tag}>`);
                    const content = lines[i].substring(lines[i].indexOf('>', j + 1) + 1, lines[i].indexOf('</', j + 1));
                    element.appendChild(newElement);
                    await this.type(content, newElement, true);
                    j = lines[i].indexOf('>', lines[i].indexOf('</', j));
                } else {
                    element.innerHTML += lines[i][j];
                }

                count++;
                if (count % this.batchSize === 0) {
                    await this.sleep(this.speed);
                }
            }

            count = 0;
            if (i < lines.length - 1) element.innerHTML += '<br>';
        }

        if (!nested) {
            this.isTyping = false;
            element.parentElement.style.userSelect = userSelect;
            this.resetSpeed();
        }
    }

    speedUp() {
        this.speed = 1;
        this.batchSize = 2;
    }

    resetSpeed() {
        this.speed = this.defaultSpeed;
        this.batchSize = 1;
    }
}