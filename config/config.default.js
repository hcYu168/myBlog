'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1516781348308_2736';

  // add your config here
  config.middleware = ['userAuth'];

  config.userAuth = {
    match:[
      "/blog/dashboard/*",
    ]
  }

  config.sequelize = {
  	dialect: "mysql",
  	database: "blog",
  	host: "localhost",
  	port: "3306",
  	username: "root",
  	password: "root"
  };

	config.security = {
    domainWhiteList: [
        'http://localhost:7001',
        'http://127.0.0.1:7001'
      ],
		csrf:{
			enable:false
		}
	};

	config.view = {
		defaultViewEngine: "ejs",
		defaultExtension: ".ejs"
	}  

  config.passportGithub = {
    key: '497eac76fa96a95ea854',
    secret: 'b5ca765f41b54d604a5fc73c6c55160ccc89f2e3'
  }

  config.aliyun = {
    accessKeyId:"LTAIU5bEfWxPzy6a",
    accessKeySecret: "phkO495bgSJyYOr0LP25O165kpwr5A",
  }

  config.session = {
    key: "rainchapter",
    maxAge: 5*3600*1000,
    httpOnly: true,
    encrypt: true
  }
  return config;
};
