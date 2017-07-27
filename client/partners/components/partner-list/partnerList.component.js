/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <partner-list>
 *     This directive presents a full screen search and listing for partners.  Clicking a partner
 *     enables editing of said partner by taking user to partnerDetails context. Currently, this is
 *     doing complete filtering of the view server side.  Pagination is not currently implemented.
 *********************************************************************************************************/

miz.directive("partnerList", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/partners/components/partner-list/partner-list.ng.html',
        controllerAs: 'partnerList',
        controller: function ($scope, $reactive, $state) {
            $reactive(this).attach($scope);



            /** HELPERS **/
            this.helpers({
                partnerList: () => {
                    return Partners.find();  //currently, the list filtered on the server...
                }
            });



            /** SUBSCRIPTIONS **/
            this.subscribe('partnerList', ()=> {
                return [ {}, this.getReactively('search'), this.getReactively('partnerFilter') ]
            });


            /** FUNCTIONS **/
            /*********************************************************************************************************
             * resetPartnerFilterButtonClasses
             * Resets button format classes.  Used when a button is clicked to normalize the format of the button
             * selected previously.
             ********************************************************************************************************/

             this.resetPartnerFilterButtonClasses = function () {
                this.partnerFilterButtonClasses = {
                    'all': 'btn btn-default',
                    'university': 'btn btn-default',
                    'company': 'btn btn-default',
                    'incubator': 'btn btn-default',
                    'venture': 'btn btn-default',
                    'professor': 'btn btn-default',
                    'individual': 'btn btn-default',

                };
            };


            /*********************************************************************************************************
             * setPartnerFilter
             * Used when filter button is clicked in view.  Sets partner filters based on partnerType.
             * @partnerFilter: string of partner type.  Used directly to filter partners by type.
             ********************************************************************************************************/

            this.setPartnerFilter = function (partnerFilterInput) {
                if (partnerFilterInput == 'all') {
                    // if 'all', filter is blank.
                    this.partnerFilter = '';
                    this.resetPartnerFilterButtonClasses();
                    this.partnerFilterButtonClasses['all'] = 'btn btn-primary';
                }

                else {
                    // otherwise, set the filter and format the buttons
                    this.partnerFilter = partnerFilterInput;
                    this.resetPartnerFilterButtonClasses();
                    this.partnerFilterButtonClasses[partnerFilterInput] = 'btn btn-primary';
                }

            };


            /*********************************************************************************************************
             * viewPartnerDetail
             * @partnerId: The id of the clicked engagement
             * Opens detail page for partner
             ********************************************************************************************************/

            this.viewPartnerDetail = function (partner) {
                $state.go('partnerDetails', {partnerId: partner._id});
            };



            /** INITIALIZATION **/
            this.partnerFilter = '';    // Clear filter, show all partners on load
            this.resetPartnerFilterButtonClasses();  // Set button format classes
            this.partnerFilterButtonClasses['all'] = 'btn btn-primary';

        }
    }
});