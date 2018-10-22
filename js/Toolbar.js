class Toolbar {
	constructor (){
		window.toolbar = this;
		this.toolbarContainer = document.getElementById("toolbarContainer");
		this.toolbarActionGroup = document.getElementById("toolbarActionGroup");
		this.toolbarLoginGroup = document.getElementById("toolbarLoginGroup");

		this.connectForm = document.getElementById("connectForm");
		this.connectUsername = document.getElementById("connectUsername");
		this.connectPassword = document.getElementById("connectPassword");
		this.toolbarNew = document.getElementById("toolbarNew");
		this.toolbarConnect = document.getElementById("toolbarConnect");

		this.toolbarScript = document.getElementById("toolbarScript");
		this.toolbarAction = document.getElementById("toolbarAction");

		this.toolbarConnect.addEventListener('click', function (evnt){
			touchSend(); // leads to showHeal or showError
		});

		this.toolbarNew.addEventListener('click', function (evnt){
			createSend();
		});

		this.toolbarScript.addEventListener('click', function (envt){
			actionModal.showDrop(datastore['userData']);
		});

		this.toolbarAction.addEventListener('click', function (envt){
			actionModal.showHeal(datastore['userData']);
		});

		this.components = [this.toolbarContainer];

		this.showConnect();


	}

	clear() {
		for (let component of this.components) 
			while (component.lastChild) {
				let child = component.lastChild;
				component.removeChild(component.lastChild);
				if (child.style && child.style.display === "none")
					child.style.display = "block"
			}
	}

	showConnect() {
		this.clear();
		this.toolbarContainer.appendChild(this.connectForm);
		this.toolbarContainer.appendChild(this.toolbarLoginGroup);
	}


	showStatus() {
		if (!connected)
			return;
		this.clear();
		let data = datastore["userData"];
		this.toolbarContainer.appendChild(this.toolbarActionGroup);
		let user = data["user"]
		let form = user["form"]
		this.toolbarScript.innerHTML = "Script";
		this.toolbarAction.innerHTML = "<span class='text-capitalize'>" + user["username"] + "</span>";
		if (form === "ghost")
			this.toolbarAction.setAttribute("class", "btn btn-warning");
		else
			this.toolbarAction.setAttribute("class", "btn btn-success");
	}
}