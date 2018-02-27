'use strict';
const Controller = require("egg").Controller;
class dbArticleController extends Controller{
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
		const articles = await MArticle.findAll({limit, offset});
		const articles_detail = [];
		for(let article of articles){
			const createTime = await this.ctx.helper.getFullTime(article.created_at);
			const article_detail = await this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "content"]);
			article_detail.createTime = createTime;
			articles_detail.push(article_detail);
		}
		await this.ctx.render("/dashboard/article", {
			"articles": articles_detail,
			"page": 1,
			"pageCount": pageCount
		});
	}
	async addArticle(){
		await this.ctx.render("/dashboard/addArticle");
	}
	async updateArticle(){
		const {MArticle} = this.ctx.model;
		const {id} = this.ctx.params;
		const article = await MArticle.findById(id);
		const article_detail = await this.ctx.helper.getAttributes(article, [
			"id", "title", "img", "segment", "content"]);
		await this.ctx.render("/dashboard/updateArticle", {
			"article_detail" : article_detail
		});
	}
	async create(){
		const {MArticle} = this.ctx.model;
		const {img, title, segment, content} = this.ctx.request.body;
		const article = await MArticle.findOne({
			where:{title},
			attributes: ["title"],
		});
		if(article){
			this.ctx.throw(404, "article already exist");
		}
		await MArticle.create({img, title, segment, content});
		//console.log(file);
		const updateJson = {
			"action": "insert article",
			"info": "ok"
		};
		this.ctx.body = updateJson;
	}

	async update(){
		const {id} = this.ctx.params;
		const {MArticle} = this.ctx.model;
		const {title, segment, content} = this.ctx.request.body;
		const article = await MArticle.findById(id);
		if(!article){
			this.ctx.throw(404, "article not found");
		}
		await MArticle.update({title, segment, content},{
			where:{id}
		})
		const updateJson = {
			"action": "update article",
			"info": "ok"
		};
		this.ctx.body = updateJson;
	}

	async destroy(){
		const {id} = this.ctx.params;
		const {MArticle} = this.ctx.model;
		const article = await MArticle.findById(id);
		console.log(article);
		if(!article){
			this.ctx.throw(404, "article not found");
		}
		await MArticle.destroy({where:{id}});
		const updateJson = {
			"action": "delete article",
			"info": "ok"
		};
		this.ctx.body = updateJson;
	}

	async show(){
		let {id} = this.ctx.params;
		const {MArticle} = this.ctx.model;
		const limit=5;
		let offset;
		if(id == 1){
			offset = 0
		}else if(id > 1){
			offset = (id-1)*5
		}
		const art = await MArticle.findAll();
		let pageCount;
		if(art.length%5 == 0){
			pageCount = art.length/5
		}else{
			pageCount = art.length/5 + 1
		}
		const articles = await MArticle.findAll({limit, offset});
		const articles_detail = [];
		for(let article of articles){
			const createTime = await this.ctx.helper.getFullTime(article.created_at);
			const article_detail = await this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "content"]);
			article_detail.createTime = createTime;
			articles_detail.push(article_detail);
		}
		//this.ctx.body = articles_detail;
		await this.ctx.render('/dashboard/article', {
			"articles": articles_detail,
			"page": id,
			"pageCount":pageCount
		});
	}
	async getSignature(){
		console.log("getSignature");
		const {img} = this.ctx.request.body;
		const SFile = this.ctx.service.sFile;
		const {Authorization, uploadUrl} = await SFile.createSignature(img);
		this.ctx.body= {Authorization, uploadUrl};
	}
	async uploadImg(){
		const SFile = this.ctx.service.sFile;
		const img = await SFile.uploadOSS(this.ctx);
		console.log("img", img);
		this.ctx.body = img;
	}
}
module.exports = dbArticleController;