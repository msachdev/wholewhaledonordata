$(document).ready(function() {
    $.get("/", function(response){
        if(response.status == "success"){
            $.get("/getData", function(response){
                console.log("here")
                var obj = JSON.stringify(response);
                var table = $("<table />");
                table[0].border = "1";
                var columns = Object.keys(obj[0]);
                var columnCount = columns.length;
                var row = $(table[0].insertRow(-1));
                for (var i = 0; i < columnCount; i++) {
                    var headerCell = $("<th />");
                    headerCell.html([columns[i]]);
                    row.append(headerCell);
                }
            
                for (var i = 0; i < obj.length; i++) {
                    row = $(table[0].insertRow(-1));
                    for (var j = 0; j < columnCount; j++) {
                        var cell = $("<td />");
                        cell.html(obj[i][columns[j]]);
                        row.append(cell);
                    }
                }
                
                var dTable = $("#donorTable");
                dTable.html("");
                dTable.append(table);
            
            });
        }
    });
});

/* $("#exportButton").click(function() {
    $.post("/export", function(response){

    });
})

$("#startButton").click(function() {
    $.post("/populate", function(response){

    });
}) */

/* $("#donorButton").click(function() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("donorInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("Donors");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none"; }
            } 
        }   
    } 
) */