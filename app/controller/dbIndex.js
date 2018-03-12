'use strict';
const Controller = require("egg").Controller;
class dbIndexController extends Controller{
	async index(){
		const {MArticle} = this.ctx.model;
		const limit=5;
		const offset=0;
		const art = await MArticle.findAll();
		let pageCount;
		if(art.length%5 == 0){
			pageCount = art.length/5
		}else{
			pageCount = art.length/5 + 1
		}
		const articles = await MArticle.findAll({
			limit,
			offset,
			include: [{
				model: this.ctx.model.MArticleType,
				as: 'article_type',
				attributes:["name"],
			}]
		});
		const articles_detail = [];
		for(let article of articles){
			const createTime = await this.ctx.helper.getFullTime(article.created_at);
			const article_detail = await this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "content"]);
			article_detail.createTime = createTime;
			article_detail.type = article.article_type.name;
			//console.log("article.article_type.name",article.article_type.name);
			articles_detail.push(article_detail);
		}
		await this.ctx.render("/dashboard/article", {
			"articles": articles_detail,
			"page": 1,
			"pageCount": pageCount,
			"name": this.ctx.session.name
		});
	}
}
module.exports = dbIndexController;