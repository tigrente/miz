/**
 * Created by a00754691 on 9/23/2015.
 */

angular.module("miz").run(['$rootScope', '$state', function ($rootScope, $state) {

    // If no permission, redirect to welcome page.
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        // We catch the error thrown when the $requireUser promise is rejected
        // and redirect the user back to the main page
        if (error === 'AUTH_REQUIRED') {
            $state.go('welcome');
        }
    });

    // The following three processes address routing pages when logging in or out.
    Accounts.onLogin(function () {
        if ($state.is('welcome')) {
            $state.go('dashboard');
        }
    });

    Accounts.onLoginFailure(function () {
        $state.go('welcome');
    });

    //this call comes from the differential:event-hooks meteor package. Not a core function at time...
    Hooks.onLoggedOut = function () {
        $state.go('welcome');
    }


}
]);

/*********************************************************************************
 * ANGULAR ROUTER
 * This function provides the application routing based on URL.
 *********************************************************************************/

miz.config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

    $locationProvider.html5Mode(true);    //Sets the URL to look like a regular one instead of a Hashbang mode





    $stateProvider

    /** LOGIN PAGE **/

        .state('welcome', {
            url: '/',
            template: '<login-screen></login-screen>'
        })


        /** ADMINISTRATIVE TOOLS **/

        .state('registerUser', {
            url: '/registerUser',
            template: '<account-create></account-create>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('userList', {
            url: '/users',
            template: '<account-list></account-list>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('userUpdate', {
            url: '/users/:userId',
            template: '<account-update></account-update>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('backup', {
            url: '/backup-restore',
            template: '<backup-restore></backup-restore>',
            resolve: {
                currentUser: ($q) => {
                    if ((Meteor.userId() == null) ||
                        (!Roles.userIsInRole(Meteor.userId(), 'superAdmin'))) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('dashboard', {
            url: '/dashboard',
            template: '<dash-main></dash-main>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })


        .state('partners', {
            url: '/partners',
            template: '<partner-summary></partner-summary>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('newPartner', {
            url: '/new-partner',
            template: '<partner-new></partner-new>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('partnerDetails', {
            url: '/partners/:partnerId',
            template: '<partner-details></partner-details>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })


        .state('labs', {
            url: '/labs',
            template: '<lab-list></lab-list>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('labDetails', {
            url: '/labs/:labId',
            template: '<lab-details></lab-details>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('newLab', {
            url: '/new-lab',
            template: '<lab-new></lab-new>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('reports', {
            url: '/reports',
            templateUrl: 'client/reports/views/reports.ng.html',
            controller: 'ReportsCtrl',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('search', {
            url: '/search/:searchTerm',
            templateUrl: 'client/search/views/search.ng.html',
            controller: 'SearchCtrl',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('engagements', {
            url: '/engagements',
            template: '<eng-user-summary></eng-user-summary>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();

                    }
                }
            }
        })

        .state('engagementTeamSummary', {
            url: '/engagement-team-summary',
            template: '<eng-team-summary></eng-team-summary>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() === null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();

                    }
                }
            }
        })

        .state('engagementUserSummary', {
            url: '/engagement-user-summary',
            template: '<eng-user-summary></eng-user-summary>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() === null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();

                    }
                }
            }
        })

        .state('engagementDetails', {
            url: '/engagements/:engagementId',
            template: '<eng-detail></eng-detail>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() === null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

        .state('newEngagement', {
            url: '/new-engagement',
            template: '<eng-new></eng-new>',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })


        .state('references', {
            url: '/references',
            templateUrl: 'client/references/views/references.ng.html',
            controller: 'ReferencesCtrl',
            resolve: {
                currentUser: ($q) => {
                    if (Meteor.userId() == null) {
                        return $q.reject('AUTH_REQUIRED');
                    }
                    else {
                        return $q.resolve();
                    }
                }
            }
        })

    .state('searchResults', {
        url: '/search-results',
        template: '<search-results></search-results>',
        resolve: {
            currentUser: ($q) => {
                if (Meteor.userId() == null) {
                    return $q.reject('AUTH_REQUIRED');
                }
                else {
                    return $q.resolve();

                }
            }
        }
    })
    
    
    .state('guideRoomCooperationManager', {
        url: '/room/cooperation-manager',
        template: '<cooperation-manager-guide-room></cooperation-manager-guide-room>',
        resolve: {
            currentUser: ($q) => {
                if (Meteor.userId() == null) {
                    return $q.reject('AUTH_REQUIRED');
                }
                else {
                    return $q.resolve();
                }
            }
        }
    })
    
    .state('guideRoomCooperationManagerArticle', {
        url: '/room/cooperation-manager/article/:articleId',
        template: '<article-detail></article-detail>',
        resolve: {
            currentUser: ($q) => {
                if (Meteor.userId() == null) {
                    return $q.reject('AUTH_REQUIRED');
                }
                else {
                    return $q.resolve();
                }
            }
        }
    })
    
    .state('guideRoomsAdmin', {
        url: '/rooms/admin',
        template: '<guide-room-admin></guide-room-admin>',
        resolve: {
            currentUser: ($q) => {
                if (Meteor.userId() == null) {
                    return $q.reject('AUTH_REQUIRED');
                }
                else {
                    return $q.resolve();
                }
            }
        }
    })
    
    .state('guideAdmin', {
        url: '/guide/:guideId/admin',
        template: '<guide-admin></guide-admin>',
        resolve: {
            currentUser: ($q) => {
                if (Meteor.userId() == null) {
                    return $q.reject('AUTH_REQUIRED');
                }
                else {
                    return $q.resolve();
                }
            }
        }
    })
    
    .state('articleEdit', {
        url: '/article/:articleId/edit',
        template: '<article-edit></article-edit>',
        resolve: {
            currentUser: ($q) => {
                if (Meteor.userId() == null) {
                    return $q.reject('AUTH_REQUIRED');
                }
                else {
                    return $q.resolve();
                }
            }
        }
    });
    

    $urlRouterProvider.otherwise("/");
});

// This is a directive to establish focus on load
miz.directive('autoFocus', function ($timeout) {
    return {
        restrict: 'AC',
        link: function (_scope, _element) {
            $timeout(function () {           //a little waiting for the page to load
                _element[0].focus();
            }, 0);
        }
    };
});

