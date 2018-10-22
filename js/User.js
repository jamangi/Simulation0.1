class User {
	constructor (char) {
		window.user = char;
		this.character = char;
		this.gb = document.getElementById("gamebox");
		this.map = char.map;
		this.selectedIDs = [];
		this.gb.addEventListener("click", this.makeClickListener());
	}

	makeClickListener() {
		let home = this;
		function processClick(event) {
			let top = home.gb.offsetTop;
			let left = home.gb.offsetLeft;
			let mapRow = Math.floor((event.clientY+home.gb.scrollTop - top) / home.character.map.cellSize); 
			let mapCol = Math.floor((event.clientX+home.gb.scrollLeft - left) / home.character.map.cellSize);
			home.character.go(mapRow, mapCol)
			let objs = home.map.getItems(mapRow, mapCol); 
			for (let obj of objs)
				if (obj.constructor.name == "Character"){
					home.selectedIDs = []
					home.selectedIDs.push(obj.ID);
				}

		}
		return processClick;
	}
}