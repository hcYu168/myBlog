'use strict';
module.exports = app =>{
	const {STRING, INTEGER} = app.Sequelize;
	const MArticleType = app.model.define("articleType", {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {type: STRING}
	},{
		paranoid: true,
		tableName: "articleType",
		charset: "utf8",
		collate: "utf8_general_ci"
	});
	MArticleType.sync();
	return MArticleType;
}