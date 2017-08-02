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


                //template for all new payment entries
            let acceptorTemplate = {
                    name: "",
                    idNumber: "",
                    lab: '',
                    independent: false
                };


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
             * addAcceptor
             * Adds another acceptor to AcceptanceTeam
             ****************************************************************************************************/

            this.addAcceptor = function () {


                this.focusEngagement.earlyInnovationProjectData.acceptanceTeam.push(acceptorTemplate);
                this.updateAcceptanceTeam();

            };

            /***************************************************************************************************
             * removeAcceptor
             * Accepts index of acceptor to be removed from AcceptanceTeam
             ****************************************************************************************************/

            this.removeAcceptor = function (index) {

                // Ensure that acceptors less than three can not be removed.
                if (index > 2) {
                    this.focusEngagement.earlyInnovationProjectData.acceptanceTeam.splice(index, 1);
                    this.updateAcceptanceTeam();
                }

            };


            /***************************************************************************************************
             * updateAcceptanceTeam
             * Commits updated acceptance team to server and turns of editing window
             ****************************************************************************************************/

            this.updateAcceptanceTeam = function () {

                this.call("engagementUpdateEIAcceptanceTeam", this.focusEngagement._id, angular.copy(this.focusEngagement.earlyInnovationProjectData.acceptanceTeam));

            };


            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


