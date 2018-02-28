'use strict';
const Subscription = require('egg').Subscription;
class TestCache extends Subscription{
	static get schedule(){
		return {
			interval: '10s',
			type: 'worker',
		}
	}
	async subscribe(){
		console.log("呵呵呵呵");
	}
	async subscribe(){
		console.log("哈哈哈哈");
	}
}
module.exports = TestCache;