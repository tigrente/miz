/*********************************************************************************************************
 * <eng-ei-acceptance-report>
 *     This directive is for editing Early Innovation project information.
 *********************************************************************************************************/


miz.directive("engEiProjectTab", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-project-tab/eng-ei-project-tab.ng.html',
        controllerAs: 'ei',
        scope: true, // create seperate copy of scope
        bindToController: {
            focusEngagementId: "@"
        },

        controller: function ($scope, $reactive) {


            $reactive(this).attach($scope);

            /** Initialize **/


            /** HELPERS **/
            this.helpers({


                // get current engagement
                focusEngagement: () => {
                    this.getReactively('focusEngagementId');

                    if (this.focusEngagementId) {
                        let focusEngagement =  Engagements.findOne(this.focusEngagementId);

                        if (!this.focusEngagement.hasOwnProperty('earlyInnovationProjectData'))
                            this.call("engagementInitializeEarlyInnovationProjectData", this.focusEngagementId);





                    }
                },


            });


            /** SUBSCRIPTIONS **/
            this.subscribe('focusEngagement', () => {
                return [
                    this.getReactively('focusEngagementId'), //ensure that a selected engagement can be seen
                ]
            });


            /** AUTORUN**/
/*            this.autorun(() => {


            });*/ //autorun


            /** FUNCTIONS **/


        } // controller
    }
        ;  //return
})
;


