// Functions responsible for drawing on canvas

let currentScore
let bestScore
document.cookie = 0

const getBestScore = (cookieString) => {
	const cookies = cookieString.split(';');
	for (const cookie of cookies) {
		const [name, value] = cookie.trim().split('=');
		if (name == 'bestscore') {
			return value;
		}
	}
	return null; // Return null if the cookie is not found
}


game.drawTile = function (tileColumn, tileRow, x, y) {
	game.context.drawImage(
		game.textures,
		tileColumn * game.options.tileWidth,
		tileRow * game.options.tileHeight,
		game.options.tileWidth,
		game.options.tileHeight,
		x * game.options.tileWidth - Math.round(game.player.x) + Math.round(game.options.canvasWidth / 2 + game.options.tileWidth / 2),
		y * game.options.tileHeight - Math.round(game.player.y) + Math.round(game.options.canvasHeight / 2 + game.options.tileHeight / 2),
		game.options.tileWidth,
		game.options.tileHeight
	)
}

game.drawStructure = function (name, x, y) {
	var structure = game.structures[name]
	for (var i = 0; i < structure.length; i++) {
		game.drawTile(structure[i].tileColumn, structure[i].tileRow, structure[i].x + x, structure[i].y + y)
	}
}

game.drawPlayer = function () {
	actualPlayerTile = game.player.animations[game.player.direction][game.player.animationFrameNumber % 4]
	game.context.drawImage(
		game.character,
		actualPlayerTile.tileColumn * 16,
		actualPlayerTile.tileRow * 24,
		16,
		24,
		Math.round(game.options.canvasWidth / 2 - game.options.tileWidth / 2),
		Math.round(game.options.canvasHeight / 2 - game.options.tileHeight / 2 - 5),
		game.options.tileWidth,
		30
	)
}

game.redraw = function (type) {
	
	game.drawPending = false


	// Draw the background
	if (game.backgrounds['sky'].loaded) {
		var pattern = game.context.createPattern(game.backgrounds['sky'].image, 'repeat') // Create a pattern with this image, and set it to "repeat".
		game.context.fillStyle = pattern
	} else {
		game.context.fillStyle = "#78c5ff"
	}

	game.context.fillRect(0, 0, game.canvas.width, game.canvas.height)

	if (game.backgrounds['trees'].loaded) {
		game.context.drawImage(game.backgrounds['trees'].image, 0, game.canvas.height / 2 - game.player.y / 10, 332, 180)
		game.context.drawImage(game.backgrounds['trees'].image, 332, game.canvas.height / 2 - game.player.y / 10, 332, 180)
	}

	// List nearest structures
	var structuresToDraw = []
	var drawing_distance = 15
	for (var i = 0; i < game.map.structures.length; i++) {
		if (
			game.map.structures[i].x > (game.player.x / game.options.tileWidth) - drawing_distance
			&& game.map.structures[i].x < (game.player.x / game.options.tileWidth) + drawing_distance
			&& game.map.structures[i].y > (game.player.y / game.options.tileHeight) - drawing_distance
			&& game.map.structures[i].y < (game.player.y / game.options.tileHeight) + drawing_distance
		) {
			structuresToDraw.push(game.map.structures[i])
		}
	}

	// Draw them
	for (var i = 0; i < structuresToDraw.length; i++) {
		game.drawStructure(structuresToDraw[i].name, structuresToDraw[i].x, structuresToDraw[i].y)
	}

	// Draw the player
	game.drawPlayer()

	currentScore = Math.round(-game.player.highestY / (3 * game.options.tileHeight)), game.canvas.width - 50, game.canvas.height - 12
	game.score.innerHTML = "Score: " + currentScore
}

game.requestRedraw = function () {
	bestScore = getBestScore(document.cookie)
	if(bestScore != null)
		game.bestScore.innerHTML = 'Best Score: ' + bestScore
	else
		game.bestScore.innerHTML = 'Best Score: 0'
	if (!game.drawPending && !game.isOver) {
		game.drawPending = true
		requestAnimationFrame(game.redraw)
	}
	if (game.isOver) {
		clearInterval(this.player.fallInterval)
		game.context.font = "30px superscript"
		game.context.textAlign = "center"
		game.context.fillStyle = "black"
		game.context.fillText("Game over!", game.canvas.width / 2, game.canvas.height / 2)
		game.context.font = "15px Georgia"
		game.context.fillText("(Refresh the page to restart)", game.canvas.width / 2, game.canvas.height / 2 + 50)		
		
		if(currentScore > bestScore) {
			document.cookie = 'bestscore=' + currentScore + '; expires=Thu, 01 Jan 2025 00:00:00 UTC'
			game.bestScore.innerHTML = 'Best Score: ' + currentScore
		}
	}
}
