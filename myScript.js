
// function eventlistener(){
//     var subjbuttons = document.getElementsByClassName("subjbuttons");
//     for(var i=0; i < subjbuttons.length; i++) {(
//         function() {
//         var subjbuttons_id = subjbuttons[i].id
//         subjbuttons[i].addEventListener("click", function(){showdb(subjbuttons_id)});
//         }())} 
//     var sort_select = document.getElementsByClassName("sort_select");
//     console.log(sort_select[0])
//     sort_select[0].addEventListener("change", sort_data);
// }  

// window.onload = eventlistener

//currently sort_by which column
 
var sort_by = 'none';
var sort_array;
var filter_array = [];
var selectable_array;
var response_array
var subAns
var markingArr

//used when backend used
function getdb(subj) {
    response_array = []
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText)
            // response_array auto global scope
            var response_json = JSON.parse(this.responseText);
            for (x in response_json) {
                var add = [['id',response_json[x]['id']],['year',response_json[x]['year']],['paper',response_json[x]['paper']],
                ['question_num',response_json[x]['question_num']],['key',response_json[x]['key']],['%correct',response_json[x]['%correct']]];
                response_array.push(add);
            };
            }
        }
    xmlhttp.open("GET","request_data.php?subject=" + subj,false);
    xmlhttp.send();
}

//used when only frontend used
function get_array(subj,isIndexPage) {
    response_array = []
    var response_json = data[subj]
    for (x in response_json) {
        var add = [['id',response_json[x]['id']],['year',response_json[x]['year']],['paper',response_json[x]['paper']],
        ['question_num',response_json[x]['question_num']],['key',response_json[x]['key']],['%correct',response_json[x]['%correct']]];
        response_array.push(add);
    }
    if (isIndexPage == true) {
        sort_data();
    }
}

function sort_data() {
    column = $("#sort_select").val()
    sort_by = column;
    sort_array = response_array.slice();
    if (column == 3 || column == 1) {
        sort_array.sort(function(a,b) {
            return a[column][1] - b[column][1];
        });
    }
    else if (column == 4 || column == 5 || column == 2) {
        sort_array.sort(function(a,b) {
            return ('' + a[column][1]).localeCompare(b[column][1]);
        });
    }
    else {
        sort_array.sort(function(a,b) {
            return b[column][1] - a[column][1];
        });
    }
    selected(sort_array, true);
}

function reverse_sort() {
    if (filter_array.length > 0) {
        filter_array.reverse();
    }
    else {
        filter_array = response_array.slice().reverse()
    }
    display_table(filter_array);
}

//column1 == year, 2 == paper, 3 == qnum, 4 == key, 5 == %correct
function selectable(columnMax) {
    for (var column=1; column<columnMax+1; column++) {
        var array_not_filter = [];
        for (x in response_array) {
            array_not_filter.push(response_array[x][column][1]);
        }
        var selectable_array = array_not_filter.filter(function(value,pos) {return array_not_filter.indexOf(value) == pos});
        var display = "<option value='none'>--</option>"
        for (x in selectable_array) {
            display += "<option value='" + selectable_array[x] + "'>" + selectable_array[x] + "</option>"
        }
        var targetId = "select_" + response_array[0][column][0];
        document.getElementById(targetId).innerHTML = display;
    }
};

function selected(array,isIndexPage) {
    if (array == sort_array || sort_by =="none") { // if the function is called by sort_data function, i.e. array already sorted OR sorting not needed
        selected_array = []
        selected_array.push(document.getElementById('select_year').value);
        selected_array.push(document.getElementById('select_paper').value);
        if (isIndexPage == true) {
            selected_array.push(document.getElementById('select_question_num').value);
        }
        filter_array = array.slice();
        for (x in selected_array) {
            if (selected_array[x] == 'none') {continue;}
            filter_array = filter_array.filter(function(row) {
                return row[parseInt(x)+1][1] == selected_array[x];
            })
        }
        if (isIndexPage == true) {
            display_table(filter_array);
        }
    }
    else { // if the array is not sorted AND sorting needed
            sort_data(sort_by);
    }
};

