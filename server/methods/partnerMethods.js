/**
 * Created by Alex on 10/19/15.
 */

/** PUBLISH FUNCTIONS **/

Meteor.publish('partnerList', function (options, searchString, partnerFilter) {

    /*    console.log('partnerFilter: ' + partnerFilter);
     console.log('searchString: ' + searchString);*/
    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewCompanies'])) {
        throw new Meteor.Error("Access denied")
    }

    if (searchString == null)
        searchString = '';

    if (partnerFilter == null)
        partnerFilter = '';


    if (options == null)
        options = '';


    // Restrict the fields to be exposed and add it to the options object.
    var fieldOption = {
        fields: {
            name: 1,
            description: 1,
            logo: 1,
            createdBy: 1,
            createdOn: 1,
            memberOf: 1,
            partnerType: 1,
            owner: 1,
            keywords: 1
        }
    };


    options["fields"] = fieldOption["fields"];


    return Partners.find({
        $and: [
            {
                $or: [
                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'description': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'owner': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'keywords': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'partnerType': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}}
                ]
            },

            {'partnerType': {'$regex': '.*' + partnerFilter || '' + '.*', '$options': 'i'}}
        ]
    }, options);


});

/***********************************************************************************************
 * partnerSearch
 * Publication for the miz menu search.  Returns partners fitting the search string.
 * Finds partners according to type and limits.
 *
 ***********************************************************************************************/

Meteor.publish('partnerSearch', function (searchString, partnerType, limit) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewCompanies'])) {
        throw new Meteor.Error("Access denied")
    }

    if (searchString == null)
        searchString = '';

    let typeSelector = {};

    // if 'otherOrgs', this becomes the catch-all for any other undefined types
    if (partnerType === 'otherOrgs') {
        typeSelector = {
            'partnerType': {
                $nin: [
                    'university',
                    'uniSubOrg',
                    'contact',
                    'company',
                    'individual',
                    'professor',
                    'contact'
                ]
            }
        };
    } else {
        typeSelector = {'partnerType': partnerType};
    }


    // Restrict the fields to be exposed and add it to the options object.
    let options = {
        fields: {
            name: 1,
            partnerType: 1,
            logo: 1,
            modifiedDate: 1,
            parentPartnerLabel: 1
        },
        limit: limit,
        sort: {modifiedDate: -1}  // sort by latest modified on top.
    };

    let selector = {
        $and: [
            {
                $or: [
                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'description': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'keywords': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'parentPartnerLabel': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}}
                ]
            },

            typeSelector,
        ]
    };

    return Partners.find(selector, options);


});

/***********************************************************************************************
 * partnerResourceSearch
 * Publication for the miz menu search.  Returns partners fitting the search string.
 * Finds partners according to type and limits.
 *
 ***********************************************************************************************/

Meteor.publish('partnerResourceSearch', function (searchString, limit) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewCompanies'])) {
        throw new Meteor.Error("Access denied")
    }

    if (searchString == null)
        searchString = '';


    // Restrict the fields to be exposed and add it to the options object.
    let options = {
        fields: {
            name: 1,
            partnerType: 1,
            logo: 1,
            modifiedDate: 1,
            parentPartnerLabel: 1,
            cooperationResource: 1
        },
        limit: limit,
        sort: {modifiedDate: -1}  // sort by latest modified on top.
    };

    let selector = {
        $and: [
            {
                $or: [
                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'description': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'keywords': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {'parentPartnerLabel': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}}
                ]
            },

            {'cooperationResource': true}
        ]
    };

    return Partners.find(selector, options);


});


Meteor.publish('memberPartners', function (partnerId) {
    return Partners.find({_id: partnerId});  //return all for now
});


/**
 * partnerNames
 * Used by the partnerOfEngaegments component.  Takes an array of partnerIds and returns partners
 * with name only in the field.
 */

Meteor.publish('partnerNames', function (partnerIdArray) {

    if (partnerIdArray == null)
        partnerIdArray = [];

    var selector = {_id: {$in: partnerIdArray}};

    var options = {
        fields: {
            name: 1
        }
    };

    return Partners.find(selector, options);  //return all for now
});


