class ActionModal {
	constructor() {
		window.actionModal = this;
		this.actionButtons = document.getElementById("actionButtons");
		this.actionContent = document.getElementById("actionContent");
		this.actionForm = document.getElementById("actionForm");

		this.actionTitle = document.getElementById("actionTitle");
		this.actionTitleImg = document.getElementById("actionTitleImg");

		this.actionLoading = document.getElementById("actionLoading");

		this.actionChangeButton = document.getElementById("actionChangeButton");
		this.actionCollectButton = document.getElementById("actionCollectButton");
		this.actionDropButton = document.getElementById("actionDropButton");
		this.actionHealButton = document.getElementById("actionHealButton");
		this.actionNewButton = document.getElementById("actionNewButton");
		this.actionRunButton = document.getElementById("actionRunButton");		
		this.actionUpdateButton = document.getElementById("actionUpdateButton");
		this.actionTestButton = document.getElementById("actionTestButton");

		this.actionUpdateForm = document.getElementById("actionUpdateForm");
		this.actionNameInput = document.getElementById("actionNameInput");

		this.actionScriptForm = document.getElementById("actionScriptForm");
		this.actionScriptname = document.getElementById('actionScriptname');
		this.actionScripttext = document.getElementById('actionScripttext');	

		this.actionOutputTitle = document.getElementById("actionOutputTitle");
		this.actionOutputTitleImg = document.getElementById("actionOutputTitleImg");
		this.actionOutputLoading = document.getElementById("actionOutputLoading");
		this.actionOutputContent = document.getElementById("actionOutputContent");		
		
		this.actionUpdateForm.addEventListener('submit', function (evnt){
			evnt.preventDefault();
			updateSend();
		});

		this.actionChangeButton.addEventListener("click", function(){
			actionModal.showUpdate(datastore['userData']);
		});

		this.actionDropButton.addEventListener('click', function(){dropSend();})
		this.actionCollectButton.addEventListener('click', function(){collectSend();})
		this.actionTestButton.addEventListener('click', function(){testSend();})
		this.actionRunButton.addEventListener('click', function(){runSend();})

		this.actionHealButton.addEventListener('click', function(){healSend();})
		this.actionNewButton.addEventListener('click', function(){newSend();})

		this.components = [this.actionTitle, this.actionContent,
						   this.actionButtons, this.actionForm];
		this.outputComponents = [this.actionOutputTitle,
								 this.actionOutputContent];

		this.clear();
		this.clearOutput();
	}


	//////////////  api /////////////////////////

	appenduserHeader(data, ele, eleImg, useOutput) {
		let userData = data["user"];
		let username = userData["username"];
		if (useOutput)
			username = "Output";
		let form = userData["form"];
		let imgdir = "images/characters/"
		let img = imgdir+form+"/"+form+"WalkDown.gif";
		messageLog(ele, "<h2 style='float:right'; class='text-capitalize'>"
				  +username+"</h2>");
		eleImg.setAttribute('src',img);
		ele.appendChild(eleImg);
	}

	appendUserTitle(data) {
		this.appenduserHeader(data, this.actionTitle, this.actionTitleImg);
	}

	appendOutputUserTitle(data) {
		this.appenduserHeader(data, this.actionOutputTitle, this.actionOutputTitleImg, true);
	}

	clear() {
		for (let component of this.components) 
			while (component.lastChild) 
				component.removeChild(component.lastChild);
		this.loadingOff();
	}

	clearOutput() {
		for (let component of this.outputComponents) 
			while (component.lastChild) 
				component.removeChild(component.lastChild);
		this.loadingOutputOff();
		actionModal.actionOutputContent.value = ''
	}

	loadingOn(){loadingLog();}
	loadingOff(){loadingClear();}
	loadingOutputOn(){loadingOutputLog();}
	loadingOutputOff(){loadingOutputClear();}

	printUser(data){
		if (checkError(data))
			printError(this.actionLoading, data);
		else 
			printUser(this.actionContent, data);
	}

	messageLog(msg) {
		messageLog(this.actionLoading, msg);
	}

	showUpdate(data) {
		this.clear();
		this.actionNameInput.value = datastore.username;
		this.updateUser(data);
		this.showUser(data);
		this.actionForm.appendChild(this.actionUpdateForm);
	}

	showUser(data) {
		this.clear();
		this.appendUserTitle(data);
		this.printUser(data);
	}

	showHeal(data) {
		this.showUser(datastore['userData']);
		this.updateUser();
		this.actionButtons.appendChild(this.actionChangeButton);
		this.actionButtons.appendChild(this.actionHealButton);
		this.actionButtons.appendChild(this.actionNewButton);
	}

	showDrop(data) {
		this.clear();
		this.appendUserTitle(data);
		this.updateUser(data);

		actionModal.actionScriptname.value = '';
		actionModal.actionScripttext.value = '';
		// actionModal.actionScriptname.removeAttribute("disabled");
		// actionModal.actionScripttext.removeAttribute("disabled");
		this.actionForm.appendChild(this.actionScriptForm);

		this.actionButtons.appendChild(this.actionRunButton);
		this.actionButtons.appendChild(this.actionTestButton);
		this.actionButtons.appendChild(this.actionDropButton);
	}
	
	showCollect() { // listener added to scripts in Map.js
		actionModal.clear();
		let data = JSON.parse(this.getAttribute("data-script"));
		let userData = data['user']
		actionModal.appendUserTitle(data);

		let scriptname = data['filename'];
		let scripttext = data['filetext'];
		let scriptid = data['id'];
		window.selectedID = scriptid;

		actionModal.actionScriptname.value = scriptname;
		actionModal.actionScripttext.value = scripttext;
		// actionModal.actionScriptname.setAttribute("disabled", true);
		// actionModal.actionScripttext.setAttribute("disabled", true);
		actionModal.actionForm.appendChild(actionModal.actionScriptForm);
		actionModal.actionButtons.appendChild(actionModal.actionTestButton);
		if (connected)
			if (window.user.ID === data['user']['id'])
				actionModal.actionButtons.appendChild(actionModal.actionRunButton);
			else
				actionModal.actionButtons.appendChild(actionModal.actionCollectButton);
	}

	showError() {
		actionModal.clear();
		let output = datastore['error']['msg'];
		// actionModal.actionContent.innerHTML = '<span style="color: darkred;">' + output+ '</span>';
		messageLog(actionModal.actionContent, '<span style="color: darkred;">' + output+ '</span>')
		messageLog(actionModal.actionOutputLoading, '<span style="color: darkred;">' + output+ '</span>')
	}

	showOutput(output) {
		actionModal.clearOutput();
		actionModal.appendOutputUserTitle(datastore['userData']);
		actionModal.actionOutputContent.value = output;
	}

	updateUser() {
		let data = datastore['userData'];
		user.changeID(data["user"]["id"]);
		user.character = data["user"]["form"];
		user.username = data["user"]["username"];
		user.location = data["user"]["location"];
		user.total_collected = data["user"]["total_collected"];
		user.total_dropped = data["user"]["total_dropped"];
		user.update(user.row, user.col)
	}

}