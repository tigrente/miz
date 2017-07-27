/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <search-engagement->
 *     This directive creates a template to represent an engagement in the search results.
 *
 *********************************************************************************************************/

miz.directive("searchResultElementUniversity", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/search/components/search-result-element-university/search-result-element-university.ng.html',
        controllerAs: 'su',
        bindToController: true,
        transclude: true,
        scope: {
            university: "=",    // The engagement passed to be represented.
        },
        controller: function ($scope, $reactive, $state) {

            $reactive(this).attach($scope);
            /** INITIALIZE **/


            /** HELPERS **/

            this.helpers({
                logo: () => {
                    if (this.getReactively("university")) {
                        if (this.university.logo != null && this.university.logo != "")
                            return Images.findOne({_id: this.getReactively("university.logo")});
                        else
                            return Images.findOne({mizSystemReference: this.university.partnerType});
                    }
                }
        });


            /** SUBSCRIPTIONS **/
            this.subscribe('partnerImages', () => {
                return [
                    //imageId
                    this.getReactively('university.logo'),
                    this.getReactively('university.partnerType')
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
