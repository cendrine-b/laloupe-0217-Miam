angular.module('app')
    .controller('MangerController', function($scope, mangerService) {

      $scope.aliments = [];

        mangerService.findAll().then(function(res){
          $scope.aliments = res.data;
          $scope.cattegorie = $scope.aliments[categorie];
          $scope.nom = $scope.aliments[nom];
          $scope.description = $scope.aliments[description];
        }, function (err) {
          // oups
        });

    });
