'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.redirect("/blog/index");
  }
}

module.exports = HomeController;
