'use strict';
const path = require("path");
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');
const crypto = require('crypto');
const md5 = require('md5');
const moment = require('moment');
const co = require('co');
const OSS = require('ali-oss');
const Service = require('egg').Service;
class sFileService extends Service{
	async upload(ctx){
		const parts = ctx.multipart();
		const info = {};
	    let part;
	    while ((part = await parts()) != null) {
	      if (part.length) {
	        info[part[0]] = part[1];
	      } else {
	        if (!part.filename) {
	          return;
	        }
	        info[part.fieldname] = part.filename;
	        const picPath = path.join(__dirname,"../public/upload/")+part.filename;
	        try {
	          part.pipe(fs.createWriteStream(picPath));
	        } catch (err) {
	          await sendToWormhole(part);
	          throw err;
	        }
	      }
	    }
	    return info;
	}
	async createSignature(img){
		const extname = path.extname(img);
		console.log("extname", extname);
		const AccessKeySecret = this.app.config.aliyun.accessKeySecret;
		const AccessKeyId = this.app.config.aliyun.accessKeyId;
		console.log("AccessKeySecret", AccessKeySecret);
		console.log("AccessKeyId", AccessKeyId);
		const VERB = "PUT";
		const Content_MD5 = "";
		const Content_Type = "";
		//process.env.TZ = 'Europe/London';
		const nowDate = new Date();
		const date = moment().format('ddd, DD MMM YYYY HH:mm:ss \'GMT\'');
		//const date = dateFormat(new Date(), 'UTC:ddd, dd mmm yyyy HH:MM:ss \'GMT\'')
		console.log(date);
		const current = Math.floor(nowDate.getTime()/1000);
		//console.log("nowDate", typeof nowDate);
		const fileName = `${md5(current)}_${current}${extname}`;
		const CanonicalizedOSSHeaders = "";
		const CanonicalizedResource = "/blogt/";
		const data = `${VERB}\n${Content_MD5}\n${Content_Type}\n${date}\n${CanonicalizedOSSHeaders}${CanonicalizedResource}`;
		console.log('data', data);
		let Signature = crypto.createHmac('sha1',AccessKeySecret)
		Signature = Signature.update(new Buffer(data, 'utf8')).digest('base64');
		const Authorization = `OSS ${AccessKeyId}:${Signature}`;
		console.log('signature', Authorization);
		console.log("fileName", fileName);
		const uploadUrl = `https://blogt.oss-cn-beijing.aliyuncs.com/${fileName}`;
		console.log("uploadUrl", uploadUrl);
		return {Authorization, uploadUrl};
	}

	async uploadOSS(ctx){
		const parts = ctx.multipart();
	    let part;
        let result="";
	    while ((part = await parts()) != null) {
	      if (part.length) {
	      } else {
	        if (!part.filename) {
	          return;
	        }
	        console.log('field: ' + part.fieldname);
	        console.log('filename: ' + part.filename);
        	const client = new OSS({
	          	region: "oss-cn-beijing",
	          	accessKeyId: this.app.config.aliyun.accessKeyId,
	          	accessKeySecret: this.app.config.aliyun.accessKeySecret,
	          	bucket: "blogt"
        	});
	        try {
	        	const picPath = path.join(__dirname,"../public/upload/")+(new Date()).getTime()+'_'+part.filename;
				part.pipe(fs.createWriteStream(picPath));
	        	result = co(function* () {
				   // use 'chunked encoding'
					const stream = fs.createReadStream(picPath);
					//fs.pipe(stream);
					const result2 = yield client.putStream(part.filename, stream);
					return result2;
				}).catch(function (err) {
				    console.log(err);
				});
				await fs.unlinkSync(picPath);
	        } catch (err) {
	          await sendToWormhole(part);
	          throw err;
	        }
	      }
	    }
		return result;
	}
}
module.exports= sFileService