
// get rooms
getRoomList = () =>
    [... document.querySelectorAll('a.quick-menu-item-link')]
        .map(n => n.innerText.trim())
        .filter(s => [...s]
        .some(c => c === '.'));

getMonstersList = () =>
    [... document.querySelectorAll('.monster-tooltip')]
        .map(e => ({element: e, name: e.innerText.trim()}));

// get monster icon : float a monster link; then call; then click the link 
getMonsterIcon = () => {
    const element = document.querySelector('.monster-icon');
    const url = element.style.backgroundImage;
    return url.substring(5, url.length - 2);
}

getMonsterName = () => {
    const element = document.querySelector('.tooltip-header-text');
    return element.innerText.trim();
}

getCharacterIcon = () => {
    const element = document.querySelector('.ddbc-character-avatar__portrait');
    const url = element.style.backgroundImage;
    return url.substring(5, url.indexOf('?'));
}
