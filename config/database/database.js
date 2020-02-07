const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/inpi_core',{ 
	useNewUrlParser: true, 
	useUnifiedTopology: true 
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