/**
 * partnerDetail
 * Used by the partnerDetail page.  Returns a single partner record, and all of its parents and children partners.
 *
 */
Meteor.publish('partnerDetail', function (partnerId) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewCompanies'])) {
        throw new Meteor.Error("Access denied")
    }


    let selectorArray = [partnerId];

    let partner = Partners.findOne(partnerId);

    selectorArray = Array.concat(selectorArray, partner.parentPartners, partner.childrenPartners);

    let selector = {_id: {$in: selectorArray}};

    return Partners.find(selector);

});

//todo: make this more selective
Meteor.publish('partners', function () {
    return Partners.find();  //return all for now
});

/**
 * partnerLightList
 * Used for listing current parents/children**/
Meteor.publish('partnerInfo', function (partnerIdArray, options) {


    check(partnerIdArray, [String]);

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'editCompanies', 'viewCompanies'])) {
        throw new Meteor.Error("Access denied")
    }

    if (partnerIdArray.length == 0)
        return [];  // if no partners are requested, don't return any
    else {
        if (!options)
            options = {  // currently returning all fields as default
                /* fields: {
                 name:1,
                 partnerType:1,
                 description:1,
                 bizDevOwners: 1,
                 logo: 1,
                 contactInfo: 1,
                 website: 1,
                 notes: 1,
                 crsNumber: 1
                 }*/
            };

        var selector = {
            _id: {$in: partnerIdArray}
        };

        //Publish counts of the cursor


        return Partners.find(selector, options);
    }
});


/**
 * selectPartnerSearch
 * Used for searching for partners and selecting them from the <partner-select> element **/
Meteor.publish('selectPartnerSearch', function (searchString, partnerTypes, cooperationResourcesOnly) {

        var selector;

        if (!Roles.userIsInRole(this.userId,
                ['superAdmin', 'editCompanies'])) {
            throw new Meteor.Error(403, "Access denied")
        }

        if (!searchString || searchString == null) {
            searchString = '';
        }

        // Working query

        if (cooperationResourcesOnly && !partnerTypes) {
            selector = {
                $and: [
                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {cooperationResource: true}
                ]
            };
        } else if (!cooperationResourcesOnly && !partnerTypes) {
            selector = {
                'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}
            };
        } else if (!cooperationResourcesOnly && partnerTypes) {
            selector = {
                $and: [
                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {partnerType: {$in: partnerTypes}}
                ]
            };
        } else if (cooperationResourcesOnly && partnerTypes) {
            selector = {
                $and: [
                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
                    {partnerType: {$in: partnerTypes}},
                    {cooperationResource: true}

                ]
            };
        }


        let options = {
            limit: 5,
            fields: {
                name: 1,
                cooperationResource: 1,
                partnerType: 1
            }
        };


        //return partners that could be eligible parentPartners
        return Partners.find(selector, options);
    }
);

/**
 * partnersOFEngagements - used to publish related partners of focus engagement in <eng-workspace>
 */
Meteor.publish('partnersOfEngagement', function (cooperationResources, contractingPartners) {

        var selector;

        if (!Roles.userIsInRole(this.userId,
                ['superAdmin', 'editCompanies'])) {
            throw new Meteor.Error(403, "Access denied")
        }

        if (!cooperationResources)
            cooperationResources = [];

        if (!contractingPartners)
            contractingPartners = [];

        selector = {
            $or: [
                {_id: {$in: cooperationResources}},
                {_id: {$in: contractingPartners}}
            ]
        };


        let options = {
            fields: {
                name: 1,
                cooperationResource: 1,
                partnerType: 1
            }
        };

        //return partners that could be eligible parentPartners
        return Partners.find(selector, options);
    }
);


/**
 * parentPartnerSearch
 * Used for searching for Parent Partners on partner create and edit pages **/
Meteor.publish('parentPartnerSearch', function (searchString) {


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


        //return partners that could be eligible parentPartners
        return Partners.find(selector, options);
    }
);


