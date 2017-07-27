/**
 * Created by Alex on 2/12/16.
 */
miz.directive('test', function () {
    return {
        restrict: 'E',
        templateUrl: 'client/partners/views/components/test.ng.html',
        controllerAs: 'test',
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            $scope.check = "working";
            $scope.check = $scope.partner;




            $scope.helpers({
                memberPartners: () => {
                    return Partners.find();
                }
            });

            /*            Meteor.call("memberPartners", $scope.partner._id, function (err, result) {
             alert("memberPartners call made");
             if (err) {
             // Handle error
             console.log('Something went wrong when looking up member partners.', err);
             alert("getMemberPartners: Error looking up children: " + err)
             return "hey";

             } else {

             alert("getMemberPartners Data: " + result);

             $scope.memberPartners = result;
             }
             })*/
        }


    }

});
