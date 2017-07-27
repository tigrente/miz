/*********************************************************************************************************
 * <login-screen>
 *     Presents a full screen welcome page and login capability.
 *********************************************************************************************************/

miz.directive("loginScreen", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/welcome/components/login-screen/login-screen.ng.html',
        controllerAs: 'login',
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            this.credentials = {
                email: '',
                password: ''
            };

            $scope.error = null;


            this.helpers({

                partnerCount: () => {

                    this.call('partnerCount', (err, result) => {
                        return result;
                    } )

                }

            });


            this.login = function () {

                Meteor.loginWithPassword(this.credentials.email, this.credentials.password,
                    function (err) {
                        //noinspection JSPotentiallyInvalidUsageOfThis
                        $scope.error = err.reason;
                    }).then(
                    function () {
                        $state.go('partners');
                    }
                );
            };
        }
    }
});





