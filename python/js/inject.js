/**
 * Returns the relative URL path of the current document.
 *
 * @return {string} relative URL path
 */
function GetUrlRelativePath() {
    const url = document.location.toString();
    const arrUrl = url.split("//");

    const start = arrUrl[1].indexOf("/");
    let relUrl = arrUrl[1].substring(start);// "stop" is omitted, intercept all characters from start to end

    if (relUrl.indexOf("?") !== -1) {
        relUrl = relUrl.split("?")[0];
    }
    return relUrl;
}

pageUrl = GetUrlRelativePath()

// get the content of the current document excluding this script
fetch(pageUrl).then(result => result.text()).then(text => {
    text = text.substring(0, text.lastIndexOf('\n'))

    // URL of the template file
    let templateUrl = pageUrl.substring(0, pageUrl.lastIndexOf('/')) + "/template.html";
    console.log(templateUrl)

    // inject this content into the template file and write it again to this document
    fetch(templateUrl).then(result => result.text()).then(textTemp => {
        textTemp = textTemp.replace("{{ title }}", "Test Title")
        textTemp = textTemp.replace("{{ content }}", text)
        document.open()
        document.write(textTemp)
        document.close()

        const h2Elements = document.querySelectorAll("h2")
        if (h2Elements.length <= 1) {
            document.getElementById("tkinter-container").remove()
            document.querySelector(".toc").remove()
        }

    })
})
