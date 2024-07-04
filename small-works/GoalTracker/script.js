const overlay = $("<div></div>");
overlay.attr("id", "overlay");

// this function creates a jquery label with an input element inside,
// parameters are the label text, the placeholder, and the input type
function createLabelAndInput(labelText, placeholder, inputType = "text") {
    const container = $('<div></div>');
    container.addClass('flex-container');
    container.append(`<span>${labelText}</span>`);
    const input = $('<input>');
    input.attr("type", inputType);
    input.attr("placeholder", placeholder);
    container.append(input);
    return container;
}

// // this function creates a jquery label with a bunch of selectable checkboxes inside, parameters are the label text
// // and a list of options as [[value1, label1], [value2, label2], ...]
// function createLabelAndCheckboxList(labelText, options) {
//     const container = $('<div></div>');
//     container.addClass('flex-container');
//     container.append(`<span>${labelText}</span>`);
//     const optionsContainer = $('<div></div>');
//     for (const option of options) {
//         const label = $(`<label>${option[1]}</label>`);
//         const checkbox = $('<input>');
//         checkbox.attr("type", "checkbox");
//         checkbox.attr("value", option[0]);
//         label.append(checkbox);
//         optionsContainer.append(label);
//     }
//     container.append(optionsContainer);
//     return container;
// }

// this function creates a jquery label with a bunch of selectable options inside the dropdown, parameters are the label text
// and a list of options as [[value1, label1], [value2, label2], ...]
function createLabelAndOptionsList(labelText, options) {
    const container = $('<div></div>');
    container.addClass('flex-container');
    container.append(`<span>${labelText}</span>`);
    const optionsContainer = $('<select></select>');
    for (const option of options) {
        const label = $(`<option>${option[1]}</option>`);
        label.attr("value", option[0]);
        optionsContainer.append(label);
    }
    container.append(optionsContainer);
    return container;
}

// this function creates a jquery checkbox with an input element inside, it has custom style with class "big-checkbox",
// parameter is the checkbox label text
function createBigCheckbox(labelText) {
    const container = $('<div></div>');
    container.addClass('flex-container');
    container.append(`<span>${labelText}</span>`);
    const checkboxContainer = $('<div class="big-checkbox"></div>');
    const checkbox = $('<input>');
    checkbox.attr("type", "checkbox");
    checkboxContainer.append(checkbox);
    container.append(checkboxContainer);
    return container;
}

function createCardEditor(mode, options = {}) {
    const cardEditor = $('<div id="card-editor"></div>');
    let header, button2;
    if (mode === "add") {
        header = "Add Card";
        button2 = $('<button id="cancel-card-button" class="btn secondary">Cancel</button>');
    } else if (mode === "edit") {
        header = "Edit Card";
        button2 = $('<button id="delete-card-button" class="btn danger">Delete</button>');
    }

    const cardEditorTitle = createLabelAndInput("Title:", "Title");
    cardEditorTitle.attr("id", "card-editor-title");

    const cardEditorGoal = createLabelAndInput("Goal:", "Goal", "number");
    cardEditorGoal.find("input").attr("min", "1");
    cardEditorGoal.attr("id", "card-editor-goal");

    const repeatCheckbox = createBigCheckbox("Repeat");
    repeatCheckbox.attr("id", "card-editor-repeat");

    const repeatingCardSelect = createLabelAndOptionsList("Interval",
        [["daily", "Daily"], ["weekly", "Weekly"], ["monthly", "Monthly"]]);
    repeatingCardSelect.attr("id", "card-editor-repeating");
    repeatingCardSelect.css("display", "none");

    const buttonsContainer = $('<div id="card-editor-buttons"></div>');
    const addCardButton = $('<button id="save-card-button" class="btn primary">Save</button>');
    addCardButton.data("mode", mode);
    if (mode === "edit") {
        addCardButton.data("id", options["id"]);
    }
    const deleteCardButton = button2;
    if (mode === "edit") {
        deleteCardButton.data("id", options["id"]);
    }

    if (mode === "edit") {
        cardEditorTitle.find("input").val(options["title"]);
        cardEditorGoal.find("input").val(options["goal"]);
        repeatCheckbox.find("input").prop("checked", options["repeat"]);
        repeatingCardSelect.find("select").val(options["repeating"]);

        if (options["repeat"]) {
            repeatingCardSelect.css("display", "flex");
        }
    }

    cardEditor.append("<h2>" + header + "</h2>");
    cardEditor.append("<hr>");
    cardEditor.append(cardEditorTitle);
    cardEditor.append(cardEditorGoal);
    cardEditor.append(repeatCheckbox);
    cardEditor.append(repeatingCardSelect);
    buttonsContainer.append(addCardButton);
    buttonsContainer.append(deleteCardButton);
    cardEditor.append("<hr>");
    cardEditor.append(buttonsContainer);

    return cardEditor;
}

