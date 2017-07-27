Meteor.startup(function () {
    
    Partners._ensureIndex({"name": 1}, {"parentPartnerLabel":1});
    Logs._ensureIndex({"subjectId": 1});





});
