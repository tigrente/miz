/**
 * Created by Alex on 10/19/15.
 */

/**********************************************************
 **                 LAB PUBLICATIONS                     **
 **********************************************************/

Meteor.publish('labList', function (options, searchString, labFilter) {

    console.log('labFilter: ' + labFilter);
    console.log('searchString: ' + searchString);
    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewCompanies'])) {
        throw new Meteor.Error("Access denied")
    }

    if (searchString == null)
        searchString = '';

    if (labFilter == null)
        labFilter = '';

    if (options == null)
        options = '';


    // Restrict the fields to be exposed and add it to the options object.
    var fieldOption = {
        fields: {
            name: 1,
            description: 1,
            leader: 1,
            entity: 1,
            company: 1,
            logo: 1,
            createdBy: 1,
            createdOn: 1,
            memberOf: 1,
            owner: 1,
            keywords: 1
        }
    };


    options["fields"] = fieldOption["fields"];


    return Labs.find({
        $and: [
            {
                $or: [
                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'leader': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'description': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'keywords': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'entity': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                ]
            },

            {'company': {'$regex': '.*' + labFilter || '' + '.*', '$options': 'i'}}
        ]
    }, options);
});


/**
 * labNames
 * Takes an array of labIds and returns labs with name only in the field.
 */

Meteor.publish('labNames', function (labIdArray) {

    if (labIdArray == null)
        labIdArray = [];

    var selector = {_id: {$in: labIdArray}};

    var options = {
        fields: {
            name: 1
        }
    };

    return Labs.find(selector, options);  //return all for now
});


/**
 * labDetail
 * Used by the labDetail page.  Returns a single lab record.
 */
//todo: make this more selective
Meteor.publish('labDetail', function (labId) {
    return Labs.find(labId);
});


/**
 * selectLabSearch
 * Used for searching for labs and selecting them from the <lab-select> element **/

Meteor.publish('selectLabSearch', function (searchString, company) {

        var selector;

        if (!Roles.userIsInRole(this.userId,
                ['superAdmin', 'editEngagements'])) {
            throw new Meteor.Error(403, "Access denied")
        }

        if (!searchString || searchString == null) {
            searchString = '';
        }

        // Working query

        if (!company) { //no company refinement
            selector = {
                'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}
            };
        } else {
            selector = {
                $and: [
                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'company': {'$regex': '.*' + company || '' + '.*', '$options': 'i'}},
                ]
            };
        }
        ;


        let options = {
            limit: 5,
            fields: {
                name: 1,
                entity: 1,
                company: 1
            }
        };


        //return labs that could be eligible parentLabs
        return Labs.find(selector, options);
    }
);


/**
 * labOfEngagements - used to publish related labs of focus engagement in <eng-workspace>
 */
Meteor.publish('labOfEngagement', function (labId) {

        var selector;

        if (!Roles.userIsInRole(this.userId,
                ['superAdmin', 'editCompanies'])) {
            throw new Meteor.Error(403, "Access denied")
        }

        if (!labId)
            labId = "";


        selector = {_id: {labId}};


        let options = {
            fields: {
                name: 1,
                entity: 1,
                company: 1
            }
        };

        return Labs.find(selector, options);
    }
);


/**
 * parentLabSearch
 * Used for searching for Parent Labs on lab create and edit pages **/
Meteor.publish('parentLabSearch', function (searchString) {


        if (!Roles.userIsInRole(this.userId,
                ['superAdmin', 'editCompanies'])) {
            throw new Meteor.Error(403, "Access denied")
        }

        if (!searchString || searchString == null) {
            searchString = '';
        }

        let selector = {
            'name': {'$regex': searchString, $options: '-i'}
        };


        let options = {
            limit: 5,
            fields: {
                name: 1
            }
        };


        return Labs.find(selector, options);
    }
);

/**********************************************************
 **                 LAB SERVER METHODS                   **
 **********************************************************/

