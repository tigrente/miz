/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <search-engagement->
 *     This directive creates a template to represent an engagement in the search results.
 *
 *********************************************************************************************************/

miz.directive("searchEngagement", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/search/components/search-result-element-engagement/search-result-element-engagement.ng.html',
        controllerAs: 'se',
        bindToController: true,
        transclude: true,
        scope: {
            engagement: "=",    // The engagement passed to be represented.
        },
        controller: function ($scope, $reactive, $state) {

            $reactive(this).attach($scope);
            /** INITIALIZE **/


            /** HELPERS **/

            this.helpers({});


            /** SUBSCRIPTIONS **/


            /** AUTORUN**/
            this.autorun(() => {


            }); //autorun

            /** FUNCTIONS */

            /***************************************************************************************************
             * engagementTypeAbbreviation()
             * Returns an abbreviated string according to the type.  This displayed in the engagement result.
             ****************************************************************************************************/
            this.typeAbbreviation = function () {

                switch (this.engagement.type) {

                    case 'Technical Cooperation':
                        return 'TC';
                        break;

                    case 'Early Innovation':
                        return 'EI';
                        break;

                    case 'Business Development':
                        return 'BD';
                        break;

                    case 'Internal Project':
                        return 'P';
                        break;

                    default:
                        return '?';

                }
            };


            /***************************************************************************************************
             * engagementStatusAbbreviation()
             * Returns an abbreviated string according to the filingStatus.  This is displayed in the engagement result.
             ****************************************************************************************************/
            this.statusAbbreviation = function () {

                switch (this.engagement.filingStatus) {

                    case 'active':
                        return 'Active';
                        break;

                    case 'executing':
                        return 'Exec.';
                        break;

                    case 'on hold':
                        return 'Hold';
                        break;

                    case 'closed':
                        return 'Closed';
                        break;

                    default:
                        return '?';

                }
            };

            /***************************************************************************************************
             * engagementStatusClass()
             * Assigns the styling engagemeclass of the Status Abbreviation based on filingType.
             ****************************************************************************************************/
            this.statusClass = function () {

                switch (this.engagement.filingStatus) {

                    case 'active':
                        return 'search-result-engagement-status-active';
                        break;

                    case 'executing':
                        return 'search-result-engagement-status-executing';
                        break;

                    case 'on hold':
                        return 'search-result-engagement-status-onhold';
                        break;

                    case 'closed':
                        return 'search-result-engagement-status-closed';
                        break;


                }
            };


            /***************************************************************************************************
             * contractingPartnerString()
             * This creates a string from the contracting partners
             ****************************************************************************************************/
            this.contractingPartnersString = function () {

                let result = '';

                for (let i = 0; i < this.engagement.contractingPartnersLabel.length; ++i) {

                    result = result + this.engagement.contractingPartnersLabel[i];

                    if (i + 1 < this.engagement.contractingPartnersLabel.length) {
                        result = result + ' / ';
                    }
                }

                if (result !== this.cooperationResourcesString())
                                    return result;
            };

            /***************************************************************************************************
             * cooperationResourcesString()
             * This creates a string from the copoperation resources.  Note that if the cooperation resource is
             * the same as the contracting partner, nothing is returned, repesentatio is left to the resource.
             ****************************************************************************************************/
            this.cooperationResourcesString = function () {

                let result = '';

                if (this.engagement.cooperationResourcesLabel) {

                    for (let i = 0; i < this.engagement.cooperationResourcesLabel.length; ++i) {
                        result = result + this.engagement.cooperationResourcesLabel[i];

                        if (i + 1 < this.engagement.cooperationResourcesLabel.length) {
                            result = result + ' / ';
                        }
                    }
                }

                    return result;

            };

            /*********************************************************************************************************
             * viewEngagementDetail
             * @engagementId: The id of the clicked engagement
             * Opens Page with Engagement
             ********************************************************************************************************/

            this.viewEngagementDetail = function (engagementId) {
                $state.go('engagementDetails', {engagementId: this.engagement._id});
            };

            /** JQUERY */


            /** INITIALIZATION **/


        } // controller
    };  //return
});
