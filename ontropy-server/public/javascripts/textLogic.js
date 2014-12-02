function getIOSCodeForObject(obj, canvasCenter){
     
    var colors = ["Black","Green","Blue","Red","Purple","Orange"];
    var scale = .5; //compensate screen size -> mobile device screen size
    var yOffset = 20; //Menubar

    var basicObj = (obj.type < 99) ? createGameObjectPrototype() : {}; 

    //ORDER MUST BE ANALOGUE TO initializers[] in editorLogic.js
    switch (obj.type) {
        case 0: //obstacle block
        {   return createObstacle(createSimpleGameObj(basicObj,"fixedObstacle"))}
        case 1: //gravity Field
        {   return createSimpleGameObj(basicObj,"gravityField")}
        case 2: //Black hole
        {   return createSimpleGameObj(basicObj,"blackhole")}
        case 3: //portal_painter
        {   return createCollectable(createSimpleGameObj(basicObj,"kCollectablePortalPainter"))} 
        case 4: //ballCanon
        {   return createSimpleGameObj(basicObj,"ballCannon")}
        case 5: //multiball
        {   return createCollectable(createSimpleGameObj(basicObj,"kCollectableMultipleBalls"))}
        case 6: //colBiggerBall
        {   return createCollectable(createSimpleGameObj(basicObj,"kCollectableBiggerBall"))}
        case 7: //colSmallerBall
        {   return createCollectable(createSimpleGameObj(basicObj,"kCollectableSmallerBall"))}
        case 8: //colPaddleBigger
        {   return createCollectable(createSimpleGameObj(basicObj,"kCollectableBiggerPaddle"))}
        case 9: //colPaddleSmaller
        {   return createCollectable(createSimpleGameObj(basicObj,"kCollectableSmallerPaddle"))}
        case 10: //colLive
        {   return createCollectable(createSimpleGameObj(basicObj,"kCollectableStar"))}
        case 11: //Portal
        {   return createPortal(createSimpleGameObj(basicObj, "portal"))}
        case 99: //colLive
        {   return getWinCondition()}
        default:
        { return "incorrect parameter"}
    }

    /*
     + creates a simple object with x and y offset
     */

    function createGameObjectPrototype(){
        var basicObj = {}
        basicObj.relX = getXOffset();               //offset value relative to center
        basicObj.relY = getYOffset();               //offset value relative to center
        return basicObj;
    }

    /*
     * Creates a playable game object by adding a type
     */
    function createSimpleGameObj(basicObj, typeName){
        basicObj.objType  = typeName;
        return basicObj;
    }

    function createObstacle(simpleGameObj) {
        simpleGameObj.isDestructible =  obj.isDestructable;
        //TODO: add life interface
        simpleGameObj.lifes = (obj.isDestructable)? 4 : 0;
        simpleGameObj.colorType = (obj.isDestructable)? getColor() : null;
        simpleGameObj.width = getWidth(obj);
        simpleGameObj.height = getHeight(obj);
        return simpleGameObj;
    }

    function createPortal(simpleGameObj) {
        // TODO html interface for in, out, axis
        simpleGameObj.outSide = "portalOutBoth";
        simpleGameObj.inSide = "portalInBoth";
        simpleGameObj.axis = "portalAxisStraight";
        simpleGameObj.colorType = getColor();
        return simpleGameObj;
    }

    function getWinCondition(){
        var output = {};
        if (parseInt(obj.winCondition) == 1){
            output.isDestroyObstaclesToWin = true;
            output.destroyObstacleWinType = "kDestroyObstacleWinTypeAll";
        }
        return output;
    }

    function getXOffset(){
        return Math.round(obj.pos.x  - canvasCenter.x) * scale;
    }

    function getYOffset() {
        return Math.round(obj.pos.y  - canvasCenter.y - yOffset) * scale;
    }

    //atm only used for fixed obstacles
    function getWidth() {
        return Math.round(obj.width * scale);
    }

    function getColor(){
        return colors[obj.colorIndex];
    }

    //atm only used for fixed obstacles
    function getHeight(height) {
        return Math.round(obj.height * scale);
    }

    function createCollectable(simpleGameObj) {
        //TODO ADD REACTIVATION TIME
        return simpleGameObj;
    }
}
