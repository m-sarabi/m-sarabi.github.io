let color1;
let color2;

class gradientColor {
    constructor(color) {
        this.color = color;
    }

    createContainer() {
        const container = document.createElement('div');
        container.style.backgroundColor = this.color;
        container.classList.add('gradient-color');

        container.appendChild(this.createCopyButton());

        container.addEventListener('click', () => {
            const rgb = container.style.backgroundColor;
            const hex = rgbToHex(rgb);
            navigator.clipboard.writeText(hex).then();
        });

        return container;
    }

    createCopyButton() {
        const button = document.createElement('div');
        button.classList.add('select-color');
        const text = document.createElement('span');
        text.innerHTML = 'copy';
        button.appendChild(text);
        return button;
    }
}

// convert rgb (as "rgb(255, 255, 255)") to hex (#ffffff)
function rgbToHex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }

    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

// convert hex (#ffffff) to rgb (as "rgb(255, 255, 255)")
function hexToRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16)
    } : null;
}

// calculate gradient, color1 and color2 are hex codes
function calculateGradient(color1, color2, gradientSize) {
    let gradient = [];
    let r1 = color1.r;
    let g1 = color1.g;
    let b1 = color1.b;

    let r2 = color2.r;
    let g2 = color2.g;
    let b2 = color2.b;

    let rStep = (r2 - r1) / (gradientSize - 1);
    let gStep = (g2 - g1) / (gradientSize - 1);
    let bStep = (b2 - b1) / (gradientSize - 1);
    for (let i = 0; i < gradientSize; i++) {
        let r = Math.round(r1 + i * rStep);
        let g = Math.round(g1 + i * gStep);
        let b = Math.round(b1 + i * bStep);
        gradient.push(`rgb(${r}, ${g}, ${b})`);
    }
    return gradient;
}

document.addEventListener('DOMContentLoaded', async function () {
    color1 = document.getElementById("color1-input").value;
    color2 = document.getElementById("color2-input").value;

    const gradientSizeInput = document.getElementById("gradient-size");
    const gradientSizeValue = document.getElementById("gradient-size-value");
    gradientSizeInput.addEventListener("input", function () {
        gradientSizeValue.value = this.value;
        createGradient();
    });

    gradientSizeValue.addEventListener("input", function () {
        if (this.value > 20) {
            this.value = 20;
        } else if (this.value < 2) {
            this.value = 2;
        }
        gradientSizeInput.value = this.value;
        createGradient();
    });

    document.getElementById("color1-color").style.backgroundColor = color1;
    document.getElementById("color2-color").style.backgroundColor = color2;

    document.querySelectorAll('.select-color').forEach(function (el) {
        el.addEventListener('click', function () {
            const rgb = this.style.backgroundColor;
            const hex = rgbToHex(rgb);
            navigator.clipboard.writeText(hex).then();
        });
    });

    document.querySelectorAll('input[type=color]').forEach(function (el) {
        el.addEventListener('input', function () {
            const parent = this.parentNode.parentNode;
            parent.querySelector('.select-color').style.backgroundColor = this.value;

            if (this.id === "color1-input") {
                color1 = this.value;
            } else {
                color2 = this.value;
            }
            createGradient();
        });
    });

    function createGradient() {
        let gradientColors;
        const gradientDivs = [];
        gradientColors = calculateGradient(hexToRgb(color1), hexToRgb(color2), gradientSizeInput.value);

        gradientColors.forEach((color) => {
            const gradientDiv = new gradientColor(color).createContainer();
            gradientDivs.push(gradientDiv);
        });
        document.getElementById('gradient').innerHTML = "";
        document.getElementById('gradient').append(...gradientDivs);
    }

    createGradient();

    // $(document).on("click", ".gradient-color", function () {
    //     const rgb = $(this).css("background-color");
    //     const hex = rgbToHex(rgb);
    //     navigator.clipboard.writeText(hex).then();
    // });
});