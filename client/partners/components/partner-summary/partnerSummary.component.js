/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <partner-summary>
 *     Landing page of the partner tab.  Shows partner statistics, latest partners, etc.
 *********************************************************************************************************/

miz.directive("partnerSummary", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/partners/components/partner-summary/partner-summary.ng.html',
        controllerAs: 'partnerSummary',
        bindToController: true,
        scope: {},
        //transclude: true,
        controller: function ($scope, $reactive, $state) {

            $reactive(this).attach($scope);

            this.partnerStats = {
                partnerCount: 0,
                companyCount: 0
            };

            this.call('partnerStatistics', (err, result) => {
                this.partnerStats = result;
            });

            this.burstOptions = {
                "chart": {
                    "type": "sunburstChart",
                    "height": 350,
                    "duration": 500,
                    "dispatch": {},
                    "sunburst": {
                        "dispatch": {},
                        "width": 300,
                        "height": 300,
                        "mode": "count",
                        "id": 9018,
                        "duration": 500,
                        "groupColorByParent": false,
                        "showLabels": true,
                        "labelThreshold": 0.02,
                        "margin": {"top": 0, "right": 0, "bottom": 0, "left": 0}
                    },
                    "tooltip": {
                        "duration": 0,
                        "gravity": "w",
                        "distance": 25,
                        "snapDistance": 0,
                        "classes": null,
                        "chartContainer": null,
                        "enabled": false,
                        "hideDelay": 200,
                        "headerEnabled": false,
                        "fixedTop": null,
                        "offset": {"left": 0, "top": 0},
                        "hidden": true,
                        "data": null,
                        "id": "nvtooltip-25893"
                    },
                    "width": 600,
                    "mode": "count",
                    "groupColorByParent": false,
                    "showLabels": true,
                    "labelThreshold": 0.02,
                    "margin": {"top": 30, "right": 20, "bottom": 20, "left": 20},
                    "noData": null,
                    "defaultState": null
                },
                "title": {
                    "enable": false,
                    "text": "Write Your Title",
                    "className": "h4",
                    "css": {"width": "600px", "textAlign": "center"}
                },
                "subtitle": {
                    "enable": false,
                    "text": "Write Your Subtitle",
                    "css": {"width": "600px", "textAlign": "center"}
                },
                "caption": {
                    "enable": false,
                    "text": "Figure 1. Write Your Caption text.",
                    "css": {"width": "600px", "textAlign": "center"}
                },
                "styles": {"classes": {"with-3d-shadow": true, "with-transitions": true, "gallery": true}, "css": "color:white"}
            };

            this.burstData = [{
                "name": "Partners",
                "children": [
                    {
                        "name": "Cooperation Resources",
                        "children": [
                            {"name": "Professors", "size": this.partnerStats.professorCount},
                            {"name": "Independent Contractors", "size": this.partnerStats.individualCount},
                            {"name": "Companies", "size": this.partnerStats.companyCount}
                        ]
                    },
                    {
                        "name": "Non-Cooperation Resources",
                        "children": [
                            {"name": "Universities", "size": this.partnerStats.universityCount},
                            {"name": "University Labs and Memberships", "size": this.partnerStats.uniSubOrgCount},
                            {"name": "Industry Associations", "size": this.partnerStats.associationCount},
                            {"name": "Incubators", "size": this.partnerStats.incubatorCount},
                            {"name": "Venture Firms", "size": this.partnerStats.ventureCount},
                            {"name": "Contacts", "size": this.partnerStats.contactCount},

                        ]
                    },

                ]
            }];


            /** HELPERS **/

            this.helpers({

                    currentUser() {
                        if (Meteor.user()) {
                            let user = Meteor.user();
                            return user.profile.name;
                        }
                    },


                }
            );


            /** SUBSCRIPTIONS **/


            /** AUTORUN**/
            /*            this.autorun(() => {
             /!*                this.getReactively('focusEngagement.currentStatus');
             this.getReactively('focusEngagement.nextStep');
             this.getReactively('focusEngagement.title');
             this.getReactively('focusEngagement.tempOrg');
             this.getReactively('focusEngagement.tempResource');
             this.getReactively('focusEngagement.cooperationResources.length');
             this.getReactively('focusEngagement.contractingPartners.length');
             this.getReactively('focusEngagement.bdOwner');
             this.getReactively('focusEngagement.bdRelated.length');

             //update engagement on Meteor side when it changes in Angular
             if (this.focusEngagement) { // check to see if engagement has loaded
             this.call('engagementUpdate', this.focusEngagement, (err, result)=> {
             if (err)
             alert('engagementUpdate method error: ' + err);
             });
             }*!/

             }); //autorun*/


            /** FUNCTIONS */

            /***************************************************************************************************
             * lastUpdateString
             * Generates a string depending upon the focusEngagement.lastUpdate field
             * This is called from HTML - ignore Webstorm warnings
             ****************************************************************************************************/

            this.lastUpdateString = function (lastUpdate) {

                if (lastUpdate == null) {
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

                if (engagement.lastUpdated == null) {
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

                if (daysSinceLastUpdate > 5 && engagement.filingStatus == 'active')
                    return "danger";

                if (daysSinceLastUpdate > 3 && engagement.filingStatus == 'active')
                    return "warning";


            };


            /*********************************************************************************************************
             * viewPartnerDetail
             * @partnerId: The id of the clicked engagement
             * Opens detail page for partner
             ********************************************************************************************************/

            this.viewPartnerDetail = function (partner) {
                $state.go('partnerDetails', {partnerId: partner._id});
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
})
;
