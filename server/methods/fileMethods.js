/** Methods to be used with the file database **/

Meteor.publish('files', ()=> {  //todo: establish filtering and security on file publishing
    return Files.find();
});

Meteor.methods({

    filesUpdateDescription: function(fileId, description) {
        //todo: put some safety and permission stuff here

        let selector = {_id : fileId};


        let modifier = {$set: {"description" : description }};

        return Files.update(selector, modifier);

    },

    filesDeleteFile: function(fileId) {

        Files.remove({_id: fileId});
    }



});
