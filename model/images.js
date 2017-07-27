/**
 * Images
 * A GridFS collection for uploading partner logos and images into the database
 * @type {FS.Collection}
 */

Images = new FS.Collection("images", {
    stores: [
        new FS.Store.GridFS("original", {path: "~/images"})
    ],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});


if (Meteor.isServer) {
    Images.allow({
        insert: function(userId) {
            return userId;
        },
        update: function(userId) {
            return userId;
        },
        remove: function(userId) {
            return userId;
        },
        download: function(userId) {
            return userId;
        }
    });



}