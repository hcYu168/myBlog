"use strict";
const fs = require("fs");
module.exports = app =>{
	class readDirClass extends app.Service{
		async read(list_dir){
			return new Promise((resolve, reject) => {
		        let files = fs.readdirSync(list_dir);
		        if (Array.isArray(files)) {
		            resolve(files);
		        } else {
		            reject();
		        }      
		    })
		}
	}
	return readDirClass;
}