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

	config.security = {
    domainWhiteList: [],
		csrf:{
			enable:false
		}
	};

  config.cluster = {
    listen:{
      port:8080
    }
  }
	config.view = {
		defaultViewEngine: "ejs",
		defaultExtension: ".ejs"
	}  

  config.passportGithub = {
    key: '',
    secret: ''
  }

  config.aliyun = {
    accessKeyId: '',
    accessKeySecret: '',
  }

  config.session = {
    key: "rainchapter",
    maxAge: 5*3600*1000,
    httpOnly: true,
    encrypt: true
  }
  return config;
};