/** PARTNER SERVER METHODS **/


Meteor.methods({

    createPartner: function (newPartner) {

        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editCompanies',
                    'removeCompanies'])) {
            throw new Meteor.Error("Insufficient Privilege to add new Partner.")
        }

        // Validate information being used to create a Partner

        // ** needs to be implemented (!) **

        //prepare an object to create the new account
        console.log("New Partner entry preparation...");
        let dbNewPartner = {};
        dbNewPartner.name = newPartner.name;                                // str - partner name
        dbNewPartner.partnerType = newPartner.partnerType;                  // str - partner type (university, etc.)
        dbNewPartner.description = newPartner.description;                  // str - partner description
        dbNewPartner.cooperationResource = newPartner.cooperationResource;  // bool - track as cooperation resource
        dbNewPartner.parentPartners = [];  //added below                    // array of partner IDs
        dbNewPartner.childrenPartners = [];                                  // array of partner IDs
        dbNewPartner.bizDevOwners = [];                // array of User IDs
        dbNewPartner.crsNumber = newPartner.crsNumber;                      // str - CRS number
        dbNewPartner.logo = newPartner.logo;                                // str - ID of logo in ImageDB
        dbNewPartner.website = newPartner.website;                          // str - website
        dbNewPartner.notes = newPartner.notes;                              // str - notes
        dbNewPartner.contactInfo = newPartner.contactInfo;                  // str - Contact info


        //booleans to force listBoxes to appear in Partner view
        dbNewPartner.forcedListBoxes = {
            cooperationResources: false,
            contacts: false,
            uniSubOrgs: false,
            bizDevOwners: false
        };

        //also add a lowercase_username property to facilitate inexpensive, case-insensitive username searching
        dbNewPartner.lowercase_name = newPartner.name.toLowerCase();


        //check website to see if it has http: in front of it.  If not, add it.
        if (dbNewPartner.website) {
            let httpCheckStr = "http://";
            let httpsCheckStr = "https://";
            if (!(dbNewPartner.website.substring(0, httpCheckStr.length) === httpCheckStr ||   // if str
                dbNewPartner.website.substring(0, httpsCheckStr.length) === httpsCheckStr)) {
                dbNewPartner.website = httpCheckStr + dbNewPartner.website;
            }
        }
        ;

        //add auto data
        dbNewPartner.createdById = Meteor.userId();
        dbNewPartner.creationDate = new Date();
        dbNewPartner.modifiedById = Meteor.userId();
        dbNewPartner.modifiedDate = new Date();


        //Create base account
        let partnerId = Partners.insert(dbNewPartner);

        //Get a handle for the account
        let partner = Partners.findOne({_id: partnerId});
        console.log(partner.name + " created.");

        //Add this newPartner to the childrenPartner fields of the parentPartners
        //Note that partnerAddParentPartner also takes care of labels
        if (newPartner.parentPartners) {
            for (let i = 0; i < newPartner.parentPartners.length; i++)
                Meteor.call('partnerAddParentPartner', partner, newPartner.parentPartners[i]);
        }

        //Add this newPartner to the ownedPartner fields of the bizDevOwners
        if (newPartner.bizDevOwners) {
            for (let i = 0; i < newPartner.bizDevOwners.length; i++)
                Meteor.call('partnerAddBizDevOwner', partner, newPartner.bizDevOwners[i]);
        }


        return partner; // send the new user back (requires ReactiveMethods) to use.

    },

    /***************************************************************************************************
     * checkIfPartnerIsUnique
     * string checkedName
     * Validates if a partner name is unique by reducing the proposed name to lower case and checking
     * against lowercase_name entries in the PARTNERS database.  If unique, returns "UNIQUE".  If not,
     * returns the ID of the matching partner.
     ***************************************************************************************************/

    checkIfPartnerIsUnique: function (checkedName) {

        //CLEANUP: Add additional permissions to ensure that records are not returned without authorization
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editCompanies',
                    'removeCompanies'])) {
            throw new Meteor.Error("Insufficient Privilege to check partner uniqueness")
        }
        let lowercaseCheckedName = checkedName.toLowerCase();

        let result = Partners.findOne({"lowercase_name": lowercaseCheckedName});

        if (!result)
            return "UNIQUE";
        else
            return result._id;

    },


    /***************************************************************************************************
     * partnerUpdate
     * Updates serverside partner record. Also triggers update of labels that refer to this partner
     ***************************************************************************************************/


    partnerUpdate: function (partnerId, field, data) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("Method partnerUpdate run.  [ID: " + partnerId + "] [field: " + field + "] [new info:" + data + "]");

        if (partnerId && field) {
            let set = {};
            set[field] = data;
            console.log(set);
            Partners.update(partnerId, {$set: set});

            // update metafields
            Partners.update(partnerId, //selector
                {
                    $set: {
                        modifiedById: Meteor.userId(),
                        modifiedDate: new Date()
                    }
                }
            ); //update

            // If name has changed, update labels of children, and labels of relevant engaements
            if (field === 'name') {

                let children = Partners.find({parentPartners: partnerId});
                console.log("Children Partners: " + children);

                children.forEach(function (element, index, array) {
                        //update labels -- updates an array of strings of parent partner names in the partner record.
                        Meteor.call("setPartnerLabels", element._id);
                    }
                );

                let engagements = Engagements.find({
                        $or: [
                            {contractingPartners: partnerId},
                            {cooperationResources: partnerId}
                        ]
                    }
                );

                engagements.forEach(function (element, incdex, array) {
                    Meteor.call("engSetEngagementLabels", element._id);
                })

            }

            return true;
        } // if partner
    }, // partnerUpdate


    /***************************************************************************************************
     * addPartnerCredentialTag
     * string tag
     * Adds a credential tag to a apartn
     ***************************************************************************************************/

    addPartnerCredentialTag: function (partnerId, tag) {

        //CLEANUP: Add additional permissions to ensure that records are not returned without authorization
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editCompanies'])) {
            throw new Meteor.Error("Insufficient Privilege to check partner uniqueness")
        }

        let partner = Partners.findOne(partnerId);

        if (!partner.credentialTags)
            partner.credentialTags = [];

        if (partner.credentialTags) {
            //console.log("CredentialTag -->  " + partner.name);
            for (let i = 0; i < partner.credentialTags.length; ++i) {
                console.log("Tag " + i + ": " + partner.credentialTags[i].text);
            }
        }

        //console.log("New Tag: " + tag.text);

        partner.credentialTags.push(tag);

        Partners.update(partnerId, {$set: {"credentialTags": partner.credentialTags}});

        /*
         //console.log("CredentialTag -->  " + partner.name);
         for (let i = 0; i < partner.credentialTags.length; ++i) {
         console.log("Tag " + i + ": " + partner.credentialTags[i].text);
         }
         */


    },

    /***************************************************************************************************
     * removePartnerCredentialTag
     * string tag
     * Adds a credential tag to a apartn
     ***************************************************************************************************/

    removePartnerCredentialTag: function (partnerId, tag) {

        //CLEANUP: Add additional permissions to ensure that records are not returned without authorization
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editCompanies'])) {
            throw new Meteor.Error("Insufficient Privilege to check partner uniqueness")
        }

        let partner = Partners.findOne(partnerId);


        //console.log("Tag to be removed: " + tag.text);

        let updatedCredentials = partner.credentialTags.filter(function (el) {
            return el.text !== tag.text;
        });

        Partners.update(partnerId, {$set: {"credentialTags": updatedCredentials}});

        /* console.log("CredentialTag -->  " + partner.name);
         for (let i = 0; i < partner.credentialTags.length; ++i) {
         console.log("Tag " + i + ": " + partner.credentialTags[i].text);
         }*/


    },

    /***************************************************************************************************
     * addPartnerSubjectTag
     * string tag
     * Adds a subject tag to a partner
     ***************************************************************************************************/

    addPartnerSubjectTag: function (partnerId, tag) {

        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editCompanies'])) {
            throw new Meteor.Error("Insufficient Privilege to check partner uniqueness")
        }

        let partner = Partners.findOne(partnerId);

        if (!partner.subjectTags)
            partner.subjectTags = [];

 /*       if (partner.subjectTags) {
            //console.log("CredentialTag -->  " + partner.name);
            for (let i = 0; i < partner.subjectTags.length; ++i) {
                console.log("Tag " + i + ": " + partner.subjectTags[i].text);
            }
        }*/

        //console.log("New Tag: " + tag.text);

        partner.subjectTags.push(tag);

        Partners.update(partnerId, {$set: {"subjectTags": partner.subjectTags}});

        /*
         //console.log("CredentialTag -->  " + partner.name);
         for (let i = 0; i < partner.credentialTags.length; ++i) {
         console.log("Tag " + i + ": " + partner.credentialTags[i].text);
         }
         */
