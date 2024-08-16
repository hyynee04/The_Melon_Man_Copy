// The spaghetti code masterpiece
var game = {
	canvas: document.getElementById('canvas'),
	context: this.canvas.getContext('2d', { alpha: false }),
	bestScore: document.getElementById('best-score'),
	score: document.getElementById('score'),
	textures: new Image(),
	character: new Image(),
	drawPending: false,
	backgrounds: {
		'sky': {
			image: new Image(),
			loaded: false
		},
		'trees': {
			image: new Image(),
			loaded: false
		}
	},
	sounds: {
		jump: new Audio('sounds/jump.wav')
	},
	options: {
		characterPath: "Character.png",
		texturesPath: "textures.png",
		tileWidth: 24,
		tileHeight: 24,
		canvasWidth: window.innerWidth / 3,
		canvasHeight: window.innerHeight / 3
	},
	pressedKeys: {},
	init: function (onInit) {
		this.canvas.width = this.options.canvasWidth
		this.canvas.height = this.options.canvasHeight
		this.context.imageSmoothingEnabled = false

		this.backgrounds['sky'].image.src = "background.png"
		this.backgrounds['trees'].image.src = "trees.png"

		for (var key in this.backgrounds) {
			this.backgrounds[key].image.onload = function (currentKey) {
				this.backgrounds[currentKey].loaded = true
			}.bind(this, key)
		}

		this.character.src = this.options.characterPath
		this.textures.src = this.options.texturesPath
		this.textures.onload = onInit
	},
	map: {
		structures: []
	},
	isOver: false
}
