/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <lab-details>
 *     This directive is the primary view for labs.  It enables information to be modified and also
 *     aggregates information.
 *
 *********************************************************************************************************/

miz.directive("dashMain", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/dashboard/components/dash-main/dash-main.ng.html',
        controllerAs: 'db',
        bindToController: true,
        transclude: true,
        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);
            this.engagementMetrics = {};

            this.call('dashEngagementMetrics', this.lab, (err, result)=> {
                if (err)
                    alert('labUpdate method error: ' + err);
                else
                    this.engagementMetrics = result;
            });


            /** HELPERS **/

            this.helpers({


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



            /** INIIALIZE MAIN MENU */







        } // controller
    };  //return
});
