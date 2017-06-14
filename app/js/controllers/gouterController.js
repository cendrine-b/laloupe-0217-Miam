angular.module('app')
    .controller('GouterController', function($scope, FoodFactory, $location, $anchorScroll, Auth, CurrentUser, LocalService, GouterService) {

            // SIMPLIFY FOOD NAMES
            $scope.underscore = function(string) {
                return string.replace(/[_]/g, " ");
            };
            $scope.regAccent = function(string) {
                return string.normalize('NFD').replace(/[\u0300-\u036f\u0100-\u017f]/g, "").toLowerCase();
            };
            $scope.correct = function(string) {
                return $scope.regAccent(string);
            };

            $scope.user = CurrentUser.user();

            $scope.foodList = FoodFactory;
            $scope.categories = Object.keys($scope.foodList);
            console.log($scope.foodList);

            var i = 0;
            var j = 0;

            $scope.arrayToString = function(string) {
                return string.join(", ");
            };

            $scope.selectFood = function(foodname) {
                $scope.appearance = foodname;
            };

            $scope.scrollTo = function() {
                $location.hash('_' + $scope.appearance);
                $anchorScroll();
            };

            $scope.like = function(foodName) {
                var like = {
                    nameFood: foodName,
                    countVote: [true],
                };
                if ($scope.user.email !== undefined) {

                    GouterService.findOneAndUpdate(like).then(function(res) {

                    }, function(err) {});
                } else {
                    LocalService.set("I like", JSON.stringify(like)).then(function(res) {

                    }, function(err) {});
                }

            };
            $scope.dislike = function(foodName) {
                var like = {
                    nameFood: foodName,
                    countVote: [false],
                };
                if ($scope.user.email !== undefined) {

                    GouterService.findOneAndUpdate(like).then(function(res) {

                    }, function(err) {});
                } else {
                    LocalService.set("I like", JSON.stringify(like)).then(function(res) {

                    }, function(err) {});
                }
            };

            $scope.choices = [];
            console.log($scope.choices);

            $scope.addChoice = function(name) {
                console.log(name);
                var choice = {
                    nameFood: name,
                    toTaste: true
                };
                $scope.choices.push(choice);
                console.log("$scope.choices", $scope.choices);
                if ($scope.user.email !== undefined) {
                  console.log("Database");
                  for (var k = 0; k < $scope.choices.length; k++) {
                    GouterService.create($scope.choices[k], $scope.user._id).then(function(res) {}, function(err) {});
                  }
                } else {
                  console.log("LocalStorage");
                  LocalService.set("gouter", JSON.stringify($scope.choices)).then(function(res) {}, function(err) {});
                }
            };

            $scope.deselect = function($index) {
              $scope.choices.splice($index, 1);
              console.log("deselect one", $scope.choices);
            };

});
