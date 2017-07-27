/*********************************************************************************************************
 * <eng-ei-deliverables>
 *     This directive is for displaying and editing early innovation payment schedules
 *********************************************************************************************************/


miz.directive("engEiAcceptanceTeam", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-acceptance-team/eng-ei-acceptance-team.ng.html',
        controllerAs: 'eiat',
        scope: false, // create seperate copy of scope
        bindToController: {
            focusEngagementId: "@"
        },

        controller: function ($scope, $reactive) {


            $reactive(this).attach($scope);

            /** Initialize **/

            const ONE_DAY = 1000 * 60 * 60 * 24;    //Get 1 day in milliseconds
            const ONE_WEEK = ONE_DAY * 7;           //Get 1 week in milliseconds
            const ONE_MONTH = ONE_DAY * 30.42;      //Get about 1 month in milliseconds


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

            this.newPaymentSchedule = 'initializing';


            this.paymentSchedule = [];

            /** HELPERS **/
            this.helpers({


                    // get current engagement
                    focusEngagement: () => {
                        this.getReactively('focusEngagementId');


                        if (this.focusEngagementId)
                            return   Engagements.findOne(this.focusEngagementId);
                    },

                    //direct pointer to early innovation data property
                    //also initializes data if its not there
                    acceptanceTeam: () => {

                        this.getReactively('focusEngagement.earlyInnovationProjectData', true);

                        if (this.focusEngagement) {

                            // check to see if EI data present.  If not, let parent handle it and just ignore.
                            if (!this.focusEngagement.hasOwnProperty('earlyInnovationProjectData')) {
                                this.call("engagementInitializeEarlyInnovationProjectData", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Issue initializing Early Innovation Project data in engagement.");
                                });
                            }

                            // check if A&P data is present.  If not, call server to create template and update.
                            else if (!this.focusEngagement.earlyInnovationProjectData.hasOwnProperty('acceptanceTeam')) {
                                this.call("engagementResetEIAcceptanceTeam", this.focusEngagementId, (err, result) => {
                                    if (err)
                                        alert("Error instantiating payment data.");
                                    else {
                                        this.ui.editAcceptanceTeam = true;
                                        return this.focusEngagement.earlyInnovationProjectData.acceptanceTeam;
                                    }
                                });
                            }

                            // otherwise, payment schedule exists, return it.

                            else
                                return this.focusEngagement.earlyInnovationProjectData.acceptanceTeam;
                        } // if (focusEngagement)


                    }, //paymentSchedule

                }
            );


            /** SUBSCRIPTIONS **/
            /*            this.subscribe('logEntries', () => {
             return [
             this.getReactively('subjectId'),
             this.getReactively('limit'),
             this.getReactively('sort')
             ]
             });*/


            /** AUTORUN**/
            this.autorun(() => {


            }); //autorun


            /** FUNCTIONS */


            /***************************************************************************************************
             * addAcceptor
             * Adds another acceptor to AcceptanceTeam
             ****************************************************************************************************/

            this.addAcceptor = function () {


                this.acceptanceTeam.push(acceptorTemplate);
                this.updateAcceptanceTeam();

            };

            /***************************************************************************************************
             * removeAcceptor
             * Accepts index of acceptor to be removed from AcceptanceTeam
             ****************************************************************************************************/

            this.removeAcceptor = function (index) {

                // Ensure that acceptors less than three can not be removed.
                if (index > 2) {
                    this.acceptanceTeam.splice(index, 1);
                    this.updateAcceptanceTeam();
                }

            };


            /***************************************************************************************************
             * updateAcceptanceTeam
             * Commits updated acceptance team to server and turns of editing window
             ****************************************************************************************************/

            this.updateAcceptanceTeam = function () {

                this.call("engagementUpdateEIAcceptanceTeam", this.focusEngagementId, angular.copy(this.acceptanceTeam));

            };


            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


