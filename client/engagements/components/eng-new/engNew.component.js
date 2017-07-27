/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <eng-new>
 *     This directive enables users to create new engagements.
 *
 *     NOTE: Since Angular-Meteor 1.3, Autobind has been removed, so changes to the client must be pushed
 *     back to the record.
 *********************************************************************************************************/

miz.directive("engNew", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/engagements/components/eng-new/eng-new.ng.html',
        controllerAs: 'en',
        bindToController: true,
        transclude: true,
        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);
            /** INITIALIZE **/

            document.title = "Miz: Create New Engagement";

            /***************************************************************************************************
             * resetForm
             * Sets the engagement type of the new engagement.  Used by the buttons.
             ****************************************************************************************************/
            this.resetForm = function () {
                this.newEngagement = {
                    type: null,       //may determine appearance of fields
                    contractingPartners: [],  //partnerId - the contracted partners
                    cooperationResources: [],  //partnerIds - the talent working

                    contractingPartnersLabel: [],  //array of strings, the denormalized partner names used for menus
                    cooperationResourcesLabel: [], //array of strings, denmrmalized partner names used for menus

                    tempLab: "",                //temp string with name of lab
                    labs: [],                  //string: the lab requesting the project
                    labLabel: [],              //array of strings - lab names

                    pm: "",                     // temp placeholder string for project manager

                    projectManager: "",         //project manager
                    hqCooperationManger: "",    // text field (until integration)
                    hwRelated: "",              //rich text field : just to list Huawei contacts until db integration

                    hwEntity: null,      //Futurewei, HQ

                    title: "",                  //project name, or name of this engagement
                    background: "",             //short description of project
                    index: "",                  //simple reference for tagging outside of miz
                    dealValue: 0,               //value of engagement in USD

                    bdOwner: Meteor.userId(),               //userId accountable for this engagement (should be 1?)
                    bdOwnerLabel: "",

                    bdRelated: [],              //userIds - other Huawei folks engaged with this
                    bdRelatedLabel: [],         //labeled strings


                    relatedPartners: [],        // partners, for talent searches

                    currentStatus: "New",              // text update
                    stage: "New",
                    filingStatus: "active",     // determines how engagement is categorized: active, archive, on hold, executing
                    filingStatusIndex: 0,       // index for determining sort order of engagements, e.g. when we want to list active engagements in ahead of executing, etc.

                    tasks: [],                  // task list {description, done, created, due}

                    finalDealValue: null,
                    finalDealValueCurrency: "USD",
                    finalDealValueUSD: 0,

                    dateStarted: new Date(),   // inception date
                    lastUpdated: new Date()    // last date updated, log entry added, etc.*/


                };

            };

            this.resetForm();
            this.updateUserFeedback = "";
            this.submissionDisabled = true;

            // The eligable partners presented that can be selected as contracting partners.
            this.contractingPartnerTypes = [
                'company',
                'individual',
                'professor',
                'university',
                'uniSubOrg',
                //'contact',
                'incubator',
                'venture',
                'association',
                'other'
            ];

            /** HELPERS **/


            /** SUBSCRIPTIONS **/


            /** AUTORUN**/
            //todo: Make this a helper function
            this.autorun(() => {
                this.getReactively('newEngagement.title');
                this.getReactively('newEngagement.type');
                this.getReactively('newEngagement.hwEntity');
                this.getReactively('placeholderValue');

                // This converts displayed deal value string (with commas) into a number for the new engagement object
                if (this.placeholderValue) {
                    this.newEngagement.dealValue = parseInt(this.placeholderValue.replace(/,/g, ''), 10);
                }

                this.submissionDisabled = ( !this.newEngagement.title ||
                                            !this.newEngagement.type  ||
                                            !this.newEngagement.hwEntity);

            }); //autorun

            /** FUNCTIONS */
            /***************************************************************************************************
             * createNewEngagement()
             * Creates a new engagement from the newEngagement object
             ****************************************************************************************************/
            this.createEngagement = function () {

                this.call('engCreateEngagement', this.newEngagement, (err, data) => {
                    if (err) {
                        alert('Something went wrong adding new engagement to database: ' + err);
                    } else {
                        window.location.href = '/engagements/' + data;
                    }

                });
            };

            /***************************************************************************************************
             * setEngagementType ()
             * Sets the engagement type of the new engagement.  Used by the buttons.
             ****************************************************************************************************/
            this.setEngagementType = function (engagementType) {
                this.newEngagement.type = engagementType;
                let targetButton = engagementType + '-radio';
                $.document.getElementById('cooperation-radio').css({"background-color": "white"});
                $.document.getElementById('bizdev-radio').css({"background-color": "white"});
                $.document.getElementById('internal-radio').css({"background-color": "white"});

                $.document.getElementById(targetButton).css({"background-color": "grey"});

            };

            /** Jquery */

            $(function () {
                $('[data-toggle="popover"]').popover()
            });

            $(document).ready(function () {
                $("input[data-type='number']").keyup(function (event) {
                    // skip for arrow keys
                    if (event.which >= 37 && event.which <= 40) {
                        event.preventDefault();
                    }

                    if (event.which == 65) {
                        event.preventDefault();
                        return false;
                    }


                    let $this = $(this);
                    let num = $this.val().replace(/,/gi, "");
                    let num2 = num.split(/(?=(?:\d{3})+$)/).join(",");
                    console.log(num2);
                    // the following line has been simplified. Revision history contains original.
                    $this.val(num2);
                });
            });

            /** INITIALIZATION **/

            this.placeholderValue = null;  // placeholder for currency.  Actual value will be convered to int for model


        } // controller
    };  //return
});
