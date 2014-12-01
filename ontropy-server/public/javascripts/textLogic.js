function getIOSCodeForObject(obj, canvasCenter){

    var scale = .5;
    var yOffset = 20; //Menubar
    //ORDER MUST BE ANALOGUE TO initializers[] in editorLogic.js
    switch (obj.type) {
        case 0: //obstacle block
        {   return createObstacleCode();}
        case 1: //gravity Field
        {   return "[m spawnGravityFieldAtPosition:" + getCenterPoint("gravityField") + "];"}
        case 2: //Black hole
        {   return "[m spawnBlackholeAtPosition:" + getCenterPoint("blackhole") + " withBonusLevel:false];";}
        case 3: //portal_painter
        {   return createCollectableString("kCollectablePortalPainter");}
        case 4: //ballCanon
        {   return "[m spawnBallCanon:" + getCenterPoint("ballCannon") + "];";}
        case 5: //multiball
        {   return createCollectableString("kCollectableMultipleBalls");}
        case 6: //colBiggerBall
        {   return createCollectableString("kCollectableBiggerBall");}
        case 7: //colSmallerBall
        {   return createCollectableString("kCollectableSmallerBall");}
        case 8: //colPaddleBigger
        {   return createCollectableString("kCollectableBiggerPaddle");}
        case 9: //colPaddleSmaller
        {   return createCollectableString("kCollectableSmallerPaddle");}
        case 10: //colLive
        {   return createCollectableString("kCollectableStar");}
        case 11: //Portal
        {
            // TODO html interface for in, out, axis
            var outSide = " out:" + "portalOutBoth ";
            var inSide  = "in:" + "portalInBoth ";
            var axis  = "axis: " + "portalAxisStraight ";

            return "[m spawnPortal:[m getCenterForSize:m.sizes.portalDefaultSize withPadX:"
                                                    + getXOffset()
                                                    + " padY:"+ getYOffset() + "] "
                                                    + getColor()
                                                    + outSide
                                                    + inSide
                                                    + axis + "];"
     	}
        case 99: //colLive
        {   return getWinCondition()}
        default:
        { return "incorrect parameter"}
    }


    function getCenterPoint(sizeString){
        return "[m getCenterForSize:m.sizes." + sizeString + "DefaultSize withPadX:" + getXOffset() + " padY:" + getYOffset() + "]";
    }

    function getWinCondition(){
        var output = (parseInt(obj.winCondition) == 1)
            ? "m.isDestroyObstaclesToWin = YES;\n" +
               "m.destroyObstacleWinType = kDestroyObstacleWinTypeAll;"
            : "";
        return output;
    }

    function getCenterX() {
         return parseInt(getX() - obj.width/2*scale);
    }

    function getCenterY(){
        return parseInt(getY() - obj.height/2*scale);
    }

    function createObstacleCode() {
            var destructible =  (obj.isDestructable)? "Destructible" : "Solid";
            var life = (obj.isDestructable)? getLifes(obj) : "";
	    var colorType = (obj.isDestructable)? getColor(obj) : "";

            var size = "CGSizeMake(" +getWidth(obj) + ", " + getHeight(obj) + ")"
            return "[m spawnObstacle" + destructible + ":[Model rectWithPoint:"
                                                                + "[m getCenterForSize: "
                                                                    + size
                                                                    + " withPadX:" + getXOffset()
                                                                    + " padY:" + getYOffset()
                                                                + "] andSize:" + size + "]"
                                                            + colorType
                                                            + life +"];"
    }

    function getColor() {
        if (obj.colorIndex > -1){
            var colors = ["Black","Green","Blue","Red","Purple","Orange"];
            return " withColorType:kColor" + colors[obj.colorIndex];
        }else{
            return ""
        }

    }
    function getLifes(obj){
        return " andLifes:4";
    }

    //TODO: use relativ positions
    function getX() {
        //compensate bigger screen
        return Math.round((obj.pos.x - obj.width/2) * scale);
    }

    function getY() {
        return Math.round((obj.pos.y - obj.height/2) * scale);
    }

    function getXOffset(){
        return Math.round(obj.pos.x  - canvasCenter.x) * scale;
    }

    function getYOffset() {
        return Math.round(obj.pos.y  - canvasCenter.y - yOffset) * scale;
    }

    function getWidth() {
        return Math.round(obj.width * scale);
    }

    function getHeight(height) {
        return Math.round(obj.height * scale);
    }

    function createCollectableString(type,reactivationTime) {
        var x =
        reactivationTime = (typeof reactivationTime === "undefined") ? 0 : reactivationTime;
        var str = "[m spawnCollectable:" +
                   getCenterPoint("collectable") +
                   " withType:"+ type +
                   " reactivationTime:"+ reactivationTime +"];"
        return str;
    }
}