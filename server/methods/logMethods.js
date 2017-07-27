/**  Methods to be used for log entries **/


/**
 * logEntries
 * Show log entries for the given objectId
 * subjectId:  the id of the object related to the logs (partnerId, engagementID)
 * limit:  the number of entries to return
 * sort:  'newestFirst, oldestFirst'  determines order of items returned. If blank, returns decending by date
 * **/
Meteor.publish('logEntries', function (subjectId, limit, sort) {

//TODO: Set permissions for log entry publications
        if (!Roles.userIsInRole(this.userId,
                ['superAdmin', 'viewEngagements'])) {
            throw new Meteor.Error(403, "Access denied")
        }


        // Do not show the whole database if no id Specified.
        if (!subjectId || subjectId === null) {
            throw new Meteor.Error("logEntries: No subject identified.")
        }

        // figure out how we are going to sort
        let sortByDate = '-1';
        if (sort === "newestFirst") {
            sortByDate = -1;
        } else if (sort === "oldestFirst") {
            sortByDate = 1;
        }


        //Return log items only for the subject id
        let selector = {
            'subjectId': subjectId,
            'hidden': false
        };


        let options = {
            limit: limit,
            fields: {
                creator: 1,
                date: 1,
                creationDate: 1,
                createdById: 1,
                createdByName: 1,
                modifiedDate: 1,
                modifiedById: 1,
                modifiedByName: 1,
                subEntries: 1

            },
            sort: {date: sortByDate}
        };


        // publish counts for pagination (even with infinite scroll).
        //passing { noReady: true } in the last argument so publication will be ready only after main cursor is ready
        Counts.publish(this, 'numberOfLogEntries', Logs.find(selector), {noReady: true});

        //return relevant logEntries
        // return Logs.find(selector, options);
        return Logs.find(selector, options);
    }
);


