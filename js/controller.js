app.controller("controlador", ["$scope", "chatMessages", "UsersAdd", "Users", "chatMessagesPersonal", "UserFollowers",
    // we pass our new chatMessages factory into the controller
    function($scope, chatMessages, UsersAdd, Users,chatMessagesPersonal, UserFollowers) {
        $scope.disabled= true;
        $scope.nologeado = "";
        $scope.logeado = "hidden";
        $scope.userConnect = "";

        $scope.messages = chatMessages;
        $scope.messagesPersonal = chatMessagesPersonal('djl');
        $scope.usuaris = Users;
        $scope.followers = UserFollowers('djl');

        $scope.addMessage = function() {
            for(var i = 0; i < $scope.usuaris.length; i++){
                var aux = $scope.usuaris[i];
                if( aux.$id == $scope.userConnect){
                    $scope.messages.$add({
                        user: aux.name,
                        text: $scope.message
                    });
                    $scope.messagesPersonal.$add({
                        text: $scope.message
                    });
                    $scope.tweetsFollowers($scope.userConnectTotal);
                    $scope.message = "";
                    $scope.disabled = true;
                }
            }
        };

        // if the messages are empty, add something for fun!
        $scope.messages.$loaded(function() {
            if ($scope.messages.length === 0) {
                $scope.messages.$add({
                    user: "David Juez",
                    text: "Hola mundo!"
                });
            }
        });

        $scope.addUser = function() {
            $scope.users.$save();
        };

        $scope.addFollow = function(){
            $scope.followers.$add({
                idUser: $scope.newFollower
            });
            $scope.tweetsFollowers($scope.userConnectTotal);
        };

        $scope.userid = function(username){
            $scope.users = UsersAdd(username);
        };

        $scope.usernameID = function(username){
            $scope.messagesPersonal = chatMessagesPersonal(username);
            $scope.followers = UserFollowers(username);
        };

        $scope.disableButton = function () {
            if($scope.message == ''){
                $scope.disabled = true;
            } else {
                $scope.disabled = false;
            }
        };

        // index function
        $scope.login = function(username){
            var aux = null;
            for(var i = 0; i < $scope.usuaris.length; i++) {
                var aux = $scope.usuaris[i];
                if (aux.$id == username) {
                    $scope.logeado = "";
                    $scope.nologeado = "hidden";
                    $scope.userConnect = username;
                    $scope.usernameID(username);
                    $scope.tweetsFollowers(aux);
                    $scope.userConnectTotal = aux;
                    break;
                }
            }
        };

        $scope.tweetsFollowers = function(aux){
            $scope.messagesFollowers = [];
            for (var tweetsSeguido in aux.tweets) {
                if (tweetsSeguido != null) {
                    $scope.messagesFollowers.push({
                        "user": aux.name,
                        "text": aux.tweets[tweetsSeguido].text
                    });
                }
            }
            for (var usuariSeguido in aux.following) {
                var userNameSeguido = aux.following[usuariSeguido].idUser;
                for(var j = 0; j < $scope.usuaris.length; j++) {
                    var aux2 = $scope.usuaris[j];
                    if( aux2.$id == userNameSeguido ) {
                        for(var tweetsSeguido in aux2.tweets){
                            if(tweetsSeguido != null) {
                                $scope.messagesFollowers.push({
                                    "user": aux2.name,
                                    "text": aux2.tweets[tweetsSeguido].text
                                });
                            }
                        }
                    }
                }
            }
        };
    }
]);