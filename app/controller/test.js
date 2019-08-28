'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async echo() {
    console.log('dasdsdadsdssaddasas');
  }
}

module.exports = TestController;
