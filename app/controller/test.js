'use strict';

const Controller = require('egg').Controller;

class TestController extends Controller {
  async echo() {
    console.log('dasdas');
  }
}

module.exports = TestController;
