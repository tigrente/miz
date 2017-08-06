/**
 * Created by Alex on 10/19/15.
 */

/** PUBLISH FUNCTIONS **/


/**
 * engagementsAll
 * Publishes all engagements with no Filtering.
 */

Meteor.publish('engagementsAll', function () {
    return Engagements.find();
});


/**
 * engagementsSearch
 * Publishes engagements for miz Search bar
 */

Meteor.publish('engagementsSearch', function (searchString, engagementLimit) {


    let selector = {

        $or: [
            {
                'bdOwnerLabel': {
                    '$regex': '.*' + searchString || '' + '.*',
                    '$options': 'i'
                }
            },
            {
                'contractingPartnersLabel': {
                    '$regex': '.*' + searchString || '' + '.*',
                    '$options': 'i'
                }
            },
            {
                'cooperationResourcesLabel': {
                    '$regex': '.*' + searchString || '' + '.*',
                    '$options': 'i'
                }
            },
            {'title': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
            {'tempLab': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
            {'labLabel': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
        ]
    };

    let options = {
        limit: engagementLimit,
        sort: {filingStatusIndex: 1, modifiedDate: -1}
    };

    return Engagements.find(selector, options);
});

/**
 * focusEngagement
 * Publishes a specific engagement nby ID
 * focusId: Always returns the record of the focusID, regardless of whether or not it is closed
 */

Meteor.publish('focusEngagement', function (focusId) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewEngagements', 'editEngagements'])) {
        throw new Meteor.Error("Access denied")
    }

    return Engagements.find(focusId);

}); // Publication


/**
 * userEngagementList
 * Publishes engagements belonging to the requesting user id.
 * activeOnly: boolean - when true, does not return any engagements that have filingStatus of 'closed'.
 * focusId: Always returns the record of the focusID, regardless of whether or not it is closed
 */

Meteor.publish('userEngagementList', function (filingStatus, limit) {

        if (!Roles.userIsInRole(this.userId,
                ['superAdmin', 'viewEngagements', 'editEngagements'])) {
            throw new Meteor.Error("Access denied")
        }

        let selector;

        //This section returns all of the user's personal engagements, including active, executing, on hold, and closed
        //as well as the selected engagement


        selector = {
            $and: [
                {filingStatus: filingStatus},
                {
                    $or: [
                        {bdOwner: this.userId},
                        {bdRelated: this.userId},
                        {bdOwner: {$exists: false}},
                        {bdOwner: ""},
                        /*{_id: focusId}*/
                    ]
                }
            ]
        }; //selector

        let options = {};

        if (limit) {
            options.limit = limit + 1;
        }
        return Engagements.find(selector, options);

    }
); // Publication


/**
 * engagementTeamSummary
 * Publishes Engagements according to filter criteria.  Used for the team summary.
 *
 */

Meteor.publish('engagementTeamSummary', function (filterTypeSelector, filterStatusSelector, filterBdOwnerSelector,
                                                  sortOptions, filter_search, limit) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewEngagements', 'editEngagements'])) {
        throw new Meteor.Error("Access denied")
    }

    let selector = {
        $and: [
            filterTypeSelector,
            filterStatusSelector,
            filterBdOwnerSelector,


            {
                $or: [
                    {'bdOwnerLabel': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'contractingPartnersLabel': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'cooperationResourcesLabel': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'title': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'tempLab': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'labLabel': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'projectManager': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                ]
            }


        ]

    };


    options = {
        limit: limit,
        fields: {
            lastUpdated: 1,
            currentStatus: 1,
            nextStep: 1,
            type: 1,
            filingStatus: 1,
            bdOwnerLabel: 1,
            contractingPartnersLabel: 1,
            cooperationResourcesLabel: 1,
            title: 1,
            tempLab: 1,
            labLabel: 1,
            projectManager: 1,
        }
    };

    Object.assign(options, sortOptions);


    return Engagements.find(selector, options);


});

/**
 * eiAcceptanceSummary
 * Publishes Engagements according to filter criteria.  Used for the engagement team summary
 */

