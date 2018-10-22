// holds all scripts in memory 

class Datastore {

	constructor(){
		window.datastore = this;
		this.username = '';
		this.password = '';
		this.loaded = false;
		this.loadDefaults();
	}

	//do not require credentials
	create(callback, data){this.postCall("create", callback, data);} 
	load(callback, data){this.getCall("load", callback, data);}
	users(callback, data){this.getCall("users", callback, data);} ///
	test(callback, data){this.postCall("test", callback, data);} //

	//require credentials
	touch(callback, data){this.postCall("touch", callback, data);}
	update(callback, data){this.postCall("update", callback, data);}
	full_restore(callback, data){this.postCall("full_restore", callback, data);} //
	heal(callback, data){this.postCall("heal", callback, data);} //

	check(callback, data){this.postCall("check", callback, data);}
	start(callback, data){this.postCall("start", callback, data);}
	status(callback, data){this.postCall("status", callback, data);}
	edit(callback, data){this.postCall("edit", callback, data);}


	drop(callback, data) {this.postCall("drop", callback, data);} //
	collect(callback, data){this.postCall("collect", callback, data);} //
	run(callback, data){this.postCall("run", callback, data);} //
	


	loadCredentials(username, password) {
		this.username = username;
		this.password = password;
		this.loaded = true;
	}

	loadDefaults() {
		this['userData'] = {
			user: {
				id: 'lockune',
				username: 'Anonymous',
	        	container_version: 0,
	        	container_name: '',
	        	unusual_death: false,

	        	location: 'training',
	        	character: 'lockune',
	        	form: 'lockune',
	        	material: 0,

	        	total_collected: 0,
	        	total_dropped: 0,
	        	row: 0,
	        	col: 0
			}
		}
	}

	reloadCredentials(username) {
		this.username = username;
	}

	credentials(){
		return {"username": this.username, "password": this.password};
	}

	appendCredentials(obj){
		obj.username = this.username;
		obj.password = this.password;
	}

	getCall(endpoint, callback, data){
		let query = "";
		if (data !== undefined)
			query = "/"+data;
		let service = window.dhdomain+endpoint+query;
		let xhr = new XMLHttpRequest();
		let datastore = this;
		xhr.open("GET", service, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
	        	let json = JSON.parse(xhr.responseText);
	        	datastore[endpoint+"Data"] = json;
	        	callback(json);
	    	}
		}
		xhr.send();
	}

	postCall(endpoint, callback, data){
		let service = window.dhdomain+endpoint;
		let xhr = new XMLHttpRequest();
		let datastore = this;
		if (data === undefined)
			data = {}
		this.appendCredentials(data);
		xhr.open("POST", service, true);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4 && xhr.status === 200) {
	        	let json = JSON.parse(xhr.responseText);
	        	datastore[endpoint+"Data"] = json;
	        	if (endpoint !== 'test' && !json['error'])
	        		datastore["userData"] = json;
	        	callback(json);
	    	}
		}
		let toSend = JSON.stringify(data);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(toSend);
	}

}