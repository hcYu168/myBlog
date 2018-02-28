'use strict';
const Subscription = require('egg').Subscription;
class Test2Cache extends Subscription{
	static get schedule(){
		return {
			interval: '10s',
			type: 'worker',
		}
	}
	async subscribe(){
		console.log("gggggg");
	}
}
module.exports = Test2Cache;