OntropyEdit = function(io){

    ////////////////////
    //CONSTANTS//
    ///////////////////
    var ed = {};
    ed.x = {
        min : 1136,
        max : 1436,
    };
    ed.x.mid = ed.x.min + Math.round((ed.x.max - ed.x.min)*.5);
    ed.y = {
        min : 0,
        max : 512,
    };
    ed.y.mid = ed.y.min + Math.round((ed.y.max - ed.y.min)*.5);
    ed.width = ed.x.max - ed.x.min;
    ed.height = ed.y.max -ed.y.min;
    var gridXcount = 3;
    var gridYcount = 5;
    var grid = new iio.Grid(ed.x.min,ed.y.min,gridXcount,gridYcount,ed.width/gridXcount,ed.height/gridYcount);
    var lastSelectedObjs = [];


    //needed for code output
    var canvasCenter = { "x": (io.canvas.width - (ed.x.max - ed.x.min))/2,
                         "y": (io.canvas.height/2)};


    ////////////////////
    //ACTUAL SCRIPTING//
    ////////////////////
    var cellXIndex = 0;
    var cellYIndex = 0;
    var oldPos = -1;
    var newPos = -1;
    var draggables = [];            //array to hold movable objects
    var printedObs = [];            //objects printed in the textarea
    var dV;                         //remember where the mouse is relative to circle center
    var selectedObjs = [];           //id of the currently selected object
    var ctrlIsPressed = false;
    var objsBeingDragged = [];
    var winCondition = { type : 99}; //wincondition object used for printing

    var imagePath = 'images/objects/';

    io.setBGImage(imagePath + 'bg.png');
    io.canvas.addEventListener('mouseup', mouseUp);

    io.setFramerate(40);            //redraw canvas when objects have moved

    //io.addObj(grid);              //draw a toolbox grid

    var blockType = 0; //NEEDED FOR DESTRUCTABLE CREATION!
    var portalType = 11; //NEEDED FOR Color selection!

    var initializers =  [
        function () { return addImageRect(imagePath + 'block.png',80,80)},
        function () { return addImageRect(imagePath + 'sun.png',128,128)},
        function () { return addImageRect(imagePath + 'blackhole.png',128,128)},
        function () { return addImageRect(imagePath + 'portal_painter.png',20,20)},
        function () { return addImageRect(imagePath + 'ballCanon.png',32, 32)},
        function () { return addImageRect(imagePath + 'ball_multi.png',20,20)},
        function () { return addImageRect(imagePath + 'colBiggerBall.png',20,20)},
        function () { return addImageRect(imagePath + 'colSmallerBall.png',20,20)},
        function () { return addImageRect(imagePath + 'colPaddleBigger.png',20,20)},
        function () { return addImageRect(imagePath + 'colPaddleSmaller.png',20,20)},
        function () { return addImageRect(imagePath + 'icon_star.png',18,18)},
        function () { return addImageRect(imagePath + 'portal.png',16,16)},
    ];

    initDraggables();

    function initDraggables() {
        //initialize draggables
        draggables = [];
        for (i = 0 ; i < initializers.length; i++) {
            draggables[i] = initializers[i]();
            draggables[i].type = i;
        }
    }


    /*
     *  Event Listeners
     */

    this.focusOff = mouseUp;   //release circle when mouse moves off canvas
    io.canvas.addEventListener('mousedown', mouseDown);
    io.canvas.addEventListener('mousemove', mouseMove);
    document.getElementById("copy").addEventListener("click", copyObj);
    document.getElementById("save").addEventListener("click", saveLvl);

    //handles width slider
    document.getElementById("wForm").oninput =  function(event){
        handleSliderInput(event, "widthRange", "widthAmount");
    };
    //handles heigth slider
    document.getElementById("hForm").oninput =  function(event){
        handleSliderInput(event, "heightRange", "heightAmount");
    };

    //handles destruction checkbox
    document.getElementById("blockDetails").onclick =  function(event){
        setElementDetails();
    };

    document.getElementById("winCondition").onclick =  function(event){
        setWinCondition();
    };

    //handles x-box
    $('#xValue').on('input', function () {
        changeX(this);
    });
        //handles x-box
    $('#yValue').on('input', function () {
        changeY(this);
    });

    $("body").keydown(function( event ) {
        //"Strg/ctrl is being pressed
	//91 = mac command button to prevent right click
        if (event.which == 17 || event.which == 91) {
            ctrlIsPressed = true;
        }

    });
    $("body").keyup(function( event ) {
        //"Strg/ctrl is being released
        if (event.which == 17 || event.which == 91) {
            ctrlIsPressed = false;
        }
    });


    /*
     * Helper Functions
     */
    function saveLvl(event){
        var lvl = {};
        //todo, insert user chosen name
        lvl.name = "lvl" +(new Date).getTime();
        var content = [];
        lvl.wincondition = printedObs.winCondition;

        for (var i = 0; i<printedObs.length;i++){
            var obj =  printedObs[i];
            content.push(getIOSCodeForObject(obj, canvasCenter));
        }
        lvl.content = content;
        //lvl.content = JSON.stringify(content);
        console.log(lvl);
        $.post( "/api/create", lvl);
    }

    function copyObj(event){
        if (selectedObjs.length > 0) {
            var objsToBeCopied = selectedObjs;
            selectedObjs = [];
            for (var i = 0; i < objsToBeCopied.length; i++) {
                var toBeCopied = draggables[objsToBeCopied[i]];
                var newObj = initializers[toBeCopied.type]();
                newObj.type = toBeCopied.type;

                newObj.height = toBeCopied.height;
                newObj.width = toBeCopied.width;

                newObj.pos.x = toBeCopied.pos.x + parseInt(newObj.width) + 10;
                newObj.pos.y = toBeCopied.pos.y;
                newObj.isDestructable = toBeCopied.isDestructable;

                draggables.push(newObj);
                selectedObjs.push(draggables.length-1);
                //add objects to textarea
                printedObs.push(draggables[draggables.length-1]);
            }
        }
    }

    function setElementDetails(){
        if (selectedObjs.length > 0) {
            for (var i = 0; i < selectedObjs.length; i++) {
                var obj = draggables[selectedObjs[i]];
                if (obj.type == blockType) {
                    //check destructable object textbox
                    var destVal = document.getElementById("isDestructable");
                    draggables[selectedObjs[i]].isDestructable = destVal.checked;
                }
                if (obj.type == blockType || obj.type == portalType) {
                    //check colourselection
                    var selectedColor = document.getElementById("color").value;
                    draggables[selectedObjs[i]].colorIndex = selectedColor;
                }
            }
        }
    }

    function setWinCondition(){
        removeObjFromArray(winCondition,printedObs);
        winCondition.winCondition = document.getElementById("winCondition").value;
        if (winCondition.winCondition != 0) {
            printedObs.push(winCondition);
        }
    }

    //handles the slider values
     //handleSliderInput(event, "widthRange", "widthAmount");

    function handleSliderInput(event, elemA, elemB) {
        var id = event.target.id;
        var firstElement = document.getElementById(elemA);
        var secondElement = document.getElementById(elemB);
        if (id == elemA) {
            secondElement.value = firstElement.value;
        }else{
            firstElement.value = secondElement.value;
        }
        resizeObject();
    }

    //TODO MERGE/Refactor with changeY
    function changeX(event){ changeXY(true); }
    function changeY(event){ changeXY(false);}
    function changeXY(changeX) {
        if (selectedObjs.length > 0) {
            for (var i = 0; i < selectedObjs.length; i++) {
                //set new position
                var obj = draggables[selectedObjs[i]];
                if (changeX) {
                    obj.setPos(parseInt(document.getElementById("xValue").value),obj.pos.y)
                }else{
                    obj.setPos(obj.pos.x,parseInt(document.getElementById("yValue").value))
                }

            }
        }
    }

    function resizeObject(event) {
        var width = document.getElementById("widthRange");
        var height = document.getElementById("heightRange");
        if (selectedObjs.length > 0) {
            for (var i = 0; i < selectedObjs.length; i++) {
                draggables[selectedObjs[i]].setSize(width.value,height.value);
            }
        }
    }

    function getNextCell() {
        var c = grid.getCellCenter(cellXIndex,cellYIndex);
        if (cellXIndex == gridXcount -1) {
            cellXIndex = 0;
            cellYIndex++;
        }else{
            cellXIndex++;
        }
        return c;
    }

    function addImageRect(url,heigth,width){

        var c = getNextCell();
        var added = new iio.Rect(c.x, c.y, heigth, width)
                .addImage(url,
                function(){io.addObj(added)})
                .setStrokeStyle('#a3da58',2)
                //.setShadow('rgb(150,150,150)',7,7,9);
        added.isDestructable = false;
        added.colorIndex = document.getElementById("color").value;
        return added;
    }

    //handle mouse down
    function mouseDown(event){
        //prevent text selection
        event.preventDefault();
        //check for objectsBeingDragged objects
        var objectSelected = false;
        for (var i=draggables.length-1;i>=0;i--){
            draggables[i].dV=iio.Vec.sub(draggables[i].pos,io.getEventPosition(event));
            if (draggables[i].contains(io.getEventPosition(event))){

                //collect selected objects
                if (ctrlIsPressed) {
                      //mouseUp obj if clicked twice
                      if (selectedObjs.indexOf(i) != -1) {
                          removeObjFromArray(i,selectedObjs);
                      }else{
                          selectedObjs.push(i);
                      }
                }else {
                    selectedObjs = [i];
                }
                objectSelected = true;

                //set textbox
                var width = document.getElementById("widthAmount");
                var height = document.getElementById("heightAmount");
                //update w/h box
                width.value = draggables[i].width;
                height.value = draggables[i].height;
                //update destructable checkbox
                document.getElementById("isDestructable").checked = draggables[i].isDestructable;
                //update color selection
                document.getElementById("color").selectedIndex = draggables[i].colorIndex;
                //update range slider
                document.getElementById("widthRange").value = draggables[i].width;
                document.getElementById("heightRange").value = draggables[i].height;
                //update x-/y-Box
                document.getElementById("xValue").value = draggables[i].pos.x;
                document.getElementById("yValue").value = draggables[i].pos.y;
            }
        }
        //clear selectedObjs if none are clicked
        if (objectSelected > -1) {
            objsBeingDragged = selectedObjs;
        }else {
            selectedObjs = [];
            objsBeingDragged = [];
        }

        for (var i=draggables.length-1;i>=0;i--){
            // make outline bigger
            if (selectedObjs.indexOf(i) != -1){
                draggables[i].setStrokeStyle('#a3da58',5)
            }else {
                //make outline small again
                draggables[i].setStrokeStyle('#a3da58',2)
            }
        }
        return;

    }

    //handle mouse up
    function mouseUp(event){
        //create new object, if object is moved from toolbox to canvas
        if (selectedObjs.length == 1 && oldPos.x > ed.x.min && newPos.x < ed.x.min) {

            //create new object for toolbox
            var objectType = draggables[selectedObjs[0]].type;
            draggables.push(initializers[objectType]());

            //update objecttype
            draggables[draggables.length-1].type = objectType;

            //position new object
            var cellCenterPos = grid.getCellCenter(objectType%gridXcount,Math.floor(objectType/gridXcount));
            draggables[draggables.length-1].setPos(cellCenterPos);

            //add objects to textarea
            printedObs.push(draggables[selectedObjs[0]]);

        } // remove object if moved into toolbox
        else if (oldPos.x < ed.x.min && newPos.x > ed.x.min) {
            for (var i=selectedObjs.length-1;i>=0;i--){
                var obj = draggables[selectedObjs[i]];
                removeObjFromArray(obj,printedObs);
                io.rmvObj(obj);
            }
            selectedObjs = [];
        }

        objsBeingDragged = [];
        oldPos = -1;
        newPos = -1;
    }

    function removeObjFromArray(obj,array) {
        var index = array.indexOf(obj);
        if (index > -1) {
        array.splice(index, 1);
        }
    }

    function mouseMove(event){
        //move object
        if (objsBeingDragged.length > 0){
            for (var i = 0; i < objsBeingDragged.length; i++) {
                var obj = draggables[objsBeingDragged[i]];
                oldPos = (oldPos == -1) ? obj.pos: oldPos;
                newPos = io.getEventPosition(event);
                obj.setPos(io.getEventPosition(event).add(obj.dV))
                //update x-/y-Box
                document.getElementById("xValue").value = obj.pos.x;
                document.getElementById("yValue").value = obj.pos.y;
            }
        }
    }

}; iio.start(OntropyEdit, 'lvlCanvas')