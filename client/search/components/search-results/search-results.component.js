/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <search-results->
 *     This directive enables users to create new engagements.
 *
 *     NOTE: Since Angular-Meteor 1.3, Autobind has been removed, so changes to the client must be pushed
 *     back to the record.
 *********************************************************************************************************/

miz.directive("searchResults", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/search/components/search-results/search-results.ng.html',
        controllerAs: 'sr',
        bindToController: true,
        transclude: true,
        controller: function ($scope, $reactive, $rootScope, $timeout, $state) {

            $reactive(this).attach($scope);
            /** INITIALIZE **/
                //$rootScope.menuSearchString = "cla";  // for development

                // The below jquery adjusts the height of the  body to accommodate the screen height
            let searchScreenHeightAdjustment = 60;
            let engagementResultHeightAdjustment = 100;
            this.engagementLimit = 20;
            this.universityLimit = 20;
            this.companyLimit = 20;
            this.resourceLimit = 20;
            this.uniSubOrgLimit = 20;
            this.otherOrgLimit = 20;
            this.contactLimit = 20;

            Partners.remove();
            Engagements.remove();


            /** HELPERS **/

            this.helpers({

                engagementCollection: () => {


                    this.getReactively('searchString');
                    this.getReactively('engagementLimit');

                    let selector = {

                        $or: [
                            {
                                'bdOwnerLabel': {
                                    '$regex': '.*' + this.searchString || '' + '.*',
                                    '$options': 'i'
                                }
                            },
                            {
                                'contractingPartnersLabel': {
                                    '$regex': '.*' + this.searchString || '' + '.*',
                                    '$options': 'i'
                                }
                            },
                            {
                                'cooperationResourcesLabel': {
                                    '$regex': '.*' + this.searchString || '' + '.*',
                                    '$options': 'i'
                                }
                            },
                            {'title': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                            {'tempLab': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                            {'labLabel': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                        ]
                    };

                    return Engagements.find(selector);

                },

                universityCollection: () => {

                    this.getReactively('searchString');
                    this.getReactively('universityLimit');

                    let selector = {
                        $and: [
                            {
                                $or: [
                                    {'name': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {'description': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {'keywords': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}}
                                ]
                            },

                            {'partnerType': 'university'}
                        ]
                    };

                    let universityOptions = {
                        limit: this.universityLimit,
                        sort: {modifiedDate: -1}
                    };


                    return Partners.find(selector, universityOptions);

                },

                companyCollection: () => {

                    this.getReactively('searchString');
                    this.getReactively('companyLimit');

                    let selector = {
                        $and: [
                            {
                                $or: [
                                    {'name': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {'description': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {'keywords': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}}
                                ]
                            },

                            {'partnerType': 'company'}
                        ]
                    };

                    let companyOptions = {
                        limit: this.companyLimit,
                        sort: {modifiedDate: -1}
                    };


                    return Partners.find(selector, companyOptions);

                },

                resourceCollection: () => {

                    this.getReactively('searchString');
                    this.getReactively('resourceLimit');

                    let selector = {
                        $and: [
                            {
                                $or: [
                                    {'name': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {
                                        'parentPartnerLabel': {
                                            '$regex': '.*' + this.searchString || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {'description': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {'keywords': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}}
                                ]
                            },

                            {'cooperationResource': true},
                            {'partnerType': {$ne: 'company'}}

                        ]
                    };

                    let options = {
                        limit: this.resourceLimit,
                        sort: {modifiedDate: -1}
                    };

                    return Partners.find(selector, options);

                },

                uniSubOrgCollection: () => {

                    this.getReactively('searchString');
                    this.getReactively('uniSubOrgLimit');

                    let selector = {
                        $and: [
                            {
                                $or: [
                                    {'name': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {
                                        'parentPartnerLabel': {
                                            '$regex': '.*' + this.searchString || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {'description': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {'keywords': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}}
                                ]
                            },

                            {'partnerType': 'uniSubOrg'}

                        ]
                    };

                    let options = {
                        limit: this.uniSubOrgLimit,
                        sort: {modifiedDate: -1}
                    };

                    return Partners.find(selector, options);

                },

                otherOrgCollection: () => {

                    this.getReactively('searchString');
                    this.getReactively('otherOrgLimit');

                    let selector = {
                        $and: [
                            {
                                $or: [
                                    {'name': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {
                                        'parentPartnerLabel': {
                                            '$regex': '.*' + this.searchString || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {'description': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {'keywords': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}}
                                ]
                            },

                            //catch all for remaining types - show if not one of these
                            {
                                'partnerType': {
                                    $nin: [
                                        'university',
                                        'uniSubOrg',
                                        'contact',
                                        'company',
                                        'individual',
                                        'professor',
                                        'contact'
                                    ]
                                }
                            }

                        ]
                    };

                    let options = {
                        limit: this.otherOrgLimit,
                        sort: {modifiedDate: -1}
                    };

                    return Partners.find(selector, options);

                },

                contactCollection: () => {

                    this.getReactively('searchString');
                    this.getReactively('contactLimit');

                    let selector = {
                        $and: [
                            {
                                $or: [
                                    {'name': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {
                                        'parentPartnerLabel': {
                                            '$regex': '.*' + this.searchString || '' + '.*',
                                            '$options': 'i'
                                        }
                                    },
                                    {'description': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}},
                                    {'keywords': {'$regex': '.*' + this.searchString || '' + '.*', '$options': 'i'}}
                                ]
                            },

                            {'partnerType': 'contact'}

                        ]
                    };

                    let options = {
                        limit: this.contactLimit,
                        sort: {modifiedDate: -1}
                    };

                    return Partners.find(selector, options);

                },


            });


            /** SUBSCRIPTIONS **/
            this.subscribe('engagementsSearch', () => {
                return [
                    //variable passed to subscription
                    this.getReactively('searchString'),
                    this.getReactively('engagementLimit')
                ]
            });

            this.subscribe('partnerSearch', () => {
                return [
                    //variable passed to subscription
                    this.getReactively('searchString'),
                    'university',
                    this.getReactively('universityLimit'),
                ]
            });

            this.subscribe('partnerSearch', () => {
                return [
                    //variable passed to subscription
                    this.getReactively('searchString'),
                    'company',
                    this.getReactively('companyLimit'),
                ]
            });

            this.subscribe('partnerResourceSearch', () => {
                return [
                    //variable passed to subscription
                    this.getReactively('searchString'),
                    this.getReactively('resourceLimit'),
                ]
            });

            this.subscribe('partnerSearch', () => {
                return [
                    //variable passed to subscription
                    this.getReactively('searchString'),
                    'uniSubOrg',
                    this.getReactively('uniSubOrgLimit'),
                ]
            });

            this.subscribe('partnerSearch', () => {
                return [
                    //variable passed to subscription
                    this.getReactively('searchString'),
                    'otherOrgs',
                    this.getReactively('otherOrgLimit'),
                ]
            });

            this.subscribe('partnerSearch', () => {
                return [
                    //variable passed to subscription
                    this.getReactively('searchString'),
                    'contact',
                    this.getReactively('contactLimit'),
                ]
            });


            /** AUTORUN**/
            this.autorun(() => {
                // Get search string from menu - this is rootScope variable
                $scope.getReactively('menuSearchString');
                $scope.getReactively('engagementCollection');
                if ($rootScope.menuSearchString.length < 3)
                    this.searchString = null;
                else
                    this.searchString = $rootScope.menuSearchString;

                let bodyheight = $('body').height();
                bodyheight = bodyheight - engagementResultHeightAdjustment;
                $('.search-result-engagement-column').css('height', bodyheight + 'px');

                $timeout(function () {
                    setBackgroundHeight();
                }, 500);

                $timeout(function () {
                    setEngagementColumnHeight();
                    setUniversityColumnHeight()
                }, 500);

            }); //autorun

            /** FUNCTIONS */

            /***************************************************************************************************
             * fetchMore____________()
             * Used by infinite-scroll function.  When the near bottom of the page is reached, increases the
             * limit on the  subscription so that more items are returned from the server.
             ****************************************************************************************************/

            this.fetchMoreEngagements = function () {
                this.engagementLimit += 20;
            };

            this.fetchMoreUniversities = function () {
                this.universityLimit += 20;
            };

            this.fetchMoreCompanies = function () {
                this.companyLimit += 20;
            };

            this.fetchMoreResources = function () {
                this.resourceLimit += 20;
            };

            this.fetchMoreUniSubOrgs = function () {
                this.uniSubOrgLimit += 20;
            };

            this.fetchMoreOtherOrgs = function () {
                this.otherOrgLimit += 20;
            };

            this.fetchMoreContacts = function () {
                this.contactLimit += 20;
            };


            /*********************************************************************************************************
             * viewPartnerDetail
             * @partnerId: The id of the clicked engagement
             * Opens detail page for partner
             ********************************************************************************************************/

            this.viewPartnerDetail = function (partner) {
                $state.go('partnerDetails', {partnerId: partner._id});
            };


            /** JQUERY */

            /***************************************************************************************************
             * setEngagementColumnHeight()
             * Sets the height of the engagement column based upon the window size.
             ****************************************************************************************************/
            let setEngagementColumnHeight = function () {
                let bodyheight = $('body').height();
                bodyheight = bodyheight - engagementResultHeightAdjustment;
                $('.search-result-engagement-column').css('height', bodyheight + 'px');
            };

            /***************************************************************************************************
             * setUniversityColumnHeight()
             * Sets the height of the engagement column based upon the window size.
             ****************************************************************************************************/
            let setUniversityColumnHeight = function () {
                let bodyheight = $('body').height();
                bodyheight = (bodyheight - engagementResultHeightAdjustment) * .40;
                $('.search-result-university-column').css('height', bodyheight + 'px');
            };


            /***************************************************************************************************
             * setBackgroundHeight()
             * Sets the height of the results background based upon the window size.
             ****************************************************************************************************/
            let setBackgroundHeight = function () {
                let bodyheight = $('body').height();
                let navbarHeight = $('#miz-navbar').height();
                bodyheight = bodyheight - 53;
                $('.search-result-main-page-background').css('height', bodyheight + 'px');
            };

            //Engagement Results column resize when window resizes
            $(window).resize(function () {
                setBackgroundHeight();
            }).resize();

            //Engagement Results column resize when window resizes
            $(window).resize(function () {
                setEngagementColumnHeight();
            }).resize();

            //Engagement Results column resize when window resizes
            $(window).resize(function () {
                setUniversityColumnHeight();
            }).resize();


            /*        $(window).resize(function () {
             let bodyheight = $('body').height();
             bodyheight = bodyheight - searchScreenHeightAdjustment;
             $('.search-result-main-page-results-wrapper').css('min-height', bodyheight + 'px');
             }).resize();

             $(window).resize(function () {
             let bodyheight = $('body').height();
             bodyheight = bodyheight - searchScreenHeightAdjustment;
             $('.search-result-main-page-results-wrapper').css('max-height', bodyheight + 'px');
             }).resize();

             $(window).resize(function () {
             let bodywidth = $('body').width();
             let tableBodyWidth = bodywidth - 400;
             $('.search-result-main-page-results-wrapper').css('width', bodywidth + 'px');
             }).resize();*/


            /** INITIALIZATION **/

            // This delayed function sets the height of the engagement results column.  A delay is required, otherwise
            // the height is not set until something manually triggers it.
            $timeout(function () {
                setBackgroundHeight();
            }, 0);

            $timeout(function () {
                setEngagementColumnHeight();
                setUniversityColumnHeight();
            }, 0);


        } // controller
    };  //return
});
