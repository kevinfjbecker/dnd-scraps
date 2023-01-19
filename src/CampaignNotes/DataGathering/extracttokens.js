const tokenExport = {
    ready: [],
    incomplete: []
};

const getMonsterIcon = () => {
    const element = document.querySelector('.monster-icon');
    const url = element.style.backgroundImage;
    return url.substring(5, url.length - 2);
};

const getMonsterName = () => {
    const element = document.querySelector('.tooltip-header-text');
    return element.innerText.trim();
};

let getToken = () => {
    const vName = getMonsterName()
        .replaceAll(/[^a-z0-9]/gi, '')
        .toLowerCase();

    return {
        name: vName,
        src: getMonsterIcon()
    };
};

let saveToken = (token) => {
    if(!token) {
        console.log('No token!');
        return;
    }
    if(!(token.name && token.src)) {
        if(tokenExport.incomplete.some(t => t.name === token.name)) {
            console.log(`Incomplete token, ${token.name || '???'}, already in list`);
        } else {
            tokenExport.incomplete.push(token);
            console.log(`Incomplete token, ${token.name || '???'}, added to list.`);
        }
    } else {
        if(tokenExport.ready.some(t => t.name === token.name)) {
            console.log(`Token, ${token.name || '???'}, already in list`)
        } else {
            tokenExport.ready.push(token);
            console.log(`Token, ${token.name || '???'}, added to list.`)
        }
    }
};

const grabToken = (event) => {
    if(!event.target.matches('.monster-tooltip')) return;
    setTimeout(() => { saveToken(getToken()); }, 1000);
}

document.addEventListener('mouseover', grabToken);