/*********************************************************************************************************
 * <eng-ei-acceptance-reports-tab>
 *     directive for capturing Acceptance reports for a project
 *********************************************************************************************************/



miz.directive("engEiAcceptanceReportsTab", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-ei-acceptance-reports-tab/eng-ei-acceptance-reports-tab.ng.html',
        controllerAs: 'eiar',
        scope: true, // create seperate copy of scope
        bindToController: {
            focusEngagement: "="
        },

        controller: function ($scope, $reactive, $state) {


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

                this.getReactively('focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule', true);
                this.getReactively('focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.actualDate');

                if (this.focusEngagement)
                    this.call('engUpdateEiAcceptanceStatus', this.focusEngagement._id);

            }); //autorun


            /** FUNCTIONS */

            /***************************************************************************************************
             * generateAcceptanceReportTemplate(paymentIndex)
             * Launches another tab/window with the engagmentId and paymentIndex to generate acceptance report.
             ****************************************************************************************************/
            this.generateAcceptanceReportTemplate = function (paymentIndex) {
               //$state.go('acceptanceReport', {engagementId: this.focusEngagement._id, milestoneIndex:paymentIndex});

                let url = $state.href('acceptanceReport', {engagementId: this.focusEngagement._id, milestoneIndex:paymentIndex});

                window.open(url, '_blank');


            };


            /***************************************************************************************************
             * acceptanceReportAdded
             * Commits updated client payment schedule to server and turns of editing window
             ****************************************************************************************************/

            this.acceptanceReportAdded = function (index) {

                if (index === 'final') {
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.actualDate = new Date();
                    this.call("engagementUpdateEIAdditionalFinalAcceptance", this.focusEngagement._id, 'actualDate', new Date());
                    this.call("engagementUpdateEIAdditionalFinalAcceptance", this.focusEngagement._id, 'acceptanceReportFile', this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.acceptanceReportFile);
                }
                else {
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[index].actualDate = new Date();
                    this.call("engagementUpdateEIPaymentSchedule", this.focusEngagement._id, angular.copy(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule));
                }



            };

            /***************************************************************************************************
             * acceptanceReportDeleted
             * Commits updated client payment schedule to server and turns of editing window
             ****************************************************************************************************/

            this.acceptanceReportDeleted = function (index) {
                if (index === 'final') {
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.additionalFinalAcceptance.actualDate = null;
                    this.call("engagementUpdateEIAdditionalFinalAcceptance", this.focusEngagement._id, 'actualDate', null);
                    this.call("engagementUpdateEIAdditionalFinalAcceptance", this.focusEngagement._id, 'acceptanceReportFile', null);
                }
                else {
                    this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[index].actualDate = null;
                    //this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule[index].acceptanceReportFile = null;

                    this.call("engagementUpdateEIPaymentSchedule", this.focusEngagement._id, angular.copy(this.focusEngagement.earlyInnovationProjectData.acceptanceAndPayments.paymentSchedule));
                }
            };

            /***************************************************************************************************
             * generateAcceptanceReportDocxtemplater
             * This is a test module for docx templater -- not working yet!
             ****************************************************************************************************/

            this.generateAcceptanceReportDocxtemplater = function ( ) {

                alert ('button clicked');

                function loadFile(url,callback){
                    alert ('loadfile');
                    JSZipUtils.getBinaryContent(url,callback);
                    alert ('post utils');
                }

                loadFile("/client/engagements/components/eng-ei-acceptance-reports-tab/input.docx",function(error,content){
                    if (error) { throw error };
                    var zip = new JSZip(content);
                    var doc=new Docxtemplater().loadZip(zip)
                    doc.setData({
                        first_name: 'John',
                        last_name: 'Doe',
                        phone: '0652455478',
                        description: 'New Website'
                    });

                    try {
                        // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                        doc.render()
                    }
                    catch (error) {
                        var e = {
                            message: error.message,
                            name: error.name,
                            stack: error.stack,
                            properties: error.properties,
                        }
                        console.log(JSON.stringify({error: e}));
                        // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                        throw error;
                    }

                    var out=doc.getZip().generate({
                        type:"blob",
                        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    }) //Output the document using Data-URI
                    saveAs(out,"output.docx")
                })

            };



            /** JQUERY **/


        } // controller
    }
        ;  //return
})
;


