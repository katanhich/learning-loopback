module.exports = function(Book) {

	Book.findOnAmazon = function (isbn, callback) {
		console.log('xxxxxxxx')
		console.log(isbn)
		Book.find({
	    	where: {
	        	isbn: isbn
	      	},
	      	fields: {
	      		id: 1, isbn: 1, name: 1
	      	}
	    }, callback);
	};

	Book.remoteMethod("findOnAmazon", 
		{
			accepts: {arg: 'isbn', type: 'string', required: true},
			returns: {
				arg: 'status', type: 'string', root: true, description: 'return value'
			},
			http: {
				verb: 'post', path: '/findOnAmazon'
			}
		}
	);
};
