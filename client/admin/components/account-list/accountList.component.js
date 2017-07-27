/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <account-list>
 *     This directive presents a full screen search and listing for user accounts.  Clicking a user account
 *     enables editing of said account by taking user to <account-update> directive. Currently, this is
 *     doing complete filtering of the view server side.  Pagination is not currently implemented.
 *********************************************************************************************************/

miz.directive("accountList", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/admin/components/account-list/account-list.ng.html',
        controllerAs: 'accountList',
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            /** INITIALIZATION **/
            this.roleFilter = '';    //filter passed to server

            this.roleFilterButtonClasses = {
                'all': 'btn btn-primary',
                'editEngagements': 'btn btn-default',
                'superAdmin': 'btn btn-default'
            };

            /** HELPERS **/
            this.helpers({
                userList: () => {
                    return Meteor.users.find();
                }

            });

            /** SUBSCRIPTIONS **/
           this.subscribe('userList', () => {
               return [
                   {
                       /*limit: parseInt(this.perPage)   //currently loading all record*/
                   },
                   this.getReactively('search'),
                   this.getReactively('roleFilter')
               ]
           });

            /** FUNCTIONS **/

            this.setRoleFilter = function (role) {
                if (role == 'all') {
                    this.roleFilter = '';
                    this.roleFilterButtonClasses = {
                        'all': 'btn btn-primary',
                        'editEngagements': 'btn btn-default',
                        'superAdmin': 'btn btn-default'
                    };
                } else {
                    this.roleFilter = role;
                    this.roleFilterButtonClasses = {
                        'all': 'btn btn-default',
                        'editEngagements': 'btn btn-default',
                        'superAdmin': 'btn btn-default'
                    };
                    this.roleFilterButtonClasses[role] = 'btn btn-primary';
                }

            };

            this.viewUserDetail = function (userId) {
                window.location.href = "/users/" + userId;
            };


        }
    }
});