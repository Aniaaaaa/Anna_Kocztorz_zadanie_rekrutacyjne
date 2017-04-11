/* Anna Kocztorz
 * studentka 3 roku Informatyki na Politechnice Śląskiej na wydziale Automatyki, Elektroniki i Informatyki
 * projekt zrealizowany na potrzeby rekrutacji na staż w firmie XSolve
 * data ukończenia: 11.04.2017r
 */


window.onload = displayTable(1);


/* Function takes two objects (workers) as arguments and sorted them by the dateOfBirth (date is kept as string). 
 * It returns:
 *  -1 if dateOfBirth of first worker(parameter) is higher than for second worker (parameter)
 *  1  if dateOfBirth of first worker(parameter) is lower than for second worker (parameter)
 *  0  if both dateOfBirth are equal */
function sortingByDate(a,b) {  
    asplited1 = a.dateOfBirth.split(" ");
    bsplited1 = b.dateOfBirth.split(" ");
    asplited2 = asplited1[0].split(".");
    bsplited2 = bsplited1[0].split(".");
    if (asplited2[2] > bsplited2[2])
        return 1;
    else if (asplited2[2] < bsplited2[2])
        return -1;
    else {
        if (asplited2[1] > bsplited2[1])
             return 1;
        else if (asplited2[1] < bsplited2[1])
             return -1;
        else {
            if (asplited2[0] > bsplited2[0])
                return 1;
            else if (asplited2[0] < bsplited2[0])
                return -1;
            else
                return 0;
        }
    }
}

/* Function takes two strings as arguments and compares them.
 * It returns:
 *  -1 if the first parameter is lower than the second parameter 
 *  1  if the first parameter is higher than the second parameter 
 *  0  if both parameters are equal */
function sortingByString(a,b) {
    if (a < b)
        return -1;
    else if (a>b)
        return 1;
    else
        return 0;
}

/* Function takes two strings as arguments and checks if the first parameter is part of second string.
 * It returns:
 *  1  if the years in first and second parameters are equal  
 *  0  if the years don't match */

function filterByYear(a,b) {  
    if (b.indexOf(a)=== -1) {
        return 0;
    }
    else {
        return 1;
    }
}

var selectedSortOption= "none";
var selectedArray = [];
var filterArray = [];

/* Function which takes one parameter - number of page to show.
 * It display the data from sluzba.json as table. 
 * Depending on sorting/filtering option it displays rows which match filtering criteria in sorting order.
 * If there is no data fitting the criteria it display information: "Sorry, but nobody fits your criteria".
 */
function displayTable(page) {
    var myArr; 
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            myArr = JSON.parse(this.responseText);
            var tableRows = "<table class='table-responsive'><thead><tr><th class ='id'>Id</th><th class ='firstName'>First Name</th><th class ='lastName'>Last Name</th><th class ='birthday'>Date Of Birth</th><th class ='function'>Function</th><th class ='experience'>Experience</th></tr></thead><tbody>";
            /*Sorting by selected option*/
            switch (selectedSortOption) {
                case "byId":
                    myArr.sort(function(a,b) {return a.id - b.id});
                    break;
                case "byFirstName": 
                    myArr.sort(function(a,b){return sortingByString(a.firstName,b.firstName)});   
                    break;
                case "byLastName":  
                    myArr.sort(function(a,b){return sortingByString(a.lastName,b.lastName)});
                    break;
                case "byBirth":  
                    myArr.sort(function(a,b){return sortingByDate(a,b)});
                    break;
                case "byFunction":  
                    myArr.sort(function(a,b) {return sortingByString(a.function,b.function)});
                    break;
                case "byExperience":  
                    myArr.sort(function(a,b) {return b.experience - a.experience});
                    break;
                default:
                    break;
            }
            selectedArray = [];
            var i = 0;
            /* Filtering data from table*/
            for (var k = 0; k<myArr.length;k++) {
                var correct = 1;
                for (var j=0; j < filterArray.length; j++) {
                    if (filterArray[j].input != undefined && filterArray[j].input != "") {
                        switch(filterArray[j].value) {
                            case "byId":
                                if (parseInt(filterArray[j].input) != myArr[k].id) {
                                    correct = 0;    
                                }
                                break;
                            case "byFirstName":
                                var x = myArr[k].firstName.toLowerCase();
                                if (x.indexOf(filterArray[j].input.toLowerCase()) === -1) {
                                    correct = 0;
                                }
                                break;
                            case "byLastName":
                                var x = myArr[k].lastName.toLowerCase();
                                if (x.indexOf(filterArray[j].input.toLowerCase()) ===-1) {
                                    correct = 0;
                                }
                                break;
                            case "byBirth":    
                                if (filterByYear(filterArray[j].input, myArr[k].dateOfBirth)===0){
                                    correct = 0;
                                }
                                break;
                            case "byFunction":
                                var x = myArr[k].function.toLowerCase();
                                if (x.indexOf(filterArray[j].input.toLowerCase())===-1) {
                                    correct = 0;
                                }
                                break;
                            case "byExperience":
                                if (parseInt(filterArray[j].input) != myArr[k].experience) {
                                    correct = 0;
                                }
                                break;
                            default:
                                break;
                        }
                    }
                }
                if (correct === 1) {
                    selectedArray[i] = myArr[k];
                    i++;
                }
            }
            /*Pagination*/
            for (var j=(page-1)*5; j< page*5; j++) {
                if (j<selectedArray.length) {               
                        tableRows += '<tr><td>' + selectedArray[j].id +'</td><td>' + selectedArray[j].firstName + '</td><td>' + 
                                selectedArray[j].lastName + '</td><td>'+ selectedArray[j].dateOfBirth+'</td><td>'+ selectedArray[j].function + '</td><td>'+ 
                                selectedArray[j].experience +'</td></tr>';  
                }        
            }
            if (selectedArray.length === 0) {
                document.getElementById("table").innerHTML = "<p class='information'>Sorry, but nobody fits your criteria</p>"; 
                document.getElementById("buttons").innerHTML = "";
            }
            else {
                document.getElementById("table").innerHTML = tableRows +"</tbody></table>";
                if (selectedArray.length < 6) {
                    document.getElementById("buttons").innerHTML = "<button class='page' id='page1' onclick='displayTable(1)'>1</button>";
                }
                else if (selectedArray.length < 11) {
                    document.getElementById("buttons").innerHTML = "<button class='page' id='page1' onclick='displayTable(1)'>1</button>"+
                        "<button class='page' id='page2' onclick='displayTable(2)'>2</button>";
                }
                else {
                    document.getElementById("buttons").innerHTML = "<button class='page' id='page1' onclick='displayTable(1)'>1</button>"+
                        "<button class='page' id='page2' onclick='displayTable(2)'>2</button>"+
                        "<button class='page' id='page3' onclick='displayTable(3)'>3</button>";
                }
            }
        }
    };
    xmlhttp.open("GET", "sluzba.json", true);
    xmlhttp.send();         
}




