var tempGameUpdateRate = 0;

/* ----------------------------------------------------------------------------------------------------------------------
    GAME SCENE
-----------------------------------------------------------------------------------------------------------------------*/

var gameScene = null;
function GameScene() {
    this.Name = "Game";
    this.Player = new Player(5, 10);
    this.RandomSnakePiece = new RandomSnakePiece();
    this.UpdateTime = Date.now();
    this.Draw = function () {
        Game.context.fillStyle = BSConfig.Styles.GameBackground;
        Game.context.fillRect(0, 0, Game.drawArea.width, Game.drawArea.height);

        this.Player.draw();
        this.RandomSnakePiece.draw();
    };
    this.Update = function () {
        onEveryFrame(function () {
            Game.currentScene.Player.update();
            if (Game.currentScene.Player.checkColision(Game.currentScene.RandomSnakePiece)) {
                Game.currentScene.Player.eat(new SnakePiece());
                Game.currentScene.RandomSnakePiece = new RandomSnakePiece();
            }
        });
    };
    this.Pause = function () {
        if (gameScene) {
            Game.currentScene = gameScene;
            gameScene = null;
			Game.isPaused = false;
            configureGameInput();
        } else {
            gameScene = Game.currentScene;
			Game.isPaused = true;
            Game.currentScene = new PauseMenuScene();
        }
    };

    configureGameInput();
}

//run for each frame rate
function onEveryFrame(callback) {
    var deltaTime = Date.now() - Game.currentScene.UpdateTime;

    if (deltaTime > Game.updateRate) {
        //reset game update rate (used on eat event for prevent graphics bug)
        if (tempGameUpdateRate !== 0) {
            Game.updateRate = clone(tempGameUpdateRate);
            tempGameUpdateRate = 0;
        }

        callback();

        Game.currentScene.UpdateTime = Date.now();
    }
}

function configureGameInput(){
    var spacePressed = false;
    Mousetrap.bind('space', function (e) {
        if (!spacePressed && !Game.isPaused) {
            Game.updateRate /= 2;
            spacePressed = true;
			console.log(spacePressed);
			console.log(Game.isPaused);
        }
        return false;
    }, 'keydown');

    Mousetrap.bind('space', function (e) {
		if (spacePressed && !Game.isPaused) {
			Game.updateRate *= 2;
			spacePressed = false;


		}
        return false;
    }, 'keyup');

    Mousetrap.bind('left', function (e) {
        if (Game.currentScene.Player.direction != "right") {
            Game.currentScene.Player.direction = "left";
        }
        return false;
    });

    Mousetrap.bind('right', function (e) {
        if (Game.currentScene.Player.direction != "left") {
            Game.currentScene.Player.direction = "right";
        }
        return false;
    });

    Mousetrap.bind('down', function (e) {
        if (Game.currentScene.Player.direction != "up") {
            Game.currentScene.Player.direction = "down";
        }
        return false;
    });

    Mousetrap.bind('up', function (e) {
        if (Game.currentScene.Player.direction != "down") {
            Game.currentScene.Player.direction = "up";
        }
        return false;
    });

    Mousetrap.bind('enter', function (e) {
		if(!spacePressed){
			Game.currentScene.Pause();
		}

        return false;
    });
}

/* ----------------------------------------------------------------------------------------------------------------------
    ALL MENU SCENE's
-----------------------------------------------------------------------------------------------------------------------*/

function InitialMenuScene() {
    this.Name = "Initial Menu";
    this.SelectedIndex = 1;
    this.Draw = function () {
        drawMenuBackground();

        var freeArea = Game.drawArea.height - (logoImg.height + 36 /*group of menu optins height*/);

        var y = freeArea * 0.3;
        Game.context.drawImage(logoImg, (Game.drawArea.width - logoImg.width) / 2, y);

        y = logoImg.height + (freeArea * 0.6);
        this.SelectedIndex == 1 ? drawMenuItem("New Game", y) : drawMenuItem("New Game", y, '#000', '#000', 5);
        this.SelectedIndex == 2 ? drawMenuItem("Exit", y + 70) : drawMenuItem("Exit", y + 70, '#000', '#000', 5);
    };
    this.Update = function () {
    };

    configureInitialAndPauseMenuInput(function () {
        Game.newGame();
    }, function () {
        close();
    });
}

//configure input for menu scene
function configureInitialAndPauseMenuInput(option1callback, option2callback) {
    Mousetrap.reset();

    Mousetrap.bind('up', function (e) {
        if (Game.currentScene.SelectedIndex != 1) {
            soundEfx.play();
        }

        Game.currentScene.SelectedIndex = 1;
        return false;
    });

    Mousetrap.bind('down', function (e) {
        if (Game.currentScene.SelectedIndex != 2) {
            soundEfx.play();
        }

        Game.currentScene.SelectedIndex = 2;
        return false;
    });

    Mousetrap.bind('enter', function (e) {
        if (Game.currentScene.SelectedIndex == 1) {
            option1callback();
        } else if (Game.currentScene.SelectedIndex == 2) {
            option2callback();
        }
        return false;
    });
}

function PauseMenuScene() {
    this.Name = "Pause Menu";
    this.SelectedIndex = 1;
    this.Draw = function () {
        drawMenuBackground();

        var y = (Game.drawArea.height / 2);

        this.SelectedIndex == 1 ? drawMenuItem("Resume", y) : drawMenuItem("Resume", y, true);
        this.SelectedIndex == 2 ? drawMenuItem("Exit to main menu", y + 70) : drawMenuItem("Exit to main menu", y + 70, true);
    };
    this.Update = function () {
    };

    configureInitialAndPauseMenuInput(function () {
        gameScene.Pause();
    }, function () {
        gameScene = null;
        Game.currentScene = new InitialMenuScene();
    });
}

//Draw background texture
function drawMenuBackground() {
    var texture = Game.context.createPattern(backImg, 'repeat');
    Game.context.fillStyle = texture;
    Game.context.fillRect(0, 0, Game.drawArea.width, Game.drawArea.height);
}

//Draw stroke menu on center of the screen
function drawMenuItem(text, y, selected) {
    //apply parameter style or default style
    Game.context.font = BSConfig.Styles.MenuItemFont;
    Game.context.strokeStyle =  selected ? BSConfig.Styles.SelectedMenuItemBorder : BSConfig.Styles.MenuItemBorder;
    Game.context.lineWidth =    selected ? BSConfig.Styles.SelectedMenuItemBorderWidth : BSConfig.Styles.MenuItemBorderWidth;
    Game.context.fillStyle =    selected ? BSConfig.Styles.SelectedMenuItemBackground : BSConfig.Styles.MenuItemBackground;

    var x = (Game.drawArea.width - Game.context.measureText(text).width) / 2;

    Game.context.strokeText(text, x, y);
    Game.context.fillText(text, x, y);
}

/* ----------------------------------------------------------------------------------------------------------------------
    GAMEOVER SCENE
-----------------------------------------------------------------------------------------------------------------------*/

function GameOverScene() {
    this.Name = "Game Over";
    this.Draw = function () {
        Game.context.fillStyle = '#000DDD';
        Game.context.fillRect(0, 0, Game.drawArea.width, Game.drawArea.height);

        drawMenuItem("Game Over", Game.drawArea.height / 2);
    };
    this.Update = function () {
    };

    soundEfx.src = '~/Resources/BrutalSnake/Audio/game-over.wav';
    soundEfx.play();
    /*configureInitialAndPauseMenuInput(function () {
        gameScene.Pause();
    }, function () {
        gameScene = null;
        Game.currentScene = new InitialMenuScene();
    });*/
}
