/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <dash-item-template>
 *     This directive is a basic template for other dashboard items.
 *
 *********************************************************************************************************/

miz.directive("engTeamSummary", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-team-summary/eng-team-summary.ng.html',
        controllerAs: 'en_ts',
        bindToController: true,
        //transclude: true,
        controller: function ($scope, $reactive, $state) {

            $reactive(this).attach($scope);

            /** INITIALIZE **/
            this.filter_type = "All";  //filter for engagement type (e.g. Early Innovation, Tech Cooperation, etc.)
            this.filterTypeSelector = {};

            this.filter_status = "Active";  //filter for engagement type (e.g. Early Innovation, Tech Cooperation, etc.)
            this.filterStatusSelector = {"filingStatus": "active"};

            this.filter_bdOwner = "All";  //filter for engagement type (e.g. Early Innovation, Tech Cooperation, etc.)
            this.filterBdOwnerSelector = {};

            this.filter_search = '';

            this.sortOptions = {};

            this.engagementLimit = 30;


            /** HELPERS **/

            this.helpers({

                    engagementCollection: () => {

                        this.getReactively('filterTypeSelector');
                        this.getReactively('filterStatusSelector');
                        this.getReactively('filterBdOwnerSelector');
                        this.getReactively('sortOptions');
                        this.getReactively('filter_search');

                        let selector = {
                            $and: [
                                this.filterTypeSelector,
                                this.filterStatusSelector,
                                this.filterBdOwnerSelector,

                                //search filter
                                {
                                    $or: [
                                        {
                                            'bdOwnerLabel': {
                                                '$regex': '.*' + this.filter_search || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'contractingPartnersLabel': {
                                                '$regex': '.*' + this.filter_search || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'cooperationResourcesLabel': {
                                                '$regex': '.*' + this.filter_search || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {'title': {'$regex': '.*' + this.filter_search || '' + '.*', '$options': 'i'}},
                                        {'tempLab': {'$regex': '.*' + this.filter_search || '' + '.*', '$options': 'i'}},
                                        {'labLabel': {'$regex': '.*' + this.filter_search || '' + '.*', '$options': 'i'}},
                                        {'projectManager': {'$regex': '.*' + this.filter_search || '' + '.*', '$options': 'i'}}
                                    ]
                                }


                            ]

                        };

                        return Engagements.find(selector, this.sortOptions);
                    },

                    filterTypeSelector: () => {
                        this.getReactively('filter_type');
                        if (this.filter_type == ("All" || null))
                            return {};
                        else
                            return {"type": this.filter_type};
                    },

                    filterStatusSelector: () => {
                        this.getReactively('filter_status');

                        switch (this.filter_status) {

                            case "Active":
                                return {"filingStatus": "active"};
                                break;

                            case "Executing":
                                return {"filingStatus": "executing"};
                                break;

                            case "On Hold":
                                return {"filingStatus": "on hold"};
                                break;

                            case "Closed":
                                return {"filingStatus": "closed"};
                                break;

                            default:
                                return {};
                        }
                    },

                    filterBdOwnerSelector: () => {
                        this.getReactively('filter_bdOwner');

                        if (this.filter_bdOwner === ("All" || null))
                            return {};
                        else
                            return {"bdOwnerLabel": this.filter_bdOwner};
                    },


                    bizDevOwnerSearchList: () => {

                        let options = {
                            //limit: 5
                        };

                        selector = {
                            $or: [
                                {roles: {$elemMatch: {$eq: 'editEngagements'}}},
                                {roles: {$elemMatch: {$eq: 'editAllEngagements'}}}
                            ]
                        };

                        return Meteor.users.find({}, options);

                    },


                }
            );


            /** SUBSCRIPTIONS **/
            //todo: Make this subscription more selective and more efficient
            this.subscribe('engagementTeamSummary', () => {
                return [
                    //variable passed to subscription
                    this.getReactively('filterTypeSelector'),
                    this.getReactively('filterStatusSelector'),
                    this.getReactively('filterBdOwnerSelector'),
                    this.getReactively('sortOptions'),
                    this.getReactively('filter_search'),
                    this.getReactively('engagementLimit'),
                ]
            });

            /** Subscription to user list to search for bizDevOwners */
            this.subscribe('userBizDevOwnerSearch', () => {
                return [
                    // searchTerm
                    this.getReactively('bizDevOwnerSearch')
                ]
            });


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
             * formatDate
             * Generates a string depending upon the focusEngagement.lastUpdate field
             ****************************************************************************************************/

            this.formatDate = function (date) {

                if (date == null) {
                    return "Never updated...";
                }
                ;

                return moment(date).format("ddd M/D/YY");
            };


            /***************************************************************************************************
             * resetFilters
             * Reset filters to defaults
             ****************************************************************************************************/

            this.resetFilters = function () {
                this.filter_type = "All";
                this.filter_status = "Active";
                this.filter_bdOwner = "All";
                this.filter_search = "";
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

                if (daysSinceLastUpdate > 7 && engagement.filingStatus == 'active')
                    return "danger";

                if (daysSinceLastUpdate > 3 && engagement.filingStatus == 'active')
                    return "warning";


            };


            /***************************************************************************************************
             * checkForEngagements
             * Takes an engagement type and status and checks if there are engagements.
             ****************************************************************************************************/

            this.checkForEngagements = function (engagementType, engagementStatus) {

                Engagements.find().count();

            };

            /*********************************************************************************************************
             * viewEngagementDetail
             * @engagementId: The id of the clicked engagement
             * Opens Page with Engagement
             ********************************************************************************************************/

            this.viewEngagementDetail = function (engagementId) {
                //location.href = "/engagements/" + engagementId;
                window.open("/engagements/" + engagementId,'_newtab');
            };


            /*********************************************************************************************************
             * viewEngagementUserSummary
             * Opens Engagement User Summary
             ********************************************************************************************************/

            this.viewEngagementUserSummary = function () {
                // location.href = '/engagement-user-summary';
                $state.go('engagementUserSummary');
            };

            /*********************************************************************************************************
             * viewEiAcceptanceSummary
             * Opens EI Engagement Summary Page
             ********************************************************************************************************/

            this.viewEiAcceptanceSummary = function () {
                $state.go("eiAcceptanceSummary");
            };


            /*********************************************************************************************************
             * setSortOptions
             * @option: Option to set - for sorting of engagements in table
             * Sets the this.sortOption, which controls how engagements are sorted. used when clicking on the headers.
             ********************************************************************************************************/

            this.setSortOptions = function (option) {

                switch (option) {
                    case "organization":
                        //Check if already set for this option, reverse the order
                        if (JSON.stringify(this.sortOptions) === JSON.stringify({sort: {contractingPartnersLabel: 1}}))
                            this.sortOptions = {sort: {contractingPartnersLabel: -1}};
                        else
                            this.sortOptions = {sort: {contractingPartnersLabel: 1}};
                        break;

                    case "resource":
                        //Check if already set for this option, reverse the order
                        if (JSON.stringify(this.sortOptions) === JSON.stringify({sort: {cooperationResourcesLabel: 1}}))
                            this.sortOptions = {sort: {cooperationResourcesLabel: -1}};
                        else
                            this.sortOptions = {sort: {cooperationResourcesLabel: 1}};
                        break;

                    case "lab":
                        //Check if already set for this option, reverse the order
                        if (JSON.stringify(this.sortOptions) === JSON.stringify({sort: {tempLab: 1}}))
                            this.sortOptions = {sort: {tempLab: -1}};
                        else
                            this.sortOptions = {sort: {tempLab: 1}};
                        break;

                    /*     case "resource"
                     code block
                     break;

                     case "lab":
                     code block
                     break;
                     */

                    case "bdOwner":
                        //Check if already set for this option, reverse the order
                        if (JSON.stringify(this.sortOptions) === JSON.stringify({sort: {bdOwnerLabel: 1}}))
                            this.sortOptions = {sort: {bdOwnerLabel: -1}};
                        else
                            this.sortOptions = {sort: {bdOwnerLabel: 1}};
                        break;

                    case "updated":
                        //Check if already set for this option, reverse the order
                        if (JSON.stringify(this.sortOptions) === JSON.stringify({sort: {lastUpdated: 1}}))
                            this.sortOptions = {sort: {lastUpdated: -1}};
                        else
                            this.sortOptions = {sort: {lastUpdated: 1}};
                        break;

                    default:
                        this.sortOptions = {};
                }


            };

            /***************************************************************************************************
             * increaseEngagementLimit ()
             * Increases
             ****************************************************************************************************/

            this.increaseEngagementLimit = function () {
                this.engagementLimit += 60;
            };



            /** JQUERY **/

// The below jquery adjusts the height of the table body to accommodate the screen height

            $(window).resize(function () {
                let bodyheight = $('body').height();
                bodyheight = bodyheight - 230;
                $('#en-team-summary-table-body-wrapper').css({
                    'min-height': bodyheight + 'px',
                    'max-height': bodyheight + 'px'
                });
            }).resize();


            $(window).resize(function () {
                let bodywidth = $('body').width();
                let tableBodyWidth = bodywidth - 20;
                $('#en-team-summary-body').css('width', bodywidth + 'px');
                $('#en-team-summary-control-panel').css('width', bodywidth + 'px');
                $('#en-team-summary-table-body-wrapper').css('width', tableBodyWidth + 'px');
                $('#en-team-summary-table-header').css('width', tableBodyWidth + 'px');
            }).resize();

        } // controller
    }
        ;  //return
})
;
