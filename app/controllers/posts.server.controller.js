'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Post = mongoose.model('Post'),
	Response = require('../lib/response'),
	_ = require('lodash');

/**
 * Create a Post
 */
exports.create = function(req, res) {
	var post = new Post(req.body),
	    response = new Response(res);
	    
	post.user = req.user;

	post.save(function(err) {
		if (err) {
			return response.error(errorHandler.getErrorMessage(err));
		} else {
			return response.data(post);
		}
	});
};

/**
 * Show the current Post
 */
exports.read = function(req, res) {
	res.jsonp(req.post);
};

/**
 * Update a Post
 */
exports.update = function(req, res) {
	var post = req.post ;

	post = _.extend(post , req.body);

	post.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/**
 * Delete an Post
 */
exports.delete = function(req, res) {
	var post = req.post ;

	post.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(post);
		}
	});
};

/**
 * List of Posts
 */
exports.list = function(req, res) { Post.find().sort('-created').populate('user', 'displayName').exec(function(err, posts) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(posts);
		}
	});
};

/**
 * Post middleware
 */
exports.postByID = function(req, res, next, id) { Post.findById(id).populate('user', 'displayName').exec(function(err, post) {
		if (err) return next(err);
		if (! post) return next(new Error('Failed to load Post ' + id));
		req.post = post ;
		next();
	});
};

/**
 * Post authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.post.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};