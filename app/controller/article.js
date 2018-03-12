'use strict';
const Controller = require("egg").Controller;
class articleController extends Controller{
	async create(){
		const {userId, userName, content, originalId} = this.ctx.request.body;
		const {MUser, MAuthorization, MComment} = this.ctx.model;
		const user = await MUser.findById(userId);
		if(!user){
			this.ctx.throw(404, "user not found");
		}
		const auth = await MAuthorization.findById(this.ctx.session.authId);
		const userImg = auth.avatar;
		await MComment.create({userId, userImg, userName, content, originalId});
		const updateJson = {
			"action": "add comment",
			"info": "ok",
			//"id": this.ctx.session.id, //userID
			//"name": this.ctx.session.name //authorization_name
		}
		this.ctx.body = updateJson
	}

	async createReply(){
		const {userId, rep_userId, userName, content, originalId, comment_state} = this.ctx.request.body;
		const {MUser,MAuthorization, MComment} = this.ctx.model;
		const user = await MUser.findById(userId);
		if(!user){
			this.ctx.throw(404, "user not found");
		}
		const auth = await MAuthorization.findById(this.ctx.session.authId);
		const userImg = auth.avatar;
		await MComment.create({userId, rep_userId, userImg, userName, content, originalId, comment_state});
		const updateJson = {
			"action": "add replyComment",
			"info": "ok",
			"originalId": originalId,
			//"id": this.ctx.session.id,
			//"name": this.ctx.session.name
		}
		this.ctx.body = updateJson
	}

	async show(){
		const {id} = this.ctx.params; //originalId
		const {MArticle, MAuthorization} = this.ctx.model;
		let article = await MArticle.findOne({
			where:{id},
			attributes: ["pageView"],
		});
		if(!article){
			this.ctx.throw(404, "article not found");
		}
		await MArticle.update({
			pageView: article.pageView+1
		},{
			where:{id}
		});
		article = await MArticle.findOne({
			where:{id},
			include: [{
				model: this.ctx.model.MArticleType,
				as: "article_type",
				attributes: ["id", "name"]
			}]
		});
		const {WordPress, AboutMe} = await this.ctx.service.articleType.types();
		if(!article){
			this.ctx.throw(404, "article not found");
		}
		const article_detail = await this.ctx.helper.getAttributes(article, [
			"id", "img", "title", "content", "auth", "pageView"]);
		const createTime = await this.ctx.helper.getFullTime(article.created_at);
		article_detail.createTime = createTime;
		article_detail.typeName = article.article_type.name;
		/*const useres = await MComment.findAll({where:{
			"originalId": id,
			"originalType": article.article_type.id,
			"rep_userId": {
				"$eq": null
			}
		}});*/
		/*article_detail.commentSum = useres.length;
		const comment_detail = [];
		let users_detail = [];
		//let repUsers_detail = [];
		//this.ctx.body = useres;
		for(let i=0; i< useres.length; i++){
			const user_detail = await this.ctx.helper.getAttributes(useres[i], [
				"id", "userId", "userImg", "userName", "content", "originalType", "originalId", "comment_state"]);
			const createTime = await this.ctx.helper.getFullTime(useres[i].created_at);
			user_detail.createTime = createTime;
			console.log("useres[i].id", useres[i].id)
			const repUseres = await MComment.findAll({
				where:{
					"originalId": id,
					"originalType": article.article_type.id,
					"comment_state": useres[i].id
				},
				include:[{
					model: MUser,
					as: "repUser_comment",
					attributes: ["id", "types"],
				}]
			});
			users_detail.push(user_detail);
		    //this.ctx.body = repUseres;
			if(repUseres.length > 0){
				for(let j=0; j<repUseres.length; j++){
					console.log("repUseres.length", repUseres[j].repUser_comment.id);
					const auth = await MAuthorization.findOne({
						where:{
							"user_id": repUseres[j].repUser_comment.id,
							"types": repUseres[j].repUser_comment.types
						}
					});
					const repUser_detail = await this.ctx.helper.getAttributes(repUseres[j], [
						"id", "userId", "rep_userId", "userImg", "userName", "content", "originalType", "originalId", "comment_state"]);
					console.log("repUser_detail", repUser_detail);
					const createTime2 = await this.ctx.helper.getFullTime(repUseres[j].created_at);
					repUser_detail.createTime = createTime2;
					repUser_detail.repUser = auth.name;
					users_detail.push(repUser_detail);
				}
				//users_detail.push(repUsers_detail);
				//repUsers_detail=[];
			}
			comment_detail.push(users_detail);
			users_detail = [];
		}*/
		const {recentArticles_detail, wordPressArticles_detail} = await this.ctx.service.sidebar.getSidebarContent(); 
		await this.ctx.render("/blog/single", {
			"article": article_detail,
			//"comments": comment_detail,
			"wordPress": WordPress,
			"aboutMe": AboutMe,
			"wordPressArticles": wordPressArticles_detail,
			"recentArticles": recentArticles_detail
			//"id": this.ctx.session.id,
			//"name": this.ctx.session.name
		});
	}

