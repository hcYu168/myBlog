'use strict';
module.exports = app =>{
	const {INTEGER, STRING, TEXT} = app.Sequelize;
	const MArticle = app.model.define('article', {
		id: {
				type: INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
		img: {
			type: STRING
		},
		title: {
			type: STRING
		},
		segment:{type: STRING},
		content:{
			type: TEXT
		},
		auth:{
			type: STRING
		},
		pageView: {
			type: INTEGER,
			defaultValue: 0
		},
		typesId: {
			type: STRING, //以后可能会增加多种类别
		}
	},{
		paranoid: true,
		tableName: 'article',
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});
	MArticle.sync();
	return MArticle;
}