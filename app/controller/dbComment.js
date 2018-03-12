'use strict';
const Controller = require("egg").Controller;
class commentController extends Controller{
		async show(){
			const {id} = this.ctx.params;
			const {MArticle, MComment} = this.ctx.model;
			const limit = 3;
			const article = await MArticle.findOne({where:{id}});
			if(!article){
				this.ctx.throw(404, "article not found");
			}
			const useres = await MComment.findAll({
				where:{
					"originalId": id,
					"originalType": article.typesId,
					"userId": {
						'$ne': null
					}
				},
				attributes: ["userId", "rep_userId", "created_at"],
				group: "userId",
				order: [
					["created_at", "DESC"]
				]
			});
			const commentSum = useres.length;
			const pageCount = Math.ceil(commentSum/3);
			const comments = [];
			let useres_detail = [];
			for(let i=0; i<commentSum; i++){
				if(i == 3){
					break;
				}
				const user_comment = await MComment.findAll({
					where: {
						$or: [
							{"userId": useres[i].userId},
							{"rep_userId": useres[i].rep_userId}
						],
						"originalId": id,
						"originalType": article.typesId,
					}
				});
				for(let j=0; j<user_comment.length; j++){
					const createTime = this.ctx.helper.getFullTime(user_comment[j].created_at);

					const user_comment_detail = this.ctx.helper.getAttributes(user_comment[j],
						["id", "userId", "rep_userId", "userImg", "userName", "content", "originalId", "originalType"]);
					user_comment_detail.createTime = createTime;
					useres_detail.push(user_comment_detail);
				}
				comments.push(useres_detail);
				useres_detail = [];
			}
			//this.ctx.body = comments;
			await this.ctx.render("/dashboard/comment", {
				"comments": comments,
				"page": 1,
				"pageCount": pageCount,
				"article_id": id
			});
		}
		async commentPageShow(){
			const {id, pageId} = this.ctx.params //comment_id;
			const {MArticle, MComment} = this.ctx.model;
			const article = await MArticle.findOne({where:{id}});
			if(!article){
				this.ctx.throw(404, "article not found");
			}
			const limit = 3;
			const useres = await MComment.findAll({
				where:{
					"originalId": id,
					"originalType": article.typesId,
					"userId": {
						'$ne': null
					}
				},
				attributes: ["userId", "rep_userId", "created_at"],
				group: "userId",
				order: [
					["created_at", "DESC"]
				]
			});
			const commentSum = useres.length;
			const pageCount = Math.ceil(commentSum/3);
			let current = (pageId-1)*2;
			let next = (pageId)*2;
			const comments = [];
			let useres_detail = [];
			for(current; current<commentSum; current++){
				if(current == next){
					break;
				}
				const user_comment = await MComment.findAll({
					where: {
						$or: [
							{"userId": useres[current].userId},
							{"rep_userId": useres[current].rep_userId}
						],
						"originalId": id,
						"originalType": article.typesId,
					}
				});
				for(let j=0; j<user_comment.length; j++){
					const createTime = this.ctx.helper.getFullTime(user_comment[j].created_at);

					const user_comment_detail = this.ctx.helper.getAttributes(user_comment[j],
						["id", "userId", "rep_userId", "userImg", "userName", "content", "originalId", "originalType"]);
					user_comment_detail.createTime = createTime;
					useres_detail.push(user_comment_detail);
				}
				comments.push(useres_detail);
				useres_detail = [];
			}
			await this.ctx.render("/dashboard/comment", {
				"comments": comments,
				"page": pageId,
				"pageCount": pageCount,
				"article_id": id
			});
		}
		async destroy(){
			const {id} = this.ctx.params //comment_id;
			const {userId, originalId} = this.ctx.request.body;//comment_uId
			const {MArticle, MComment} = this.ctx.model;
			const article = await MArticle.findOne({where: {
				"id": originalId
			}});
			console.log("sdasds",id);
			if(!article){
				this.ctx.throw(404, "article not found");
			} 
			const firstComment = await MComment.findOne({where:{
				"userId" : userId,
				"originalId" : originalId,
				"originalType" : article.typesId,
			}})
			console.log("originalId", originalId);
			//console.log("comment_originalId", firstComment.comment_originalId);
			
			if(id == firstComment.id){
				await MComment.destroy({where:{
					$or:[
						{"userId" : userId},
						{"rep_userId" : userId}
				    ],
				    "originalId" : originalId,
					"originalType" : 1,
				}});
			}else{
				await MComment.destroy({where:{id}});
			}
			const updateJson = {
				"action" : "delete comment",
				"info" : "ok",
				"originalId" : originalId //原贴ID
			};
			this.ctx.body = updateJson;
		}
}
module.exports = commentController;