/////// generic ///////
function checkError(data) {
	if (data === undefined || data["msg"] !== undefined) 
		return true; 
	else return false;
}


function clearLog(ele) {
	ele.innerHTML = '';
}


function loadingClear() {
	messageLog(actionModal.actionLoading, "");
}
function loadingLog() {
	let load = "<span style='color:darkgreen;'> loading... </span>";
	messageLog(actionModal.actionLoading, load);
}
function loadingReturn(html) {
	messageLog(actionModal.actionLoading, html);
}
function loadingOutputClear(){
	messageLog(actionModal.actionOutputLoading, "");
}

function loadingOutputLog (){
	let load = "<span style='color:#ff761a;'> running... </span>";
	messageLog(actionModal.actionOutputLoading, load);
}
function loadingOutputReturn(html) {
	messageLog(actionModal.actionOutputLoading, html);
}
function messageLog(ele, msg) {
	ele.innerHTML = msg;
}

function printError(display, data) {
	messageLog(display, data["msg"]);
}

function printUser(display, data) {
	let props = ["username", "id", "location",
				 "character", "form", "material",
				 "total_collected", "total_dropped"]

	let status = "healthy"
	if (data["user"]["form"] === "ghost")
		status = "ghost"

	for (let prop of props){
		let key = prop.replace("total_", "");
		let value = data["user"][prop];
		if (prop === "form") {
			key = "status";
			value = status;
		}
		returnLog(display, key +": "+value);
	}
}


function returnLog(ele, msg) {
	if (ele.innerHTML === '')
		ele.innerHTML = msg;
	else
		ele.innerHTML = ele.innerHTML + "<br>" + msg;
}

function reconnect(data) {
	datastore['error'] = data;
	// toolbar.showConnect();
	actionModal.showError()
}

////////// Output Callback /////////////////
function outputCallback(data, printMaterial) {
	if (checkError(data)){
		reconnect(data);
		return false;
	}
	else{
		let output = data['result']['output'];
		let hasHeart = data['result']['has_heart'];
		let material = data['result']['material'];
		let img = "<img src='images/icons/material.gif' width=10 height=15>"
		let msg = "Script is worth "+ material +" " + img + "";
		if (printMaterial){
			loadingReturn(msg); // drop collect test || run
		}

		actionModal.updateUser();
		actionModal.showOutput(output);
		toolbar.showStatus();

		if (hasHeart)
			loadingOutputReturn("<small style='color:darkgreen;'>script ran safely</small>");
		else if (hasHeart !== null)
			loadingOutputReturn("<small style='color:#ff761a;'>heart file was destroyed</small>");
		else
			loadingOutputReturn("<small style='color:darkred;'>script failed to run</small>");
		return true;
	}
}

function outputSend(method, callback) {
	actionModal.clearOutput();
	let actionScriptname = document.getElementById("actionScriptname");
	let actionScripttext = document.getElementById("actionScripttext");
	if (actionScriptname.value.lenth === 0 || actionScripttext.value.length === 0)
		actionModal.messageLog("<small style='color:darkred;'>script name and text needed</small>")
	else {
		actionModal.clearOutput();
		actionModal.loadingOn();
		actionModal.loadingOutputOn();
		if (datastore['userData'])
			actionModal.appendOutputUserTitle(datastore['userData']);
		data = {filename: actionScriptname.value,
				filetext: actionScripttext.value,
				row: user.row, col: user.col, fileid: window.selectedID};
		datastore[method](callback, data)
	}
}

////////// Collect (collect file) //////////
function collectCallback(data) {
	if (outputCallback(data, false))
		actionModal.appendUserTitle(data);
}
function collectSend() {outputSend('collect', collectCallback);}

////////// Drop (drop file) ////////////////
function dropCallback(data) {
	if (outputCallback(data, false));
		map.layScript(data)
}
function dropSend() {outputSend('drop', dropCallback);}

////////// Run (Run scripts) ///////////
function runCallback(data) {
	outputCallback(data, false);
	actionModal.appendUserTitle(data);
}
function runSend() {outputSend('run', runCallback);}

////////// Test (test script) ///////////
function testCallback(data) {outputCallback(data, true);}
function testSend() 		{outputSend('test', testCallback);}

///////////////////////////////////////////////////////////////
////////// User Functions ////////////////
//////////////////////////////////////////////////////////////

/// load credentials
function loadCredentials() {
		datastore.loadCredentials(toolbar.connectUsername.value, toolbar.connectPassword.value);
}

function loadUsername(username) {
	datastore.loadCredentials(username, datastore['password']);
}


/// UserConsole Callback ///
function userCallback(data) {
	actionModal.loadingOff();
	if (checkError(data))
		reconnect(data)
	else{
		window.connected = true;
		toolbar.showStatus();
		actionModal.showHeal(data);
	}
}


////////// Create (New Player) ///////////
function createSend() {
	loadCredentials();
	actionModal.loadingOn();
	datastore.create(userCallback);
}

////////// New (New Container) ///////////
function newSend() {
	loadCredentials();
	actionModal.loadingOn();
	datastore.full_restore(userCallback);
}

////////// Heal (Heal Container) ///////////
function healSend() {
	loadCredentials();
	actionModal.loadingOn();
	datastore.heal(userCallback);
}

////////// Touch (fetch username, character, and ip) ///////////
function touchSend() {
	loadCredentials();
	actionModal.loadingOn();
	datastore.touch(userCallback);
}

////////// Update (update username, character, and ip) ///////////
function updateFormUpdate(char) {
	document.getElementById("actionRadioInput").value = char;
}

function updateSend() {
	let charInput = document.getElementById("actionRadioInput").value;
	let nameInput = document.getElementById("actionNameInput").value;
	loadUsername(nameInput)

	if (charInput.lenth === 0 || nameInput.length === 0)
		actionModal.messageLog("<small style='color:darkred;'>character and name must be selected</small>")
	else {
		data = {character: charInput,
				location: "training"}
		datastore.update(userCallback, data)
	}
}

