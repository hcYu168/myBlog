"use strict";
const Service = require("egg").Service;
class articleTypeService extends Service{
	async types(){
		const {MArticleType} = this.ctx.model;
		const wordPress = await MArticleType.findOne({
			where:{
				"name": "技术分享"
			},
			attributes:["id"]
		});
		const aboutMe = await MArticleType.findOne({
			where:{
				"name": "关于我"
			},
			attributes:["id"]
		});
		const WordPress = wordPress.id;
		const AboutMe = aboutMe.id;
		return { WordPress, AboutMe};
	}

	async show(){
		const {MArticleType} = this.ctx.model;
		const articleTypes = await MArticleType.findAll({});
		const articleTypes_detail = [];
		for(let articleType of articleTypes){
			const articleType_detail = await this.ctx.helper.getAttributes(articleType, ["id", "name"]);
			articleTypes_detail.push(articleType_detail);
		}
		return {articleTypes_detail};
	}
}
module.exports = articleTypeService;