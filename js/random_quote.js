async function getRandomQuote() {
    try {
        const response = await fetch('https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en');
        const quote = await response.json();
        return quote.quoteText;
    } catch (error) {
        console.error('Error getting the quote: ', error)
        return 'Failed to get a quote, Try again later or report the issue.'
    }
}

document.getElementById('quote-btn').addEventListener('click', async () => {
    document.getElementById('quote-txt').textContent = await getRandomQuote();
});