var app = angular.module('Beauty&BeastApp', []);
app.controller('myCtrl', function($scope) {

/* Function which uncheck other checkboxes if noneValue is checked */
    $scope.checkboxesUnchecked=function() {
        if ($scope.checkboxModel.noneValue) {
            $scope.checkboxModel.idValue = false;
            $scope.checkboxModel.firstNameValue = false;
            $scope.checkboxModel.lastNameValue = false;
            $scope.checkboxModel.birthdayValue = false;
            $scope.checkboxModel.functionValue = false;
            $scope.checkboxModel.experienceValue = false;
        }
    }

/*Function which change sorting option and call displayTable function after sorting*/
    $scope.changeSortOption = function () {
        selectedSortOption = $scope.sortOptionsModel.value;
        displayTable(1);
    }   
/*Function which check if checkboxes are checked and call displayTable function*/
    $scope.filtrData = function () {
        filterArray = [];
        var i = 0;
        if ($scope.checkboxModel){
            if ($scope.checkboxModel.idValue){
                filterArray[i] = {value: "byId", input: $scope.filterIdInput};
                i++;
            }
            if ($scope.checkboxModel.firstNameValue){
                filterArray[i] = {value: "byFirstName", input: $scope.filterFirstNameInput};
                i++;
            }
            if ($scope.checkboxModel.lastNameValue){
                filterArray[i] = {value: "byLastName", input: $scope.filterLastNameInput};
                i++;
            }
            if ($scope.checkboxModel.birthdayValue){
                filterArray[i] = {value: "byBirth", input: $scope.filterBirthdayInput};
                i++;
            }
            if ($scope.checkboxModel.functionValue){
                filterArray[i] = {value: "byFunction", input: $scope.filterFunctionInput};
                i++;
            }
            if ($scope.checkboxModel.experienceValue){
                filterArray[i] = {value: "byExperience", input: $scope.filterExperienceInput};
                i++;
            }
            if (i > 0) {
                $scope.checkboxModel.noneValue = false;
            }
            displayTable(1);
        }  
    }

/* Function which return table of options for filtering by year of birth*/
    $scope.Range = function(start, end) {
        var result = [];
        for (var i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    };

/*Table which contains options for sorting*/
    $scope.options =
        [
             { value: "none", description: "None" },
             { value: "byId", description: "By ID" },
             { value: "byFirstName", description: "By First Name" },
             { value: "byLastName", description: "By Last Name" },
             { value: "byBirth", description: "By Date of Birth" },
             { value: "byFunction", description: "By Function" },
             { value: "byExperience", description: "By Experience" }
        ];
});