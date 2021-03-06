/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <eng-workspace>
 *     This directive is the the primary view for users to edit their own engagements.
 *
 *     NOTE: Since Angular-Meteor 1.3, Autobind has been removed, so changes to the client must be pushed
 *     back to the record.
 *********************************************************************************************************/

miz.directive("engWorkspace", function () {
        return {
            restrict: 'E',
            templateUrl: 'client/engagements/components/eng-workspace/eng-workspace.ng.html',
            controllerAs: 'ew',
            bindToController: true,
            transclude: true,
            controller: function ($scope, $reactive, $stateParams) {

                $reactive(this).attach($scope);

                if ($stateParams.engagementId) { //noinspection JSUnresolvedVariable
                    this.focusEngagementId = $stateParams.engagementId;
                }
                else
                    this.focusEngagementId = "dashboard";

                //start by toggling the slide open
                $('.mizmenu-submenu').slideToggle('fast');


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

                /** HELPERS **/

                this.helpers({

                        //Featured partner to be displayed and modifed
                        focusEngagement: () => {
                            this.getReactively('focusEngagementId');

                            if (this.focusEngagementId !== "dashboard") {
                                Meteor.call("engSetEngagementLabels", this.focusEngagementId);  // clean up labels
                                return Engagements.findOne({_id: this.focusEngagementId});
                            }
                        },

                        //list of all engagements tied to this users - used in dashboard summary
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
                        },

                        //list of all engagements tied to this users - used in sidebar
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

                        //Collection of Parent partners of the feature partner
                        cooperationResources: () => {
                            if (this.getReactively("focusEngagement.cooperationResources")) {
                                return Partners.find({
                                    _id: {$in: this.focusEngagement.cooperationResources}
                                });
                            }
                        },


                        //Collection of Parent partners of the feature partner
                        contractingPartners: () => {
                            if (this.getReactively("focusEngagement.contractingPartners")) {
                                return Partners.find({
                                    _id: {$in: this.focusEngagement.contractingPartners}
                                });
                            }
                        },

                        setNewFilingStatus: () => {
                            if (this.getReactively("focusEngagement.filingStatus")) {
                                this.newFilingStatus = this.focusEngagement.filingStatus;

                            }
                        },

                        formattedDealValue: () => {
                            if (this.getReactively("focusEngagement.dealValue")) {
                                let fdl = this.focusEngagement.dealValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                                return "$" + fdl;

                            } else return null;
                        },


                    }
                );


                /** SUBSCRIPTIONS **/
                this.subscribe('userEngagementList', () => {
                    return [
                        this.getReactively('engagementFilterFilingStatus'),  //variable passed to subscription
                        this.getReactively('focusEngagementId'), //ensure that a selected engagement can be seen
                        this.getReactively('engagementFilterString') //searchString - for searching all CM's engagments
                    ]
                });

                this.subscribe('images');

                this.subscribe('partnersOfEngagement', () => {
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


                /** Subscription to user list to search for bizDevOwners */
                this.subscribe('userBizDevOwnerSearch', () => {
                    return [
                        // searchTerm
                        this.getReactively('bizDevOwnerSearch')
                    ]
                });


                /** Subscription to users for list of current biz dev owners. */

                this.subscribe('userSimpleList', () => {
                    return [
                        // array of user ids to look up
                        this.getReactively('partner.bizDevOwners', true)
                    ]
                });


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
                 * Given a field name or array of field names, will update the server-side enagement with new
                 * information of focusEngagement.
                 *
                 * @param field - field or array of fields to be updated on server from focus Engagement
                 */

                this.updateEngagement = function (field) {

                    if (field) {

                        //single value
                        if (typeof field === "string") {
                            //noinspection JSUnresolvedVariable
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

                            this.call('engagementUpdate', this.focusEngagement._id, set, (err) => {
                                if (err)
                                    alert('engagementUpdate method error: ' + err);
                            });


                        } // if Array
                    } //if field
                };


                /** JQUERY **/
                /* This section controls the slide in engagement chooser from the right */

                $(function () {
                    let items = $('.overlapblackbg, .slideLeft');
                    let wsmenucontent = $('.mizmenucontent');

                    let menuopen = function () {
                        $(items).removeClass('menuclose').addClass('menuopen');
                    };
                    let menuclose = function () {
                        $(items).removeClass('menuopen').addClass('menuclose');
                    };

                    $('#navToggle').click(function () {
                        if (wsmenucontent.hasClass('menuopen')) {
                            $(menuclose)
                        }
                        else {
                            $(menuopen)
                        }
                    });

                    $('#dashboardButton').click(function () {
                        if (wsmenucontent.hasClass('menuopen')) {
                            $(menuclose)
                        }
                        else {
                            $(menuopen)
                        }
                    });

                    wsmenucontent.click(function () {
                        if (wsmenucontent.hasClass('menuopen')) {
                            $(menuclose)
                        }
                    });


                    $('#navToggle,.overlapblackbg').on('click', function () {
                        $('.mizmenucontainer').toggleClass("mrginleft");
                    });


                    /*** todo: ISSUE WITH ANGULAR DATA NOT LOADING IS IN THIS JQUERY***/
                    //$('.mizmenu-list li').has('.mizmenu-submenu, .mizmenu-submenu-sub, .mizmenu-submenu-sub-sub, .megamenu').prepend('<span class="mizmenu-click"><i class="mizmenu-arrow fa fa-angle-down"></i></span>');


                    $('.mizmenu-mobile').click(function () {
                        $('.mizmenu-list').slideToggle('slow');
                    });

                    $('.mizmenu-click').click(function () {
                        $(this).siblings('.mizmenu-submenu').slideToggle('slow');
                        $(this).children('.mizmenu-arrow').toggleClass('wsmenu-rotate');
                        $(this).siblings('.mizmenu-submenu-sub').slideToggle('slow');
                        $(this).siblings('.mizmenu-submenu-sub-sub').slideToggle('slow');
                        $(this).siblings('.megamenu').slideToggle('slow');

                    });

                });


                // The below jquery adjusts the height of the miz-menu to accomodate screenheight

                const SCREEN_OFFSET = 75;  //offset to control the distance from the bottom of the engagement list to the bottom of the screen

                $(window).resize(function () {
                    var bodyheight = $('body').height();
                    bodyheight = bodyheight - SCREEN_OFFSET;
                    $('#active-collapse').css('min-height', bodyheight + 'px');
                }).resize();

                $(window).resize(function () {
                    var bodyheight = $('body').height();
                    bodyheight = bodyheight - SCREEN_OFFSET;
                    $('#active-collapse').css('max-height', bodyheight + 'px');
                }).resize();


                /***************************************************************************************************
                 * Partner Connections Edit Button
                 * Makes the edit button appear or disappear
                 ****************************************************************************************************/

                $('#partner-label').hover(function () {

                    $(this).append('<small class="glyphicon glyphicon-pencil" data-toggle="modal" data-target="#partner-selection-modal"></small>')
                }, function () {

                    $(this).children("small").remove();
                });


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
                 * Sets the bdOwner of the engagment to the current user.
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


                    this.call("logsCreateEntry", angular.copy(newLogEntry), (err, result) => {
                        if (err) {
                            alert('Something went wrong when creating log entry: ' + err);
                            console.log(err);
                        }
                    });


                };


                /***************************************************************************************************
                 * lastUpdateString
                 * Generates a string depending upon the focusEngagement.lastUpdate field
                 ****************************************************************************************************/

                this.lastUpdateString = function () {

                    if (this.focusEngagement.lastUpdated == null || !this.focusEngagement.hasOwnProperty('lastUpdated')) {
                        return "Never updated...";
                    }

                    Date.dateDiff = function (datepart, fromdate, todate) {
                        datepart = datepart.toLowerCase();
                        var diff = todate - fromdate;
                        var divideBy = {
                            w: 604800000,
                            d: 86400000,
                            h: 3600000,
                            n: 60000,
                            s: 1000
                        };

                        return Math.floor(diff / divideBy[datepart]);
                    };


                    let today = new Date();

                    let hoursSinceLastUpdate = Date.dateDiff('h', this.focusEngagement.lastUpdated, today);
                    let daysSinceLastUpdate = Date.dateDiff('d', this.focusEngagement.lastUpdated, today);
                    let weeksSinceLastUpdate = Date.dateDiff('w', this.focusEngagement.lastUpdated, today);

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
                        return this.focusEngagement.lastUpdated.toDateString();

                };

                /***************************************************************************************************
                 * updateFilingStatus
                 * Sets the bdOwner of the engagement to the current user.
                 ****************************************************************************************************/

                this.updateFilingStatus = function () {
                    if (this.focusEngagement) {
                        if (this.focusEngagement.filingStatus != this.newFilingStatus) {
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
                            var newLogEntry = {
                                subjectId: this.focusEngagementId,
                                date: new Date(),
                                subEntries: [{
                                    headline: "Engagement status changed from " + originalFilingStatus + " to " + this.newFilingStatus,
                                    details: this.newStatus,
                                    files: []
                                }],

                            };


                            this.call("logsCreateEntry", angular.copy(newLogEntry), (err, result) => {
                                if (err) {
                                    alert('Something went wrong when creating log entry: ' + err);
                                    console.log(err);
                                }
                            });

                            if (this.newFilingStatus = 'closed') {
                                this.focusEngagement.closedDate = new Date();

                                this.focusEngagementId = "dashboard";
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
                        if (this.focusEngagement.type != this.newType) {

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

                            this.call("logsCreateEntry", angular.copy(newLogEntry), (err, result) => {
                                if (err) {
                                    alert('Something went wrong when creating log entry: ' + err);
                                    console.log(err);
                                }
                            });

                            this.newStatus = null;
                            this.focusEngagement.lastUpdated = new Date();

                            //update on the server
                            this.updateEngagement(['type', 'currentStatus', 'lastUpdated']);

                            $('#change-type-modal').modal('hide');

                        }
                    }
                };

            } // controller
        }
            ;  //return
    }
)
;
