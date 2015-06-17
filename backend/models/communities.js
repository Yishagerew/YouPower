'use strict';

//var config = require('../config');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Community Schema
var CommunitySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  //refer challenge schema
  challenges: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true
    }
  ],
  // refer actions schema
  actions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Action',
      required: true
    }
  ],
  // refer user schema
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
});

var Community = mongoose.model('Community', CommunitySchema);

// create community entity

exports.create = function(community, cb) {
  Community.create({
    name: community.name,
    challenges: community.challenges,
    actions: community.actions
  }, cb);
};

// get community information

exports.get = function(id, cb) {
  Community.findOne({
    _id: id
  }, function(err, community) {
    if (err) {
      cb(err);
    } else if (!community) {
      cb('Community not found');
    } else {
      community = community.toObject();
      cb(null, community);
    }
  });
};

//add member to the Community

exports.addMember = function(id, userId, cb) {
  Community.findById({
    _id: id
  }, function(err, community) {
    if (err) {
      cb(err);
    } else if (!community) {
      cb('Community not found');
    } else {
      community.members.push(userId);
      community.save(cb);
    }
  });
};

//remove member from  Community

exports.removeMember = function(id, userId, cb) {
  Community.findById({
    _id: id
  }, function(err, community) {
    if (err) {
      cb(err);
    } else if (!community) {
      cb('Community not found');
    } else {
      community.members.remove(userId);
      community.save(cb);
    }
  });
};

//return top actions in community- "actions with rating > 3"- need to verify this
exports.topActions = function(id, cb) {
  Community
  .find({_id: id})
  .where('Community.actions.ratings.rating')
  .gt(3)
  .populate('actions')
  .exec(function(err, actions) {
    if (err) {
      cb(err);
    } else {
      cb(actions);
    }
  });
};

// delete community
exports.delete = function(id, cb) {
  Community.remove({
    _id: id
  }, cb);
};

exports.all = function(limit, skip, cb) {
  Community
  .find({})
  .skip(skip)
  .limit(limit)
  .select('name _id')
  .exec(function(err, communities) {
    cb(err, communities);
  });
};

exports.Community = mongoose.model('Community', CommunitySchema);