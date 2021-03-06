'use strict';
module.exports = app =>{
	const {STRING, INTEGER} = app.Sequelize;
	const MUser = app.model.define("user", {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		phone: {type:STRING},
		email: {type: STRING},
		password:{
			type: STRING,
		},
		types: {type: STRING},
	},{
		paranoid: true,
		tableName: "user",
		charset: "utf8",
		collate: "utf8_general_ci"
	});
	MUser.associate = function(){
		app.model.MUser.hasOne(app.model.MAuthorization, {
			as: "auth_user",
			foreignKey: "user_id"
		});
	}
	MUser.sync();
	return MUser;
}