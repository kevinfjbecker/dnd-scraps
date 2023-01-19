getMonsterIcon = () => {
    const element = document.querySelector('.monster-icon');
    const url = element.style.backgroundImage;
    return url.substring(5, url.length - 2);
}

getMonsterName = () => {
    const element = document.querySelector('.tooltip-header-text');
    return element.innerText;
}

getMonsterName().trim().replaceAll(' ', '').toLowerCase();

let harvestMonsterToken = () => {
    const data = {
        key: getMonsterName().trim().replaceAll(' ', '').toLowerCase(),
        value: getMonsterIcon()
    };
    console.log(data);
    if(data.value) {
        childwin.postMessage(data, '*')
    }
};
[...document.querySelectorAll('.monster-tooltip')].forEach(e => {
    e.onmouseover = () => { 
        setTimeout(harvestMonsterToken, 1000);
    };
});