function display_table(array) {
    var display = "<table><tr><th>year</th><th>paper</th><th>Question number</th><th>Key</th><th>%Correct</th></tr>";
    for (x in array) {
                display += "<tr>"
                + "<td class='year'>" + array[x][1][1] + "</td>" 
                + "<td class='paper'>" + array[x][2][1] + "</td>"
                + "<td class='question_num'>" + array[x][3][1] + "</td>"
                + "<td class='key'>" + array[x][4][1] + "</td>"
                + "<td class='%correct'>" + array[x][5][1] + "</td>"
                + "</tr>" ;
                };
    display += "</table>";
    document.getElementById("demo").innerHTML = display;
};

function subjbuttons_events(subjId) {
    get_array(subjId,true);
    // display_table(response_array);
    selectable(3);
};

//also show the submit button
function showQuestions(numQuestion){
    document.getElementById("choices").style.height = "650px";
    document.getElementById("splitScreenAdvice").style.display = "none";
    for(var i=0; i<numQuestion; i++) {
        var qName = "Q" + String(i+1);
        var qLi = document.createElement("LI");;
        for(var x=0; x<4; x++) {
            var qLabel = document.createElement("LABEL");
            var ansPairs = {0:"A", 1:"B", 2:"C", 3:"D"};
            var qInput = document.createElement("INPUT");
            qInput.setAttribute("type", "radio");
            qInput.setAttribute("name", qName);
            qInput.setAttribute("value", ansPairs[x]);
            qLabel.appendChild(qInput)
            qLi.appendChild(qLabel);
            }
        var target = document.getElementById("choices");
        target.appendChild(qLi);
    }
    if (numQuestion>40) {
        choices.style.width = "450px"
    }
    showSubBtn();
}

function showSubBtn () {
    var subBtn = document.createElement("BUTTON")
    subBtn.id= "subAnsBtn"
    subBtn.innerHTML = "submit"
    subBtn.setAttribute("type","button")
    var target = document.getElementById("choices");
    target.appendChild(subBtn)
    //submit button events
    document.getElementById("subAnsBtn").addEventListener("click", function(){
        subAnsEvents()
    })
}

function subAnsEvents () {
    document.getElementById("choices").style.display = "none";
    document.getElementById("clockContainer").style.display = "none";
    submitAns(filter_array.length);
    marking(filter_array.length);
    showResult();
    sepLevelResult();
    markingTable(filter_array);
}


function submitAns(numQuestion){
    subAns = [];
    for (var i=0; i<numQuestion; i++) {
        var qAns = $("input[name=Q"+String(i+1)+"]:checked").val()
        if (typeof qAns == "undefined") {
            qAns = "/";
        }
        subAns.push(qAns);
    }
}

function marking(numQuestion) {
    markingArr = [];
    for (var i=0; i<numQuestion; i++) {
        var isCorrect = subAns[i] == filter_array[i][4][1];
        markingArr.push(isCorrect);
    }
}

function showResult() {
    var numCorrect = 0;
    var numTotal = filter_array.length;
    for (var i=0; i<numTotal; i++){
        if (markingArr[i] == true) {
            numCorrect ++
        }
    }
    var percCorrect = Math.round(numCorrect/numTotal * 100 * 100) / 100
    var display = "Score: " + numCorrect + "/" + numTotal + " (" + percCorrect + "%)";
    document.getElementById("mark").innerHTML = display;
}

// challenging = <40%, average difficulty = 40-70%, Easy = > 70%
function sepLevelResult () {
    var chaTotal=0, chaCorrect=0, avgTotal=0, avgCorrect=0, easyTotal=0, easyCorrect=0;
    for (var i=0; i<filter_array.length; i++) {
        var studentsCorrectPerc = filter_array[i][5][1];
        if (studentsCorrectPerc < 40) {
            chaTotal ++
            if (markingArr[i] == true) {
                chaCorrect ++
            }
        }
        else if (studentsCorrectPerc > 70) {
            easyTotal ++
            if (markingArr[i] == true) {
                easyCorrect ++
            }
        } 
        else {
            avgTotal ++
            if (markingArr[i] == true) {
                avgCorrect ++
            }
        }
    }
    var display = "Easy Questions: "+easyCorrect+"/"+easyTotal+"<br>Average Questions: "+avgCorrect+"/"+avgTotal+"<br>Challenging Questions: "+chaCorrect+"/"+chaTotal;
    document.getElementById("levelMark").innerHTML = display;
}

