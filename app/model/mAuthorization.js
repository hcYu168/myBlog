'use strict';
module.exports = app =>{
	const {INTEGER, STRING, ENUM} = app.Sequelize;
	const MAuthorization = app.model.define("authorization", {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: INTEGER,
		},
		types: {
			type: ENUM("github", "weibo", "qq", "telphone", "email")
		},
		openid: {type: STRING},
		name: {type: STRING},
		age: {type: STRING(10)},
		sex: {type: STRING(10)},
		country: {type: STRING(50)},
		city: {type: STRING(50)},
		area: {type: STRING(50)},
		avatar: {type: STRING(1000)},
		phone: {type:STRING},
		email: {type: STRING},
	},{
		paranoid: true,
		tableName: 'authorization',
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});
	MAuthorization.associate = function(){
		app.model.MAuthorization.belongsTo(app.model.MUser,{
			as: "user_auth",
			foreignKey: "user_id"
		})
	}
	MAuthorization.sync();
	return MAuthorization;
}