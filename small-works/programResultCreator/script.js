// When add button is pressed, create a new card div inside "result" div, and add title, goal, and progress values to it

const svgFail = $("<svg clip-rule=\"evenodd\" fill-rule=\"evenodd\" stroke-linejoin=\"round\" stroke-miterlimit=\"2\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z\" fill-rule=\"nonzero\"/></svg>")
svgFail.attr("width", 40)
svgFail.attr("fill", "red")

const svgAlert = $("<svg clip-rule=\"evenodd\" fill-rule=\"evenodd\" stroke-linejoin=\"round\" stroke-miterlimit=\"2\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m2.095 19.886 9.248-16.5c.133-.237.384-.384.657-.384.272 0 .524.147.656.384l9.248 16.5c.064.115.096.241.096.367 0 .385-.309.749-.752.749h-18.496c-.44 0-.752-.36-.752-.749 0-.126.031-.252.095-.367zm1.935-.384h15.939l-7.97-14.219zm7.972-6.497c-.414 0-.75.336-.75.75v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5c0-.414-.336-.75-.75-.75zm-.002-3c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z\" fill-rule=\"nonzero\"/></svg>")
svgAlert.attr("width", 40)
svgAlert.attr("fill", "orange")

const svgCheck = $("<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z\"/></svg>")
svgCheck.attr("width", 40)
svgCheck.attr("fill", "green")

const svgGold = svgCheck.clone()
svgGold.attr("fill", "gold")

// click event for "add" button
const addBtn = $("#add");
addBtn.click(function () {
    const title = $("#title");
    const goal = $("#goal");
    const progress = $("#progress");
    const result = $("#result");

    // check if title, goal, and progress inputs are empty
    if (title.val() === "" || goal.val() === "" || progress.val() === "") {
        alert("Please fill in all fields");
        return;
    }

    // create a div with class .item-container
    const cardDiv = $("<div>").addClass("card")
    const valuesDiv = $("<div>").addClass("item-container");
    result.append(valuesDiv);

    valuesDiv.append(`<span class="c-title item">${title.val()}</span>`)
    valuesDiv.append(`<span class="c-goal item">${goal.val()}</span>`)
    valuesDiv.append(`<span class="c-progress item">${progress.val()}</span>`)

    // add a progress bar
    const progressContainer = $("<div>").addClass("progress-container")
    const progressBar = $("<progress>")
    progressBar.attr("max", goal.val())
    progressBar.attr("value", Math.max(0, Math.min(progress.val(), goal.val())))
    const progressPercentage = Math.round(Math.max(0, Math.min(progress.val(), goal.val())) / goal.val() * 100)
    const progressLabel = $("<span class='progress-label'>").text(progressPercentage + "%")

    cardDiv.append(valuesDiv);
    progressContainer.append(progressLabel)
    progressContainer.append(progressBar)

    if (progressPercentage >= 100) {
        progressContainer.append(svgGold.clone())
    } else if (progressPercentage >= 80) {
        progressContainer.append(svgCheck.clone())
    } else if (progressPercentage >= 50) {
        progressContainer.append(svgAlert.clone())
    } else {
        progressContainer.append(svgFail.clone())
    }

    cardDiv.append(progressContainer)

    // if number of .card is bigger than one, add a horizontal line
    if (result.children(".card").length > 1) {
        result.append("<hr>")
    }

    result.append(cardDiv);
    // clear title, goal, and progress inputs
    title.val("");
    goal.val("");
    progress.val("");
})

// click event for "clear" button, to clear all the cards, except the first one
const clearBtn = $("#clear");
clearBtn.click(function () {
    const result = $("#result");
    result.children(".card").each(function (index) {
        if (index > 0) {
            $(this).remove();
        }
    })
    // remove all <hr> elements
    result.children("hr").remove();
})


// click event for "download" button, to download the result as an image
const downloadBtn = $("#download");
downloadBtn.click(function () {
    const result = document.getElementById("result");
    html2canvas(result).then(function (canvas) {
        // $("#preview").append(canvas)
        const link = document.createElement("a")
        link.href = canvas.toDataURL("image/png");
        link.download = "result.png";
        document.body.appendChild(link);
        link.click();
    })
})

// assign enter key to the add button, if on #progress input
// and move the focus to the #title input
const progressInput = $("#progress");
progressInput.on("keyup", function (event) {
    if (event.key === "Enter") {
        addBtn.click();
        $("#title").focus();
    }
})