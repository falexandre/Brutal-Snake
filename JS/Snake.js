//create a new snake piece
function SnakePiece() {
    this.X = -1;
    this.Y = -1;
    this.direction = "down";
}

//create a new snake piece using a random position on screen
function RandomSnakePiece() {
    this.X = Math.floor((Math.random() * (Game.drawArea.width / BSConfig.TileArea)) + 1);
    this.Y = Math.floor((Math.random() * (Game.drawArea.height / BSConfig.TileArea)) + 1);
    this.draw = function () {
        Game.context.drawImage(nodeImg, (this.X - 1) * BSConfig.TileArea, (this.Y - 1) * BSConfig.TileArea, BSConfig.TileArea, BSConfig.TileArea);
    };
}

//update position for each snake piece
function updateSnakePieces(snake) {
    if (snake.pieces.length > 0) {
        for (var i = snake.pieces.length - 1; i >= 0; i--) {
            if (i !== 0) {
                snake.pieces[i] = clone(snake.pieces[i - 1]);
            } else {
                snake.pieces[i].X = snake.X;
                snake.pieces[i].Y = snake.Y;
                snake.pieces[i].direction = snake.direction;
            }
        }
    }
}