Meteor.methods({


    /***************************************************************************************************
     * logsCreateEntry
     * Accepts and inserts new log entry
     * newLogEntry: an object containing the new entry
     ***************************************************************************************************/

    logsCreateEntry: function (newLogEntry) {

        console.log("logsCreateEntry method called: " + newLogEntry.subEntries[0].headline);

        // TODO: Check privilege for creating new log entry
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error("Insufficient Privilege to add new log entry.")
        }

        // Validate information used to create log entry.  We should at least have a subjectId and

        //prepare an object to create the new entry

        if (newLogEntry === null)
            throw new Meteor.Error("logsCreateEntry: No Entry Provided.");

        if (newLogEntry.subjectId === '' || newLogEntry.subjectId === null)
            throw new Meteor.Error("logsCreateEntry: no subjectId for entry, didn't create ");

        if (newLogEntry.date === '' || newLogEntry.date === null)
            throw new Meteor.Error("logsCreateEntry: no date for entry, didn't create ");


        //add auto data
        newLogEntry.createdById = Meteor.userId();
        newLogEntry.createdByName = Meteor.user().profile.name;
        newLogEntry.creationDate = new Date();
        newLogEntry.modifiedById = Meteor.userId();
        newLogEntry.modifiedDate = new Date();
        newLogEntry.hidden = false;

        //Look for files with out names and rename their description

        for (let subEntry of newLogEntry.subEntries) {
            console.log("Description Update: " + subEntry.headline);
            for (let file of subEntry.files) {
                console.log("File: " + file.fileName);
                if (file.description === "" || file.description === null) {
                    file.description = "Attachment";
                    console.log("Updated file description.");
                }
            }
        }

        //Insert the log entry into the database
        Logs.insert(newLogEntry, (err, entryId) => {
            if (err) {
                throw new Meteor.Error('Something went wrong when trying to add: ' + err);
            } else {
                console.log("New log entry created: " + entryId);
                return entryId;  // send back for
            }
        });

        //if part of an engagement,  update the engagement's 'lastUpdated' field
        Engagements.update(
            newLogEntry.subjectId,
            {$set: {lastUpdated: new Date()}}
        );
    }, // method logsCreateEntry

    /***************************************************************************************************
     * logsHideEntry
     * Hides an existing log entry
     * entryId: the Id of the Entry to be hidden
     ***************************************************************************************************/


    logsHideEntry: function (entryId) {

        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error("Insufficient Privilege to Edit Log.")
        }

        if (entryId === null || entryId === '') {
            throw new Meteor.Error('No entry specified. Nothing done.');
        }

        let selector = {_id: entryId};
        let modifier = {hidden: true};

        Logs.update(selector, modifier, (err, data) => {
            if (err) {
                throw new Meteor.Error('Could not modify log entry.');
            } else console.log("Log entry hidden: " + data);
        });

    },

    /***************************************************************************************************
     * logsRemoveEntry
     * Permanently deletes log entry
     * entryId: the Id of the Entry to be hidden
     ***************************************************************************************************/


    logsRemoveEntry: function (entryId) {

        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error("Insufficient Privilege to Edit Log.")
        }

        if (entryId === null || entryId === '') {
            throw new Meteor.Error('No entry specified. Nothing done.');
        }

        let selector = {_id: entryId};

        //Remove all of the attached files to the entry.

        let entry = Logs.findOne(entryId);
        for (let subEntry of entry.subEntries) {
            for (let file of subEntry.files) {
                Files.remove(file.fileId, (err) => {
                    if (err)
                        console.log('Error while deleting attached files: ');
                    else
                        console.log(file.fileName + " removed.")

                })
            }
        }

        //remove the entry itself

        Logs.remove(selector, (err, data) => {
            if (err) {
                throw new Meteor.Error('Could not remove log entry: ' + err);
            } else console.log("Log entry removed: " + data);
        });
    },

    /***************************************************************************************************
     * logsUpdateEntry
     * Updates entry with new information.
     * entryId: the Id of the Entry to be hidden
     ***************************************************************************************************/


    logsUpdateEntry: function (updatedLogEntry) {
//todo: update this to address roles and ownership (editOthersEntgagements)
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error("Insufficient Privilege to Edit Log.")
        }

        if (updatedLogEntry === null) {
            throw new Meteor.Error('No update provided. Nothing done.');
        }

        if (updatedLogEntry.subjectId === null || updatedLogEntry.subjectId === '') {
            throw new Meteor.Error("No subject ID.  Can't update log entry.");
        }

        let selector = {_id: updatedLogEntry._id};

        let modifier = {
            headline: updatedLogEntry.headline,
            details: updatedLogEntry.details,
            files: updatedLogEntry.files,
            date: updatedLogEntry.date,
            modifiedById: Meteor.userId(),
            modifiedDate: new Date()
        };

        Logs.update(selector, modifier, (err, data) => {
            if (err) {
                throw new Meteor.Error('Error updating entry: ' + err);
            } else {
                console.log('Entry updated: ' + data);
            }
        });
    },


    /***************************************************************************************************
     * logsUpdateEntry
     * Updates entry with new information.
     * entryId: the Id of the Entry to be hidden
     ***************************************************************************************************/


    logsUpdateDetail: function (updatedLogEntry, subIndex) {
//todo: update this to address roles and ownership (editOthersEntgagements)
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error("Insufficient Privilege to Edit Log.")
        }

        if (updatedLogEntry === null) {
            throw new Meteor.Error('No update provided. Nothing done.');
        }

        let targetName = "subEntries." + subIndex + ".details";
        let targetValue = updatedLogEntry.subEntries[subIndex].details;


        let updateObj = {};
        updateObj[targetName] = targetValue;

        Logs.update(
            {_id: updatedLogEntry._id}, //selector
            {$set: updateObj});


        Logs.update(
            {_id: updatedLogEntry._id}, //selector
            {
                $set: {
                    modifiedById: Meteor.userId(),
                    modifiedDate: new Date()
                }
            });
    },


    /***************************************************************************************************
     * logsUpdateFiles
     * Updates file information on subEntry
     * entryId: the Id of the Entry to be hidden
     ***************************************************************************************************/


    logsUpdateFiles: function (updatedLogEntry, subIndex) {
//todo: update this to address roles and ownership (editOthersEntgagements)
        console.log("logsUpdateFiles run on server.")

        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error("Insufficient Privilege to Edit Log.")
        }

        if (updatedLogEntry === null) {
            throw new Meteor.Error('No update provided. Nothing done.');
        }


        let targetName = "subEntries." + subIndex + ".files";
        let targetValue = updatedLogEntry.subEntries[subIndex].files;

        let updateObj = {};
        updateObj[targetName] = targetValue;

        Logs.update(
            {_id: updatedLogEntry._id}, //selector
            {$set: updateObj});


        Logs.update(
            {_id: updatedLogEntry._id}, //selector
            {
                $set: {
                    modifiedById: Meteor.userId(),
                    modifiedDate: new Date()
                }
            });
    },

    /***************************************************************************************************
     * logsUpdateDate
     * Updates file information on subEntry
     * entryId: the Id of the Entry to be hidden
     ***************************************************************************************************/


    logsUpdateDate: function (updatedLogEntry) {
//todo: update this to address roles and ownership (editOthersEntgagements)
        console.log("logsUpdateFiles run on server.")

        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error("Insufficient Privilege to Edit Log.")
        }

        if (updatedLogEntry === null) {
            throw new Meteor.Error('No update provided. Nothing done.');
        }


        let targetName = "date";
        let targetValue = updatedLogEntry.date;

        let updateObj = {};
        updateObj[targetName] = targetValue;

        Logs.update(
            {_id: updatedLogEntry._id}, //selector
            {$set: updateObj});


        Logs.update(
            {_id: updatedLogEntry._id}, //selector
            {
                $set: {
                    modifiedById: Meteor.userId(),
                    modifiedDate: new Date()
                }
            });
    },


    /***************************************************************************************************
     * logsUpdateHeadline
     * Updates headline information in entry
     * entryId: the Id of the Entry to be hidden
     * subentryIndex: Index of the Subentry to have its headline updated
     * newHeadline: string - the new headline
     ***************************************************************************************************/


    logsUpdateHeadline: function (entryId, subentryIndex, newHeadline) {
//todo: update this to address roles and ownership (editOthersEntgagements)

        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error("Insufficient Privilege to Edit Log.")
        }

        if ((entryId === null) || (subentryIndex === null) || (newHeadline === null)) {
            throw new Meteor.Error('Insufficient update information provided. Nothing done.');
        }

        //GAME PLAN:  Get the object, update the headline, then write the object back to mongoDB
        let logObject = Logs.findOne(entryId);

        logObject["subEntries"][subentryIndex]["headline"] = newHeadline;


        let targetName = "subEntries";
        let targetValue = logObject.subEntries;


        let updateObj = {};
        updateObj[targetName] = targetValue;

        Logs.update(
            {_id: entryId}, //selector
            {$set: updateObj});


        Logs.update(
            {_id: entryId}, //selector
            {
                $set: {
                    modifiedById: Meteor.userId(),
                    modifiedDate: new Date()
                }
            });
    },

});