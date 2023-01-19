# Readme

## start ```http-server``` from this folder

``` shell
http-server
```

## Open some web page (e.g. <https://www.dndbeyond.com/>)

## Run these one as a time from the page opened above

``` JavaScript
var popup = window.open('http://127.0.0.1:8080/');

window.addEventListener("message", (event) => {
    console.log(`${event.data}`);
}, false);

popup.postMessage("Hi.", "*");
```
