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
}
module.exports = articleTypeService;