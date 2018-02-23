"use strict";
const Controller = require('egg').Controller;
class dbUserController extends Controller{
	async index(){
		const {MUser} = this.ctx.model;
		const limit=5;
		const offset=0;
		const userCount = await MUser.findAll();
		let pageCount;
		if(userCount.length%5 == 0){
			pageCount = userCount.length/5
		}else{
			pageCount = userCount.length/5 + 1
		}
		const useres = await MUser.findAll({limit, offset});
		const useres_detail = [];
		for(let user of useres){
			const createTime = await this.ctx.helper.getFullTime(user.created_at);
			const user_detail = await this.ctx.helper.getAttributes(user, [
				"id", "name", "password", "phone"]);
			user_detail.createTime = createTime;
			useres_detail.push(user_detail);
		}
		await this.ctx.render("/dashboard/user", {
			"useres": useres_detail,
			"page": 1,
			"pageCount": pageCount
		});
	}

	async create(){
		const {name, password, phone} = this.ctx.request.body;
		const {MUser} = this.ctx.model;
		const user = await MUser.create({name, password, phone});
		const user_detail = await this.ctx.helper.getAttributes(user, [
				"id", "name", "password", "phone"]);
		this.ctx.body = user_detail;
	}

	async destroy(){
		const {id} = this.ctx.params;
		const {MUser} = this.ctx.model;
		const user = await MUser.findById(id);
		if(!user){
			this.ctx.throw(404, "user not found");
		}
		await MUser.destroy({where:{id}});
		const updateJson = {
			"action" : "delete user",
			"info" : "ok"
		}
		this.ctx.body = updateJson;
	}
	async show(){
		const {id} = this.ctx.params;
		const {MUser} = this.ctx.model;
		const limit=5;
		let offset;
		if(id == 1){
			offset = 0;
		}else{
			offset = (id-1)*limit
		}
		const userCount = await MUser.findAll();
		let pageCount;
		if(userCount.length%5 == 0){
			pageCount = userCount.length/5
		}else{
			pageCount = userCount.length/5 + 1
		}
		const useres = await MUser.findAll({limit, offset});
		const useres_detail = [];
		for(let user of useres){
			const createTime = await this.ctx.helper.getFullTime(user.created_at);
			const user_detail = await this.ctx.helper.getAttributes(user, [
				"id", "name", "password", "phone"]);
			user_detail.createTime = createTime;
			useres_detail.push(user_detail);
		}
		await this.ctx.render("/dashboard/user", {
			"useres": useres_detail,
			"page": id,
			"pageCount": pageCount
		});
	}

}
module.exports= dbUserController;