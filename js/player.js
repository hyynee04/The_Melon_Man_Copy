game.player = {
		x: 54,
		y: 0,
		height: 24,
		highestY: 0,
		direction: "left",
		isInAir: false,
		startedJump: false,
		moveInterval: null,
		fallTimeout: function(startingY, time, maxHeight) {
			setTimeout( function () {
				if (this.isInAir) {
					this.y = startingY - maxHeight + Math.pow((-time / 3 + 11), 2)
					if (this.y < this.highestY) {
						this.highestY = this.y
					}
					if (time > 37) {
						this.startedJump = false
						game.checkCollisions()
					}
					if (time < 150) {
						time++
						this.fallTimeout(startingY, time, maxHeight)
					} else {
						game.isOver = true
					}
					if (this.y > 40) {
						game.isOver = true
					}
					game.requestRedraw()
				}
			}.bind(this, startingY, time, maxHeight), 12)
		},
		animationFrameNumber: 0,
		collidesWithGround: true,
		animations: {
			// Describe coordinates of consecutive animation frames of objects in textures
			left: [{tileColumn: 5, tileRow: 6}, {tileColumn: 5, tileRow: 5}, {tileColumn: 5, tileRow: 6}, {tileColumn: 5, tileRow: 7}],
			right: [{tileColumn: 3, tileRow: 6}, {tileColumn: 3, tileRow: 5}, {tileColumn: 3, tileRow: 6}, {tileColumn: 3, tileRow: 7}]
		},
		jump: function (type) {
			if (!this.isInAir) {
				clearInterval(this.fallInterval)
				game.sounds.jump.play()
				this.isInAir = true
				this.startedJump = true
				var startingY = this.y
				var time = 1
				maxHeight = 121
				if (type == "fall") {
					time = 30
					maxHeight = 0
				}
				this.fallTimeout(startingY, time, maxHeight)
			}
		}
	}
