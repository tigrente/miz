/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <eng-detail>
 *     This directive is the the primary view for users to edit their own engagements.
 *********************************************************************************************************/

miz.directive("engDetail", function () {
        return {
            restrict: 'E',
            templateUrl: 'client/engagements/components/eng-detail/eng-detail.ng.html',
            controllerAs: 'ed',
            bindToController: true,
            transclude: true,
            controller: function ($scope, $reactive, $stateParams, $state) {

                $reactive(this).attach($scope);

                if ($stateParams.engagementId) { //noinspection JSUnresolvedVariable
                    this.focusEngagementId = $stateParams.engagementId;
                }


                /** INITIALIZE **/
                // The eligable partners presented that can be selected as contracting partners.

                this.contractingPartnerTypes = [
                    'company',
                    'individual',
                    'professor',
                    'university',
                    'uniSubOrg',
                    //'contact',
                    'incubator',
                    'venture',
                    'association',
                    'other'
                ];

                //Entity selection options used to change entity
                this.entityOptions = [
                    "Futurewei",
                    "HQ",
                    "Other Huawei Entity"
                ];
                this.myEngagements = [];

                this.engagementFilterFilingStatus = "active";

                this.windowInnerHeight = window.innerHeight;

                // noinspection JSUnusedGlobalSymbols
                // noinspection Annotator
                // noinspection JSUnusedGlobalSymbols
                // noinspection Annotator
                /** HELPERS **/

                this.helpers({

                        //Featured partner to be displayed and modified
                        focusEngagement: () => {
                            // noinspection Annotator
                            this.getReactively('focusEngagementId');

                            if (this.focusEngagementId) {
                                //Meteor.call("engSetEngagementLabels", this.focusEngagementId, function(){});  // clean up labels - function to enable async running
                                return Engagements.findOne({_id: this.focusEngagementId});
                            }

                            else alert("Error: lost engagementID");
                        },

                        /*                        //list of all engagements tied to this users - used in dashboard summary
                         myEngagements: () => {
                         this.getReactively('engagementFilterString');

                         selector = {
                         $or: [
                         {bdOwner: Meteor.userId()},
                         {bdRelated: Meteor.userId()},
                         {bdOwner: {$exists: false}},
                         {bdOwner: ""}

                         ]
                         }; //selector


                         return Engagements.find(selector);
                         },*/

                        //list of all engagements tied to this users - used in sidebar
                        /*
                         mizMenuEngagements: () => {
                         this.getReactively('engagementFilterString');
                         let selector;
                         //let options;

                         if (this.engagementFilterString == null)
                         this.engagementFilterString = '';

                         if (this.engagementFilterString == '') {
                         selector = {};
                         } else {
                         selector = {
                         $or: [
                         {
                         'cooperationResourcesLabel': {
                         '$regex': '.*' + this.engagementFilterString || '' + '.*',
                         '$options': 'i'
                         }
                         },
                         {'title': {'$regex': '.*' + this.engagementFilterString || '' + '.*', '$options': 'i'}},
                         {
                         'contractingPartnersLabel': {
                         '$regex': '.*' + this.engagementFilterString || '' + '.*',
                         '$options': 'i'
                         }
                         },
                         {
                         'labLabel': {
                         '$regex': '.*' + this.engagementFilterString || '' + '.*',
                         '$options': 'i'
                         }
                         },
                         {
                         'projectManager': {
                         '$regex': '.*' + this.engagementFilterString || '' + '.*',
                         '$options': 'i'
                         }
                         }
                         ]
                         }
                         }

                         return Engagements.find(selector);
                         },
                         */

                        //Collection of Parent partners of the feature partner
                        cooperationResources: () => {
                            // noinspection Annotator
                            if (this.getReactively("focusEngagement.cooperationResources")) {
                                return Partners.find({
                                    _id: {$in: this.focusEngagement.cooperationResources}
                                });
                            }
                        },


                        //Collection of Parent partners of the feature partner
                        contractingPartners: () => {
                            // noinspection Annotator
                            if (this.getReactively("focusEngagement.contractingPartners")) {
                                return Partners.find({
                                    _id: {$in: this.focusEngagement.contractingPartners}
                                });
                            }
                        },

                        setNewFilingStatus: () => {
                            // noinspection Annotator
                            if (this.getReactively("focusEngagement.filingStatus")) {
                                this.newFilingStatus = this.focusEngagement.filingStatus;

                            }
                        },

                        formattedDealValue: () => {
                            // noinspection Annotator
                            if (this.getReactively("focusEngagement.dealValue")) {
                                let fdl = this.focusEngagement.dealValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                return "$" + fdl;

                            } else return null;
                        },


                    }
                );


                // noinspection Annotator
                /** SUBSCRIPTIONS **/
                this.subscribe('focusEngagement', () => {
                    // noinspection Annotator
                    return [
                        this.getReactively('focusEngagementId'), //ensure that a selected engagement can be seen
                    ]
                });

                /*                this.subscribe('userEngagementList', () => {
                 return [
                 this.getReactively('engagementFilterFilingStatus'),  //variable passed to subscription
                 this.getReactively('focusEngagementId'), //ensure that a selected engagement can be seen
                 this.getReactively('engagementFilterString') //searchString - for searching all CM's engagements
                 ]
                 });*/

                /*     this.subscribe('images');*/

                // noinspection Annotator
                this.subscribe('partnersOfEngagement', () => {
                    // noinspection Annotator
                    // noinspection Annotator
                    return [
                        this.getReactively('focusEngagement.cooperationResources'),  //variable passed to subscription
                        this.getReactively('focusEngagement.contractingPartners'),  //variable passed to subscription
                    ]
                });

                /*                this.subscribe('partners', () => {
                 return [
                 this.getReactively('focusEngagement.cooperationResources'),  //variable passed to subscription
                 ]
                 });*/


                // noinspection Annotator
                /** Subscription to user list to search for bizDevOwners */
                this.subscribe('userBizDevOwnerSearch', () => {
                    // noinspection Annotator
                    return [
                        // searchTerm
                        this.getReactively('bizDevOwnerSearch')
                    ]
                });


                // noinspection Annotator
                /** Subscription to users for list of current biz dev owners. */

                this.subscribe('userSimpleList', () => {
                    // noinspection Annotator
                    return [
                        // array of user ids to look up
                        this.getReactively('partner.bizDevOwners', true)
                    ]
                });


                // noinspection Annotator
                /** AUTORUN**/

                this.autorun(() => {


                    /*           this.getReactively('focusEngagement.currentStatus');
                     this.getReactively('focusEngagement.nextStep');
                     this.getReactively('focusEngagement.title');
                     this.getReactively('focusEngagement.tempOrg');
                     this.getReactively('focusEngagement.tempResource');
                     this.getReactively('focusEngagement.cooperationResources.length');
                     this.getReactively('focusEngagement.contractingPartners.length');
                     this.getReactively('focusEngagement.bdOwner');
                     this.getReactively('focusEngagement.bdRelated.length');
                     this.getReactively('focusEngagement.background');
                     this.getReactively('focusEngagement.tempLab');
                     this.getReactively('focusEngagement.projectManager');
                     this.getReactively('focusEngagement.hwEntity');
                     this.getReactively('focusEngagement.dealValue');
                     this.getReactively('focusEngagement.hqCooperationManger');


                     //update engagement on Meteor side when it changes in Angular
                     if (this.focusEngagement) { // check to see if engagement has loaded
                     //noinspection JSUnresolvedVariable
                     this.call('engagementUpdate', this.focusEngagement, (err) => {
                     if (err)
                     alert('engagementUpdate method error: ' + err);
                     });
                     }
                     */
                }); //autorun

                /** FUNCTIONS */


                /**
                 * updateEngagement
                 * Given a field name or array of field names, will update the server-side engagement with new
                 * information of focusEngagement.
                 *
                 * @param field - field or array of fields to be updated on server from focus Engagement
                 */

                this.updateEngagement = function (field) {

                    if (field) {

                        //single value
                        if (typeof field === "string") {
                            //noinspection JSUnresolvedVariable,Annotator
                            this.call('engagementUpdate', this.focusEngagement._id, field, this.focusEngagement[field], (err) => {
                                if (err)
                                    alert('engagementUpdate method error: ' + err);
                            });
                        }
                        // if array - build an object to pass
                        else if (Array.isArray(field)) {


                            let set = {};
                            for (let i = 0; i < field.length; i++) {
                                set[field[i]] = this.focusEngagement[field[i]];
                            }

                            // noinspection Annotator
                            this.call('engagementUpdate', this.focusEngagement._id, set, (err) => {
                                if (err)
                                    alert('engagementUpdate method error: ' + err);
                            });


                        } // if Array
                    } //if field
                };

                /**
                 * Angular Window resizing
                 * Bind to the window and reset sizing variables when the window resizes;
                 */


                /***************************************************************************************************
                 * setFocusEngagement
                 * Sets the presented engagement to be that of the selected did.
                 *
                 * @property {string} parentId - the id of the parent to be removed from this partner.
                 *
                 ****************************************************************************************************/


                this.setFocusEngagement = function (engagementId) {
                    this.focusEngagementId = engagementId;

                };


                /***************************************************************************************************
                 * takeOwnershipOfEngagement
                 * Sets the bdOwner of the engagement to the current user.
                 ****************************************************************************************************/

                this.takeOwnershipOfEngagement = function () {


                    if (this.focusEngagement) {
                        this.focusEngagement.bdOwner = Meteor.userId();
                    }

                    this.updateEngagement('bdOwner');

                    // automatically record a log entry for the change
                    let newLogEntry = {
                        subjectId: this.focusEngagementId,
                        date: new Date(),
                        subEntries: [{
                            headline: "Engagement owner changed  to " + Meteor.user().profile.name,
                            details: "Self assigned by " + Meteor.user().profile.name,
                            files: []
                        }],

                    };


                    // noinspection Annotator
                    // noinspection JSUnusedLocalSymbols
                    // noinspection Annotator
                    this.call("logsCreateEntry", angular.copy(newLogEntry), (err, result) => {
                        if (err) {
                            alert('Something went wrong when creating log entry: ' + err);
                            console.log(err);
                        } else
                            return result;
                    });


                };


                /***************************************************************************************************
                 * lastUpdateString
                 * Generates a string depending upon the focusEngagement.lastUpdate field
                 ****************************************************************************************************/

                this.lastUpdateString = function (date) {

                    if (!date) {
                        return "Never updated...";
                    }

                    // noinspection SpellCheckingInspection
                    Date.dateDiff = function (datepart, fromdate, todate) {
                        datepart = datepart.toLowerCase();
                        let diff = todate - fromdate;
                        let divideBy = {
                            w: 604800000,
                            d: 86400000,
                            h: 3600000,
                            n: 60000,
                            s: 1000
                        };

                        return Math.floor(diff / divideBy[datepart]);
                    };


                    let today = new Date();

                    let hoursSinceLastUpdate = Date.dateDiff('h', date, today);
                    let daysSinceLastUpdate = Date.dateDiff('d', date, today);
                    let weeksSinceLastUpdate = Date.dateDiff('w', date, today);

                    if (hoursSinceLastUpdate < 3)
                        return "Just updated!";
                    else if (hoursSinceLastUpdate < 15)
                        return "Today";
                    else if (daysSinceLastUpdate < 2)
                        return "Yesterday";
                    else if (daysSinceLastUpdate < 14)
                        return daysSinceLastUpdate + " days ago.";
                    else if (weeksSinceLastUpdate < 6)
                        return "About " + weeksSinceLastUpdate + "weeks ago.";
                    else
                        return date.toDateString();

                };

                /***************************************************************************************************
                 * updateFilingStatus
                 * Sets the bdOwner of the engagement to the current user.
                 ****************************************************************************************************/

                this.updateFilingStatus = function () {
                    if (this.focusEngagement) {
                        if (this.focusEngagement.filingStatus !== this.newFilingStatus) {
                            let originalFilingStatus = this.focusEngagement.filingStatus;
                            this.focusEngagement.filingStatus = this.newFilingStatus;
                            this.focusEngagement.currentStatus = this.newStatus;


                            switch (this.focusEngagement.filingStatus) {

                                case "active":
                                    this.focusEngagement.filingStatusIndex = 0;
                                    break;

                                case "executing":
                                    this.focusEngagement.filingStatusIndex = 1;
                                    break;

                                case "on hold":
                                    this.focusEngagement.filingStatusIndex = 2;
                                    break;

                                case "closed":
                                    this.focusEngagement.filingStatusIndex = 3;
                                    break;

                            }


                            // automatically record a log entry for the change
                            let newLogEntry = {
                                subjectId: this.focusEngagementId,
                                date: new Date(),
                                subEntries: [{
                                    headline: "Engagement status changed from " + originalFilingStatus + " to " + this.newFilingStatus,
                                    details: this.newStatus,
                                    files: []
                                }],

                            };


                            // noinspection Annotator
                            this.call("logsCreateEntry", angular.copy(newLogEntry), (err, result) => {
                                if (err) {
                                    alert('Something went wrong when creating log entry: ' + err);
                                    console.log(err);
                                } else
                                    return result;
                            });

                            if (this.newFilingStatus = 'closed') {
                                this.focusEngagement.closedDate = new Date();
                            }


                            this.focusEngagement.lastUpdated = new Date();

                            //update Serverside
                            this.updateEngagement(['filingStatus', 'currentStatus', 'filingStatusIndex', 'closedDate', 'lastUpdated']);


                            this.newStatus = "";
                            $('#change-status-modal').modal('hide');

                        }

                    }
                };

                /***************************************************************************************************
                 * updateCurrentStatusFn
                 * Update the status- used in collaboration with MizLog
                 ****************************************************************************************************/
                this.updateCurrentStatusFn = function (status) {
                    if (this.focusEngagement && status) {
                        this.focusEngagement.currentStatus = status;
                        this.updateEngagement("currentStatus");
                    }
                };


                /***************************************************************************************************
                 * updateType
                 * Update the type of engagement
                 ****************************************************************************************************/

                this.updateType = function () {
                    if (this.focusEngagement) {
                        if (this.focusEngagement.type !== this.newType) {

                            let originalType = this.focusEngagement.type;
                            this.focusEngagement.type = this.newType;
                            this.focusEngagement.currentStatus = this.newStatus;


                            //automatically record a log entry for the change
                            let newLogEntry = {
                                subjectId: this.focusEngagementId,
                                date: new Date(),
                                subEntries: [{
                                    headline: "Engagement type changed from " + originalType + " to " + this.newType,
                                    details: this.newStatus,
                                    files: []
                                }],

                            };

                            // noinspection Annotator
                            this.call("logsCreateEntry", angular.copy(newLogEntry), (err, result) => {
                                if (err) {
                                    alert('Something went wrong when creating log entry: ' + err);
                                    console.log(err);
                                } else
                                    return result;
                            });

                            this.newStatus = null;
                            this.focusEngagement.lastUpdated = new Date();

                            //update on the server
                            this.updateEngagement(['type', 'currentStatus', 'lastUpdated']);

                            $('#change-type-modal').modal('hide');

                        }
                    }
                };

                /*********************************************************************************************************
                 * viewEngagementTeamSummary
                 * Opens Engagement User Summary
                 ********************************************************************************************************/

                this.viewEngagementTeamSummary = function () {
                    //todo: change this to a state change, which provides faster, smoother transition.  Currently a state changes breaks on the 2nd page transition.
                    $state.go("engagementTeamSummary");

                    /*  location.href = '/engagement-team-summary';*/
                };

                /*********************************************************************************************************
                 * viewEngagementUserSummary
                 * Opens Engagement User Summary
                 ********************************************************************************************************/

                this.viewEngagementUserSummary = function () {
                    $state.go("engagementUserSummary");

                    /* location.href = '/engagement-user-summary';*/
                };


       /*         /!***************************************************************************************************
                 * jquery - Partner Connections Edit Button
                 * Makes the edit button appear or disappear
                 ****************************************************************************************************!/

                $('#partner-label').hover(function () {

                    $(this).append('<small style="color:white" class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#partner-selection-modal"></small>')
                }, function () {

                    $(this).children("small").remove();
                });
*/

                /***************************************************************************************************
                 * jquery - The below jquery adjusts the height of each tab
                 ****************************************************************************************************/

                    //todo: purge the evil jQuery and make this pure angular


                let tabFooterOffset = 10;
                let tabHeaderOffset = 330;

               //todo: Fix this hack, which resizes the log a 1/2 second after the page load
                setTimeout(function () {
                    let bodyHeight = $('body').height();
                    //let logHeaderOffset = wrapperElement.offset().top;

                    let tabHeight = bodyHeight - tabHeaderOffset - tabFooterOffset;
                    $('#payment-panel').css({'min-height': tabHeight + 'px', 'max-height': tabHeight + 'px;', 'height': tabHeight + 'px'});
                    $('#checklist-panel-wrapper').css({'min-height': tabHeight + 'px', 'max-height': tabHeight + 'px;', 'height': tabHeight + 'px'});
                    $('#acceptance-report-panel').css({'min-height': tabHeight + 'px', 'max-height': tabHeight + 'px;', 'height': tabHeight + 'px'});
                }, 1000);

                $(window).resize(function () {
                    let bodyHeight = $('body').height();
                    let tabHeight = bodyHeight - tabHeaderOffset - tabFooterOffset;
                    $('#payment-panel').css({'min-height': tabHeight + 'px', 'max-height': tabHeight + 'px;', 'height': tabHeight + 'px'});
                    $('#checklist-panel-wrapper').css({'min-height': tabHeight + 'px', 'max-height': tabHeight + 'px;', 'height': tabHeight + 'px'});
                    $('#acceptance-report-panel').css({'min-height': tabHeight + 'px', 'max-height': tabHeight + 'px;', 'height': tabHeight + 'px'});
                }).resize();


            } // controller
        }
            ;  //return
    }
)
;
