var grader = null;
SGPGrader
    .controller('GraderController', ["$scope", "$rootScope","$sce", "$http", "$location", "Common", "GraderService", "$timeout","$q", function($scope, $rootScope,$sce, $http, $location, Common, GraderService, $timeout, $q) {

        $scope.generalInfo = {
            visible:true,
            students:{
                done:0,
                total:0
            },
            questions:{
                done:0,
                total:0
            },
            candidates:{
                done:0
            }
        };
        $scope.scheduleInfo = {
            visible:true,
            score:{
                discursives:0,
                objectives:0,
                total:0
            },
            questions:{
                discursives:0,
                objectives:0,
                total:0
            }
        };



        $scope.limitString = function(str, length){
            if (str.length>length){
                return str.substring(0,length-3)+"...";
            }
            return str;
        };
        $scope.formatFloat = function(number, length){
            if (Common.isEmpty(length)){
                length = 2;
            }
            length += 3;
            number = number.toString();
            if (number.length>length){
                return number.substring(0,5);
            }else{
                if (number.indexOf(".")==-1){
                    number += "." + Math.pow(10, length-3).toString().replace("1", "");
                }else if (number){
                    while (number.length<length){
                        number+="0";
                    }
                }
            }
            return number;
        };

        $scope.selectCandidate = function(candidate){


            $scope.currentCandidate = candidate;
            if (!$scope.started){
                $scope.start(candidate);
            }else{
                if (Common.isEmpty($scope.currentQuestion)){
                    $scope.findNext(candidate);
                }else{
                    save().then(function(objResponse){
                        if (!Common.isError(objResponse)){
                            if (!objResponse.canceled){
                                $scope.findNext(candidate);
                            }
                        }else{
                            $scope.serverError();
                        }
                    });
                }


            }
        };
        $scope.selectQuestion = function(question, candidate){

            $scope.currentQuestion = question;
            $scope.currentQuestion.oldScore = $scope.currentQuestion.score;
            $scope.currentQuestion.candidateId = candidate.id;
            for (var x=0 ; x<candidate.pages.length ; x++){
                if (candidate.pages[x].id==question.questionFirstPage){
                    $scope.selectPage(x, true);
                    break;
                }
            }
        };

        $scope.start = function(candidate){
            $scope.finished = false;
            $scope.started = true;
            $("#silverlight").show();
            $(".overlay-transparent").show();
            setTimeout(function(){
                grader = document.getElementById("grader");
                if (Common.isEmpty(grader.Content)){
                    $scope.silverlightError();
                }else{
                    grader.Content.MainPage.Debug = false;
                    $scope.findNext(candidate);
                    $scope.showGrader();
                    $(".overlay-transparent").hide();
                }

            },10000);
        };
        $scope.startGrader = function(){

        };
        $scope.showGrader = function(){
            $("#silverlight").width("100%");
            $("#silverlight").height("100%");
            $("#prev-page").fadeIn();
            $("#next-page").fadeIn();
            grader.width="100%";
            grader.height="100%";
        };
        $scope.findNext = function(candidate){
            var bln = false;

            if (!Common.isEmpty(candidate)){
                for (var y=0 ; y<candidate.questions.length ; y++) {
                    if ($scope.questions[candidate.questions[y].key].type=="t") {
                        bln = true;
                        $scope.selectQuestion(candidate.questions[y], candidate);
                        break;
                    }
                }
                $timeout(function(){
                    $scope.$apply();
                });
            }else{
                var arr = $scope.data.candidates;

                for (var x=0 ; x<arr.length ; x++){
                    for (var y=0 ; y<arr[x].questions.length ; y++){
                        if ($scope.questions[arr[x].questions[y].key].type=="t" && Common.isEmpty(arr[x].questions[y].score)){
                            bln = true;
                            $scope.selectCandidate(arr[x]);
                            $scope.selectQuestion(arr[x].questions[y], arr[x]);
                            break;
                        }
                    }
                    if (bln){
                        break;
                    }
                }
                if (bln){
                    $scope.$apply();
                    return;
                }else{
                    $scope.finish();
                }
            }
            Common.scrollTo("candidates", "candidate_"+$scope.currentCandidate.index);
        };

        $scope.next = function(){
            save().then(function(objResponse){
                if (!Common.isError(objResponse)){
                    if (!objResponse.canceled){
                        if ($scope.mode == "candidate"){  // Searching the next discursive question of that candidate
                            var bln = false;
                            for (var x=$scope.currentQuestion.index+1 ; x<$scope.currentCandidate.questions.length ; x++){
                                if ($scope.questions[$scope.currentCandidate.questions[x].key].type=="t"){
                                    $scope.selectQuestion($scope.currentCandidate.questions[x], $scope.currentCandidate);
                                    bln = true;
                                    break;
                                }
                            }
                            if (!bln){ // if not found, search the next discursive question of the next candidate
                                if ($scope.data.candidates.length!=$scope.currentCandidate.index+1){ //if it is not at the end of candidate's array
                                    var candidate = $scope.data.candidates[$scope.currentCandidate.index+1];
                                    $scope.currentCandidate = candidate;
                                    for (var x=0 ; x<candidate.questions.length ; x++){
                                        if ($scope.questions[candidate.questions[x].key].type=="t"){
                                            $scope.selectQuestion(candidate.questions[x], candidate);
                                            bln = true;
                                            break;
                                        }
                                    }
                                }else{ // go to the top
                                    var candidate = $scope.data.candidates[0];
                                    $scope.currentCandidate = candidate;
                                    for (var x=0 ; x<candidate.questions.length ; x++){
                                        if ($scope.questions[candidate.questions[x].key].type=="t"){
                                            $scope.selectQuestion(candidate.questions[x], candidate);
                                            bln = true;
                                            break;
                                        }
                                    }
                                }
                            }

                        }else{
                            if ($scope.data.candidates.length!=$scope.currentCandidate.index+1){

                                var candidate = $scope.data.candidates[$scope.currentCandidate.index+1];
                                $scope.currentCandidate = candidate;
                                var bln = false;
                                for (var x=0 ; x<candidate.questions.length ; x++){
                                    if (candidate.questions[x].key==$scope.currentQuestion.key){

                                        $scope.selectQuestion(candidate.questions[x], candidate);
                                        bln = true;
                                        break;
                                    }
                                }

                            }else{
                                var candidate = $scope.data.candidates[0];
                                $scope.currentCandidate = candidate;
                                var bln = false;
                                var nextQuestion = {};
                                for (var x=$scope.questions[$scope.currentQuestion.key].index+1 ; x<$scope.data.questions.length ; x++){
                                    if ($scope.data.questions[x].type=="t"){
                                        nextQuestion = $scope.data.questions[x];
                                        bln = true;
                                        break;
                                    }
                                }
                                if (!bln){
                                    for (var x=0 ; x<$scope.data.questions.length ; x++){
                                        if ($scope.data.questions[x].type=="t"){
                                            nextQuestion = $scope.data.questions[x];
                                            bln = true;
                                            break;
                                        }
                                    }
                                }

                                bln = false;

                                for (var x=0 ; x<candidate.questions.length ; x++){
                                    if (candidate.questions[x].key==nextQuestion.key){
                                        $scope.selectQuestion(candidate.questions[x], candidate);
                                        bln = true;
                                        break;
                                    }
                                }
                            }

                        }
                        Common.scrollTo("candidates", "candidate_"+$scope.currentCandidate.index);
                    }
                }else{
                    $scope.serverError();
                }
            });


        };
        $scope.unavailableServer = function(){
            Common.toogleDialog("unavailable-server", true);
        };
        $scope.closeDialog = function(name){
            Common.toogleDialog(name, false);
        };

        $scope.serverError = function(){
            Common.toogleDialog("error", true);
        };
        $scope.silverlightError = function(){
            Common.toogleDialog("install-silverlight", true);
        };
        $scope.prev = function(){
            save().then(function(objResponse){
                if (!Common.isError(objResponse)){
                    if (!objResponse.canceled){
                        if ($scope.mode == "candidate"){  // Searching the next discursive question of that candidate
                            var bln = false;
                            for (var x=$scope.currentQuestion.index-1 ; x>0 ; x--){
                                if ($scope.questions[$scope.currentCandidate.questions[x].key].type=="t"){
                                    $scope.selectQuestion($scope.currentCandidate.questions[x], $scope.currentCandidate);
                                    bln = true;
                                    break;
                                }
                            }
                            if (!bln){ // if not found, search the next discursive question of the next candidate
                                if ($scope.currentCandidate.index!=0){ //if it is not at the end of candidate's array
                                    var candidate = $scope.data.candidates[$scope.currentCandidate.index-1];
                                    $scope.currentCandidate = candidate;
                                    for (var x=candidate.questions.length-1 ; x>0 ; x--){
                                        if ($scope.questions[candidate.questions[x].key].type=="t"){
                                            $scope.selectQuestion(candidate.questions[x], candidate);
                                            bln = true;
                                            break;
                                        }
                                    }
                                }else{ // go to the bottom
                                    var candidate = $scope.data.candidates[$scope.data.candidates.length-1];
                                    $scope.currentCandidate = candidate;
                                    for (var x=candidate.questions.length-1 ; x>0 ; x--){
                                        if ($scope.questions[candidate.questions[x].key].type=="t"){
                                            $scope.selectQuestion(candidate.questions[x], candidate);
                                            bln = true;
                                            break;
                                        }
                                    }
                                }
                            }

                        }else{
                            if ($scope.currentCandidate.index!=0){

                                var candidate = $scope.data.candidates[$scope.currentCandidate.index-1];
                                $scope.currentCandidate = candidate;
                                var bln = false;
                                for (var x=candidate.questions.length-1 ; x>0 ; x--){
                                    if (candidate.questions[x].key==$scope.currentQuestion.key){

                                        $scope.selectQuestion(candidate.questions[x], candidate);
                                        bln = true;
                                        break;
                                    }
                                }

                            }else{
                                var candidate = $scope.data.candidates[$scope.data.candidates.length-1];
                                $scope.currentCandidate = candidate;
                                var bln = false;
                                var nextQuestion = {};
                                for (var x=$scope.questions[$scope.currentQuestion.key].index-1 ; x>0 ; x--){
                                    if ($scope.data.questions[x].type=="t"){
                                        nextQuestion = $scope.data.questions[x];
                                        bln = true;
                                        break;
                                    }
                                }
                                if (!bln){
                                    for (var x=$scope.data.questions.length ; x>0 ; x--){
                                        if ($scope.data.questions[x].type=="t"){
                                            nextQuestion = $scope.data.questions[x];
                                            bln = true;
                                            break;
                                        }
                                    }
                                }

                                bln = false;

                                for (var x=candidate.questions.length-1 ; x>0 ; x--){
                                    if (candidate.questions[x].key==nextQuestion.key){
                                        $scope.selectQuestion(candidate.questions[x], candidate);
                                        bln = true;
                                        break;
                                    }
                                }
                            }

                        }
                        Common.scrollTo("candidates", "candidate_"+$scope.currentCandidate.index);
                    }
                }else{
                    $scope.serverError();
                }
            });
        };
        $scope.changeMode = function(mode){
            $scope.mode = mode;
        };
        $scope.loadData = function(){
            loading(true);
            GraderService.get().then(function(data){
                if (!Common.isError(data)){
                    var objQuestions = {};
                    angular.forEach(data.questions, function(question, indexQuestion){
                        var questionValue = 0;
                        if (!Common.isEmpty(question.value)){
                            questionValue = parseFloat(question.value);
                        }
                        $scope.scheduleInfo.score.total += questionValue;
                        $scope.scheduleInfo.questions.total++;
                        if (question.type=="t"){
                            $scope.scheduleInfo.questions.total++;
                            $scope.scheduleInfo.score.discursives += questionValue;
                            $scope.scheduleInfo.questions.discursives++;
                        }else if (question.type=="o"){
                            $scope.scheduleInfo.score.objectives += questionValue;
                            $scope.scheduleInfo.questions.objectives++;
                        }
                        question.index = indexQuestion;
                        objQuestions[question.key] = question;

                    });
                    $scope.questions = objQuestions;
                    var candidatesDone = 0;
                    angular.forEach(data.candidates, function(candidate, indexCandidate){

                        candidate.score = {
                            total:0,
                            objectives:0,
                            discursives:0
                        };
                        candidate.done = 0;
                        candidate.index = indexCandidate;
                        candidate.allDone = false;

                        angular.forEach(candidate.questions, function(question, indexQuestion){
                            var questionScore = 0;
                            if (!Common.isEmpty(question.score)){
                                questionScore = parseFloat(question.score);
                            }
                            if ($scope.questions[question.key].type=="t"){
                                $scope.generalInfo.questions.total++;
                                if (!Common.isEmpty(question.score)){
                                    $scope.generalInfo.questions.done++;
                                    candidate.done++;
                                }
                                candidate.score.discursives += questionScore;
                            }else if ($scope.questions[question.key].type=="o"){
                                candidate.score.objectives += questionScore;
                            }
                            candidate.score.total += questionScore;
                            question.index = indexQuestion;
                            if (candidate.questions.length==indexQuestion+1){
                                if ($scope.scheduleInfo.questions.discursives==candidate.done){
                                    candidatesDone++;
                                    candidate.allDone = true;
                                }
                            }
                        });

                    });
                    $scope.generalInfo.candidates.done = candidatesDone;
                    //console.log(data);
                    $scope.data = data;

                    $timeout(function(){
                        loading(false);
                    },1000);

                }else{
                    loading(false, true);
                    $timeout(function(){
                        $scope.unavailableServer();
                    },3000);
                }



            });
        };

        $scope.loadData();

        $scope.calculateCandidateScore = function(){
            $scope.currentCandidate.score.total = 0;
            $scope.currentCandidate.score.discursives = 0;
            $scope.currentCandidate.done = 0;
            angular.forEach($scope.currentCandidate.questions, function(question, indexQuestion){
                var questionScore = 0;
                if (!Common.isEmpty(question.score)){
                    questionScore = parseFloat(question.score);
                }
                if ($scope.questions[question.key].type=="t"){
                   // $scope.generalInfo.questions.total++;
                    if (!Common.isEmpty(question.score)){
                        //$scope.generalInfo.questions.done++;
                        $scope.currentCandidate.done++;
                    }
                    $scope.currentCandidate.score.discursives += questionScore;
                }

            });
            $scope.currentCandidate.score.total = $scope.currentCandidate.score.objectives + $scope.currentCandidate.score.discursives;
        };

        $scope.loadImage = function (page){
            grader.Content.MainPage.Desenho = $scope.currentPage.stringCorrection;
            grader.Content.MainPage.CarregaImagem("http://192.168.16.58:9000/images/teste.jpeg");
            //grader.Content.MainPage.CarregaImagem($currentPage..url);
        };
        $scope.selectPage = function(index, bln){
            //if (!bln){
                save().then(function(objResponse) {
                    if (!Common.isError(objResponse)) {
                        if (index==$scope.currentCandidate.pages.length){
                            index = 0;
                        }else if (index==-1){
                            index = $scope.currentCandidate.pages.length-1;
                        }
                        $scope.currentPage = $scope.currentCandidate.pages[index];
                        $scope.currentPage.index = index;
                        console.log($scope.currentPage.index);
                        $scope.loadImage();
                    } else {
                        $scope.serverError();
                    }
                });
            //}else{

            //}


        };

        $scope.refreshStringCorrection = function(){
            if (grader && $scope.currentPage){
                $scope.currentPage.stringCorrection = grader.Content.MainPage.Desenho;
            }
        }

        function save(){
            var d = $q.defer();

            $scope.refreshStringCorrection();

            if (Common.isEmpty($scope.currentQuestion.score)){
                $scope.currentQuestion.score = null;
            }
            var blnErased = false;
            if (Common.isEmpty($scope.currentPage)) {
                d.resolve({canceled:true});
                return d.promise
            }else if (Common.isEmpty($scope.currentQuestion.score)) {
                if (!Common.isEmpty($scope.currentQuestion.oldScore)){
                    if (confirm("Você não preencheu o valor da nota, deseja continuar ?")){
                        blnErased = true;
                    }else{
                        d.resolve({canceled:true});
                        return d.promise
                    }
                }else{
                    d.resolve({ok:true});
                    return d.promise
                }
            }else if ($scope.currentQuestion.oldScore == $scope.currentQuestion.score){
                d.resolve({ok:true});
                return d.promise
            }else if (Common.isEmpty($scope.currentQuestion.oldScore) && Common.isEmpty($scope.currentQuestion.score)){
                d.resolve({ok:true});
                return d.promise
            }


            var obj = {
                id:$scope.currentCandidate.id,
                question:{
                    key:$scope.currentQuestion.key,
                    score:$scope.currentQuestion.score,
                    comments:$scope.currentQuestion.comment
                },
                pages:[
                    {
                        "id": $scope.currentPage.id,
                        "stringCorrection":$scope.currentPage.stringCorrection
                    }
                ]
            };
            loadingOverlay(true);
            GraderService.post(obj).then(function(data){
                if (!Common.isError(data)) {
                    if (blnErased){
                        $scope.generalInfo.questions.done--;
                        $scope.currentCandidate.done--;
                        if ($scope.currentCandidate.allDone){
                            $scope.currentCandidate.allDone = false;
                            $scope.generalInfo.candidates.done--;
                        }
                    }else if (Common.isEmpty($scope.currentQuestion.oldScore)) {
                        if (!Common.isEmpty($scope.currentQuestion.score)){
                            $scope.generalInfo.questions.done++;
                            $scope.currentCandidate.done++;
                            if (!$scope.currentCandidate.allDone){
                                if ($scope.currentCandidate.done==$scope.currentCandidate.done){
                                    $scope.currentCandidate.allDone = true;
                                    $scope.generalInfo.candidates.done++;
                                }
                            }
                        }
                    }


                    $scope.calculateCandidateScore();


                    if ($scope.generalInfo.questions.done==$scope.generalInfo.questions.total && (Common.isEmpty($scope.currentQuestion.oldScore))){
                        loadingOverlay(false, true);
                        $timeout(function(){
                            $scope.showFinished(true);
                        });
                    }else{
                        loadingOverlay(false);
                    }

                    d.resolve({ok:true});
                }else{
                    loadingOverlay(false);
                    d.resolve(data);
                }

            });

            return d.promise


        }

        $scope.showComment = function(bln){
            Common.toogleDialog("comment", bln);
            $("#comment_text").focus();
        };
        $scope.showFinished = function(bln){
            Common.toogleDialog("finished", bln);
        };
    }]);

