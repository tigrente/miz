/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <lab-list>
 *     This directive presents a full screen search and listing for labs.  Clicking a lab
 *     enables editing of said lab by taking user to labDetails context. Currently, this is
 *     doing complete filtering of the view server side.  Pagination is not currently implemented.
 *********************************************************************************************************/

miz.directive("labList", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/labs/components/lab-list/lab-list.ng.html',
        controllerAs: 'labList',
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);



            /** HELPERS **/
            this.helpers({
                labList: () => {
                    return Labs.find();  //currently, the list filtered on the server...
                }
            });



            /** SUBSCRIPTIONS **/
            this.subscribe('labList', ()=> {
                return [ {}, this.getReactively('search'), this.getReactively('labFilter') ]
            });


            /** FUNCTIONS **/
            /*********************************************************************************************************
             * resetLabFilterButtonClasses
             * Resets button format classes.  Used when a button is clicked to normalize the format of the button
             * selected previously.
             ********************************************************************************************************/

             this.resetLabFilterButtonClasses = function () {
                this.labFilterButtonClasses = {
                    'all': 'btn btn-default',
                    'futurewei': 'btn btn-default',
                    'hq': 'btn btn-default',
                    'other': 'btn btn-default',
                };
            };


            /*********************************************************************************************************
             * setLabFilter
             * Used when filter button is clicked in view.  Sets lab filters based on labType.
             * @labFilter: string of lab type.  Used directly to filter labs by type.
             ********************************************************************************************************/

            this.setLabFilter = function (labFilterInput) {
                if (labFilterInput == 'all') {
                    // if 'all', filter is blank.
                    this.labFilter = '';
                    this.resetLabFilterButtonClasses();
                    this.labFilterButtonClasses['all'] = 'btn btn-primary';
                }
                else {
                    // otherwise, set the filter and format the buttons
                    this.labFilter = labFilterInput;
                    this.resetLabFilterButtonClasses();
                    this.labFilterButtonClasses[labFilterInput] = 'btn btn-primary';
                }

            };


            /*********************************************************************************************************
             * viewLabDetail
             * @labId: The id of the clicke
             * Used when filter button is clicked in view.  Sets lab filter based on selction.
             ********************************************************************************************************/

            this.viewLabDetail = function (labId) {
                window.location.href =  "/labs/" + labId;
            };


            /** INITIALIZATION **/
            this.labFilter = '';    // Clear filter, show all labs on load
            this.resetLabFilterButtonClasses();  // Set button format classes
            this.labFilterButtonClasses['futurewei'] = 'btn btn-primary';

        }
    }
});