/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <lab-details>
 *     This directive is the primary view for labs.  It enables information to be modified and also
 *     aggregates information.
 *
 *********************************************************************************************************/

miz.directive("dashItemReports", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/dashboard/components/dash-item-reports/dash-item-reports.ng.html',
        controllerAs: 'db_home',
        bindToController: true,
        scope: {},
        transclude: true,
        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);


            /** HELPERS **/

            this.helpers({
                o2w_serial: () => {

                    if (Meteor.user()) {
                        let user = Meteor.user();
                        return user.profile.o2w_serial;
                    }
                }
            });


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


            //mark this item, active


            /** INITIALIZE */


        } // controller
    };  //return
});
