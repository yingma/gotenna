var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:from/:to', function(req, res, next) {
	let from = parseInt(req.params.from);
	let to = parseInt(req.params.to);
	from = Math.min(from, images.length);
	to = Math.min(to + 1, images.length);

	if (from >= 0 && from <= to) {
		res.send(global.images.slice(from, to));
		return;
	}
	res.send([]);
});

router.get('/:from/:to/:width/:height', function(req, res, next) {
	let from = parseInt(req.params.from);
	let to = parseInt(req.params.to);
	let width = parseInt(req.params.width);
	let height = parseInt(req.params.height);

	let images = [];

	for (let i = 0; i < global.images.length; i++) {
		let imageUrl = global.images[i];
		let tokens = imageUrl.split("/");
		if (tokens.length <= 2 )
			continue;
		let imagewidth = parseInt(tokens[tokens.length - 2]);
		let imageheight = parseInt(tokens[tokens.length - 1]);
		if ((width === 0 || (width !== 0 && width === imagewidth))
			&& (height === 0 || (height !== 0 && height === imageheight))) {
			images.push(imageUrl);
		}
	}

	from = Math.min(from, images.length);
	to = Math.min(to + 1, images.length);
	
	if (from >= 0 && from <= to) {
		res.send(images.slice(from, to));
		return;
	}
	res.send([]);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send(global.images);
});

module.exports = router;
