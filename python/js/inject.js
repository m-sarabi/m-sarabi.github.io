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
console.log(pageUrl)

fetch(pageUrl).then(result => result.text()).then(text => {
    text = text.substring(0, text.lastIndexOf('\n'))
    console.log(text)
})

let templateUrl = pageUrl.substring(0, pageUrl.lastIndexOf('/')) + "/template.html";
console.log(templateUrl)

fetch(templateUrl).then(result => result.text()).then(text => {
    document.open()
    document.write(text)
    document.close()
})
