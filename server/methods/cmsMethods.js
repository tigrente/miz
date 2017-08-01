Meteor.publish('cms', function() {
  return Cms.find({
    cmsType: 'room'
  });
});

Meteor.methods({
  
  createGuideRoom: function (newRoom) {
      // Check privilege
      if (!Roles.userIsInRole(Meteor.userId(),
              ['superAdmin',
                  'editGuideRoom',
                  'editAllGuideRooms'
              ])) {
          throw new Meteor.Error("Insufficient Privilege to add new Guide Room.")
      }

      console.log("Adding new guide room...");


      //add auto data and remove $$hashKey

      /* ROOM */
      newRoom.createdById = Meteor.userId();
      newRoom.creationDate = new Date();
      newRoom.modifiedById = Meteor.userId();
      newRoom.modifiedDate = new Date();

      /* GUIDES */

      newRoom.guides.forEach((guide) => {
        // add data
        guide.createdById = Meteor.userId();
        guide.creationDate = new Date();
        guide.modifiedById = Meteor.userId();
        guide.modifiedDate = new Date();
        
        // remove $$hashKey
        delete guide.$$hashKey;
        
        /* ARTICLES */
        
        guide.articles.forEach((article) => {
          // add data
          article.createdById = Meteor.userId();
          article.creationDate = new Date();
          article.modifiedById = Meteor.userId();
          article.modifiedDate = new Date();

          //remove $$hashKey
          delete article.$$hashKey;
        });
      });

      return Cms.insert(newRoom, (err, data) => {
          if (err)
              console.log('Error adding new guide room to db: ' + err);
          else {
              console.log('New Guide Room Created: ' + data);
          }
      });

    }
  });