/*
        let tagObject = Tags.findOne({name: "subjectTags"});

        if (!tagObject)
            tagObject = {
                name: "subjectTags",
                tagCollection: []
            };

        let referenceTags = tagObject.tagCollection;

        //if the tag is not already member of the collection
        if (!referenceTags.filter(e => e.name === tag.text).length > 0) {
            referenceTags.push(tag);
            console.log("Adding tag to references: " + tag.text);
            Tags.update({name: "subjectTags"}, {$set: {tagCollection: referenceTags}});
        }*/


    },

    /***************************************************************************************************
     * removePartnerSubjectTag
     * string tag
     * Removes a subject tag from a partner
     ***************************************************************************************************/

    removePartnerSubjectTag: function (partnerId, tag) {

        //CLEANUP: Add additional permissions to ensure that records are not returned without authorization
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editCompanies'])) {
            throw new Meteor.Error("Insufficient Privilege to check partner uniqueness")
        }

        let partner = Partners.findOne(partnerId);


        //console.log("Tag to be removed: " + tag.text);

        let updatedSubjects = partner.subjectTags.filter(function (el) {
            return el.text !== tag.text;
        });

        Partners.update(partnerId, {$set: {"subjectTags": updatedSubjects}});

        /* console.log("CredentialTag -->  " + partner.name);
         for (let i = 0; i < partner.credentialTags.length; ++i) {
         console.log("Tag " + i + ": " + partner.credentialTags[i].text);
         }*/


    },


    /***************************************************************************************************
     * partnerRemoveParentPartner
     * Takes partner object from Angular and updates the parent partner field in the Meteor object.
     * Also updates the child field in the parent Meteor object.
     ****************************************************************************************************/
    partnerRemoveParentPartner: function (partner, parentId) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("partnerRemoveParentPartner: " + partner.name + ' ' + parentId);

        if ((partner._id != null) && (parentId != null)) {

            //remove parent from partner
            Partners.update({_id: partner._id},
                {$pull: {parentPartners: parentId}});


            // remove partner from parent's children
            Partners.update({_id: parentId},
                {$pull: {childrenPartners: partner._id}});
        }


        //update labels -- updates an array of strings of parent partner names in the partner record.
        Meteor.call("setPartnerLabels", partner._id);

    }
    ,// partnerRemoveParentPartner

    /***************************************************************************************************
     * partnerAddParentPartner
     * Takes partner object from Angular and adds the parent partner ID to the parentPartners field
     * in the Meteor object. Also updates the childrenPartners field in the parent Meteor object to contain
     * this partner.
     ****************************************************************************************************/
    partnerAddParentPartner: function (partner, parentId) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("partnerAddParentPartner: " + partner.name + ' ' + partner.partnerType);


        if ((partner != null) &&        // parameters are not null
            (parentId != null) &&
            (partner._id != parentId)) {

            //Before we add the parent to partner, let's check for duplicates
            if (!_.contains(partner.parentPartners, parentId)) {
                //add parent to partner
                Partners.update({_id: partner._id},
                    {$push: {parentPartners: parentId}});
            }

            //Before we add partner as child to parent, let's check for duplicates
            var parentObject = Partners.findOne({_id: parentId});

            if (!_.contains(parentObject.childrenPartners, partner._id)) {
                //add parent to partner
                Partners.update({_id: parentId},
                    {$push: {childrenPartners: partner._id}});
            }

            Meteor.call("setPartnerLabels", partner._id);

        } //if not null
    }
    ,// partnerAddParentPartner

    /***************************************************************************************************
     * partnerRemoveBizDevOwner
     *
     ****************************************************************************************************/
    partnerRemoveBizDevOwner: function (partner, bizDevOwnerId) {

        if (!Meteor.userId()) {
            console.log("This user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("partnerRemoveBizDevOwner: " + partner.name + ' ' + bizDevOwnerId);

        if ((partner._id != null) && (bizDevOwnerId != null)) {

            //remove parent from partner
            Partners.update({_id: partner._id},
                {$pull: {bizDevOwners: bizDevOwnerId}});

            // remove partner from parent's children
            Meteor.users.update({_id: bizDevOwnerId},
                {$pull: {'profile.bizDevOwnedPartners': partner._id}});

            Meteor.call("setPartnerLabels", partner._id);

        } // if
    }
    , // partnerRemoveBizDevOwner

    /***************************************************************************************************
     * partnerAddBizDevOwner
     *
     ****************************************************************************************************/
    partnerAddBizDevOwner: function (partner, bizDevOwnerId) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("partnerAddBizDevOwner: " + partner.name + ' ' + bizDevOwnerId);


        if ((partner != null) &&        // parameters are not null
            (bizDevOwnerId != null) &&
            (partner._id != bizDevOwnerId)) {  // not trying to add to self

            if (!Roles.userIsInRole(bizDevOwnerId, ['editEngagements', 'editAllEngagement']))
                throw new Meteor.Error("Selected user is not authorized to be a BizDev owner");

            //Before we add the parent to partner, let's check for duplicates
            if (!_.contains(partner.bizDevOwners, bizDevOwnerId)) {
                //add parent to partner
                Partners.update({_id: partner._id},
                    {$push: {bizDevOwners: bizDevOwnerId}});
            }

            //Before we add partner as child to parent, let's check for duplicates
            var user = Meteor.users.findOne({_id: bizDevOwnerId});

            if (!_.contains(user.profile.bizDevOwnedPartners, partner._id)) {
                //add parent to partner
                Meteor.users.update({_id: bizDevOwnerId},
                    {$push: {'profile.bizDevOwnedPartners': partner._id}});
            }

            Meteor.call("setPartnerLabels", partner._id);


        }// if
    }
    , // partnerAddBizDevOwner

    /***************************************************************************************************
     * createStringOfPartnerNames
     * string checkedName
     * Takes an array of partnerId's and returns a string with their name
     ***************************************************************************************************/

    createStringOfPartnerNames: function (partnerIdArray) {

        if (partnerIdArray == null)
            partnerIdArray = [];

        var partnerString = "";
        var partner;  //object holder for retrieving names

        for (let i = 0; i < partnerIdArray.length; i++) {

            partner = Partners.findOne(partnerIdArray[i]);

            if (!partnerString.length)
                partnerString = partner.name;
            else
                partnerString = partnerString + ", " + partner.name;

            console.log("partnerString: " + partnerString);

        }// for
        console.log("Final partner string: " + partnerString);
        return partnerString;
    }
    , //createStringOfPartnerNames

    /**
     * partnerSetParentPartnerLabels
     *
     * Because mongoDB is a noSQL database that doesn't do joins, per se, this function is required to 'denormalize'
     * relational data.  This function updates the engagement record with the relational information for partner names,
     * users, etc. This pushes activity to the server, but should significantly reduce the number of calls that might
     * be required trying to emulate a relational database.
     */
    setPartnerLabels: function (partnerId) {

        // console.log("Method engSetEngagementLabels run: " + engagementId);

        if (partnerId) {
            let partner = Partners.findOne(partnerId);
            console.log("Partner Label Update: " + partner.name);

            if (partner) {

                /** PREPARE PARENT PARTNER LABELS **/
                let tempParentPartnerLabel = [];

                if (partner.parentPartners) {


                    partner.parentPartners.forEach(function (element, index, array) {
                        let parentPartner = Partners.findOne(element);

                        tempParentPartnerLabel.push(parentPartner.name);
                    });

                }


                /** PREPARE BD OWNER LABELS **/
                let tempBdOwnerLabel = "";

                if (partner.bdOwner) {
                    let bdOwner = Meteor.users.findOne(partner.bdOwner);
                    tempBdOwnerLabel = bdOwner.profile.name;
                }

                /** UPDATE THE RECORD **/
                let selector = {_id: partnerId};

                let update = {
                    $set: {
                        parentPartnerLabel: tempParentPartnerLabel,
                        bdOwnerLabel: tempBdOwnerLabel,
                    }
                };
                Partners.update(selector, update);
            } //if engagement
        } // if engagementId

    }
    ,

    /**
     * partnerStatistics
     * Returns a collection of statistics regarding partners.
     */
    partnerStatistics: function () {

        let stat;

        stats = {
            partnerCount: 0,
            companyCount: 0,
            universityCount: 0,
            individualCount: 0,
            professorCount: 0,
            incubatorCount: 0,
            ventureCount: 0,
            associationCount: 0,
            uniSubOrgCount: 0,
            contactCount: 0,
            otherCount: 0,
            resourceCount: 0,

            partnersAddedThisMonth: 0

        };

        stats.partnerCount = Partners.find().count();
        stats.companyCount = Partners.find({partnerType: 'company'}).count();
        stats.universityCount = Partners.find({partnerType: 'university'}).count();
        stats.individualCount = Partners.find({partnerType: 'individual'}).count();
        stats.professorCount = Partners.find({partnerType: 'professor'}).count();
        stats.incubatorCount = Partners.find({partnerType: 'incubator'}).count();
        stats.ventureCount = Partners.find({partnerType: 'venture'}).count();
        stats.associationCount = Partners.find({partnerType: 'association'}).count();
        stats.uniSubOrgCount = Partners.find({partnerType: 'uniSubOrg'}).count();
        stats.contactCount = Partners.find({partnerType: 'contact'}).count();
        stats.otherCount = Partners.find({partnerType: 'other'}).count();
        stats.resourceCount = Partners.find({cooperationResource: true}).count();

        stats.partnersAddedThisMonth = Partners.find({cooperationResource: true}).count();

        let d = new Date();

        stats.thisMonth = d.getMonth();
        stats.thisYear = d.getFullYear();
        let currentMonthStartDate = new Date(stats.thisYear, stats.thisMonth, 1);
        let currentMonthEndDate = new Date(stats.thisYear, stats.thisMonth, 31);

        stats.partnersAddedThisMonthCount = Partners.find({
            creationDate: {
                $gte: currentMonthStartDate,
                $lt: currentMonthEndDate
            }
        }).count();
        stats.universitiesAddedThisMonthCount = Partners.find({
            partnerType: 'university',
            creationDate: {$gte: currentMonthStartDate, $lt: currentMonthEndDate}
        }).count();

        let findNewestPartners = function (pType, limit) {
            let newestPartnerIds = Partners.find({partnerType: pType}, {sort: {$natural: -1}, limit: limit});

            let newestPartners = [];

            newestPartnerIds.forEach(function (element, index, array) {
                Partners.findOne(element);
                let partner = {
                    _id: element._id,
                    name: element.name,
                    logo: element.logo
                };
                newestPartners.push(partner);
            });

            return newestPartners;
        };


        stats.newestUniversities = findNewestPartners('university', 10);
        stats.newestUniSubOrgs = findNewestPartners('uniSubOrg', 10);
        stats.newestCompanies = findNewestPartners('company', 10);
        stats.newestProfessors = findNewestPartners('professor', 10);
        stats.newestIndividuals = findNewestPartners('individual', 10);


        return stats;

    }

})
; // Meteor methods


