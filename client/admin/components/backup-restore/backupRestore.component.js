/**
 * Created by Alex on 10/6/15.
 */

/*********************************************************************************************************
 * <backup-restore>
 *     This directive is the homescreen of an admin backup and restore function.
 *********************************************************************************************************/

miz.directive("backupRestore", function () {
    return {
        restrict: 'E',
        templateUrl: 'client/admin/components/backup-restore/backup-restore.ng.html',
        controllerAs: 'bu',
        controller: function ($scope, $reactive) {
            $reactive(this).attach($scope);

            /** INITIALIZATION **/


            /** HELPERS **/
            this.helpers({
                backups: () => {
                    return Backups.find();
                }
            });

            /** SUBSCRIPTIONS **/
           this.subscribe('backups');

            /** FUNCTIONS **/
            this.backup = function () {
                Meteor.call('backup', (err, data) => {
                    if (err)
                    alert(err);
                    else {
                        this.backupResult = data;
                    }

                })
            }



        }
    }
});