Meteor.publish('eiAcceptanceSummary', function (filterStatusSelector, filterBdOwnerSelector,
                                                sortOptions, filter_search, limit) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewEngagements', 'editEngagements'])) {
        throw new Meteor.Error("Access denied")
    }

    let selector = {
        $and: [
            {"type": 'Early Innovation'},
            filterStatusSelector,
            filterBdOwnerSelector,


            {
                $or: [
                    {'bdOwnerLabel': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'contractingPartnersLabel': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'cooperationResourcesLabel': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'title': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'tempLab': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'labLabel': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                    {'projectManager': {'$regex': '.*' + filter_search || '' + '.*', '$options': 'i'}},
                ]
            }


        ]

    };


    options = {
        limit: limit
    };

    Object.assign(options, sortOptions);

    let engagementCollection = Engagements.find(selector, options);


// Update acceptance status for all returned items
    engagementCollection.forEach(function (engagement) {
        console.log(engagement.title);
        Meteor.call("engUpdateEiAcceptanceStatus", engagement._id);
    });

    return engagementCollection;


});


/**
 * engagementList
 * Publises list according to filter
 */

Meteor.publish('engagementList', function (options) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewEngagements', 'editEngagements'])) {
        throw new Meteor.Error("Access denied")
    }


    if (options === null)
        options = '';

    // Restrict the fields to be exposed and add it to the options object.
    let fieldOption = {
        fields: {
            title: 1,
            backgroundInfo: 1,
            bdOwner: 1
        }
    };


    options["fields"] = fieldOption["fields"];


    return Engagements.find(/*{
     $and: [
     {
     $or: [
     /!*                    {'name': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
     {'description': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},*!/
     {'bdOwner': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
     /!*                    {'keywords': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}},
     {'partnerType': {'$regex': '.*' + searchString || '' + '.*', '$options': 'i'}}*!/
     ]
     },

     {'partnerType': {'$regex': '.*' + partnerFilter || '' + '.*', '$options': 'i'}}
     ]
     }, options*/);
});


/** engagementsOfPartner  **/

Meteor.publish('engagementsOfPartner', function (partnerId) {

    if (!Roles.userIsInRole(this.userId,
            ['superAdmin', 'viewEngagements', 'editEngagements'])) {
        throw new Meteor.Error("Access denied")
    }

    let selector = {
        $or: [
            {cooperationResources: partnerId},
            {contractingPartners: partnerId}
        ]
    };


    let options = {
        /* fields: {
         cooperationResources: 1,
         contractingPartners: 1,
         title: 1,
         bdOwner: 1,
         bdRelated: 1

         }*/
    };

    return Engagements.find(selector, options);//return)
});


/** PARTNER SERVER METHODS **/


