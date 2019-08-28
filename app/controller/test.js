'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async echo() {
    console.log('dasdsdadsdssaddasas');
    console.log('222222222');
    console.log('333333333');
    console.log('444444444');
  }
}

module.exports = TestController;
