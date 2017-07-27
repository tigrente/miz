/**  Methods to be used for log entries **/


Meteor.publish('subjectTags', function () {

            return Logs.findOne({name:'subjectTags'});

    }
);


Meteor.methods({



});