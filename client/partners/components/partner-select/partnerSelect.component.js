/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <partner-select>
 *     This directive is a component that enables selection and return of partners.
 *     It is called with an array of eligible partners and sets its caller's partner variable.
 *
 *     Attributes
 *     selected-partner-ids:  the reactive variable containing the array of selected partner ids
 *     partner-types: an ARRAY of eligible partner types to return
 *     cooperation-resources-only:  boolean - when true, returns only partners market as cooperation resources
 *     selector-label:  string - label rendered in the partner selector
 *
 *     Example:
 *         <partner-select
 *              partner-types="en.contractingPartnerTypes"
 *               selector-label="The party signing the contract is:"
 *               selected-partner-ids="en.newEngagement.contractingPartners">
 *           </partner-select>
 *********************************************************************************************************/

miz.directive("partnerSelect", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/partners/components/partner-select/partner-select.ng.html',
        controllerAs: 'ps',
        /* transclude: true,*/
        scope: {
            partnerTypes: "=",    // Eligible types of partners to present for selection
            selectedPartnerIds: "=", // Array of Ids of selected partners -- modifies reactive variable passed to it
            selectorLabel: "@",  // Label "e.g. "This Partner is a member of...",   "Talent"
            cooperationResourcesOnly: "@",  // Filters available partners to only Cooperation Resources
            resetOnChange: "="   // Resets component when this changes - likely the parent of selectedPartnerIds
        },
        bindToController: true,

        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);

            /** Initialize **/

            this.partnerSearch = "";


            /** HELPERS **/

            this.helpers({

                /** Reset the component if resetOnChange changed */
                resetComponent: () => {
                    this.getReactively("resetOnChange");

                    this.partnerSearch = "";  //Clear searchbox

                    //$scope.$apply();



                    return true;
                },

                /** Collection of selected partner objects */
                selectedPartners: () => {
                    this.getReactively("selectedPartnerIds", true);
                    this.getReactively("resetOnChange");

                    return Partners.find({
                        _id: {$in: this.selectedPartnerIds}
                    });

                },

                /** A list of potential  partners generated from the Search bar */
                partnerSearchList: () => {
                    this.getReactively('partnerSearch');
                    this.getReactively("resetOnChange");

                    if (this.partnerSearch == "") {
                        this.emptySearch = true;
                        this.noSearchResult = false;
                        return {};
                    } else {

                        this.emptySearch = false;


                        var selector;


                        if (this.cooperationResourcesOnly && !this.partnerTypes) {
                            selector = {
                                $and: [
                                    {'name': {'$regex': '.*' + this.partnerSearch || '' + '.*', '$options': 'i'}},
                                    {cooperationResource: true}
                                ]
                            };
                        } else if (!this.cooperationResourcesOnly && !this.partnerTypes) {
                            selector = {
                                'name': {'$regex': '.*' + this.partnerSearch || '' + '.*', '$options': 'i'}
                            };
                        } else if (!this.cooperationResourcesOnly && this.partnerTypes) {
                            selector = {
                                $and: [
                                    {'name': {'$regex': '.*' + this.partnerSearch || '' + '.*', '$options': 'i'}},
                                    {partnerType: {$in: this.partnerTypes}}
                                ]
                            };
                        } else if (this.cooperationResourcesOnly && this.partnerTypes) {
                            selector = {
                                $and: [
                                    {'name': {'$regex': '.*' + this.partnerSearch || '' + '.*', '$options': 'i'}},
                                    {partnerType: {$in: this.partnerTypes}},
                                    {cooperationResource: true}

                                ]
                            };
                        }

                        let options = {
                            limit: 5,
                            fields: {
                                name: 1,
                                cooperationResource: 1
                            }
                        };

                        return Partners.find(selector, options);

                    } //else

                },

                noSearchResult: () => {
                    if (this.getReactively('partnerSearchList').length == 0)
                        return true;
                    else
                        return false;
                }

            });


            /** SUBSCRIPTIONS **/


            this.subscribe('selectPartnerSearch', ()=> {
                return [
                    this.getReactively('partnerSearch'),  //variable passed to subscription
                    this.getReactively('partnerTypes'),  //variable passed to subscription
                    this.getReactively('cooperationResourcesOnly')   //variable passed to subscription

                ]
            });


            /** Subscription to list partners added to newPartner **/
            this.subscribe('partnerInfo', ()=> {
                return [
                    //array of partnerIds to return
                    this.getReactively('selectedPartnerIds', true),

                    //options for find
                    {
                        fields: {
                            name: 1,
                            partnerType: 1
                        }
                    }
                ]
            });


            /***************************************************************************************************
             * noSelectedPartners
             * Returns true if no selectedPartners are defined.   This is used to view/hide
             * the "None selected..." message with an 'ng-hide' in the view
             ****************************************************************************************************/
            this.noSelectedPartners = function () {
                return typeof this.selectedPartners == 'undefined' ||
                    this.selectedPartnerIds.length == 0;
            };


            /***************************************************************************************************
             * addPartner
             * Adds the clicked partner ID to the selectedPartners array.
             ****************************************************************************************************/
            this.addPartner = function (partner) {
                //alert('Select partner add attempted:'+ partner.name);
                //first, we need to see if it is already listed, otherwise we could add duplicates.
                if (!_.contains(this.selectedPartnerIds, partner._id)) {
                    //if not, add it
                    this.selectedPartnerIds.push(partner._id);
                }

            };

            /***************************************************************************************************
             * removePartner
             * Removes the clicked partner ID from the selectedPartnerIds array and the corresponding
             * object from this.selectedPartners
             *
             * @property {string} this.partner    the clicked parentPartner that triggeed this function
             *
             ****************************************************************************************************/
            this.removePartner = function (partner) {
                this.selectedPartnerIds = _.without(this.selectedPartnerIds, partner._id); //remove all matching values
            };

        } // controller
    }
        ;  //return
})
;


