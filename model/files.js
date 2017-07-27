/**
 * Files
 * A GridFS collection for uploading files that are pointed to from logentries
 * @type {FS.Collection}
 */

Files = new FS.Collection("files", {
    stores: [
        new FS.Store.GridFS("files", {path: "~/files"})
    ]/*,
    filter: {
        allow: {
            contentTypes: ['image/!*']
        }
    }*/  // No File input filter - any file can be uploaded
});

//todo:clean up permissions on files.  How do owners factor in?  How do roles factor in?

if (Meteor.isServer) {  // Currently, any registered user can upload a file
    Files.allow({
        insert: function(userId) {
            console.log("INSERT--> userID: " + userId);
            return userId;
        },
        update: function(userId) {
            return userId;
        },
        remove: function(userId) {
            console.log("REMOVE--> userID: " + userId);
            return userId;
        },
        download: function(userId, fileObj) {
            console.log("DOWNLOAD--> userID: " + userId  + "  fileObjL: " + fileObj);
            console.log("FileObj Owner ID: " + fileObj.owner);

            return userId;
        }
    });



}