/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <lab-details>
 *     This directive is the primary view for labs.  It enables information to be modified and also
 *     aggregates information.
 *
 *********************************************************************************************************/

miz.directive("dashSidebar", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/dashboard/components/dash-sidebar/dash-sidebar.ng.html',
        controllerAs: 'dbsb',
        bindToController: true,
        scope: {
            currentMenuItem: "="    // Eligible types of partners to present for selection
        },
        transclude: true,
        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);

            this.engagementMetrics = {};

            this.call('dashEngagementMetrics', this.lab, (err, result) => {
                if (err)
                    alert('labUpdate method error: ' + err);
                else
                    this.engagementMetrics = result;
            });


            /** HELPERS **/

            this.helpers({});


            /** SUBSCRIPTIONS **/


            /** AUTORUN**/
            this.autorun(() => {

                /** UPDATE FUNDAMENTAL PARTNER FIELDS IN METEOR WHEN ANGULAR CHANGES **/
                //run autorun anytime any of these primary partner fields change
                //not included are arrays because this causes an infiite loop
                //of updating and digestion
                /* NOT INCLUDED
                 this.getReactively('partner.parentPartners');
                 this.getReactively('partner.bizDevOwners');
                 */


            }); //autorun

            /** FUNCTIONS */


            this.selectMenuItem = function (menuItem) {

                //change menu item value
                this.currentMenuItem = menuItem.name;


                //change formatting of sidebar

                //mark all inactive
                for (item of this.menuItems) {
                    if (item.name == menuItem.name)
                        item.active = "active";
                    else
                        item.active = false;
                }
                ;


                //mark this item, active


            };


            /** INITIALIZE */


            this.currentMenuItem = "home";

            this.menuItems = [
                {
                    "name": "home",
                    "active": "active",   //move this to make the default active menu
                    "text": "Home",
                    "sref": "#",
                    "icon": "icon-home",
                    "alert": "3",
                    "label": "label label-info",
                    "submenu": [{
                        "text": "Dashboard v1",
                        "sref": "app.dashboard"
                    }, {
                        "text": "Dashboard v2",
                        "sref": "app.dashboard_v2"
                    }, {
                        "text": "Dashboard v3",
                        "sref": "app.dashboard_v3"
                    }],

                },
                {
                    "name": "reports",
                    "text": "Reports",
                    "sref": "#",
                    "icon": "icon-doc",
                    "label": "label label-info",

                },
                /*                {
                 "name": "metrics",
                 "text": "Metrics",
                 "sref": "#",
                 "icon": "icon-speedometer",
                 "label": "label label-info",

                 },*/
                /*                {

                 "name": "team summary",
                 "text": "Engage- ment List",
                 "sref": "#",
                 "icon": "icon-list",
                 "label": "label label-info",

                 },*/
                /*                {
                 "name": "reference",
                 "text": "Reference",
                 "sref": "#",
                 "icon": "icon-docs",
                 "label": "label label-info",
                 },*/
                /*
                 {
                 "name": "settings",
                 "text": "Settings",
                 "sref": "#",
                 "icon": "icon-settings",
                 "label": "label label-info",
                 }
                 */


            ];


            this.bottomMenuItems = [

                /*                {
                 "name": "requests",
                 "text": "Requests",
                 "sref": "#",
                 "icon": "fa fa-bug",
                 "label": "label label-info",
                 },

                 {
                 "name": "about",
                 "text": "About",
                 "sref": "#",
                 "icon": "icon-question",
                 "label": "label label-info",
                 }*/


            ];

        } // controller
    };  //return
});
