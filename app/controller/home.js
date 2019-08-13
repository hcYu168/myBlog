'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.redirect("/blog/index");
  }

  async hook() {
    // console.log('a', this.ctx.request.body);
    this.ctx.body = 200;
  }
}

module.exports = HomeController;
