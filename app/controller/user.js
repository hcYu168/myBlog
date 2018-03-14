'use strict';
const Controller = require('egg').Controller;
class userController extends Controller{
	async index(){
		await this.ctx.render("/dashboard/login");
	}
	async create(){
		const {email, password} = this.ctx.request.body;
		const {MUser, MAuthorization} = this.ctx.model;
		const findUser = await MUser.findOne({where:{email}});
		console.log("email", email);
		console.log("22", findUser);
		if(!findUser){
			this.ctx.throw(404, "user not found")
		}
		const user = await MUser.findOne({
			where:{email, password}
		});
		if(!user){
			this.ctx.throw(404, "email or password was wrong");
		}
		console.log("user.id", user.id);
		const auth = await MAuthorization.findOne({
            where: {
                "types": user.types,
                "user_id": user.id
            }
        });
		this.ctx.session.id = user.id;
		this.ctx.session.name = auth.name;
        this.ctx.session.authId = auth.id;
		const loginJson = {
			"action": "user login",
			"info": "ok",
		}
		this.ctx.body = loginJson;
	}
	async regist(){
		await this.ctx.render("/dashboard/regist");
	}
	async doRegist(){
		const {email, password, phone} = this.ctx.request.body;
		const {MUser, MAuthorization} = this.ctx.model;
		const findUser = await MUser.findOne({
			where:{
				'$or':[
					{"email": email},
					{"phone": phone}
				],
				"password": {'$ne': null},
			}
		});
		if(findUser){
			this.ctx.throw(404, "email or phone was registed");
		}
		const findUser2 = await MUser.findOne({
			where:{
				'$or':[
					{"email": email},
					{"phone": phone}
				],
				"password": {'$eq': null},
			}
		});
		if(findUser2){
			await MUser.update({
				"email": email,
				"password": password,
				"phone": phone
			},{
				"id": findUser2.id
			});
		}else{
			await MUser.create({
				"email": email,
				"password": password,
				"phone": phone,
				"types": "email"
			});
		}
		const updateJson = {
			"action": "regist user",
			"info": "ok"
		}
		this.ctx.body = updateJson;
	}
	async logout(){
		this.ctx.session.id = null;
        this.ctx.session.name = null;
        this.ctx.session.authId = null;
		this.ctx.redirect("/blog/dashboard/login");
	}
}
module.exports = userController

/*
	账户密码登录方式， 账号直接用email或手机号，
	当一个用户用几种方式进行登录之后，有不同的头像和名字，
	还有独立的openid,这时候就得用他们共有的东西。
	我觉得是email或phone吧， 
	然后用哪个授权方式登录，出现的头像和名字就是登录的哪一个
	
	登录完之后 是用它现成的信息，还是每次授权读取信息的时候， 
	把这个信息再次更新到user表那里，然后需要什么信息就直接在
	这个user表直接读取，这样就会处于时时更新的状态，就是不知道
	会不会很耗资源
*/