class Character {
	constructor(character, imgCellWidth, imgCellHeight,
	            row, col, basePose, facing, baseSpeed, mode, map, search) {

		if (window.characterCount !== undefined)
			window.characterCount++;
		else
			window.characterCount = 1;
		this.ID = character+"-"+characterCount; 

		this.charDiv = undefined; 
		this.charImg = undefined;
		this.imgId = this.ID + "Img";
		this.map = map;     

		this.location = 'training';
		this.character = character
		this.row = row; 
		this.col = col;

		this.selectedRow = row; 
		this.selectedCol = col;
		this.facing = facing; 
		this.mode = mode;
		this.basePose = basePose;
		this.pose = basePose + facing;
		this.lastPose = this.pose;
		this.baseSpeed = baseSpeed; 
		this.speed = baseSpeed;
		this.left = col * map.cellSize; 
		this.top = row * map.cellSize;  
		this.imgFolder = "images/characters/";

		this.imgCellWidth = imgCellWidth; 
		this.imgCellHeight = imgCellHeight;
		this.pathSearch = search;
		this.done = true;

		this.display = undefined;

		//set in map
		this.map.enter(this);
		//create character object
		let gb = document.getElementById("gamebox"); 
		let charDiv = document.createElement("div"); this.charDiv = charDiv;
		let img = document.createElement("img"); this.charImg = img;
		charDiv.character = this;
		charDiv.append(img); gb.append(charDiv)
		charDiv.setAttribute("id", this.ID); charDiv.setAttribute("class", "character");
		setValues(charDiv, this.left, this.top, 
				  this.imgCellWidth * this.map.cellSize, 
				  this.imgCellHeight * this.map.cellSize);
		charDiv.style["z-index"] = this.row;
		charDiv.style.transition = "left "+this.speed+"ms linear, top "+this.speed+"ms linear";
		img.setAttribute("src", this.imgFolder+this.character+"/"+this.character+this.pose+".gif"); 
		img.setAttribute("id", this.imgId);

	}

	changeID(id){
		this.ID = id;
		this.charDiv.setAttribute("id", this.ID);
		this.imgId = id+"Img";
		this.charImg.setAttribute("id", this.imgId);
	}

	toGhost() {
		this.character = "ghost";
	}

	go(row, col){
		this.selectedRow = row, this.selectedCol = col;
		if (this.done){
			this.done = false;
			this.pathSearch();
		}
	}

	update(destRow, destCol){
		// pathSearch calculates destRow and destCol, but changes nothing
			// so update much change things: done*, pose*, col*, row*
			// and speed* (pathsearch using timeout(update,recur, speed))
		// might let characters have their own update functions later
		if (this.col < destCol) this.facing = "Right";
		else if (this.col > destCol) this.facing = "Left";
		else if (this.row > destRow) this.facing = "Up";
		else if (this.row < destRow) this.facing = "Down";
		else this.done = true;

		if (this.map.barrierList[destRow+'-'+destCol]) 
			this.done = true;
		else{
			let check = this.map.items[destRow+"-"+destCol];
			if (check && (check["lockune"] || check[user.ID]))
				this.done = true;
		}


		// 
		if (this.mode === "Run") this.speed = this.baseSpeed / 2;
		else this.speed = this.baseSpeed;
		this.lastPose = this.pose;
		this.pose = this.mode + this.facing;

		// check for obstacle, change cell and change position only if no obstacle
		if(this.done === false){
			this.map.leave(this);
			switch(this.facing){
				case "Right": this.col += 1; break;
				case "Left": this.col -= 1; break;
				case "Up": this.row -= 1; break;
				case "Down": this.row += 1; break;
			}	
			this.map.enter(this);

		} else this.pose = this.basePose + this.facing
		// reposition
		this.reposition();

	}

	reposition(){
		this.left = this.col * this.map.cellSize;
		this.top = this.row * this.map.cellSize;
		this.charDiv.style.transition = "left "+this.speed+"ms linear, top "+this.speed+"ms linear";
		this.charDiv.style.left = this.left + "px";
		this.charDiv.style.top = this.top + "px";
		this.charDiv.style["z-index"] = this.row;
		let src = this.imgFolder+this.character+"/"+this.character+this.pose+".gif" ///// make simpler 
		let oldsrc = this.charImg.getAttribute("src");
		if (src !== oldsrc)
			this.charImg.setAttribute("src", src);
	}

}

function makeSimpleSearch(char){
	function search(){
		let row = char.row;
		let col = char.col;
		if (char.done) return;
		if (char.selectedRow > row 		&& check(char.map, row+1, col)) row += 1;
		else if (char.selectedRow < row && check(char.map, row-1, col)) row -= 1;
		else if (char.selectedCol > col && check(char.map, row, col+1)) col += 1;
		else if (char.selectedCol < col && check(char.map, row, col-1)) col -= 1;
		else {char.update(row, col); return;}
		char.update(row, col);
		setTimeout(char.pathSearch, char.speed);
	}
	return search;
}

function makeCharacterFromData(data){}

function makeCharacter(map, row, col, character){

	let imgCellWidth = 1, 
	imgCellHeight = 1,  
	baseSpeed=250, 
	basePose="Still",
	facing="Down", 
	mode="Walk";
	let myChar = new Character(character, imgCellWidth, imgCellHeight,
    				           row, col, basePose, facing, baseSpeed, mode, map, null);
	myChar.pathSearch = makeSimpleSearch(myChar);

	return myChar;
}

function makeTitan(map, row, col){

	let character=name,
	imgCellWidth = 1, 
	imgCellHeight = 1,  
	baseSpeed=250, 
	basePose="Still",
	facing="Right", 
	mode="Walk";
	let myChar = new Character(character, imgCellWidth, imgCellHeight,
    				           row, col, basePose, facing, baseSpeed, mode, map, null);
	myChar.pathSearch = makeSimpleSearch(myChar);

	return myChar;
}

function makeSimpleLoiter (axis, myChar, rangeLow, rangeHigh) {
	function loiter(){
		let data = {row: {dir1: "Down", dir2: "Up"}, col:{dir1: "Right", dir2:"Left"}}
		let inc = 1;
		if (myChar[axis] < rangeHigh && myChar.facing === data[axis].dir1) inc = inc;
		else if (myChar[axis] >= rangeHigh) inc = -inc;
		else if (myChar[axis] > rangeLow && myChar.facing === data[axis].dir2) inc = -inc;
		else if (myChar[axis] <= rangeLow) inc = inc;
		
		if (axis === "row")
			myChar.go(myChar.row + inc, myChar.col);
		else
			myChar.go(myChar.row, myChar.col + inc);
	}

	return loiter;
}

function makeLoiterer(l, frequency, wait, map){ 
	//currently only makes titans
	let row = l.row, col = l.col, axis = l.axis, rangeLow = l.rangeLow, rangeHigh = l.rangeHigh;
	function loiterTitan() {
		let titan = makeTitan(map, row, col);
		function waitTime(){
			setInterval(makeSimpleLoiter(axis, titan, rangeLow, rangeHigh), 
			frequency);
		}
		setTimeout(waitTime, wait);
	}
	return loiterTitan;
}
