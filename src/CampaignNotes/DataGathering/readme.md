# Readme

## Start the local server from this folder

``` shell
http-server
```

## Run these one as a time from the source page

Util

``` JavaScript
getMonsterIcon = () => {
    const element = document.querySelector('.monster-icon');
    if(!element) return;
    const url = element.style.backgroundImage;
    return url.substring(5, url.length - 2);
};

getMonsterName = () => {
    const element = document.querySelector('.tooltip-header-text');
    if(!element) return;
    return element.innerText.trim();
};

getTokenDetails = () => {
    return {
        name: getMonsterName(),
        src: getMonsterIcon()
    };
};
```

``` JavaScript
var popup = window.open('http://127.0.0.1:8080/');
```

``` JavaScript
document.querySelector('.p-article-content').addEventListener('mouseover', event => {
    if([...event.target.classList].some(c => c === 'monster-tooltip')) {
        const details = getTokenDetails();
        if(!details.name || !details.src) return;
        console.log(details.name);
        popup.postMessage(JSON.stringify(details), "*");
    }
});
```