function getSelText(sel) {
    return sel.options[sel.selectedIndex].text;
}

function showTestInfo() {
    var subject = getSelText(document.getElementById("select_subject"));
    var year = getSelText(document.getElementById("select_year"));
    var paper = getSelText(document.getElementById("select_paper"));
    var display = "Subject: " + subject + "<br>Year: " + year +" <br>Paper: " + paper;
    document.getElementById("testSelect").innerHTML = display;
}

function markingTable(array) {
    var display = "<table><tr><th>year</th><th>paper</th><th>Question number</th><th>Your ans</th><th>Key</th><th>%Correct</th></tr>";
    for (x in array) {
                display += "<tr>"
                + "<td class='year'>" + array[x][1][1] + "</td>" 
                + "<td class='paper'>" + array[x][2][1] + "</td>"
                + "<td class='question_num'>" + array[x][3][1] + "</td>"
                + "<td class='yourAns'>" + subAns[x] + "</td>"
                + "<td class='key'>" + array[x][4][1] + "</td>"
                + "<td class='%correct'>" + array[x][5][1] + "</td>"
                + "</tr>" ;
                };
    display += "</table>";
    document.getElementById("markingTable").innerHTML = display;
    // red/green mark
    for (var i=0; i<filter_array.length; i++) {
        var colorAns = document.getElementsByClassName("yourAns")[i];
        if (colorAns.innerHTML == filter_array[i][4][1]) {
            colorAns.style.color = "#009900";
        }
        else {
            colorAns.style.color = "#ff0000";
        }
    }
}
//add zero to the front
function adjustedTime(time) {
    if (time<10) {
        time = "0" + time
    }
    return time;
}
function setTimer() {
    if (document.getElementById("selectTime").value != "off") {
        // var selectedTime = parseInt(document.getElementById("selectTime").value)
        var selectedTime = 1
        var second = 0;
        if (selectedTime<60) {
            var minute = selectedTime
            var hour = 0
        }
        else {
            var minute = selectedTime - 60
            var hour = 1
        }
        var display = adjustedTime(hour) + ":" + adjustedTime(minute) + ":" + adjustedTime(second);
        document.getElementById("clock").innerHTML = display; 
        document.getElementById("clockContainer").style.visibility = "visible";
        var t = setInterval(countdown,1000)
        document.getElementById("pauseBtn").addEventListener("click",pauseTimerEvents)
        function countdown() {
            second -= 1
            if (second<0) {
                second = 59
                minute -= 1
                if (minute<0) {
                    hour -= 1
                    minute = 59
                    if (hour<0) {
                        hour = 0
                        minute = 0
                        second = 0
                        clearInterval(t)
                        //auto-submission
                        var autoSubSwitchChecked = document.getElementById("autoSubSwitch").checked
                        if (autoSubSwitchChecked == true) {
                            subAnsEvents()
                        }
                    }
                }    
            }
            var display = adjustedTime(hour) + ":" + adjustedTime(minute) + ":" + adjustedTime(second);
            document.getElementById("clock").innerHTML = display; 
        }
        function pauseTimerEvents(evt) {
            var continueBtn = document.getElementById("continueBtn");
            clearInterval(t);
            continueBtn.style.opacity = "30%";
            evt.target.style.opacity = "100%";
            evt.target.removeEventListener("click",pauseTimerEvents);
            continueBtn.addEventListener("click", continueTimerEvents);
        }
        
        function continueTimerEvents(evt) {
            var pauseBtn = document.getElementById("pauseBtn");
            t = setInterval(countdown,1000);
            pauseBtn.style.opacity = "30%";
            evt.target.style.opacity = "100%";
            evt.target.removeEventListener("click", continueTimerEvents);
            pauseBtn.addEventListener("click", pauseTimerEvents);
        }
    }
}

// refer the auto sub instruction from the start page to the testing page
function checkAutoSub() {
    var autoSubBox = document.getElementById("autoSubBox")
    if (autoSubBox.checked == true) {
        document.getElementById("autoSubSwitch").checked = true;
    }
}