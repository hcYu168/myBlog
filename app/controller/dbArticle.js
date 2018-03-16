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
			const createTime = this.ctx.helper.getFullTime(article.created_at);
			const article_detail = this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "content"]);
			article_detail.createTime = createTime;
			article_detail.type = article.article_type.name;
			//console.log("article.article_type.name",article.article_type.name);
			articles_detail.push(article_detail);
		}
		const {articleTypes_detail} = await this.ctx.service.articleType.show();
		console.log(articleTypes_detail);
		await this.ctx.render("/dashboard/article", {
			"articles": articles_detail,
			"page": 1,
			"pageCount": pageCount,
			"name": this.ctx.session.name,
			"articleType": articleTypes_detail,
		});
	}

	async addArticle(){
		const {MArticleType} = this.ctx.model;
		const articleTypes = await MArticleType.findAll({});
		const articleTypes_detail = [];
		for(let articleType of articleTypes){
			const articleType_detail = this.ctx.helper.getAttributes(articleType, [
				"id", "name"]);
			articleTypes_detail.push(articleType_detail);
		}
		await this.ctx.render("/dashboard/addArticle",{
			"articleType": articleTypes_detail,
			"name": this.ctx.session.name
		});
	}

	async updateArticle(){
		const {MArticle, MArticleType} = this.ctx.model;
		const {id} = this.ctx.params;
		const article = await MArticle.findOne({
			where:{id},
			include: [{
				model: this.ctx.model.MArticleType,
				as: "article_type"
			}]	
		});
		if(!article){
			this.ctx.throw(404, "article not found");
		}
		const article_detail = await this.ctx.helper.getAttributes(article, [
			"id", "title", "img", "segment", "content"]);
		article_detail.typeId = article.article_type.id;
		article_detail.typeName = article.article_type.name;
		console.log(article_detail.typeName);
		const articleTypes = await MArticleType.findAll({where:{
			id:{
				'$ne': article.article_type.id
			}
		}});
		const articleTypes_detail = [];
		for(let articleType of articleTypes){
			const articleType_detail = this.ctx.helper.getAttributes(articleType, [
				"id", "name"]);
			articleTypes_detail.push(articleType_detail);
		}
		await this.ctx.render("/dashboard/updateArticle", {
			"article_detail" : article_detail,
			"articleType": articleTypes_detail,
			"name": this.ctx.session.name
		});
	}
	async create(){
		const {ctx} = this;
		const {MArticle} = ctx.model;
		const createRule = {
			img: {type: 'string'},
			title: {type: 'string'},
			segment: {type: 'string'},
			content: {type: 'string'},
		};
		ctx.validate(createRule);		
		const {img, title, segment, content, typesId} = ctx.request.body;
		const article = await MArticle.findOne({
			where:{title},
			attributes: ["title"],
		});
		if(article){
			ctx.throw(404, "article already exist");
		}
		await MArticle.create({img, title, segment, content, typesId});
		//console.log(file);
		const updateJson = {
			"action": "insert article",
			"info": "ok"
		};
		ctx.body = updateJson;
	}

	async update(){
		const {ctx} = this;
		const {id} = ctx.params;
		const {MArticle} = ctx.model;
		const createRule = {
			img: {type: "string"},
			title: {type: "string"},
			segment: {type: "string"},
			content: {type: "string"},
		}
		ctx.validate(createRule);
		const {img, title, segment, content, typesId} = ctx.request.body;
		const article = await MArticle.findById(id);
		if(!article){
			ctx.throw(404, "article not found");
		}
		await MArticle.update({img, title, segment, content, typesId},{
			where:{id}
		})
		const updateJson = {
			"action": "update article",
			"info": "ok"
		};
		ctx.body = updateJson;
	}

	async destroy(){
		const {ctx} = this;
		const {id} = ctx.params;
		const {MArticle} = ctx.model;
		const article = await MArticle.findById(id);
		console.log(article);
		if(!article){
			ctx.throw(404, "article not found");
		}
		await MArticle.destroy({where:{id}});
		const updateJson = {
			"action": "delete article",
			"info": "ok"
		};
		ctx.body = updateJson;
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
		const articles = await MArticle.findAll({
			limit,
			offset,
			include: [{
				model: this.ctx.model.MArticleType,
				as: "article_type",
				attributes: ["name"],
			}]
		});
		const articles_detail = [];
		for(let article of articles){
			const createTime =  this.ctx.helper.getFullTime(article.created_at);
			const article_detail = this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "content"]);
			article_detail.createTime = createTime;
			article_detail.type = article.article_type.name
			articles_detail.push(article_detail);
		}
		const {articleTypes_detail} = await this.ctx.service.articleType.show();
		await this.ctx.render('/dashboard/article', {
			"articles": articles_detail,
			"page": id,
			"pageCount":pageCount,
			"name": this.ctx.session.name,
			"articleType": articleTypes_detail
		});
	}

	async search(){
		const {id} = this.ctx.params;
		console.log("ds",id);
		const {MArticle, MArticleType} = this.ctx.model;
		const limit=5;
		const offset=0;
		const articles = await MArticle.findAll({
			where: {"typesId":id},
			limit,
			offset,
			include:[{
				model: MArticleType,
				as: "article_type",
			}]
		});
		if(!articles){
			this.ctx.throw(404, "该类型文章不存在");
		}
		let pageCount;
		if(articles.length%5 == 0){
			pageCount = articles.length/5
		}else{
			pageCount = articles.length/5 + 1
		}
		const articles_detail = [];
		for(let article of articles){
			const createTime = this.ctx.helper.getFullTime(article.created_at);
			console.log("createTime", createTime);
			const article_detail = this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "content"]);
			article_detail.createTime = createTime;
			article_detail.type = article.article_type.name;
			console.log("article_detail.type", article_detail.type);
			//console.log("article.article_type.name",article.article_type.name);
			articles_detail.push(article_detail);
		}
		const {articleTypes_detail} = await this.ctx.service.articleType.show();
		//this.ctx.body = articles_detail;
		await this.ctx.render("/dashboard/article", {
			"articles": articles_detail,
			"page": 1,
			"pageCount": pageCount,
			"name": this.ctx.session.name,
			"articleType": articleTypes_detail,
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