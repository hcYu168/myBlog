'use strict';
module.exports = {
	//递归式获取所需属性，不改变原对象
	getAttributes(source, path) {
    if (!path) {
      return source;
    }
   // console.log('source', source);
    const target = {};
    this.ctx.helper.getAttributesHelper(target, source, path);
  //  console.log('target', target);
    return target;
  },

  getAttributesHelper(target, source, path) {
    if (Array.isArray(source)) {
      for (let i = 0; i < source.length; i++) {
        target.push({});
      //  console.log('source1', source[i]);
        this.ctx.helper.getAttributesHelper(target[i], source[i], path);
      }
    } else if (source instanceof Object) {
      if (Array.isArray(path)) {
        for (let each of path) {
      //    console.log('source2', each);
          this.ctx.helper.getAttributesHelper(target, source, each);
        }
      } else if (path instanceof Object) {
       // console.log('2222222222222222');
        for (let attr in path) {
          if (Array.isArray(source[attr])) {
            target[attr] = [];
          } else if (source[attr] instanceof Object) {
            target[attr] = {};
          }
          this.ctx.helper.getAttributesHelper(target[attr], source[attr], path[attr]);
        }
      } else if (typeof path === 'string') {
     //   console.log('444444' ,path);
     //   console.log('333333', source[path]);
        target[path] = source[path];
      } else {
        // TODO use egg log
        // TODO throw error
        console.log('error');
      }
    } else {
      // TODO use egg log
      // TODO throw error
      console.log('error');
    }
  },

  getFullTime(time){
    const year = time.getFullYear();
    const month = time.getMonth()+1;
    const date = time.getDate();
    const hours = time.getHours();
    const minute = time.getMinutes();
   // console.log(typeof minute);
    if(minute < 10){
      return `${year}-${month}-${date} ${hours}:0${minute}`;
    }else{
      return `${year}-${month}-${date} ${hours}:${minute}`;
    }
   // const seconds = time.getSeconds()
    
  }
}
/*sequelize返回的值是user(promise形式), user[id]就能获取里面的值
获取JSON类型  就要用递归的方式
把user 和 user.prototype 传入一个getAttributesHelper, 
如果user是一个对象，把user.prototype放入数组里面， 每遍历一个，就把那个
再次传入getAttributesHelper, 单独取出来放入target里面，再返回回去

const target = {};
target[id] = 5;
target[userName] = '张三';
target[password] = '123';
==>
{
  id: 5,
  userName: '张三',
  password: '123'
}
*/
