'use strict';
'use strict';
const fs = require("fs");
const path = require("path");
module.exports = app =>{
	class ueditorClass extends app.Controller{
		async index(ctx){
			console.log("action", ctx.query.action);
			const upload = ctx.service.upload;
			if (ctx.query.action === 'config') {
		        ctx.type = "json";
		        ctx.redirect("/public/ueditor/nodejs/config.json");
		    } else if (ctx.query.action === 'listimage') {
		        ctx.body = await upload.ue_pic_list( '/upload/image', ctx.query.start, ctx.query.size);
		    } else if (ctx.query.action === 'listfile') {
		        ctx.body = await upload.ue_pic_list( '/upload/file', ctx.query.start, ctx.query.size);
		    } else if (ctx.query.action === 'uploadimage' || ctx.query.action === 'uploadfile' || ctx.query.action === 'uploadvideo') {
		        // 图片文件类型分类
		        let fileType = 'image';
		        if (ctx.query.action === 'uploadfile') {
		            fileType = 'file';
		        }else if(ctx.query.action === 'uploadvideo'){
		        	fileType = 'video';
		        }
		        // 响应对象
		        let result = { state: "FAIL" };
		        // 保存地址
		        let serverFilePath = path.join(__dirname, '../public/upload');
		        result = await upload.uploadFile(ctx, {
		            fileType: fileType,
		            path: serverFilePath,
		            // 公共静态目录下的上传目录，传递此项是为了处理返回的url，upload是相对静态服务器目录的
		            uploadPath: '/public/upload'
		        })
		        await fs.unlinkSync(result.filePath);
		        ctx.body = result;
		    }
		}
	}
	return ueditorClass;
}