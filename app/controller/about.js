'use strict';
const Controller = require('egg').Controller;
class aboutController extends Controller{
	async index(){
		const {MArticle, MArticleType} = this.ctx.model;
		const limit = 10;
		const offset = 0;
		const articles = await MArticle.finAll({
			limit,
			offset,
			include: [{
				model: MArticleType,
				as: "article_type",
				where:{
					name: "关于我"
				},
				attributes: ["name"],
			}]
		})
		const articles_detail = [];
		for(let article of articles){
			const article_detail = this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment"]);
			const createTime = this.ctx.helper.getFullTime(article.created_at);
			article_detail.createTime = createTime;
			articles_detail.push(article_detail);
		}
		const {WordPress, AboutMe} = await this.ctx.service.articleType.types();
		const {recentArticles_detail, wordPressArticles_detail} = await this.ctx.service.sidebar.getSidebarContent(); 
		await this.ctx.render("/blog/about", {
			"articles_detail" : articles_detail,
			"wordPress": WordPress,
			"aboutMe": AboutMe,
			"wordPressArticles": wordPressArticles_detail,
			"recentArticles": recentArticles_detail
		});
	}
}
return aboutController;