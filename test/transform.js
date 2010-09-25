
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
	csv = require('csv');

module.exports = {
	'Test reorder fields': function(assert){
		var count = 0;
		csv()
		.fromPath(__dirname+'/transform/reorder.in')
		.toPath(__dirname+'/transform/reorder.tmp')
		.transform(function(data,index){
			assert.strictEqual(count,index);
			count++;
			data.unshift(data.pop());
			return data;
		})
		.on('end',function(){
			assert.strictEqual(2,count);
			assert.equal(
				fs.readFileSync(__dirname+'/transform/reorder.out').toString(),
				fs.readFileSync(__dirname+'/transform/reorder.tmp').toString()
			);
			fs.unlink(__dirname+'/transform/reorder.tmp');
		});
	},
	'Test empty': function(assert){
		var count = 0;
		csv()
		.fromPath(__dirname+'/transform/empty.in')
		.toPath(__dirname+'/transform/empty.tmp')
		.transform(function(data,index){
			assert.strictEqual(count,index);
			count++;
			return null;
		})
		.on('end',function(){
			assert.strictEqual(2,count);
			assert.equal(
				fs.readFileSync(__dirname+'/transform/empty.out').toString(),
				fs.readFileSync(__dirname+'/transform/empty.tmp').toString()
			);
			fs.unlink(__dirname+'/transform/empty.tmp');
		});
	},
	'Test return object': function(assert){
		// we don't define columns
		// recieve and array and return an object
		// also see the columns test
		csv()
		.fromPath(__dirname+'/transform/object.in')
		.toPath(__dirname+'/transform/object.tmp')
		.transform(function(data,index){
			return {field_1:data[4],field_2:data[3]};
		})
		.on('end',function(count){
			assert.strictEqual(2,count);
			assert.equal(
				fs.readFileSync(__dirname+'/transform/object.out').toString(),
				fs.readFileSync(__dirname+'/transform/object.tmp').toString()
			);
			fs.unlink(__dirname+'/transform/object.tmp');
		});
	},
	'Test return string': function(assert){
		csv()
		.fromPath(__dirname+'/transform/string.in')
		.toPath(__dirname+'/transform/string.tmp')
		.transform(function(data,index){
			return (index>0 ? ',' : '') + data[4] + ":" + data[3];
		})
		.on('end',function(count){
			assert.strictEqual(2,count);
			assert.equal(
				fs.readFileSync(__dirname+'/transform/string.out').toString(),
				fs.readFileSync(__dirname+'/transform/string.tmp').toString()
			);
			fs.unlink(__dirname+'/transform/string.tmp');
		});
	}
}