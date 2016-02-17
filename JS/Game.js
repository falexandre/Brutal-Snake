BSConfig = {
    UpdateRate: 200,
    FPS: 60,
    TileArea: 20, /*px*/
    Images: {
        Skull: "skull.gif",
        MenuBackground: "back.png",
        GameLogo: "logo.png"
    },
    Styles: {
        GameBackground: "#F0251A",
        MenuItemBackground: '#ECE0CE',
        MenuItemBorder: '#000',
        MenuItemBorderWidth: 5,
        MenuItemFont: "50px silkscreen_expandednormal",
        SelectedMenuItemBackground: '#000',
        SelectedMenuItemBorder: '#000',
        SelectedMenuItemBorderWidth: 2
    },
    SolidWall: false /*define if wall is solid*/
};

//temp variable for save Game.updateRate value (used on snake eat event)
var soundEfx = null, logoImg = null, nodeImg = null, backImg = null;

//Game "class"
var Game = {
    context: null,
    currentScene : new InitialMenuScene(),
    drawArea: null,
	isPaused: false,
    updateRate: BSConfig.UpdateRate,
    initialize: function (width, height) {
        soundEfx = document.getElementById("soundEfx");

		var canvas = createCanvasObject(width, height);

        this.context = canvas.getContext("2d");
        this.drawArea = canvas;
    },
    newGame: function () {
        this.currentScene = new GameScene();
    },
    gameOver: function(){
        this.currentScene = new GameOverScene();
    }
};

/* -----------------------------------------------------------------------------------
    GAME EVENTS :)
------------------------------------------------------------------------------------*/

window.onload = configureBrutalSnake;

function configureBrutalSnake() {
    //load all game resources
    loadResources(function () {
        var screenGameWidth = parseInt(window.innerWidth / BSConfig.TileArea) * BSConfig.TileArea;
        var screenGameHeight = parseInt((window.innerHeight) / BSConfig.TileArea) * BSConfig.TileArea;
        
		Game.initialize(screenGameWidth, screenGameHeight);
		
    });

    //game main method
    work(1000 / BSConfig.FPS, null, Main);
}

//game main method
function Main() {
    Game.currentScene.Update();

    if (Game.context !== null) {
        Game.currentScene.Draw();
    }
}

/* -----------------------------------------------------------------------------------
    LOAD RESOURCES METHODS
--------------------------------------------------------------------------------------*/

//load all game resources
function loadResources(callback) {
    callback = callback || function () { };
    var font = new Font();

    font.onload = function () {
        loadImages(["Resources/Images/" + BSConfig.Images.Skull, "Resources/Images/" + BSConfig.Images.MenuBackground, "Resources/Images/" + BSConfig.Images.GameLogo], function () {
            callback();
        });
    };

    font.fontFamily = "silkscreen_expandednormal";
    font.src = font.fontFamily;
}

//load all images for the game
function loadImages(paths, whenLoaded) {
    var imgs = [];
    paths.forEach(function (path) {
        var img = new Image();
        img.onload = function () {
            imgs.push(img);
            setImage(img);
            if (imgs.length == paths.length) whenLoaded(imgs);
        };
        img.src = path;
    });
}

//set images objects
function setImage(img) {
    switch (img.src.substring(img.src.lastIndexOf('/') + 1)) {
        case BSConfig.Images.Skull:
            nodeImg = img;
            break;
        case BSConfig.Images.MenuBackground:
            backImg = img;
            break;
        case BSConfig.Images.GameLogo:
            logoImg = img;
            break;
    }
}

/* -----------------------------------------------------------------------------------
    UTILITY METHODS
------------------------------------------------------------------------------------*/

//create a job that run until endtime
function work(interval, endTime, job) {
    var i = setInterval(function () {
        job();
    }, interval);

    if (endTime !== null) {
        setTimeout(function () {
            clearInterval(i);
        }, endTime);
    }

    return i;
}

//return obj as value
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function createCanvasObject(width, height){
	var marginTopCanvas = (window.innerHeight - height) / 2;
	var marginLeftCanvas = (window.innerWidth - width) / 2;
		
	var canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.style.marginTop = marginTopCanvas;
	canvas.style.marginLeft = marginLeftCanvas;
	document.body.appendChild(canvas);
	
	return canvas;
}
