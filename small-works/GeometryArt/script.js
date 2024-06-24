const segment = $('<div class="to-rotate"></div>');

$(document).ready(function () {
    const mainContainer = $('#main-container');
    let n, r, w;

    $(document).on("change", ".buttons input", function () {
        if ($(this).attr("id") === "count") {
            n = parseFloat($(this).val());
            w = 2 * r * Math.sin(Math.PI / n);
            $("#word-size").val(w);
        } else if ($(this).attr("id") === "radius") {
            r = parseFloat($(this).val());
            w = 2 * r * Math.sin(Math.PI / n);
            $("#word-size").val(w);
        } else if ($(this).attr("id") === "word-size") {
            w = parseFloat($(this).val());
            r = w / (2 * Math.sin(Math.PI / n));
            $("#radius").val(r);
        }

        if (!n || !r || !w) return;
        updateSegments();
    })

    function updateSegments() {
        mainContainer.empty();
        const segments = []
        for (let i = 0; i < n; i++) {
            const newSegment = segment.clone();
            newSegment.css("transform", `rotate(${360 / n * i}deg) translate(${r}mm) rotate(90deg)`);
            segments.push(newSegment);
        }

        mainContainer.append(segments);
    }
})