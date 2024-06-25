$(document).ready(function () {
    /**
     * Converts millimeters to pixels.
     *
     * @param {number} mm - The length in millimeters to convert.
     * @return {number} The corresponding length in pixels.
     */
    function mmToPx(mm) {
        return mm * 3.7795275591;
    }

    /**
     * Calculates the points on a circle with the given radius and number of points.
     *
     * @param {number} r - The radius of the circle.
     * @param {number} n - The number of points on the circle.
     * @return {Array<Array<number>>} An array n of points on the circle,
     * where each point is represented as an array of x and y coordinates.
     */
    function calculatePoints(r, n) {
        const points = [];
        const center = [canvas[0].width / 2, canvas[0].height / 2];
        const radius = mmToPx(r);
        for (let i = 0; i < n; i++) {
            const x = center[0] + radius * Math.cos(2 * Math.PI * i / n);
            const y = center[1] + radius * Math.sin(2 * Math.PI * i / n);
            points.push([x, y]);
        }

        return points;
    }

    /**
     * Updates the dots on the canvas by clearing the canvas and redrawing the dots
     * based on the calculated points. If showLines is true, also updates the lines
     * connecting the dots.
     *
     * @return {void} This function does not return anything.
     */
    function updateDots() {

        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);

        const points = calculatePoints(r, n);
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.arc(points[i][0], points[i][1], 3, 0, 2 * Math.PI);
            ctx.fill();
        }

        if (showLines) updateLines(points);
    }

    /**
     * Updates the lines on the canvas by drawing lines between the points.
     *
     * @param {Array<Array<number>>} points - An array of points where each point is represented as an array of x and y coordinates.
     * @return {void} This function does not return anything.
     */
    function updateLines(points) {
        ctx.beginPath();
        for (let i = 0; i < n - 1; i++) {
            ctx.moveTo(points[i][0], points[i][1]);
            ctx.lineTo(points[i + 1][0], points[i + 1][1]);
        }
        ctx.moveTo(points[n - 1][0], points[n - 1][1]);
        ctx.lineTo(points[0][0], points[0][1]);
        ctx.stroke();
    }

    const canvas = $("#board");
    canvas[0].width = window.innerWidth;
    canvas[0].height = window.innerHeight;
    const ctx = canvas[0].getContext("2d");
    let n, r, w;
    let showLines = $("#line").is(":checked");

    $(document).on("change", ".buttons input", function () {
        if ($(this).attr("id") === "count") {
            n = parseFloat($(this).val());
            w = 2 * r * Math.sin(Math.PI / n);
            !isNaN(w) && $("#word-size").val(Math.round(w * 100) / 100);
        } else if ($(this).attr("id") === "radius") {
            r = parseFloat($(this).val());
            w = 2 * r * Math.sin(Math.PI / n);
            !isNaN(w) && $("#word-size").val(Math.round(w * 100) / 100);
        } else if ($(this).attr("id") === "word-size") {
            w = parseFloat($(this).val());
            r = w / (2 * Math.sin(Math.PI / n));
            !isNaN(r) && $("#radius").val(Math.round(r * 100) / 100);
        } else if ($(this).attr("id") === "line") {
            showLines = $(this).is(":checked");
        }

        if (!n || !r || !w) return;
        updateDots();
    })

    $(window).on("resize", function () {
        canvas[0].width = window.innerWidth;
        canvas[0].height = window.innerHeight;
        if (!n || !r || !w) return;
        updateDots();
    })

    canvas.contextmenu(function (event) {
        event.preventDefault();
        event.stopPropagation();
    })
})