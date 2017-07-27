/**
 * Created by Alex on 10/6/16.
 */

/**
 * THIS FUNCTION IS RUN AT STARTUP AND IS INTENDED TO CLEAN UP DATABASE ERRORS CREATED
 * DURING DEVELOPMENT.
 *
 * IT WILL ALSO BE USE TO PURGE ORPHANED FILES.
 */

Meteor.startup(function () {

    console.log("CLEANING DATABASE...");

    ///let selector, update, options;

    /** Clean up partner labels **/


    let subjectTagCheck = Tags.findOne({name: 'subjectTags'});

    if (!subjectTagCheck) {

        let subjectTagTemplate = {
            name: 'subjectTags',
            tagCollection: []
        };

        Tags.insert(subjectTagTemplate);
    }

    let credentialTagCheck = Tags.findOne({name: 'credentialTags'});

    if (!credentialTagCheck) {

        let credentialTagTemplate = {
            name: 'subjectTags',
            tagCollection: []
        };

        Tags.insert(credentialTagTemplate);
    }



    /*
     function updatePartnerLabels(element, index, array) {
     console.log('id: ' + element._id);
     Meteor.call("setPartnerLabels", element._id);
     }

     let partnerList = Partners.find();

     partnerList.forEach(updatePartnerLabels);


     /!** Clean up Engagement Type Field **!/
     selector = {type: " Technical Cooperation"};
     update = {$set: {type: "Technical Cooperation"}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);*/

    /*
     /!** Clean up Engagement Type Field **!/
     selector = {type: " Early Innovation"};
     update = {$set: {type: "Early Innovation"}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);

     /!** Clean up Engagement Type Field **!/
     selector = {type: " Business Development"};
     update = {$set: {type: "Business Development"}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);

     /!** Clean up Engagement Type Field **!/
     selector = {type: " Internal Project"};
     update = {$set: {type: "Internal Project"}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);


     /!** Add engagementStatusIndex for engagement status **!/
     selector = {filingStatus: "active"};
     update = {$set: {filingStatusIndex: 0}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);


     selector = {filingStatus: "executing"};
     update = {$set: {filingStatusIndex: 1}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);

     selector = {filingStatus: "on hold"};
     update = {$set: {filingStatusIndex: 2}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);

     selector = {filingStatus: "closed"};
     update = {$set: {filingStatusIndex: 3}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);


     /!*    /!** Remove Extraneous Field "talent" **!/*/
    /*selector = {talent: {$exists: true}};
     update = {$unset: {talent: 1}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);

     /!** Remove Extraneous Field "contractingPartner" **!/
     selector = {contractingPartner: {$exists: true}};
     update = {$unset: {contractingPartner: 1}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);


     /!** Add Missing Field "contractingPartners" **!/
     selector = {contractingPartners: {$exists: false}};
     update = {$set: {contractingPartner: []}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);

     /!** Add Missing Field "cooperationResources" **!/
     selector = {cooperationResources: {$exists: false}};
     update = {$set: {cooperationResources: []}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);


     /!** Remove extraneous Field "cooperationPartners" **!/
     selector = {cooperationPartners: {$exists: true}};
     update = {$unset: {cooperationPartners: 1}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };

     Engagements.update(selector, update, options);
     */


    /*
     /!** Add filing status to all engagements missing it ***!/
     selector = {filingStatus: {$exists: false}};
     update = {$set: {filingStatus: "active"}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Add bdOwner label to all engagements missing it ***!/
     selector = {bdOwnerLabel: {$exists: false}};
     update = {$set: {bdOwnerLabel: ""}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Add bdRelated  to all engagements missing it ***!/
     selector = {bdRelated: {$exists: false}};
     update = {$set: {bdRelated: []}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Add bdRelated label to all engagements missing it ***!/
     selector = {bdRelatedLabel: {$exists: false}};
     update = {$set: {bdRelatedLabel: []}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Change cooperation to "Technical Cooperation ***!/
     selector = {type: 'cooperation'};
     update = {$set: {type: 'Technical Cooperation'}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Change cooperation to "Technical Cooperation ***!/
     selector = {type: 'internal'};
     update = {$set: {type: 'Internal Project'}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Change cooperation to "Technical Cooperation ***!/
     selector = {type: 'bizdev'};
     update = {$set: {type: 'Business Development'}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);


     /!** Add tempLab string to all engagements missing it ***!/
     selector = {tempLab: {$exists: false}};
     update = {$set: {tempLab: "unspecified"}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Add labs label to all engagements missing it ***!/
     selector = {labs: {$exists: false}};
     update = {$set: {labs: []}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Remove lab label***!/
     selector = {lab: {$exists: true}};
     update = {$unset: {labs: ""}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Add labs label to all engagements missing it ***!/
     selector = {pm: {$exists: false}};
     update = {$set: {pm: ""}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);

     /!** Add bizDevOwnedLabs to users ***!/
     selector = {"profile.bizDevOwnedLabs" : {$exists: false}};
     update = {$set: {"profile.bizDevOwnedLabs": []}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Meteor.users.update(selector, update, options);*/

    /*
     /!** Add Alex as viewer to all engagements which don't already have him***!/
     //NOTE: NO SAFETY CHECK ON THIS
     selector = {bdRelated: { "$ne": "rs37A54m6Q7Kz78Ym" }};
     update = {$push: {bdRelated: "rs37A54m6Q7Kz78Ym"}};
     options = {
     multi: true,    // Update multiple documents that meet selector criteria
     };
     Engagements.update(selector, update, options);
     */

});
