'use strict';
const Controller = require("egg").Controller;
class indexController extends Controller{
	async index(){
		const {MArticle} = this.ctx.model;
		const limit=4;
		const offset=0;
		const articles = await MArticle.findAll({
			limit, 
			offset,
			include:[{
				model: this.app.model.MArticleType,
				as: "article_type",
				attributes: ["id", "name"],
			}]
		});		
		let wordPress = "";
		let aboutMe = "";
		const articles_detail = [];
		for(let article of articles){
			const createTime = this.ctx.helper.getFullTime(article.created_at);
			const article_detail = this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "content"]);
			article_detail.createTime = createTime;
			articles_detail.push(article_detail);
			if(article.article_type.name == "技术分享"){
				wordPress = article.article_type.id;
			}else if(article.article_type.name == "关于我"){
				aboutMe = article.article_type.id;
			}
		}
		const {recentArticles_detail, wordPressArticles_detail} = await this.ctx.service.sidebar.getSidebarContent();
		console.log("recentArticles_detail", recentArticles_detail);
		console.log("wordPressArticles_detail", wordPressArticles_detail);
		await this.ctx.render("/blog/index", {
			"articles": articles_detail,
			"wordPress": wordPress,
			"aboutMe": aboutMe,
			"wordPressArticles": wordPressArticles_detail,
			"recentArticles": recentArticles_detail
		});
	}
}
module.exports = indexController;