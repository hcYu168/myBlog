"use strict";
const Service = require('egg').Service;
class userService extends Service{
	async register(user){
		const {MUser, MAuthorization} = this.ctx.model;
		const provider = user.provider;
		if(provider == "github"){
			let area="";
			let email = "";
			if(user.profile._json.location != "" || user.profile._json.location!= "undefined"){
				area = user.profile._json.location;
			}
			if(user.profile._json.email == "" || user.profile._json.email == "undefined"){
				this.ctx.throw("email or phone not found"); //这里要跳转到输入email或phone的号码,然后要保存下来
			}else{
				email = user.profile._json.email
			}
	    	await MAuthorization.create({
	    		"types": user.provider,
	    		"openid": user.id,
	    		"name": user.name,
	    		"area": area,
	    		"avatar": user.photo,
	    		"email": email
	    	});
	    	const findUser = await MUser.findOne({where: {"email": user.email}});
	    	if(!findUser){
		    	await MUser.create({
		    		"email": email,
		    		"types": provider
		    	});
		    	const newUser = await MUser.findOne({where:{
		    		"email": email
		    	}});
		    	await MAuthorization.update({
		    		"user_id" : newUser.id
		    	},{
		    		where:{
		    			"email": email,
		    			"types": provider
		    		}
		    	});
		    	return newUser;
	    	}else{
	    		await MAuthorization.update({
		    		"user_id" : findUser.id
		    	},{
		    		where:{
		    			"email": email,
		    			"types": provider
		    		}
		    	});
		    	return findUser;
	    	}
		}
	}
}
module.exports = userService;