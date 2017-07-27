/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <search-engagement->
 *     This directive creates a template to represent a partner in the search results.
 *
 *********************************************************************************************************/

miz.directive("searchResultElementWithParent", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/search/components/search-result-element-with-parent/search-result-element-with-parent.ng.html',
        controllerAs: 'sp',
        bindToController: true,
        transclude: true,
        scope: {
            partner: "=",    // The engagement passed to be represented.
        },
        controller: function ($scope, $reactive, $state) {

            $reactive(this).attach($scope);
            /** INITIALIZE **/


            /** HELPERS **/

            this.helpers({
                logo: () => {
                    if (this.getReactively("partner")) {
                        if (this.partner.logo != null && this.partner.logo != "")
                            return Images.findOne({_id: this.getReactively("partner.logo")});
                        else
                            return Images.findOne({mizSystemReference: this.partner.partnerType});
                    }
                }
        });


            /** SUBSCRIPTIONS **/
            this.subscribe('partnerImages', () => {
                return [
                    //imageId
                    this.getReactively('partner.logo'),
                    this.getReactively('partner.partnerType')
                ]
            });

            /** AUTORUN**/
            this.autorun(() => {


            }); //autorun

            /** FUNCTIONS */






            /*********************************************************************************************************
             * viewPartnerDetail
             * @engagementId: The id of the clicked engagement
             * Opens Page with Engagement
             ********************************************************************************************************/

            this.viewPartnerDetail = function (partner) {
                $state.go('engagementDetails', {partnerId: this.partner._id});
            };

            /** JQUERY */


            /** INITIALIZATION **/


        } // controller
    };  //return
});