Meteor.methods({

    createLab: function (newLab) {

        // Check privilege - if you can edit an engagement, you can add a lab
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editEngagements'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to add new Lab.")
        }


        //prepare an object to create the new lab
        console.log("New Lab entry preparation...");
        var dbNewLab = {};
        dbNewLab.name = newLab.name;                      // str - lab name
        dbNewLab.company = newLab.company;                // str - company (e.g. Futurewei, HQ)
        dbNewLab.entity = newLab.entity;                  // str - e.g. 2012 labs, device
        dbNewLab.description = newLab.description;        // str - lab description
        dbNewLab.leader = newLab.leader;                  // str - lab leader
        dbNewLab.parentLab = newLab.parentLab;                  //  lab IDs
        dbNewLab.childrenLabs = [];                             // array of lab IDs
        dbNewLab.bizDevOwners = [];                                 // array of User IDs
        dbNewLab.logo = newLab.logo;                                // str - ID of logo in ImageDB


        //also add a lowercase_username property to facilitate inexpensive, case-insensitive username searching
        dbNewLab.lowercase_name = newLab.name.toLowerCase();


        //add auto data
        dbNewLab.createdById = Meteor.userId();
        dbNewLab.creationDate = new Date();
        dbNewLab.modifiedById = Meteor.userId();
        dbNewLab.modifiedDate = new Date();


        //Create lab in DB
        var labId = Labs.insert(dbNewLab);

        //Get a handle for the account
        var lab = Labs.findOne(labId);
        console.log("Lab " + lab.name + " created.");

        return lab; // send the new user back (requires ReactiveMethods) to use.

    },

    /***************************************************************************************************
     * checkIfLabIsUnique
     * string checkedName
     * Validates if a lab name is unique by reducing the proposed name to lower case and checking
     * against lowercase_name entries in the labs database.  If unique, returns "UNIQUE".  If not,
     * returns the ID of the matching lab.
     ***************************************************************************************************/

    checkIfLabIsUnique: function (checkedName) {

        //CLEANUP: Add additional permissions to ensure that records are not returned without authorization
        if (!Roles.userIsInRole(Meteor.userId(),
                [
                    'superAdmin',
                    'editEngagements'
                ]
            )) {
            throw new Meteor.Error("Insufficient Privilege to check lab uniqueness")
        }


        var lowercaseCheckedName = checkedName.toLowerCase();

        var result = Labs.findOne({"lowercase_name": lowercaseCheckedName});

        if (result == null)
            return "UNIQUE";
        else
            return result._id;

    },

    /***************************************************************************************************
     * checkIfLabIsUnique
     * Takes a lab and updates the infomration in the database with the new object.
     ***************************************************************************************************/

    labUpdate: function (lab) {

        if (!Meteor.userId()) {
            console.log("User was authorized to update the lab.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("updateLab: " + lab.name);
        if (lab._id != null) {

            Labs.update(
                {_id: lab._id}, //selector
                lab // replace with the meteor/mongo object with the angular object
            );

            // update metafields
            Labs.update({_id: lab._id}, //selector
                {
                    $set: {
                        lowercase_name: lab.name.toLowerCase(), //lowercase_username property to facilitate inexpensive, case-insensitive username searching
                        modifiedById: Meteor.userId(),
                        modifiedDate: new Date()
                    }
                }
            ); //update


        } // if lab
    }, // labUpdate

    /***************************************************************************************************
     * labRemoveParentLab
     * Takes lab object from Angular and updates the parent lab field in the Meteor object.
     * Also updates the child field in the parent Meteor object.
     ****************************************************************************************************/
    labRemoveParentLab: function (lab, parentId) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the lab.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("labRemoveParentLab: " + lab.name + ' ' + parentId);

        if ((lab._id != null) && (parentId != null)) {

            //remove parent from lab
            Labs.update(
                {_id: lab._id}, //selector
                {$set: {parentLab: null}}
            );

            // remove lab from parent's children
            Labs.update({_id: parentId},
                {$pull: {childrenLabs: lab._id}});
        }
    },// labRemoveParentLab


    /***************************************************************************************************
     * labAddParentLab
     * Takes lab object from Angular and adds the parent lab ID to the parentLab field
     * in the Meteor object. Also updates the childrenLabs field in the parent Meteor object to contain
     * this lab.
     ****************************************************************************************************/
    labAddParentLab: function (lab, parentId) {

        if (!Meteor.userId()) {
            console.log("User was authorized to update the lab.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("labAddParentLab: " + lab.name + ' ');


        if ((lab != null) &&        // parameters are not null
            (parentId != null) &&
            (lab._id != parentId)) {

            //Before we add the parent to lab, let's check for duplicates
            if (!_.contains(lab.parentLabs, parentId)) {
                //add parent to lab
                Labs.update({_id: lab._id},
                    {$set: {parentLab: parentId}});
            }

            //Before we add lab as child to parent, let's check for duplicates
            var parentObject = Labs.findOne({_id: parentId});

            if (!_.contains(parentObject.childrenLabs, lab._id)) {
                //add parent to lab
                Labs.update({_id: parentId},
                    {$push: {childrenLabs: lab._id}});
            }

        } //if not null
    },// labAddParentLab


    /***************************************************************************************************
     * labRemoveBizDevOwner
     * Removes a biz dev owner from the lab DB entry.  Also removes said lab from the user's profile
     ****************************************************************************************************/
    labRemoveBizDevOwner: function (lab, bizDevOwnerId) {

        if (!Meteor.userId()) {
            console.log("This user was authorized to update the lab.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("labRemoveBizDevOwner: " + lab.name + ' ' + bizDevOwnerId);

        if ((lab._id != null) && (bizDevOwnerId != null)) {

            //remove parent from lab
            Labs.update({_id: lab._id},
                {$pull: {bizDevOwners: bizDevOwnerId}});

            // remove lab from bizDevOwner list
            Meteor.users.update({_id: bizDevOwnerId},
                {$pull: {'profile.bizDevOwnedLabs': lab._id}});

        } // if
    }, // labRemoveBizDevOwner

    /***************************************************************************************************
     * labAddBizDevOwner
     * Adds a biz dev owner to the lab DB entry.  Also adds said lab to the user's profile
     ****************************************************************************************************/
    labAddBizDevOwner: function (lab, bizDevOwnerId) {

        if (!Meteor.userId()) {
            console.log("User was authorized to update the lab.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("labAddBizDevOwner: " + lab.name + ' ' + bizDevOwnerId);


        if ((lab != null) &&        // parameters are not null
            (bizDevOwnerId != null) &&
            (lab._id != bizDevOwnerId)) {  // not trying to add to self

            if (!Roles.userIsInRole(bizDevOwnerId, ['editEngagements', 'editAllEngagement']))
                throw new Meteor.Error("Selected user is not authorized to be a BizDev owner");

            //Before we add the bizDevOwner to lab, let's check for duplicates
            if (!_.contains(lab.bizDevOwners, bizDevOwnerId)) {
                //add bizDevOwner to lab
                Labs.update({_id: lab._id},
                    {$push: {bizDevOwners: bizDevOwnerId}});
            }

            //Before we add lab to the BizDevOwner, let's check for duplicates
            var user = Meteor.users.findOne({_id: bizDevOwnerId});

            if (!_.contains(user.profile.bizDevOwnedLabs, lab._id)) {
                //add lab to user
                Meteor.users.update({_id: bizDevOwnerId},
                    {$push: {'profile.bizDevOwnedLabs': lab._id}});
            }


        }// if
    }, //labAddBizDevOwner

    /***************************************************************************************************
     * createStringOfLabNames
     * string checkedName
     * Takes an array of labId's and returns a string with their name.  Also works if just an labId
     ***************************************************************************************************/

    createStringOfLabNames: function (labIdArray) {

        var labString = "";
        var lab;  //object holder for retrieving names

        if (!Array.isArray(labIdArray)) {   //not an array
            if (labIdArray == null)         //...but not null either, return the name of the singular lab
                return "";
            else {
                lab = Labs.findOne(labIdArray);
                return lab.name;
            }
        } else {  //  actually is an array.

            for (let i = 0; i < labIdArray.length; i++) {

                lab = Labs.findOne(labIdArray[i]);

                if (!labString.length)
                    labString = lab.name;
                else
                    labString = labString + ", " + lab.name;

                console.log("labString: " + labString);

            }// for
            console.log("Final lab string: " + labString);
            return labString;
        }
    }, //createStringOfLabNames


})
; // Meteor methods


