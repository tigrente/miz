/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <eng-dashboard>
 *     This directive presents a summary list of a user's engagements
 *
 *     NOTE: Since Angular-Meteor 1.3, Autobind has been removed, so changes to the client must be pushed
 *     back to the record.
 *********************************************************************************************************/

miz.directive("engUserSummary", function () {
        return {
            restrict: 'E',
            templateUrl: 'client/engagements/components/eng-user-summary/eng-user-summary.ng.html',
            controllerAs: 'ed',
            bindToController: true,
            transclude: true,
            controller: function ($scope, $reactive, $state) {

                $reactive(this).attach($scope);

                /** INITIALIZATION **/
                this.engagementFilterFilingStatus = 'active';
                this.engagementFilterString = '';

                // These variables enable a limit. If limit = 0, all enagements are fetched
                this.engagementSafetyLimit = 200;
                this.engagementSafetyEnabled = true;
                this.showEngagementSafetyButton = false;


                /** HELPERS **/

                this.helpers({

                        currentUser() {
                            if (Meteor.user()) {
                                let user = Meteor.user();
                                return user.profile.name;
                            }
                        },

                        //list of all engagements tied to this users - used in dashboard summary
                        engagementCollection: () => {
                            this.getReactively('engagementFilterString');
                            this.getReactively('engagementFilterFilingStatus');

                            if (Meteor.user()) {

                                selector = {
                                    $or: [
                                        {bdOwner: Meteor.userId()},
                                        {bdRelated: Meteor.userId()},
                                        {bdOwner: {$exists: false}},
                                        {bdOwner: ""}

                                    ]
                                }; //selector

                                let collection = Engagements.find(selector);

                                if (this.engagementSafetyEnabled) {
                                    if (collection.count() >= this.engagementSafetyLimit)
                                        this.showEngagementSafetyButton = true;
                                    else
                                        this.showEngagementSafetyButton = false;
                                }
                                return collection;
                            }
                        }
                    });


                    /** SUBSCRIPTIONS **/
                    this.subscribe('userEngagementList', () => {
                        return [
                            this.getReactively('engagementFilterFilingStatus'),  //variable passed to subscription
                            this.getReactively('engagementSafetyLimit') // limit
                        ]
                    });

                /** AUTORUN**/


                /** FUNCTIONS */

                /***************************************************************************************************
                 * lastUpdateString
                 * Generates a string depending upon the .lastUpdate field
                 * This is called from HTML - ignore Webstorm warnings
                 ****************************************************************************************************/

                this.lastUpdateString = function (lastUpdate) {

                    if (lastUpdate === null) {
                        return "Never updated...";
                    }

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

                    let hoursSinceLastUpdate = Date.dateDiff('h', lastUpdate, today);
                    let daysSinceLastUpdate = Date.dateDiff('d', lastUpdate, today);
                    let weeksSinceLastUpdate = Date.dateDiff('w', lastUpdate, today);

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
                        return lastUpdate.toDateString();

                };


                /***************************************************************************************************
                 * overdue
                 * Looks at time and changes styling
                 ****************************************************************************************************/

                this.overdue = function (engagement) {

                    if (engagement.lastUpdated === null) {
                        return "info";
                    }

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

                    let hoursSinceLastUpdate = Date.dateDiff('h', engagement.lastUpdated, today);
                    let daysSinceLastUpdate = Date.dateDiff('d', engagement.lastUpdated, today);
                    // let weeksSinceLastUpdate = Date.dateDiff('w', engagement.lastUpdated, today);

                    if (hoursSinceLastUpdate < 10)
                        return "info";

                    if (daysSinceLastUpdate > 5 && engagement.filingStatus === 'active')
                        return "danger";

                    if (daysSinceLastUpdate > 3 && engagement.filingStatus === 'active')
                        return "warning";


                };

                /*********************************************************************************************************
                 * viewEngagementDetail
                 * @engagementId: The id of the clicked engagement
                 * Opens Page with Engagement
                 ********************************************************************************************************/

                this.viewEngagementDetail = function (engagementId) {
                    /* location.href ="/engagements/" + engagementId;*/
                    $state.go("engagementDetails", {engagementId: engagementId});
                };



                /*********************************************************************************************************
                 * viewEngagementTeamSummary
                 * Opens Engagement User Summary
                 ********************************************************************************************************/

                this.viewEngagementTeamSummary = function () {
                    /*location.href = '/engagement-team-summary';*/
                    $state.go("engagementTeamSummary");
                };

                /*********************************************************************************************************
                 * turnOffSafety
                 * Turns off safety - loads all engagements and hides button
                 ********************************************************************************************************/

                this.turnOffSafety = function () {
                  this.engagementSafetyLimit = 0;
                  this.engagementSafetyEnabled = false;
                  this.showEngagementSafetyButton = false;
                };



                /** JQUERY **/
// The below jquery adjusts the height and width of the table body to accommodate the screen dimensions

                $(window).resize(function () {
                    let bodyheight = $('body').height();
                    bodyheight = bodyheight - 160;
                    $('#en-personal-dashboard-wrapper').css('min-height', bodyheight + 'px');

                }).resize();

                $(window).resize(function () {
                    let bodyheight = $('body').height();
                    bodyheight = bodyheight - 160;
                    $('#en-personal-dashboard-wrapper').css('max-height', bodyheight + 'px');
                }).resize();

                $(window).resize(function () {
                    let bodywidth = $('body').width();
                    bodywidth = bodywidth - 15;
                    $('#en-personal-dashboard-wrapper').css('width', bodywidth + 'px');
                }).resize();


            } // controller
        }
            ;  //return
    }
)
;
