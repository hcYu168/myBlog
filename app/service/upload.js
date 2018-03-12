'use strict';
const inspect = require('util').inspect;
const path = require('path');
const fs = require('fs');
const co = require("co");
const OSS = require("ali-oss");
module.exports = app =>{
	class uploadClass extends app.Service{
		async mkdirsSync(dirname){
			const upload = this.ctx.service.upload;
			if (fs.existsSync(dirname)) {
			    return true
			} else {
			    if (await upload.mkdirsSync( path.dirname(dirname)) ) {
			      fs.mkdirSync(dirname)
			      return true
			    }
			}
		}
		async uploadFile(ctx, options) {
			const upload = this.ctx.service.upload;
		    const stream = await ctx.getFileStream();
		   // console.log("stream", stream);
		   // console.log("name", stream.filename);
		    let fileName = (new Date()).getTime() + '_' + stream.filename;
			  // 获取类型
			let fileType = options.fileType || 'common'
			let filePath = path.join( options.path,  fileType);
			let uploadPath = options.uploadPath;
			let mkdirResult = await upload.mkdirsSync(filePath)
			let _uploadFilePath = path.join(filePath, fileName);
			console.log("fileName", fileName);
			await stream.pipe(fs.createWriteStream(_uploadFilePath));
			const client = new OSS({
				region: "oss-cn-beijing",
	          	accessKeyId: app.config.aliyun.accessKeyId,
	          	accessKeySecret: app.config.aliyun.accessKeySecret,
	          	bucket: "blogt"
			});
			return new Promise((resolve, reject) => {
				console.log('文件上传中...')
				setTimeout(function(){
					co(function* () {
					  	const result = yield client.put(fileName, _uploadFilePath);
					  	console.log(result);
						let res = { 
					    	'url': result.url,
			                'title': fileName,
			                'original': fileName,
					        "state": 'SUCCESS',
					        "filePath": _uploadFilePath
					  	}
					  	resolve(res);
					}).catch(function (err) {
					  console.log(err);
					});
				}, 2000);
			})   
		}

		async ue_pic_list(list_dir, start, size){
			// console.log(readDir);
			const readDir = this.ctx.service.readDir;
		    let result = {};
		    let list = [];
		    // 读取文件目录下的所有文件，返回所有文件的名字形成的数组
		    let files = await readDir.read(path.join(path.join(__dirname, "../public/"), list_dir));
		    let len = files.length;
		    if (len === 0) {
		        return {
		          state: 'no match file',
		          list: [],
		          start: start,
		          total: files.length
		        } 
		    }
		    let end = start + size;
		    for (let i = end <= len ? end - 1 : len - 1; i < len && i >= 0 && i >= start; i--) {
		        list.push({
		            url: path.join('/public/', list_dir, files[i])
		        });
		        console.log(list);
		    }
		    return {
		      "state": "SUCCESS",
		      "list": list,
		      "start": start,
		      "total": files.length
		    }
		}
	}
	return uploadClass;
}