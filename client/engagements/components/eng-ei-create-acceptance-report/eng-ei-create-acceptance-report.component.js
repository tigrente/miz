/*********************************************************************************************************
 * <eng-ei-deliverables>
 *     This directive is for displaying and editing early innovation payment schedules
 *********************************************************************************************************/


miz.directive("engEiCreateAcceptanceReport", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-create-acceptance-report/eng-ei-create-acceptance-report.ng.html',
        controllerAs: 'eicar',
        scope: true, // create seperate copy of scope


        controller: function ($scope, $reactive, $stateParams, $state, $element) {

            $reactive(this).attach($scope);

            if ($stateParams.engagementId) { //noinspection JSUnresolvedVariable
                this.focusEngagementId = $stateParams.engagementId;
                this.milestoneIndex = $stateParams.milestoneIndex;
            }


            /** Initialize **/

            //ui helpers
            this.ui = {
                editAcceptanceTeam: false  //true for development, otherwise should be false
            };


            /** HELPERS **/
            this.helpers({

                    // get current engagement
                    focusEngagement: () => {
                        this.getReactively('focusEngagementId');


                        if (this.focusEngagementId)
                            return Engagements.findOne(this.focusEngagementId);
                    }
                }
            );


            /** SUBSCRIPTIONS **/
            this.subscribe('focusEngagement', () => {
                return [
                    this.getReactively('focusEngagementId'),
                ]
            });


            /** AUTORUN**/
            this.autorun(() => {


            }); //autorun


            /** FUNCTIONS */


            /***************************************************************************************************
             * phaseNumber
             * Returns the phase number of the project (eg. phase 1 of 4)
             ****************************************************************************************************/

            this.phaseNumber = function () {

                if (this.mileStoneIndex = 'finalAdditionalAcceptance')
                    return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length;
                else
                    return  parseInt(this.milestoneIndex) + 1;
            };


            /***************************************************************************************************
             * totalNumberOfPhases
             * Returns total number of phases
             ****************************************************************************************************/

            this.totalNumberOfPhases = function () {

                if (this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.options.additionalFinalAcceptance)
                    return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length + 1;
                else
                    return this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule.length;


            };


            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


