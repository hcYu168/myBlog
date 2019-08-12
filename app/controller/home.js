'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.redirect("/blog/index");
  }

  async hook() {
    this.ctx.body = 200;
  }
}

module.exports = HomeController;
