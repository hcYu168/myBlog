'use strict';

// had enabled by egg
// exports.static = true;
exports.sequelize = {
	enable: true,
	package: 'egg-sequelize'
};

exports.ejs = {
	enable: true,
	package: 'egg-view-ejs'
};

exports.passport = {
	enable: true,
	package: 'egg-passport'
};

exports.passportGithub = {
	enable: true,
	package: 'egg-passport-github',
}
/*exports.passportQQ = {
	enable: true,
	package: 'egg-passport-qq'
}*/