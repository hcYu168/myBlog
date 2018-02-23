'use strict';
const Controller = require('egg').Controller;
class dbArticleTypeController extends Controller{
	async index(){
		const {MArticleType} = this.ctx.model;
		const types = await MArticleType.findAll({});
		const types_detail = [];
		for(let type of types){
			const type_detail = await this.ctx.helper.getAttributes(type,[
				"id", "name"]);
			console.log("1111", type_detail);
			types_detail.push(type_detail);
		}
		await this.ctx.render("/dashboard/articleType", {
			"types_detail" : types_detail,
		});
	}
	async create(){
		const {name} = this.ctx.request.body;
		const {MArticleType} = this.ctx.model;
		const types = await MArticleType.findOne({where:{name}});
		if(types){
			this.ctx.throw(404, "types is exist");
		}
		await MArticleType.create({name});
		const updateJson = {
			"action": "create articleType",
			"info": "ok"
		}
		this.ctx.body = updateJson;
	}
	async destroy(){
		const {id} = this.ctx.params;
		const {MArticleType} = this.ctx.model;
		const types = await MArticleType.findById(id);
		if(!types){
			this.ctx.throw(404, "types not found");
		}
		await MArticleType.destroy({where:{id}});
		const updateJson = {
			"action": "delete articleType",
			"info": "ok"
		}
		this.ctx.body = updateJson;
	}
}
module.exports = dbArticleTypeController;