function createCard(title, goal, repeat, repeating = "never", progress = 0) {
    const cardId = "card-" + Math.floor(Math.random() * 1_000_000_000_000_000);
    const card = $(`<div class="card" data-id="${cardId}"></div>`);
    card.data("repeat", repeat);
    card.data("repeating", repeating);
    const leftSection = $('<div class="left-section"></div>');
    const middleSection = $('<div class="middle-section"></div>');
    const rightSection = $('<div class="right-section"></div>');

    leftSection.append("<h3 class='goal-title'>" + title + "</h3>");
    leftSection.append('<button class="btn edit secondary">Edit</button>');

    const buttons = $('<div class="buttons"></div>');
    buttons.append('<button class="btn primary decrement" data-action="decrement">-</button>');
    buttons.append('<button class="btn primary increment" data-action="increment">+</button>');
    middleSection.append(buttons);

    const progressContainer = $('<div class="progress"></div>');
    progressContainer.append(`<span class="current-progress">${progress}</span>/<span class="total-progress">${goal}</span>`);
    rightSection.append(progressContainer);
    card.append(leftSection);
    card.append(middleSection);
    card.append(rightSection);
    return card;
}

function fadeOutRemove(element) {
    element.fadeOut(function () {
        $(this).remove();
    });
}

$(document).ready(function () {
    function openCardEditor(mode, options = {}) {
        // add a gray overlay to the whole screen
        $("body").append(overlay.clone());
        $("body > #overlay").append(createCardEditor(mode, options)).fadeIn();

        // add the card editor
        $("#card-editor").css("transform", "translate(-50%, -50%) scale(1)")
            .css("opacity", "1").css("top", "40%");

        // focus the title input
        $("#card-editor-title").trigger("focus");
    }

    function deleteCard(cardId) {
        const card = $(`[data-id="${cardId}"]`);
        fadeOutRemove(card);
    }

    // click event for #add-card-button
    $("#add-card-button").click(function () {
        openCardEditor("add");
    });

    // click event for overlay
    $(document).on("click", "#overlay", function (event) {
        if (event.target.id === "overlay") {
            fadeOutRemove($(this));
            $("#card-editor").css("transform", "translate(-50%, -50%) scale(0.2)")
                .css("opacity", "0").css("top", "0%");
        }
    });

    // click event for #cancel-card-button
    $(document).on("click", "#cancel-card-button", function () {
        fadeOutRemove($("#overlay"));

        $("#card-editor").css("transform", "translate(-50%, -50%) scale(0.2)")
            .css("opacity", "0").css("top", "0%");
    });

    // click event for #save-card-button
    $(document).on("click", "#save-card-button", function () {
        const mode = $(this).data("mode");
        const cardEditorRepeat = $("#card-editor-repeat");
        if (mode === "add") {
            // add a card to the #card-container
            $("#cards-container").append(createCard(
                $("#card-editor-title").find("input").val(),
                $("#card-editor-goal").find("input").val(),
                cardEditorRepeat.find("input").is(":checked"),
                cardEditorRepeat.find("input").is(":checked") ? $("#card-editor-repeating").find("option:selected").val() : "never"
            ));
        } else if (mode === "edit") {
            // find the card and update its data
            const id = $(this).data("id");
            const card = $(`[data-id="${id}"]`);
            card.find(".goal-title").text($("#card-editor-title").find("input").val());
            card.find(".total-progress").text($("#card-editor-goal").find("input").val());
            card.data("repeat", cardEditorRepeat.find("input").is(":checked"));
            card.data("repeating", cardEditorRepeat.find("input").is(":checked") ? $("#card-editor-repeating").find("option:selected").val() : "never");
        }
        fadeOutRemove($("#overlay"));
    });

    $(document).on("click", "#delete-card-button", function () {
        const id = $(this).data("id");
        fadeOutRemove($("#overlay"));
        deleteCard(id);
    });

    $(document).on("click", ".card .btn", function () {
        const action = $(this).data("action");
        const card = $(this).closest(".card");
        const currentProgressElement = card.find(".current-progress");
        const currentProgress = parseInt(currentProgressElement.text());
        const totalProgress = parseInt(card.find(".total-progress").text());
        if (action === "increment") {
            currentProgressElement.text(Math.min(currentProgress + 1, totalProgress));
        } else if (action === "decrement") {
            currentProgressElement.text(Math.max(currentProgress - 1, 0));
        }
    });

    $(document).on("click", ".card .edit", function () {
        const options = {};
        const card = $(this).closest(".card");
        options["id"] = card.data("id");
        options["title"] = card.find(".goal-title").text();
        options["goal"] = card.find(".total-progress").text();
        options["progress"] = card.find(".current-progress").text();
        options["repeat"] = card.data("repeat");
        options["repeating"] = card.data("repeating");
        openCardEditor("edit", options);
    });

    // scroll event for number inputs to increment their value, if no value, start from 1
    $(document).on("wheel", "input[type=number]", function (event) {
        console.log("number input scrolled");
        // if input is not focused, focus it
        if (!$(this).is(":focus")) {
            $(this).trigger("focus");
        }
        if ($(this).val() === "") {
            $(this).val(1);
        } else if (event.deltaY < 0) {
            $(this).val(parseInt($(this).val()) - 1);
        } else if (event.deltaY > 0) {
            $(this).val(parseInt($(this).val()) + 1);
        }
    });

    // change the visibility of the #card-editor-repeating when #card-editor-repeat is toggled
    $(document).on("change", "#card-editor-repeat", function () {
        if ($(this).find("input").is(":checked")) {
            $("#card-editor-repeating").css("display", "flex")
                // select the "daily" option
                .find("option[value=daily]").prop("selected", true);
        } else {
            $("#card-editor-repeating").css("display", "none");
        }
    });
});