'use strict';
module.exports = app =>{
	return async function(ctx, next){
		if(ctx.req.url == "/blog/dashboard/login"){
			await next();
		}else{
			if(ctx.session.id == null || ctx.session.id == "" || ctx.session.name == "" || ctx.session.name == null){
				ctx.redirect("/blog/dashboard/login");
			}else{
				await next();
			}
		}
	}
}