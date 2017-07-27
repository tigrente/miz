/*********************************************************************************************************
 * <eng-ei-acceptance-reports>
 *     directive for capturing Acceptance reports
 *********************************************************************************************************/


miz.directive("engEiAcceptanceReports", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-acceptance-reports/eng-ei-acceptance-reports.ng.html',
        controllerAs: 'eiar',
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



            /** HELPERS **/
            this.helpers({


                    // get current engagement
                    focusEngagement: () => {
                        this.getReactively('focusEngagementId');

                        //alert(this.focusEngagementId);

                        if (this.focusEngagementId) {

                            let focusEngagement = Engagements.findOne(this.focusEngagementId);



                            return Engagements.findOne(this.focusEngagementId);

                        } //if

                    },

                   /* //direct pointer to early innovation data property
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

                    }, //paymentSchedule*/

            //direct pointer to early innovation data property
                //also initializes data if its not there

                }
            );


            /** SUBSCRIPTIONS **/



            /** AUTORUN**/
            this.autorun(() => {


            }); //autorun


            /** FUNCTIONS */



            /***************************************************************************************************
             * updatePaymentSchedule
             * Commits updated client payment schedule to server and turns of editing window
             ****************************************************************************************************/

            this.updatePaymentSchedule = function () {
//alert("updatePaymentRun");
                this.call("engagementUpdateEIPaymentSchedule", this.focusEngagementId, angular.copy(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule));

            };


            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


