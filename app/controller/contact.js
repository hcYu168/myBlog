"use strict";
const Controller = require("egg").Controller;
class contactController extends Controller{
	async index(){
		const id = "contact";
		const {WordPress, AboutMe} = await this.ctx.service.articleType.types();
		const {recentArticles_detail, wordPressArticles_detail} = await this.ctx.service.sidebar.getSidebarContent(); 
		await this.ctx.render("/blog/contact",{
			"contact":id,
			"wordPress": WordPress,
			"aboutMe": AboutMe,
			"wordPressArticles": wordPressArticles_detail,
			"recentArticles": recentArticles_detail
		});
	}
}
module.exports = contactController;