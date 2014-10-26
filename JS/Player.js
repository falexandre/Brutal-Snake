//Player "class"
function Player(x, y) {
    this.X = x;
    this.Y = y;
    this.pieces = [];
    this.direction = "down";
    this.draw = function () {
        drawNodeImage(this.X, this.Y);

        for (var i = 0; i < this.pieces.length; i++) {
            drawNodeImage(this.pieces[i].X, this.pieces[i].Y);
        }
    };
    this.update = function () {
        updateSnakePieces(this);
        playerMove(this);
        
        //check collision with yourself
        for (var i = 0; i < this.pieces.length; i++) {
            if (this.checkColision(this.pieces[i])) {
                Game.gameOver();
                break;
            }
        }
    };
    this.eat = function (snakePiece) {
        //prevent graphics bug
        tempGameUpdateRate = clone(Game.updateRate);
        Game.updateRate = 1;

        this.pieces.push(snakePiece);
    };
    this.checkColision = function (obj) {
        return this.X == obj.X && this.Y == obj.Y;
    };
}

/* -----------------------------------------------------------------------------------
    PLAYER METHODS
--------------------------------------------------------------------------------------*/

//move the player on the scene
function playerMove(player) {
    switch (player.direction) {
        case "right": {
            player.X += 1;

            if (player.X > Game.drawArea.width / BSConfig.TileArea) {
                if (BSConfig.SolidWall)
                    Game.gameOver();
                else
                    player.X = 1;
            }
        } break;
        case "left": {
            player.X -= 1;

            if (player.X < 1) {
                if (BSConfig.SolidWall)
                    Game.gameOver();
                else
                    player.X = Game.drawArea.width / BSConfig.TileArea;
            }
        } break;
        case "up": {
            player.Y -= 1;

            if (player.Y < 1) {
                if (BSConfig.SolidWall)
                    Game.gameOver();
                else
                    player.Y = Game.drawArea.height / BSConfig.TileArea;
            }
        } break;
        case "down": {
            player.Y += 1;

            if (player.Y > Game.drawArea.height / BSConfig.TileArea) {
                if (BSConfig.SolidWall)
                    Game.gameOver();
                else
                    player.Y = 1;
            }
        } break;
    }
}

//draw a snake node
function drawNodeImage(X, Y) {
    var x = (X - 1) * BSConfig.TileArea;
    var y = (Y - 1) * BSConfig.TileArea;
    Game.context.drawImage(nodeImg, x, y, BSConfig.TileArea, BSConfig.TileArea);
}
