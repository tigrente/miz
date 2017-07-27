/**
 * Created by Alex on 11/13/16.
 */
/*

Note: Labs are references into the internal Huawei and Futurewei organizations placing requests.
      As of this current build they are created manually.  Eventually, these should be created from the Huawei
      directory and updated accordingly.   Questions that should be considered include:
      (1) What happens when the master lab changes?  Should the changes roll through, or should the project
      reflect the lab that was in place when it was sponsored (I suggest the latter).
      (2) Who should have permission to update and change labs?  (Currently, I push this down to anyone who has the edit
      engagement permission.  (Acutally, as of this build - anyone can do it.,)

*/


Labs = new Mongo.Collection("labs");


//for now - just being logged in should be good enough
Labs.allow({
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

//todo: ensure that labs are updated as permitted by owner