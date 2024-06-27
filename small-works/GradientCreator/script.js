let color1;
let color2;

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
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
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
    console.log(gradientSize);
    for (let i = 0; i < gradientSize; i++) {
        let r = Math.round(r1 + i * rStep);
        let g = Math.round(g1 + i * gStep);
        let b = Math.round(b1 + i * bStep);
        gradient.push(`rgb(${r}, ${g}, ${b})`);
    }
    return gradient;
}

$(document).ready(function () {
    color1 = $("#color1-input").val();
    color2 = $("#color2-input").val();

    const gradientSizeInput = $("#gradient-size");
    let gradientSize = gradientSizeInput.val();
    gradientSizeInput.on("input", function () {
        $("#gradient-size-value").html($(this).val());
        gradientSize = $(this).val();
        createGradient();
    });

    $("#color1-color").css("background-color", color1);
    $("#color2-color").css("background-color", color2);

    $(".select-color").on("click", function () {
        const rgb = $(this).css("background-color");
        const hex = rgbToHex(rgb);
        navigator.clipboard.writeText(hex).then();
    });

    // change background color of .select-color on input change
    $("input[type=color]").on("input", function () {
        $(this).parent().parent().children(".select-color").css("background-color", $(this).val());
        if (this.id === "color1-input") {
            color1 = $(this).val();
        } else {
            color2 = $(this).val();
        }
        createGradient();
    });

    function createGradient() {
        let gradientColors;
        const gradientDivs = [];
        gradientColors = calculateGradient(hexToRgb(color1), hexToRgb(color2), gradientSize);

        gradientColors.forEach((color) => {
            gradientDivs.push(`<div style="background-color: ${color}" class="gradient-color"></div>`);
        });
        $("#gradient").html("").html(gradientDivs.join(" "));
    }

    createGradient();

    $(document).on("click", ".gradient-color", function () {
        const rgb = $(this).css("background-color");
        const hex = rgbToHex(rgb);
        navigator.clipboard.writeText(hex).then();
    });
});