	async list(){
		const {MArticle} = this.ctx.model;
		const {id} = this.ctx.params; // articleType_id
		const limit = 10;
		const offset = 0;
		const sum = await MArticle.findAll({});
		const pageCount = Math.ceil(sum.length/10);
		const articles = await MArticle.findAll({
			limit,
			offset,
			include: [{
				model: this.ctx.model.MArticleType,
				as: "article_type",
				where:{id},
				attributes: ["name"]
			}]
		});
		let articles_detail = [];
		for(let article of articles){
			const article_detail = await this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "auth", "pageView"]);
			const createTime = await this.ctx.helper.getFullTime(article.created_at);
			article_detail.createTime = createTime;
			article.typeName = article.article_type.name;
			articles_detail.push(article_detail);
		}
		const {WordPress, AboutMe} = await this.ctx.service.articleType.types();
		const {recentArticles_detail, wordPressArticles_detail} = await this.ctx.service.sidebar.getSidebarContent(); 
		await this.ctx.render("/blog/articleList", {
			"articles_detail" : articles_detail,
			"page": 1,
			"pageCount": pageCount,
			"wordPress": WordPress,
			"aboutMe": AboutMe,
			"wordPressArticles": wordPressArticles_detail,
			"recentArticles": recentArticles_detail
		});
	}
	async pageShow(){
		const {MArticle} = this.ctx.model;
		const {id} = this.ctx.request.body;
		const limit = 10;
		let offset = 0;
		if(id>1){
			offset = (id-1)*10;
		}
		const sum = await MArticle.findAll({});
		const pageCount = Math.ceil(sum.length/10);
		const articles = await MArticle.findAll({
			limit, 
			offset,
			include: [{
				model: this.ctx.model.MArticleType,
				as: "article_type",
				attributes: ["name"]
			}]
		});
		let articles_detail = [];
		for(let article of articles){
			const article_detail = await this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment", "auth", "pageView"]);
			const createTime = await this.ctx.helper.getFullTime(article.created_at);
			article_detail.createTime = createTime;
			article.typeName = article.article_type.name;
			articles_detail.push(article_detail);
		}
		const {WordPress, AboutMe} = await this.ctx.service.articleType.types();
		const {recentArticles_detail, wordPressArticles_detail} = await this.ctx.service.sidebar.getSidebarContent(); 
		await this.ctx.render("/blog/articleList", {
			"articles_detail" : articles_detail,
			"page": parseInt(id),
			"pageCount": pageCount,
			"wordPress": WordPress,
			"aboutMe": AboutMe,
			"wordPressArticles": wordPressArticles_detail,
			"recentArticles": recentArticles_detail
		});
	}
}
module.exports = articleController;