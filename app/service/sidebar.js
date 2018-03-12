'use strict';
const Service = require("egg").Service;
class sidebarService extends Service{
	async getSidebarContent(){
		const {MArticle, MArticleType} = this.ctx.model;
		const limit = 6;
		const offset = 0;
		const recentArticles = await MArticle.findAll({
			limit, 
			offset,
			order: [
				["created_at", "desc"]
			],
			attributes: ["id", "title"]
		});
		const wordPressArticles = await MArticle.findAll({
			limit, 
			offset,
			order: [
				["created_at", "desc"]
			],
			attributes: ["id", "title"],
			include: [{
				model: this.app.model.MArticleType,
				as: "article_type",
				where:{
					"name": "技术分享"
				}
			}]
		});
		const recentArticles_detail = [];
		const wordPressArticles_detail = [];
		for(let recentArticle of recentArticles){
			const recentArticle_detail = this.ctx.helper.getAttributes(recentArticle, [
				"id", "title"]);
			recentArticles_detail.push(recentArticle_detail);
		}
		for(let wordPressArticle of wordPressArticles){
			const wordPressArticle_detail = this.ctx.helper.getAttributes(wordPressArticle, [
				"id", "title"]);
			wordPressArticles_detail.push(wordPressArticle_detail);
		}
		return {recentArticles_detail, wordPressArticles_detail};
	}
}
module.exports =  sidebarService;