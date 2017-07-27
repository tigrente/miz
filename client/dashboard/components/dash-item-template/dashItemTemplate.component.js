/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <dash-item-template>
 *     This directive is a basic template for other dashboard items.
 *
 *********************************************************************************************************/

miz.directive("dashItemTemplate", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/dashboard/components/dash-item-template/dash-item-template.ng.html',
        controllerAs: 'db_template',
        bindToController: true,
        scope: {

        },
        transclude: true,
        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);





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


                //mark this item, active




            /** INITIALIZE */




        } // controller
    };  //return
});
