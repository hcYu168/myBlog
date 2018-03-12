"use strict";
const Controller = require('egg').Controller;
class dbUserController extends Controller{
	async index(){
		const {MUser} = this.ctx.model;
		const limit=5;
		const offset=0;
		const useres = await MUser.findAndCountAll({
			limit,
			offset,
			include: [{
				model: this.app.model.MAuthorization,
				as: "auth_user"
			}]
		});
		console.log("useres.count", useres.count);
		const pageCount = Math.ceil(useres.count/5);
		const useres_detail = [];
		for(let user of useres.rows){
			const createTime = await this.ctx.helper.getFullTime(user.created_at);
			const user_detail = {};
			user_detail.createTime = createTime;
			user_detail.id = user.id;
			user_detail.name = user.auth_user.name;
			useres_detail.push(user_detail);
		}
		await this.ctx.render("/dashboard/user", {
			"useres": useres_detail,
			"page": 1,
			"pageCount": pageCount,
			"name": this.ctx.session.name
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
		const useres = await MUser.findAndCountAll({
			limit,
			offset,
			include: [{
				model: this.app.model.MAuthorization,
				as: "auth_user"
			}]
		});
		let pageCount = Math.ceil(useres.count/5);
		const useres_detail = [];
		for(let user of useres.rows){
			const createTime = await this.ctx.helper.getFullTime(user.created_at);
			const user_detail = {};
			user_detail.id = user.id;
			user_detail.name = user.auth_user.name;
			user_detail.createTime = createTime;
			useres_detail.push(user_detail);
		}
		await this.ctx.render("/dashboard/user", {
			"useres": useres_detail,
			"page": id,
			"pageCount": pageCount,
			"name": this.ctx.session.name
		});
	}

}
module.exports= dbUserController;