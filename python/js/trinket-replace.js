fetch("./trinket.html").then(result => result.text()).then(text => {
    let old_elem = document.querySelector("script#trinket-script");
    let new_elem = document.createElement("div");
    new_elem.classList.add('trinket')
    new_elem.innerHTML = text;
    old_elem.parentNode.replaceChild(new_elem, old_elem);
})