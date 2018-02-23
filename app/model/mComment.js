'use strict';
module.exports = app =>{
	const {STRING, INTEGER} = app.Sequelize;
	const MComment = app.model.define("comment", {
		id: {
			type: INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		userId: {type: INTEGER},
		rep_userId: {type: INTEGER},
		userImg: {type: STRING},
		userName: {type: STRING},
		content: {type: STRING},
		originalId: {type: STRING},
		originalType: {
			type: INTEGER,
			defaultValue: 1,
		},
		goods: {
			type: INTEGER,
			defaultValue: 0, //点赞次数 默认为0
		},
		comment_state: {
			type: INTEGER,
			defaultValue: 0, //默认为0，发表评论的id, 而不是回复的id
		},

	},{
		paranoid: true,
		tableName: "comment",
		charset: 'utf8',
		collate: 'utf8_general_ci'
	});
	/*MComment.associate = function(){
		app.model.MComment.hasOne(app.model.MComment,{
			as: "rep_comment",
			foreignKey: "rep_userId"
		})
	}*/
	MComment.associate = function(){
		app.model.MComment.belongsTo(app.model.MUser, {
			as: "user_comment",
			foreignKey: "userId"
		});
		app.model.MComment.belongsTo(app.model.MUser, {
			as: "repUser_comment",
			foreignKey: "rep_userId"
		});
	}
	MComment.sync();
	return MComment;
}
// id, userId, rep_userId, user_img, content, originalId, originalType, goods