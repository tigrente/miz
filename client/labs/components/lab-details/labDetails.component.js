/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <lab-details>
 *     This directive is the primary view for labs.  It enables information to be modified and also
 *     aggregates information.
 *
 *********************************************************************************************************/

miz.directive("labDetails", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/labs/components/lab-details/lab-details.ng.html',
        controllerAs: 'ld',
        bindToController: true,
        transclude: true,
        controller: function ($scope, $reactive, $stateParams) {

            $reactive(this).attach($scope);
            this.labId = $stateParams.labId;


            /** HELPERS **/

            this.helpers({

                //Featured partner to be displayed and modifed
                lab: () => {
                    return Labs.findOne({_id: $stateParams.labId});
                },


            });


            /** SUBSCRIPTIONS **/
            this.subscribe('labDetail', ()=> {
                return [
                    $stateParams.labId,  //variable passed to subscription
                ]
            });



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

                this.getReactively('lab.name');
                this.getReactively('lab.description');
                this.getReactively('lab.company');
                this.getReactively('lab.entity');
                this.getReactively('lab.logo');


                //update partner on Meteor side when it changes in Angular
                if (this.lab) { // check to see if partner has loaded
                    this.call('labUpdate', this.lab, (err, result)=> {
                        if (err)
                            alert('labUpdate method error: ' + err);
                    });
                }
            }); //autorun

            /** FUNCTIONS */








        } // controller
    };  //return
});
