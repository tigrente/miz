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
      if (!Roles.userIsInRole(Meteor.userId(),
              ['superAdmin',
                  'editGuideRoom',
                  'editAllGuideRooms'
              ])) {
          throw new Meteor.Error("Insufficient Privilege to add new Guide Room.")
      }

      console.log("Adding new guide room...");


      //add auto data

      /* ROOM */
      newRoom.createdById = Meteor.userId();
      newRoom.creationDate = new Date();
      newRoom.modifiedById = Meteor.userId();
      newRoom.modifiedDate = new Date();

      return Cms.insert(newRoom, (err, data) => {
          if (err)
              console.log('Error adding new guide room to db: ' + err);
          else {
              console.log('New Guide Room Created: ' + data);
          }
      });
    },

    createGuide: function (newGuide) {
      // Check privilege
      if (!Roles.userIsInRole(Meteor.userId(),
              ['superAdmin',
                  'editGuide',
                  'editAllGuides'
              ])) {
          throw new Meteor.Error("Insufficient Privilege to add new Guide.")
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
              console.log('New Guide Created: ' + data);
          }
      });
    },

    createArticle: function (newArticle) {
      // Check privilege
      if (!Roles.userIsInRole(Meteor.userId(),
              ['superAdmin',
                  'editArticle',
                  'editAllArticles'
              ])) {
          throw new Meteor.Error("Insufficient Privilege to add new Article.")
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
              console.log('New Article Created: ' + data);
          }
      });
    }
  });