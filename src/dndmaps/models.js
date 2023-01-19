class MapDetails {

    title;
    xlinkHref;
    id;
    svgWidth;
    svgHeight;
    imgWidth;
    imgHeight;
    xOffset;
    yOffset;
    squareWidth;
    key;
    tokenSetKey;
    geometryKey;
    combatantsKey;

    constructor() {
        this.key = getUuid();
        this.tokenSetKey = getUuid();
        this.geometryKey = getUuid();
        this.combatantsKey = getUuid();
    }
    
}