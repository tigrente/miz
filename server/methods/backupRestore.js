Meteor.methods({

    backup: function (options) {

        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin'])) {
            throw new Meteor.Error("Insufficient Privilege to create backup.")
        }
        shell.meteor('shell');
        shell.mongodump('-v', '-h', '127.0.0.1', '--port', '3001', '-d', 'meteor', '-c', 'partners', '--out', '/mizbackup/mongodump-2011-10-24)');





    } //backup




});