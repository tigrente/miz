/**
 * Created by Alex on 10/6/15.
 */
angular.module("miz").controller("PartnerListCtrl", ['$meteor', '$scope', '$state',
    function ($meteor, $scope, $state) {


        //$scope.userList = $meteor.collection(Meteor.users).subscribe('userList');

        $scope.partnerFilter = '';

        $scope.resetPartnerFilterButtonClasses = function () {
            $scope.partnerFilterButtonClasses = {
                'none': 'btn btn-default',
                'university': 'btn btn-default',
                'company': 'btn btn-default',
                'incubator': 'btn btn-default',
                'venture': 'btn btn-default',
                'individual': 'btn btn-default'
            };
        };

        $scope.resetPartnerFilterButtonClasses();
        $scope.partnerFilterButtonClasses['none'] = 'btn btn-primary';


        $scope.setPartnerFilter = function (partnerFilter) {
            if (partnerFilter == 'none') {
                $scope.partnerFilter = '';
                $scope.resetPartnerFilterButtonClasses();
                $scope.partnerFilterButtonClasses['none'] = 'btn btn-primary';
            }
            else {
                $scope.partnerFilter = partnerFilter;
                $scope.resetPartnerFilterButtonClasses();
                $scope.partnerFilterButtonClasses[partnerFilter] = 'btn btn-primary';
            }

        };


        $scope.partnerList = $meteor.collection(function () {
            return Partners.find();
        });



       $meteor.autorun($scope, function () {
            $scope.$meteorSubscribe('partnerList', {
                    limit: parseInt($scope.perPage)   //currently loading all record
                }, $scope.getReactively('search'), $scope.getReactively('partnerFilter')
            );
        });


        jQuery(document).ready(function ($) {
            $(".clickable-row").click(function () {
                alert("table clicked...")
                window.document.location = $(this).data("url");
            });
        });


        $scope.viewPartnerDetail = function () {

            $scope.targetPartner = this.partner._id;
            $scope.targetDestination = "/partners/" + $scope.targetPartner;


            window.location.href = $scope.targetDestination;
        };


    }
])
;