Meteor.publish('cms', function() {
  return Cms.find({});
});

Meteor.publish('guides', function() {
    return Guides.find({});
});

Meteor.publish('articles', function() {
    return Articles.find({});
});

Meteor.methods({
  
  createGuideRoom: function (newRoom) {
      // Check privilege
      /*if (!Roles.userIsInRole(Meteor.userId(),
              ['superAdmin',
                  'editGuideRoom',
                  'editAllGuideRooms'
              ])) {
          throw new Meteor.Error("Insufficient Privilege to add new Guide Room.")
              }*/

      console.log("Adding new guide room...");


      //add auto data

      /* ROOM */
    //   newRoom.createdById = Meteor.userId(); // Doesn't make sense to have ths here
      newRoom.creationDate = new Date();
      newRoom.modifiedById = Meteor.userId();
      newRoom.modifiedDate = new Date();

      return Cms.insert(newRoom, (err, data) => {
          if (err)
              console.log('Error adding new guide room to db: ' + err);
          else {
              console.log('New guide room created: ' + data);
          }
      });
    },




    /***************************************************************************/

    /*************************************************************************/




    createGuide: function (newGuide) {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editGuide',
                    'editAllGuides'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to add new guide.")
        }

        console.log("Adding new guide...");


        //add auto data

        /* GUIDES */
        newGuide.createdById = Meteor.userId();
        newGuide.creationDate = new Date();
        newGuide.modifiedById = Meteor.userId();
        newGuide.modifiedDate = new Date();
        
        // remove $$hashKey
        delete newGuide.$$hashKey;

        return Guides.insert(newGuide, (err, data) => {
            if (err)
                console.log('Error adding new guide to db: ' + err);
            else {
                console.log('New guide created: ' + data);
            }
        });
    },

    updateParentGuideRoomWithChildGuideId: function (newGuideId, roomId) {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editGuideRoom',
                    'editAllGuideRooms'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to update parent guide room.")
        }

        console.log("updating parent guide room...");

        return Cms.update({
            _id: roomId
        }, {
            $set: {
                modifiedById: Meteor.userId(),
                modifiedDate: new Date()
            },

            $push: {
                childrenGuideIds: newGuideId
            }

        }, (err, data) => {
            if (err)
                console.log('Error updating parent guide room: ' + err);
            else {
                console.log('parent room updated with child guide: ' + data);
            }
        });
    },

    deleteGuide: function (guideIdToDelete) {
    // Check privilege
    if (!Roles.userIsInRole(Meteor.userId(),
            ['superAdmin',
                'editGuide',
                'editAllGuides'
            ])) {
        throw new Meteor.Error("Insufficient Privilege to delete guide.")
    }

    console.log("Deleting guide...");


    //add auto data

    return Guides.remove({
            _id: guideIdToDelete
        }, (err, data) => {
            if (err)
                console.log('Error deleting guide from db: ' + err);
            else {
                console.log('Guide deleted: ' + data);
            }
        });
    },

    updateParentGuideRoomWithDeletedChildGuideId: function (deletedGuideId, roomId) {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editGuideRoom',
                    'editAllGuideRooms'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to update parent guide room.")
        }

        console.log("updating parent guide room...");

        return Cms.update({
            _id: roomId
        }, {
            $set: {
                modifiedById: Meteor.userId(),
                modifiedDate: new Date()
            },

            $pull: {
                childrenGuideIds: deletedGuideId
            }

        }, (err, data) => {
            if (err)
                console.log('Error updating parent guide room: ' + err);
            else {
                console.log('deleted guide ' + data + ' from parent guide room');
            }
        });
    },




    /***************************************************************************/

    /*************************************************************************/




    createArticle: function (newArticle) {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editArticle',
                    'editAllArticles'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to add new article.")
        }

        console.log("Adding new article...");


        //add auto data

        /* ARTICLES */
        newArticle.createdById = Meteor.userId();
        newArticle.creationDate = new Date();
        newArticle.modifiedById = Meteor.userId();
        newArticle.modifiedDate = new Date();
        
        // remove $$hashKey
        delete newArticle.$$hashKey;

        return Articles.insert(newArticle, (err, data) => {
            if (err)
                console.log('Error adding new article to db: ' + err);
            else {
                console.log('New article created: ' + data);
            }
        });
    },

    updateParentGuideWithChildArticleId: function (newArticleId, guideId) {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editGuide',
                    'editAllGuides'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to update parent guide.")
        }

        console.log("updating parent guide...");

        return Guides.update({
            _id: guideId
        }, {
            $set: {
                modifiedById: Meteor.userId(),
                modifiedDate: new Date()
            },

            $push: {
                childrenArticleIds: newArticleId
            }

        }, (err, data) => {
            if (err)
                console.log('Error updating parent guide: ' + err);
            else {
                console.log('parent guide updated with child article: ' + data);
            }
        });
    },

    deleteArticle: function (articleIdToDelete) {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editArticle',
                    'editAllArticles'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to delete article.")
        }

        console.log("Deleting article...");


        //add auto data

        return Articles.remove({
                _id: articleIdToDelete
            }, (err, data) => {
                if (err)
                    console.log('Error deleting article from db: ' + err);
                else {
                    console.log('Article deleted: ' + data);
                }
        });
    },

    updateParentGuideWithDeletedChildArticleId: function (deletedArticleId, guideId) {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editGuide',
                    'editAllGuides'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to update parent guide.")
        }

        console.log("updating parent guide...");

        return Guides.update({
            _id: guideId
        }, {
            $set: {
                modifiedById: Meteor.userId(),
                modifiedDate: new Date()
            },

            $pull: {
                childrenArticleIds: deletedArticleId
            }

        }, (err, data) => {
            if (err)
                console.log('Error updating parent guide: ' + err);
            else {
                console.log('deleted article ' + data + ' from parent guide.');
            }
        });
    },
  });