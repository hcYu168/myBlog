'use strict';
const Controller = require("egg").Controller;
class indexController extends Controller{
	async index(){
		const {MArticle} = this.ctx.model;
		const limit=4;
		const offset=0;
		const articles = await MArticle.findAll({limit, offset});
		const articles_detail = [];
		for(let article of articles){
			const createTime = await this.ctx.helper.getFullTime(article.created_at);
			const article_detail = await this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "content"]);
			article_detail.createTime = createTime;
			articles_detail.push(article_detail);
		}
		await this.ctx.render("/blog/index", {
			"articles": articles_detail,
		});
	}
}
module.exports = indexController;