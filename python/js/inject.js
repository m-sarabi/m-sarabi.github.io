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

function pageTitle(title) {
    let name;
    if (title !== null) {
        name = title
    } else {
        name = pageUrl.substring(pageUrl.lastIndexOf('/') + 1, pageUrl.lastIndexOf('.'))
    }
    return name[0].toUpperCase() + name.substring(1).toLowerCase() + " - Python/MSarabi"
}

pageUrl = GetUrlRelativePath()

// get the content of the current document excluding this script
fetch(pageUrl).then(result => result.text()).then(content => {
    content = content.substring(0, content.lastIndexOf('\n'))
    let properties = null, title
    if (content.startsWith("{")) {
        properties = JSON.parse(content.substring(0, content.indexOf('}') + 1))
        title = pageTitle(properties["title"])
        content = content.substring(content.indexOf("}") + 2)
    }
    // URL of the template file
    let templateUrl = pageUrl.substring(0, pageUrl.lastIndexOf('/')) + "/template.html";

    // inject this content into the template file and write it again to this document
    fetch(templateUrl).then(result => result.text()).then(textTemp => {
        textTemp = textTemp.replace("{{ title }}", title)
        textTemp = textTemp.replace("{{ content }}", content)
        document.open()
        document.write(textTemp)
        document.close()

        const h2Elements = document.querySelectorAll("h2")
        if (h2Elements.length <= 1) {
            document.getElementById("trinket-container").remove()
            document.querySelector(".toc").remove()
        }

    })
})
