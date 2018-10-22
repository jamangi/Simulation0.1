window.onload = function() {
	let debugBody = document.getElementById('debugBody');
	try {
		new Datastore();
		new ActionModal();
		new Toolbar();
		window.connected = false;
		window.dhdomain = "http://localhost:9080/"
		window.selectedId = null;
		let map = emptyWood();
		let userCharacter = makeCharacter(map, 3, 3, "lockune");
		let user = new User(userCharacter)
	}
	catch (err){
		debugBody.innerHTML = err
	}
}