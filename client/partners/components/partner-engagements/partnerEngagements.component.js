/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <eng-list-for-partner>
 *     This directive takes a partnerId and returns a table of all the associated engagements.
 *
 *     Attributes
 *     partner-id:  the reactive variable containing the array of selected partner ids
 *
 *     Example:
 *         <partner-select
 *              partner-id="pd.partner"
 *           </partner-select>
 *********************************************************************************************************/

miz.directive("partnerEngagements", function () {


    return {
        restrict: 'E',
        templateUrl: 'client/partners/components/partner-engagements/partner-engagements.ng.html',
        controllerAs: 'pe',
        /* transclude: true,*/
        scope: {
            partnerId: "=",    // PartnerId to retrieve engagements for
        },
        bindToController: true,

        controller: function ($scope, $reactive) {

            $reactive(this).attach($scope);

            /** Initialize **/


            /** HELPERS **/
            this.helpers({

                /** Collection of selected partner objects */
                engagements: () => {
                    this.getReactively("partnerId");

                    if (this.partnerId) {
                        return Engagements.find();//return
                    } // if
                },

                /** Partners referenced in listed engagements. Used to fetch from subscription */
                referencedPartnerIds: () => {
                    this.getReactively("engagements");
                    var refPartnerIds = [];

                    if (this.engagements) {
                        for (let eng  of this.engagements) {
                            // add unique values to partner
                            refPartnerIds = _.union(refPartnerIds, eng.cooperationResources, eng.contractingPartners);
                        }
                    }

                    return refPartnerIds;

                },

                referencedPartners: ()=> {
                    this.getReactively("referencedPartnerIds");

                    if (this.referencedPartnerIds) {
                        var selector = {_id: {$in: this.referencedPartnerIds}};

                        var options = {
                            fields: {name: 1}
                        };

                        return Partners.find(selector, options);
                    }
                },

                /** Partners referenced in listed engagements. Used to fetch from subscription */
                referencedBizdevIds: () => {
                    this.getReactively("engagements");
                    var refBizdevIds = [];

                    if (this.engagements) {
                        for (let eng  of this.engagements) {

                            //put into array so union can use it.
                            var ownerArray = [eng.bdOwner];

                            // add unique values to partner
                            refBizdevIds = _.union(refBizdevIds, ownerArray, eng.bdRelated);
                        }
                    }

                    return refBizdevIds;

                },

                referencedBizdevs: ()=> {
                    this.getReactively("referencedBizdevIds");

                    if (this.referencedBizdevIds) {
                        var selector = {_id: {$in: this.referencedBizdevIds}};

                        var options = {
                            fields: {profile: 1}
                        };

                        return Meteor.users.find(selector, options);
                    }
                },

            }); // helpters


            /** SUBSCRIPTIONS **/

            /** Subscription to list partners added to newPartner **/
            this.subscribe('engagementsOfPartner', ()=> {
                return [
                    //array of partnerIds to return
                    this.getReactively('partnerId')
                ]
            });

            this.subscribe('partnerNames', ()=> {
                return [
                    //array of partnerIds to return
                    this.getReactively('referencedPartnerIds'),

                    //options for find
                    {}
                ]
            });

            this.subscribe('userSimpleList', ()=> {
                return [
                    //array of partnerIds to return
                    this.getReactively('referencedBizdevIds'),

                    //options for find
                    {}
                ]
            });

            /** FUNCTIONS **/

            /*********************************************************************************************************
             * viewEngagementDetail
             * @engagementId: The id of the clicke
             * Changes view to selected Engagement
             ********************************************************************************************************/

            this.viewEngagement = function (engagementId) {
                window.location.href = "/engagements/" + engagementId;
            };



            /***************************************************************************************
             * stringOfPartnerNames
             * Takes an array of partnerIds and returns a single string of concatenated names.
             * @param partnerIdArray
             * @returns {string}
             */
            this.stringOfPartnerNames = function (partnerIdArray) {

            var partnerString = "";

            for (let i = 0; i < partnerIdArray.length; i++) {

                var partner = _.find(this.referencedPartners, function (testPartner) {
                    return testPartner._id == partnerIdArray[i]
                });

                if (partner)
                    if (!partnerString.length)
                        partnerString = partner.name;
                    else
                        partnerString = partnerString + ", " + partner.name;
            }// for

            return partnerString;


        };// returnPartnerNames

            /***************************************************************************************
             * stringOfPartnerNames
             * Takes and array of userIds and returns a single string of concatenated names.
             * @param bizdevIdArray
             * @returns {string}
             */
            this.stringOfBizdevNames = function (bizdevIdArray) {

                var bizdevString = "";

                for (let i = 0; i < bizdevIdArray.length; i++) {

                    var bizdev = _.find(this.referencedBizdevs, function (testBizdev) {
                        return testBizdev._id == bizdevIdArray[i]
                    });

                    if (bizdev)
                        if (!bizdevString.length)
                            bizdevString = bizdev.profile.name;
                        else
                            bizdevString = bizdevString + ", " + bizdev.profile.name;
                }// for

                return bizdevString;


            };// returnPartnerNames


        } // controller
    }
        ;  //return
})
;


