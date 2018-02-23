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
			"id": this.ctx.session.id, //userID
			"name": this.ctx.session.name //authorization_name
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
			"id": this.ctx.session.id,
			"name": this.ctx.session.name
		}
		this.ctx.body = updateJson
	}

	async show(){
		const {id} = this.ctx.params; //originalId
		const {MUser, MArticle, MComment, MAuthorization} = this.ctx.model;
		const article = await MArticle.findById(id);
		if(!article){
			this.ctx.throw(404, "article not found");
		}
		const article_detail = await this.ctx.helper.getAttributes(article, [
			"id", "img", "title", "content", "auth", "pageView"]);
		const createTime = await this.ctx.helper.getFullTime(article.created_at);
		article_detail.createTime = createTime;
		const useres = await MComment.findAll({where:{
			"originalId": id,
			"originalType": 1,
			"rep_userId": {
				"$eq": null
			}
		}});
		article_detail.commentSum = useres.length;
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
					"originalType": 1,
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
		}
		await this.ctx.render("/blog/single", {
			"article": article_detail,
			"comments": comment_detail,
			"id": this.ctx.session.id,
			"name": this.ctx.session.name
		});
	}

	async list(){
		const {MArticle} = this.ctx.model;
		const limit = 10;
		const offset = 0;
		const sum = await MArticle.findAll({});
		const pageCount = Math.ceil(sum.length/10);
		const articles = await MArticle.findAll({limit, offset});
		let articles_detail = [];
		for(let article of articles){
			const article_detail = await this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment"]);
			const createTime = await this.ctx.helper.getFullTime(article.created_at);
			article_detail.createTime = createTime;
			articles_detail.push(article_detail);
		}
		//this.ctx.body = articles_detail;
		await this.ctx.render("/blog/articleList", {
			"articles_detail" : articles_detail,
			"page": 1,
			"pageCount": pageCount
		});
	}
	async pageShow(){
		const {MArticel} = this.ctx.model;
		const {id} = this.ctx.request.body;
		const limit = 10;
		let offset = 0;
		if(id>1){
			offset = (id-1)*10;
		}
		const sum = await MArticle.findAll({});
		const pageCount = Math.ceil(sum.length/10);
		const articles = await MArticle.findAll({limit, offset});
		let articles_detail = [];
		for(let article of articles){
			const article_detail = await this.ctx.helper.getAttributes(article, [
				"id", "img", "title", "segment"]);
			const createTime = await this.ctx.helper.getFullTime(article.created_at);
			article_detail.createTime = createTime;
			articles_detail.push(article_detail);
		} 
		await this.ctx.render("/blog/articleList", {
			"articles_detail" : articles_detail,
			"page": parseInt(id),
			"pageCount": pageCount
		});
	}
}
module.exports = articleController;

/*
评论
	每个人都能发表评论   userId 不为空， rep_userId 为空  
	每个人都可以多次进行评论别人，以及回复别人  评论别人 userId rep_userId都不为空
	评论的模式为 发起评论之后，其他人的所有评论都是在第二行， 
	如果是对其他人进行评论的话，那也是在下面 就多一个@就好了

	rep_userId 到底是要userid好，还是commentId好
	如果是userId 那就是每个人对userId 的内容，一目了然 但有个问题
	比如 A：aaaa   b->A : dasda c->b: asdasdasda 
	接着b: bbb  那之前c->b 会不会放到B这里来   如果加一个标签标识 应该就可以吧

	如果是commentId 那就是要对别人评论的话，评论的是谁的内容一目了然，
	但是获取评论的时候，只能获取上一级的，这样的话应该要循环获取，一级获取一级，
	一直到最上面那一级

*/