// DOM elements
const button = document.getElementById("quote-btn");
const quote = document.getElementById("quote-txt");
const cite = document.getElementById('author')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function updateQuote() {
    quote.classList.toggle('quote-txt-active')
    cite.classList.toggle('author-active')

    await sleep(1000);

    // Fetch a random quote from the Quotable API
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    if (response.ok) {
        // Update DOM elements
        quote.textContent = data.content;
        cite.textContent = '- ' + data.author + ' -';
    } else {
        quote.textContent = "An error occured";
        console.log(data);
    }

    quote.classList.toggle('quote-txt-active')
    cite.classList.toggle('author-active')
}

// Attach an event listener to the `button`
button.addEventListener("click", updateQuote);

window.onload = function () {
    updateQuote();
};
