/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <bd-owner-select>
 *     This directive is a component that enables selection and return of bdOwner enabled users.  Note that
 *     this component checks to see if specified selected-bd-owner-ids is a single STRING, in which it will permit selection
 *     of only one user, or an ARRAY, in which it will permit selection of many.
 *
 *     Attributes
 *     selected-bd-owner-ids:  the reactive variable containing the array of selected user ids
 *     selector-label:  string - label rendered in the partner selector
 *     resetOnChange: = Resets component when this specified variable changes
 *
 *     Example:
 *         <bd-owner-select
 *               selector-label="The party signing the contract is:"
 *               selected-partner-ids="en.newEngagement.contractingPartners">
 *           </partner-select>
 *********************************************************************************************************/

miz.directive("bdOwnerSelect", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/users/components/bd-owner-select/bd-owner-select.ng.html',
        controllerAs: 'bds',
        /* transclude: true,*/
        scope: {
            selectedBdOwnerIds: "=", // Array of Ids of selected partners -- modifies reactive variable passed to it
            selectorLabel: "@",  // Label "e.g. "This Partner is a member of...",   "Talent"
            resetOnChange: "="   // Resets component when this specified variable changes
        },
        bindToController: true,

        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);

            /** Initialize **/

            this.bdOwnerSearch = "";

            var returnMultipleOwners = false; // deterine if multiple entries should be returned according to typeof bdOwnerIds

            if (Array.isArray(this.selectedBdOwnerIds))
                returnMultipleOwners = true;
            else if (typeof this.selectedBdOwnerIds === "string")
                returnMultipleOwners = false;
/*            else
                alert("Error in BDOwner selection: BD Owner variable has unrecognized type.");*/

            /** HELPERS **/

            this.helpers({

                /** Reset the component if resetOnChange changed */
                resetComponent: () => {
                    this.getReactively("resetOnChange");
                    this.bdOwnerSearch = "";  //Clear search box
                    return true;
                },

                /** Collection of selected bdOwner objects */
                selectedBdOwners: () => {
                    this.getReactively("selectedBdOwnerIds", true);
                    this.getReactively("resetOnChange");

                    if (!returnMultipleOwners) { //find based on string
                        return Meteor.users.find(this.selectedBdOwnerIds)
                    }
                    else {
                        return Meteor.users.find({ //find based on array
                            _id: {$in: this.selectedBdOwnerIds}
                        });
                    }
                },

                /** A list of potential  partners generated from the Search bar */
                bdOwnerSearchList: () => {
                    this.getReactively('bdOwnerSearch');
                    this.getReactively("resetOnChange");

                    if (this.bdOwnerSearch == "") {
                        this.emptySearch = true;
                        this.noSearchResult = false;
                        return {};   // if no search list return an empty result
                    } else {

                        this.emptySearch = false;

                        selector = {
                            $and: [
                                {
                                    $or: [
                                        {
                                            'username': {
                                                '$regex': '.*' + this.bdOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'profile.name': {
                                                '$regex': '.*' + this.bdOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'profile.company': {
                                                '$regex': '.*' + this.bdOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'profile.group': {
                                                '$regex': '.*' + this.bdOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'profile.huaweiId': {
                                                '$regex': '.*' + this.bdOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        },
                                        {
                                            'emails.address': {
                                                '$regex': '.*' + this.bdOwnerSearch || '' + '.*',
                                                '$options': 'i'
                                            }
                                        }
                                    ]
                                },

                                {
                                    $or: [
                                        {roles: {$elemMatch: {$eq: 'editEngagements'}}},
                                        {roles: {$elemMatch: {$eq: 'editAllEngagements'}}}
                                    ]
                                }
                            ]
                        };

                        let options = {
                            limit: 5
                        };

                        return Meteor.users.find(selector, options);

                    } //else

                },

                noSearchResult: () => {
                    if (this.getReactively('bdOwnerSearchList').length == 0)
                        return true;
                    else
                        return false;
                }

            });

            /** SUBSCRIPTIONS **/


            /** Subscription to user list to search for bizDevOwners */
            this.subscribe('userBizDevOwnerSearch', ()=> {
                return [
                    // searchTerm
                    this.getReactively('bdOwnerSearch')
                ]
            });


            /** Subscription to users for list of current biz dev owners. */
            this.subscribe('userSimpleList', ()=> {

                    return [
                        // array of user ids to look up
                        this.getReactively('selectedBdOwnerIds')
                    ]

                }
            );

            /***************************************************************************************************
             * noSelectedBdOwners
             * Returns true if no slectedBdOwners are defined.   This is used to view/hide
             * the "None selected..." message with an 'ng-hide' in the view
             ****************************************************************************************************/
            this.noSelectedBdOwners = function () {
                return typeof this.selectedBdOwnerIds == 'undefined' ||
                    this.selectedBdOwnerIds.length == 0;
            };


            /***************************************************************************************************
             * addBdOwner
             * Adds the clicked partner ID to the selectedPartners array.
             ****************************************************************************************************/
            this.addBdOwner = function (bdOwner) {
                //alert('Select partner add attempted:'+ partner.name);
                //first, we need to see if it is already listed, otherwise we could add duplicates.

                if (returnMultipleOwners) { // returning multiple entries
                    if (!_.contains(this.selectedBdOwnerIds, bdOwner._id)) { //see if its already there...
                        //if not, add it
                        this.selectedBdOwnerIds.push(bdOwner._id);
                    }
                } else {
                    this.selectedBdOwnerIds = bdOwner._id;
                }
            };

            /***************************************************************************************************
             * removeBdOwner
             * Removes the clicked partner ID from the selectedPartnerIds array and the corresponding
             * object from this.selectedPartners
             *
             * @property {string} this.partner    the clicked parentPartner that triggeed this function
             *
             ****************************************************************************************************/
            this.removeBdOwner = function (bdOwner) {

                if (returnMultipleOwners)
                    this.selectedBdOwnerIds = _.without(this.selectedBdOwnerIds, bdOwner._id); //remove all matching values
                else
                    this.selectedBdOwnerIds = "";
                    };


        } // controller
    }
        ;  //return
})
;


