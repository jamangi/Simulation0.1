
/////// generic ///////
function clearLog(ele) {
	ele.innerHTML = '';
}

function returnLog(ele, msg) {
	ele.innerHTML = ele.innerHTML + "<br>" + msg;
}

function checkError(display, data) {
	if (data["msg"] !== undefined){
		returnLog(display, data["msg"]);
		return true;
	}
	else{
		return false;
	}
}


//////////  Dump (multiple file upload) ////////////// 
function renderFileList(fileList, fileListDisplay) {
  	fileListDisplay.innerHTML = '';
    fileList.forEach(function (file, index) {
    	var fileDisplayEl = document.createElement('p');
      	fileDisplayEl.innerHTML = (index + 1) + ': ' + file.name;
      	fileListDisplay.appendChild(fileDisplayEl);
    });
}

function addToModal(data) {
	let fileListDisplay = document.getElementById('dumpContent');
	let c = fileListDisplay.innerHTML;
	if (data["msg"] === undefined){
		let script = data["script"];
		let user = data["user"];

		let name = user["name"];
		let id = script["id"];
		let location = script["location"];
		let filetype = script["filetype"];
		let filename = script["filename"];
		let filetext = script["filetext"];
		let material = script["material"];
		let row = script["row"];
		let col = script["col"];

		let append = filename + "<br>" + filetype + "<br>" + material
		fileListDisplay.innerHTML = c + "<br><br>" + append;
	}
	else {
		fileListDisplay.innerHTML = c + "<br>" + data["msg"];
	}

}

function sendFile(file, callback) {
  	let formData = new FormData();
    let request = new XMLHttpRequest();
 
    formData.set('file', file);
    request.open("POST", 'http://localhost:9000/dump');
    request.onreadystatechange = function() {
		if (request.readyState === 4) {
        	let json = JSON.parse(request.responseText);
        	if (callback !== undefined) {
        		callback(json);
        	}
    	}
	}
    request.send(formData);
}

////////// Set (set username, character, and ip) ///////////
function setCharacter(char) {
	document.getElementById("characterInput").value = char;
}

function setCallback(data) {
	let display = document.getElementById("setContent");
	if (checkError(display, data))
		return false;
	else {
		let props = ["name", "id", "location",
					 "character", "form", "material",
					 "total_collected", "total_dropped",
					 "row", "col"]
		for (let prop of props){
			returnLog(display, prop +": "+data["user"][prop]);
		}
	}
}

function setSend() {
	let display = document.getElementById("setContent");
	let charInput = document.getElementById("characterInput").value;
	let nameInput = document.getElementById("nameInput").value
	clearLog(display);
	if (charInput.lenth === 0 || nameInput.length === 0)
		returnLog(display, "<b>character and name must be selected</b>")
	else {
		data = {name: nameInput, character: charInput,
				location: "training"}
		datastore.set(setCallback, data)
	}
}

////////// Touch (fetch username, character, and ip) ///////////