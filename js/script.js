$(document).ready(function () {
    const PARTICLE_SIZE = 3;
    const PARTICLE_COLOR = "rgb(215,190,255)";
    const MAX_LINE_SIZE = 2;
    const LINE_COLOR = "rgba(215, 190, 255, ";
    const FPS = 30;
    const MIN_SPEED = 1.5;
    const MAX_SPEED = 2;

    let count, size;
    let points = [];

    const canvasElement = $('#network-canvas');
    const ctx = canvasElement[0].getContext('2d');

    updateCanvasSize();
    draw();

    function updateCanvasSize() {
        size = [canvasElement.parent().innerWidth(), canvasElement.parent().innerHeight()];
        count = Math.max(15, Math.min(50, Math.floor(size[0] * size[1] / 10000)));
        console.log(count);
        canvasElement[0].width = size[0];
        canvasElement[0].height = size[1];
        updatePoints();
    }

    function randomSpeed(min, max) {
        let speed;
        do {
            speed = Math.random() * 2 * max - max;
        } while (Math.abs(speed) < min);
        return speed;
    }

    function updatePoints() {
        while (points.length < count) {
            points.push([Math.random() * size[0], Math.random() * size[1], randomSpeed(MIN_SPEED, MAX_SPEED), randomSpeed(MIN_SPEED, MAX_SPEED)]);
        }
        while (points.length > count) {
            points.shift();
        }
    }

    function drawPoints() {
        // draw the points
        ctx.clearRect(0, 0, size[0], size[1]);
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, size[0], size[1]);
        for (const point of points) {
            let [x, y, vx, vy] = point;

            x += vx;
            y += vy;

            if (x < PARTICLE_SIZE || x > size[0] - PARTICLE_SIZE) {
                vx = -vx;
            }

            if (y < PARTICLE_SIZE || y > size[1] - PARTICLE_SIZE) {
                vy = -vy;
            }

            ctx.beginPath();
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.arc(x, y, PARTICLE_SIZE, 0, 2 * Math.PI);
            ctx.fill();

            point[0] = x;
            point[1] = y;
            point[2] = vx;
            point[3] = vy;
        }
    }

    function drawLines() {
        // draw the lines
        for (let i = 0; i < points.length - 1; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const [x1, y1] = points[i];
                const [x2, y2] = points[j];

                const distance = Math.hypot(x2 - x1, y2 - y1);
                const maxDistance = (size[0] + size[1]) / 4;
                const alpha = 1 - distance / maxDistance;
                if (alpha > 0) {
                    ctx.beginPath();
                    ctx.strokeStyle = `${LINE_COLOR}${alpha})`;
                    ctx.lineWidth = alpha * MAX_LINE_SIZE;
                    ctx.moveTo(points[i][0], points[i][1]);
                    ctx.lineTo(points[j][0], points[j][1]);
                    ctx.stroke();
                }
            }
        }
    }

    function draw() {
        drawPoints();
        drawLines();
        setTimeout(function () {
            requestAnimationFrame(draw);
        }, 1000 / FPS);
    }

    $(window).on("resize", function () {
        updateCanvasSize();
    });
});