Meteor.methods({

    engCreateEngagement: function (newEngagement) {
        // Check privilege
        if (!Roles.userIsInRole(Meteor.userId(),
                ['superAdmin',
                    'editEngagements',
                    'editAllEngagements'
                ])) {
            throw new Meteor.Error("Insufficient Privilege to add new Engagement.")
        }

        console.log("Adding new engagement...");


        //add auto data
        newEngagement.createdById = Meteor.userId();
        newEngagement.creationDate = new Date();
        newEngagement.modifiedById = Meteor.userId();
        newEngagement.modifiedDate = new Date();

        return Engagements.insert(newEngagement, (err, data) => {
            if (err)
                console.log('Error adding new Engagement to db: ' + err);
            else {
                console.log('New Engagement Created: ' + data);
                Meteor.call("engSetEngagementLabels", data);
            }
        });

    },


    /**
     * engagementUpdate
     * Updates engagement with updated data.  Accepts arrays or variables
     *
     * @param engagementId - id of engagement to be updated
     * @param field - array or string - field to be updated or array of fields to be updated
     * @param data - variable or array of variables to be updated
     */

    engagementUpdate: function (engagementId, field, data) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("Method engagementUpdate run.  [ID: " + engagementId + "] [field: " + field + "] [new info:" + data + "]");

        // If the field to be updated includes any of these fields, update the labels on the engagement.
        let updateLabels = false;
        let labelUpdateArray = [
            "cooperationResources",
            "contractingPartners",
            "bdOwner",
            "bdRelated",
            "filingStatus"
        ];


        if (engagementId && field) {

            let set = {};

            //if a simple field and data value was passed, do this...

            if ((typeof field === "string") && ((typeof data === "number") || (typeof data === "string") || ( data === null))) {
                set[field] = data;

                //check if labels need to be udpated, and if so, do it.
                if (labelUpdateArray.includes(field))
                    updateLabels = true;

            }


            //if an object was passed as a field,
            else if (typeof field === "object") {
                //array was passed  -assumes array of fields and array of updates with matching index || todo: depricate this)
                if (Array.isArray(field)) {
                    for (let i = 0; i < field.length; i++)
                        set[field[i]] = data[i];
                }
                // an object was passed
                else {
                    //troubleshooting with log
                    /*                   let str = JSON.stringify(field);
                                       str = JSON.stringify(field, null, 4); // (Optional) beautiful indented output.
                                       console.log('an object was passed:' + str); // Logs output to dev tools console.
                   */
                    set = field;

                    for (let i = 0; i < labelUpdateArray.length; ++i) {
                        if (set.hasOwnProperty(labelUpdateArray[i]))
                            updateLabels = true;
                    }
                }
            }

            // update metafields
            set[field['modifiedById']] = Meteor.userId();
            set[field['modifiedDate']] = new Date();

            //console.log(set);

            Engagements.update(engagementId, {$set: set});


            if (updateLabels)
                Meteor.call("engSetEngagementLabels", engagementId);


        }// if engagement

    }
    ,  // engagementUpdate

    /**
     * engagementInitializeEarlyInnovationProjectData
     * Updates engagement with eiProjectData
     *
     * @param engagementId - id of engagement to be updated
     */

    engagementInitializeEarlyInnovationProjectData: function (engagementId) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("Initializing EI Project Data for:" + engagementId);

        let eiTemplate = {

            acceptanceAndPayments: {
                paymentSchedule: [],       //array of objects with payment milestones and dates
                additionalPayments: [],
                additionalFinalAcceptance: {
                    targetDate: null,
                    actualDate: null,
                    deliverables: null
                },
                options: {
                    additionalFinalAcceptance: false,
                    relativeTime: null,
                    deliverables: null

                },
                status: "schedule incomplete"
            },


            contract: {
                fileId: null,
                signingDate: null,
                contractValue: null

            },

            purchaseRequest: {
                prDate: null,
                prNumber: null
            },

            acceptanceTeam: [
                {name: "", idNumber: "", title: "", role: "", independent: false},
                {name: "", idNumber: "", title: "", role: "", independent: false},
                {name: "", idNumber: "", title: "", role: "", independent: false}
            ]


        };

        let set = {"earlyInnovationProjectData": eiTemplate};

        Engagements.update(engagementId, {$set: set});


    },  // engagementInitializeEarlyInnovationProjectData


    engagementResetEIAcceptanceAndPayments: function (engagementId) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        console.log("Initializing EI Payment Data for:" + engagementId);

        let engagement = Engagements.findOne(engagementId);

        // if there is not engagemend data at all, rebuild the whole thing
        if (!engagement.hasOwnProperty("earlyInnovationProjectData")) {
            Meteor.call("engagementInitializeEarlyInnovationProjectData", engagementId);
            return true;
        } else {
            // Otherwise, just reset all the payment fields.

            set = {
                "earlyInnovationProjectData.acceptanceAndPayments": {
                    paymentSchedule: [],       //array of objects with payment milestones and dates
                    additionalPayments: [],
                    options: {},
                    status: "schedule incomplete"

                }
            };

            Engagements.update(engagementId, {$set: set});

        } //else

    }
    ,


    engagementResetEIAcceptanceTeam: function (engagementId) {

        if (!Meteor.userId()) {
            console.log("No user was authorized to update the partner.");
            throw new Meteor.Error("not-authorized");
        }

        let engagement = Engagements.findOne(engagementId);

        // if there is not engagemend data at all, rebuild the whole thing
        if (!engagement.hasOwnProperty("earlyInnovationProjectData")) {
            Meteor.call("engagementInitializeEarlyInnovationProjectData", engagementId);
            return true;
        } else {
            // Otherwise, just reset all the payment fields.

            set = {
                "earlyInnovationProjectData.acceptanceTeam": [
                    {name: "", idNumber: "", title: "", role: "", independent: false},
                    {name: "", idNumber: "", title: "", role: "", independent: false},
                    {name: "", idNumber: "", title: "", role: "", independent: false}
                ]

            };

            Engagements.update(engagementId, {$set: set});

        } //else

    }
    ,


    engagementUpdateEIPaymentSchedule: function (engagementId, paymentScheduleArray) {

        /*paymentScheduleArrayconsole.log("EI Payment Update run");*/

        let set = {
            "earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule": paymentScheduleArray
        };

        Engagements.update(engagementId, {$set: set});

    }
    ,

    engagementUpdateEIAcceptanceAndPayments: function (engagementId, apObject) {

        /*paymentScheduleArrayconsole.log("EI Payment Update run");*/

        let set = {
            "earlyInnovationProjectData.acceptanceAndPayments": apObject
        };

        Engagements.update(engagementId, {$set: set});

    }
    ,


    engagementUpdateEIAcceptanceTeam: function (engagementId, acceptanceTeamArray) {


        let set = {
            "earlyInnovationProjectData.acceptanceTeam": acceptanceTeamArray
        };

        Engagements.update(engagementId, {$set: set});

    }
    ,

    engagementUpdateEIAdditionalPayments: function (engagementId, paymentScheduleArray) {

        /*  console.log("EI Payment Update run");
         */
        let set = {
            "earlyInnovationProjectData.acceptanceAndPayments.additionalPayments": paymentScheduleArray
        };

        Engagements.update(engagementId, {$set: set});
    }
    ,

    engagementUpdateEIPaymentOption: function (engagementId, option, value) {

        //console.log("EI Payment Option Update run");

        let key = "earlyInnovationProjectData.acceptanceAndPayments.options." + option;

        //console.log(key);

        let set = {};

        set[key] = value;

        Engagements.update(engagementId, {$set: set});

    }
    ,

    engagementUpdateEIAdditionalFinalAcceptance: function (engagementId, option, value) {

        //console.log("EI Payment Option Update run");

        let key = "earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance." + option;

        //console.log(key);

        let set = {};

        set[key] = value;

        Engagements.update(engagementId, {$set: set});

    }
    ,

    engagementUpdateEIContractData: function (engagementId, contractData) {

        //console.log("EI Payment contract data Update run");

        let key = "earlyInnovationProjectData.contract";

        //console.log(key);

        let set = {};

        set[key] = contractData;

        Engagements.update(engagementId, {$set: set});


        // Update Deal Value

        let engagement = Engagements.findOne(engagementId);

        if (engagement.dealValue !== engagement.earlyInnovationProjectData.contract.contractValue) {
            Engagements.update(engagementId, {$set: {"dealValue": engagement.earlyInnovationProjectData.contract.contractValue}});

        }

    }
    ,


    /**
     * setEngagementPartnerLabels
     *
     * Because mongoDB is a noSQL database that doesn't do joins, per se, this function is required to 'denormalize'
     * relational data.  This function updates the engagement record with the relational information for partner names,
     * users, etc. This pushes activity to the server, but should significantly reduce the number of calls that might
     * be required trying to emulate a relational database.
     */
    engSetEngagementLabels: function (engagementId) {

        console.log("Method engSetEngagementLabels run: " + engagementId);

        if (engagementId) {
            let engagement = Engagements.findOne(engagementId);

            if (engagement) {

                /** PREPARE PARTNER LABELS **/
                let tempCooperationResourcesLabel = [];
                let tempContractingPartnersLabel = [];


                for (let i = 0; i < engagement.cooperationResources.length; i++) {
                    let partner = Partners.findOne(engagement.cooperationResources[i]);
                    tempCooperationResourcesLabel.push(partner.name);
                }

                for (let i = 0; i < engagement.contractingPartners.length; i++) {
                    let partner = Partners.findOne(engagement.contractingPartners[i]);
                    tempContractingPartnersLabel.push(partner.name);
                }


                /** PREPARE BD OWNER LABELS **/
                let tempBdOwnerLabel = "";
                let tempBdRelatedLabel = [];

                if (engagement.bdOwner) {
                    let bdOwner = Meteor.users.findOne(engagement.bdOwner);
                    tempBdOwnerLabel = bdOwner.profile.name;
                }

                for (let i = 0; i < engagement.bdRelated.length; i++) {
                    let bdOwner = Meteor.users.findOne(engagement.bdRelated[i]);
                    tempBdRelatedLabel.push(bdOwner.profile.name);
                }


                /** PREPARE ENGAGEMENT filingStatusIndex  **/
                let tempFilingStatusIndex = 0;

                switch (engagement.filingStatus) {

                    case "active":
                        tempFilingStatusIndex = 0;
                        break;

                    case "executing":
                        tempFilingStatusIndex = 1;
                        break;

                    case "on hold":
                        tempFilingStatusIndex = 2;
                        break;

                    case "closed":
                        tempFilingStatusIndex = 3;
                        break;

                }


                /** UPDATE THE RECORD **/
                let selector = {_id: engagementId};

                let update = {
                    $set: {
                        contractingPartnersLabel: tempContractingPartnersLabel,
                        cooperationResourcesLabel: tempCooperationResourcesLabel,
                        bdOwnerLabel: tempBdOwnerLabel,
                        bdRelatedLabel: tempBdRelatedLabel,
                        filingStatusIndex: tempFilingStatusIndex
                    }
                };
                Engagements.update(selector, update);
            } //if engagement
        } // if engagementId

    },


    /**
     * engEiCheckForEarlyEngagementProjectData
     * Checks to see if earlyInnovatioProjectData is part of an engagement.  If so, returns false.  If not,
     * creates it and returns true, so that caller may recognize flag and retrieve the updated record
     * @param engagementId
     */

    engEiNeedToRefreshForNewEiProjectData: function (engagementId) {

        let engagement = Engagements.findOne(engagementId);
        let refresh = false;

        //Check for earlyInnovationData - initialize if nothing there
        if (!engagement.hasOwnProperty('earlyInnovationProjectData')) {
            refresh = true;
            console.log("Ei project data didn't exist for: " + engagement.title + ". Creating it...");
            Meteor.call("engagementInitializeEarlyInnovationProjectData", engagementId);
        }

        if (!engagement.earlyInnovationProjectData.hasOwnProperty('acceptanceAndPayments')) {
            refresh = true;
            console.log("Ei project data didn't exist for: " + engagement.title + ". Creating it...");
            Meteor.call("engagementInitializeEarlyInnovationProjectData", engagementId);
        }

        return refresh;

    },


    engUpdateEiAcceptanceStatus: function (engagementId) {

        /**
         * engUpdateEiAcceptanceStatus
         * Does a check to see if the schedule, acceptance Criteria, and acceptance team have been defined for a project.
         * Returns a string status.
         * @param engagementId
         */



        //Check for earlyInnovationData - initialize if nothing there
        Meteor.call('engEiNeedToRefreshForNewEiProjectData', engagementId);

        let totalAcceptanceSpecificationComplete = false;
        let statusMessage = "Analyzing...";

        Meteor.call("engUpdateEiAcceptanceStatusScheduleComplete", engagementId);
        Meteor.call("engUpdateEiAcceptanceStatusCriteriaComplete", engagementId);

        let engagement = Engagements.findOne(engagementId);
        let acceptanceStatus = engagement.earlyInnovationProjectData.acceptanceAndPayments.acceptanceStatus;


        if (acceptanceStatus.scheduleComplete &&
            acceptanceStatus.criteriaComplete) {
            totalAcceptanceSpecificationComplete = true;
            statusMessage = "Acceptance Spec Complete"  //should not see this.
        }
        else {
            totalAcceptanceSpecificationComplete = false;
            statusMessage = "Acceptance Spec Incomplete!"  //should not see this.
        }


        let selector = {_id: engagementId};

        let update = {
            $set: {
                "earlyInnovationProjectData.acceptanceAndPayments.acceptanceStatus.statusMessage": statusMessage
            }
        };

        Engagements.update(engagementId, update);

    },


    engUpdateEiAcceptanceStatusScheduleComplete: function (engagementId) {

        //Check for earlyInnovationData - initialize if nothing there
        let engagement = Engagements.findOne(engagementId);
        let refreshRequired = Meteor.call('engEiNeedToRefreshForNewEiProjectData', engagementId);
        if (refreshRequired)
            engagement = Engagements.findOne(engagementId);


        let scheduleComplete = false;

        if (engagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length &&
            engagement.earlyInnovationProjectData.contract.signingDate) {
            for (let i = 0; i < engagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length; ++i) {
                // check to see if the target date is valid.
                if (Object.prototype.toString.call(engagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate) === "[object Date]") {
                    // it is a date
                    if (isNaN(engagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[i].targetDate.getTime())) {
                        // date is not valid
                        scheduleComplete = false;
                    }
                    else
                        scheduleComplete = true;
                }
                else
                    scheduleComplete = false;
            }//for

            //do check on final payment
            if (engagement.earlyInnovationProjectData.acceptanceAndPayments.options.additionalFinalAcceptance) {
                if (Object.prototype.toString.call(engagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate) === "[object Date]") {
                    // it is a date
                    if (isNaN(engagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.targetDate.getTime())) {
                        // date is not valid
                        scheduleComplete = false;
                    }
                    else
                        scheduleComplete = true;
                }
                else
                    scheduleComplete = false;
            }
        }

        //console.log("UpdateAcceptanceStatus (Schedule): " + scheduleComplete);

        let selector = {_id: engagementId};

        let update = {
            $set: {
                "earlyInnovationProjectData.acceptanceAndPayments.acceptanceStatus.scheduleComplete": scheduleComplete
            }
        };

        Engagements.update(engagementId, update);

    }
    ,

    /***
     * engUpdateEiAcceptanceStatusCriteriaComplete
     * Checks payementStatus array of engagement to see if every payment and final payment acceptance criteria is defined.
     * @param engagementId
     */

    engUpdateEiAcceptanceStatusCriteriaComplete: function (engagementId) {

        let engagement = Engagements.findOne(engagementId);
        //Check for earlyInnovationData - initialize if nothing there
        let refreshRequired = Meteor.call('engEiNeedToRefreshForNewEiProjectData', engagementId);
        if (refreshRequired)
            engagement = Engagements.findOne(engagementId);


        let paymentSchedule = engagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule; //shorthand
        let criteriaComplete;  // is the acceptanceCriteriaCompelte


        if (paymentSchedule.length === 0)
            criteriaComplete = false;  //there are no payments scheduled, so no acceptance criteria
        else {
            //it does exists - so let's see if every planned payment has an acceptance criteria for it.
            let allHaveAcceptanceCriteria = true;
            for (let i = 0; i < paymentSchedule.length; ++i) {
                if (!paymentSchedule[i].deliverables) {
                    allHaveAcceptanceCriteria = false;
                    break;
                }
            }

            if (engagement.earlyInnovationProjectData.acceptanceAndPayments.options.additionalFinalAcceptance) {
                if (!engagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.deliverables) {
                    allHaveAcceptanceCriteria = false;
                }
            }
            criteriaComplete = allHaveAcceptanceCriteria;

        }


// update engagement with new status

        //console.log("UpdateAcceptanceStatus (Schedule): " + scheduleComplete);

        let selector = {_id: engagementId};

        let update = {
            $set: {
                "earlyInnovationProjectData.acceptanceAndPayments.acceptanceStatus.criteriaComplete": criteriaComplete
            }
        };

        Engagements.update(engagementId, update);

    },


})
; // Meteor methods


