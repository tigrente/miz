focusEngagement = undefined;
/*********************************************************************************************************
 * <eng-ei-deliverables>
 *     This directive is for displaying and editing early innovation payment schedules
 *********************************************************************************************************/


miz.directive("engEiAcceptanceTeam", function () {


    // noinspection SpellCheckingInspection
    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-acceptance-team/eng-ei-acceptance-team.ng.html',
        controllerAs: 'eiat',
        scope: true, // create separate copy of scope
        bindToController: {
            focusEngagement: "="
        },

        controller: function ($scope, $reactive) {


            $reactive(this).attach($scope);

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


            // check to see if EI data present.  If not, let parent handle it and just ignore.
            // noinspection Annotator
            if (!this.focusEngagement.hasOwnProperty('earlyInnovationProjectData')) {
                // noinspection JSUnusedLocalSymbols
                // noinspection Annotator
                // noinspection JSUnusedLocalSymbols
                // noinspection Annotator
                // noinspection Annotator
                // noinspection JSUnusedLocalSymbols
                // noinspection Annotator
                // noinspection Annotator
                // noinspection JSUnusedLocalSymbols
                // noinspection Annotator
                this.call("engagementInitializeEarlyInnovationProjectData", this.focusEngagement._id, (err, result) => {
                    if (err)
                        alert("Issue initializing Early Innovation Project data in engagement.");
                });
            }

            // check if A&P data is present.  If not, call server to create template and update.
            else { // noinspection Annotator
                if (!this.focusEngagement.earlyInnovationProjectData.hasOwnProperty('acceptanceTeam')) {
                                // noinspection JSUnusedLocalSymbols
                                // noinspection Annotator
                                // noinspection Annotator
                                // noinspection JSUnusedLocalSymbols
                    // noinspection Annotator
                    // noinspection Annotator
                    // noinspection JSUnusedLocalSymbols
                    this.call("engagementResetEIAcceptanceTeam", this.focusEngagement._id, (err, result) => {
                                    if (err)
                                        alert("Error instantiating payment data.");
                                    else {
                                        this.ui.editAcceptanceTeam = true;
                                    }
                                });
                            }
            }



            // noinspection Annotator
            /** HELPERS **/
            this.helpers({


/*
                    // get current engagement
                    focusEngagement: () => {
                        this.getReactively('focusEngagementId');


                        if (this.focusEngagementId)
                            return   Engagements.findOne(this.focusEngagementId);
                    },
*/

                    //direct pointer to early innovation data property
                    //also initializes data if its not there
/*                    acceptanceTeam: () => {

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


                    }, //acceptanceTeam
            */
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


            // noinspection Annotator
            /** AUTORUN**/
            this.autorun(() => {


            }); //autorun


            /** FUNCTIONS */


            /***************************************************************************************************
             * addAcceptor
             * Adds another acceptor to AcceptanceTeam
             ****************************************************************************************************/

            this.addAcceptor = function () {


                // noinspection Annotator
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
                    // noinspection Annotator
                    this.focusEngagement.earlyInnovationProjectData.acceptanceTeam.splice(index, 1);
                    this.updateAcceptanceTeam();
                }

            };


            /***************************************************************************************************
             * updateAcceptanceTeam
             * Commits updated acceptance team to server and turns of editing window
             ****************************************************************************************************/

            this.updateAcceptanceTeam = function () {

                // noinspection Annotator
                // noinspection Annotator
                // noinspection Annotator
                this.call("engagementUpdateEIAcceptanceTeam", this.focusEngagement._id, angular.copy(this.focusEngagement.earlyInnovationProjectData.acceptanceTeam));

            };


            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


