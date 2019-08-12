'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.all('/hook', controller.home.hook);

  app.passport.mount('github');
  //dashboard
  router.all("/ueditor/ue", "ueditor.index");
  //index
  router.resources("dbIndex", "/blog/dashboard/index", app.controller.dbIndex);

  //article
  router.resources("dbArticle", "/blog/dashboard/article", app.controller.dbArticle);
  router.get("/blog/dashboard/addArticle", "dbArticle.addArticle");
  router.get("/blog/dashboard/updateArticle/:id", "dbArticle.updateArticle");
  router.get("/blog/dashboard/searchArticle/:id", "dbArticle.search");
  router.post("/blog/getSignature", "dbArticle.getSignature");
  router.post("/blog/uploadImg", "dbArticle.uploadImg");

  //user
  router.resources("dbUser", "/blog/dashboard/user", app.controller.dbUser);
  router.resources("user", "/blog/dashboard/login", app.controller.user);
  router.get("/blog/dashboard/regist", "user.regist");
  router.post("/blog/dashboard/regist", "user.doRegist");
  router.get("/blog/dashboard/logout", "user.logout");

  //articleType
  router.resources("dbArticleType", "/blog/dashboard/articleType", app.controller.dbArticleType);

  //comment
  router.resources("dbComment", "/blog/dashboard/comment", app.controller.dbComment);
  router.get("/blog/dashboard/comment/:id/show/:pageId", "dbComment.commentPageShow");

  //blog
  //index
  router.resources("index", "/blog/index", app.controller.index);

  //article
  router.resources("article", "/blog/article", app.controller.article);
  router.post("/blog/article/createReply", "article.createReply");
  router.get("/blog/article/page/list/:id", "article.list");
  router.get("/blog/article/page/:id", "article.pageShow");

  //about me
  router.resources("about", "/blog/about", app.controller.about);

  //contact
  router.get("/blog/contact/index", "contact.index");

};
