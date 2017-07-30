/*********************************************************************************************************
 * <eng-ei-acceptance-reports>
 *     directive for capturing Acceptance reports
 *********************************************************************************************************/


miz.directive("engEiAcceptanceReports", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-acceptance-reports/eng-ei-acceptance-reports.ng.html',
        controllerAs: 'eiar',
        scope: true, // create seperate copy of scope
        bindToController: {
            focusEngagement: "="
        },

        controller: function ($scope, $reactive) {


            $reactive(this).attach($scope);

            /** Initialize **/


            //ui helpers
            this.ui = {
                editAcceptanceTeam: false  //true for development, otherwise should be false
            };


            /** HELPERS **/
            this.helpers({}
            );


            /** SUBSCRIPTIONS **/


            /** AUTORUN**/
            this.autorun(() => {


            }); //autorun


            /** FUNCTIONS */


            /***************************************************************************************************
             * acceptanceReportAdded
             * Commits updated client payment schedule to server and turns of editing window
             ****************************************************************************************************/

            this.acceptanceReportAdded = function (index) {


                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[index].actualDate = new Date();


                this.call("engagementUpdateEIPaymentSchedule", this.focusEngagement._id, angular.copy(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule));

            };

            /***************************************************************************************************
             * acceptanceReportDeleted
             * Commits updated client payment schedule to server and turns of editing window
             ****************************************************************************************************/

            this.acceptanceReportDeleted = function (index) {

                this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[index].actualDate = null;
                //this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[index].acceptanceReportFile = null;


                this.call("engagementUpdateEIPaymentSchedule", this.focusEngagement._id, angular.copy(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule));


            };

            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


