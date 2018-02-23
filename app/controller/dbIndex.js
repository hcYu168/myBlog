'use strict';
const Controller = require("egg").Controller;
class dbIndexController extends Controller{
	async index(){
		await this.ctx.render("/dashboard/index");
	}
}
module.exports = dbIndexController;