const LocalStrategy = require('passport-local').Strategy;
module.exports = app => {
    /*app.passport.use(new LocalStrategy({
        passReqToCallback: true,
    }, (req, username, password, done) => {
        // format user
        const user = {
            provider: 'local',
            username,
            password,
        };
        debug('%s %s get user: %j', req.method, req.url, user);
        console.log("user", user);
        app.passport.doVerify(req, user, done);
    }));*/

    app.passport.verify(async (ctx, user) => {
        console.log(user.profile._json.email);
        console.log(user);
       // this.ctx.body = user;
       //查询授权登录的账号是否存在
        const auth = await ctx.model.MAuthorization.findOne({
            where:{  
              openid: user.id,
              types: user.provider,
            }  
        });
        if(!auth){
            //如果不存在就注册
            const newUser = await ctx.service.user.register(user);
            return newUser;
        }else{
            const existsUser = await ctx.model.MUser.findOne({where:{id: auth.user_id }});
            //console.log("existsUser", existsUser);
            await ctx.model.MUser.update({"type": user.provider},{where: {id: auth.user_id }})
            if (existsUser) {
              return existsUser;
            }
        }

    // call user service to register a new user

    });
    app.passport.serializeUser(async (ctx, user) => {
        console.log("user.id", user);
        const auth = await ctx.model.MAuthorization.findOne({
            where: {
                "types": user.types,
                "user_id": user.id
            }
        });
        ctx.session.id = user.id;
        ctx.session.name = auth.name;
        ctx.session.authId = auth.id;
        ctx.session.returnTo= "/blog/index";
        return user;
    });

    app.passport.deserializeUser(async (ctx, user) => {
        console.log("deserializeUser", user);
  });
};

/*
    为什么user和authorization都有了email，
    user_id还有没有必要存在authorization,
    如果突然换邮箱了，那就找不到了^^
*/