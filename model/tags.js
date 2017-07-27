Tags = new Mongo.Collection("tags");


//for now - just being logged in should be good enough
Tags.allow({
    insert: function(userId) {
        return userId;
    },
    update: function(userId) {
        return userId;
    },
    remove: function(userId) {
        return userId;
    }
});


/*********
 * Stores tags for automatic look up on ngTags.
 * Actual tags of elments are stored on the element
 *
 *  Structure
 *  name: Name of Tag Collection - handle
 *  tagCollection: array of tagObjects
 *  *************/