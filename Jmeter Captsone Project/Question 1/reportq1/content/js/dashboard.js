/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 62.537048014226436, "KoPercent": 37.462951985773564};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.27435854435686735, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6290322580645161, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-20"], "isController": false}, {"data": [0.0, 500, 1500, "https://sampleapp.tricentis.com/101/app.php"], "isController": false}, {"data": [0.6209677419354839, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-21"], "isController": false}, {"data": [0.6491935483870968, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-24"], "isController": false}, {"data": [0.6209677419354839, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-25"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.5524193548387096, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-22"], "isController": false}, {"data": [0.6330645161290323, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-23"], "isController": false}, {"data": [0.39919354838709675, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-2"], "isController": false}, {"data": [0.4475806451612903, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-3"], "isController": false}, {"data": [0.07258064516129033, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-0"], "isController": false}, {"data": [0.6129032258064516, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-1"], "isController": false}, {"data": [0.4717741935483871, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-10"], "isController": false}, {"data": [0.7661290322580645, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-13"], "isController": false}, {"data": [0.0, 500, 1500, "https://sampleapp.tricentis.com/101/tcpdf/pdfs/quote.php"], "isController": false}, {"data": [0.782258064516129, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-14"], "isController": false}, {"data": [0.3387096774193548, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-11"], "isController": false}, {"data": [0.14919354838709678, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-12"], "isController": false}, {"data": [0.31451612903225806, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-6"], "isController": false}, {"data": [0.7338709677419355, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-17"], "isController": false}, {"data": [0.3790322580645161, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-7"], "isController": false}, {"data": [0.7056451612903226, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-18"], "isController": false}, {"data": [0.41935483870967744, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-4"], "isController": false}, {"data": [0.4475806451612903, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-15"], "isController": false}, {"data": [0.34274193548387094, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-5"], "isController": false}, {"data": [0.7016129032258065, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-16"], "isController": false}, {"data": [0.3387096774193548, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-8"], "isController": false}, {"data": [0.6330645161290323, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-19"], "isController": false}, {"data": [0.4314516129032258, 500, 1500, "https://sampleapp.tricentis.com/101/app.php-9"], "isController": false}, {"data": [0.0, 500, 1500, "Reaponse time test"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5061, 1896, 37.462951985773564, 13345.933609958507, 210, 4394499, 1461.0, 4677.0, 9087.499999999998, 73557.12000000005, 1.098246516306064, 36.81121992625191, 0.7514135129512147], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://sampleapp.tricentis.com/101/app.php-20", 124, 10, 8.064516129032258, 818.9435483870969, 212, 4275, 428.5, 2037.5, 3111.5, 4086.25, 0.026938794840873193, 0.06852742635444024, 0.01415339025819314], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php", 954, 854, 89.51781970649895, 57371.955974842764, 2002, 4394499, 4667.0, 9082.0, 22560.25, 4353150.55, 0.2070197938265135, 18.41736960017946, 0.3646701764686416], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-21", 124, 9, 7.258064516129032, 803.8064516129031, 210, 4181, 456.5, 1936.5, 2514.75, 4020.75, 0.02693964931963264, 0.12704700090280413, 0.01396968143430169], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-24", 124, 10, 8.064516129032258, 757.0967741935476, 211, 3672, 373.0, 2081.0, 2584.75, 3625.5, 0.02694180331484126, 0.014401100007756632, 0.013997108753413624], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-25", 124, 11, 8.870967741935484, 836.2177419354839, 211, 7262, 406.0, 1982.5, 2628.0, 6499.0, 0.026938800693283072, 0.040533797766947224, 0.014091443596017056], "isController": false}, {"data": ["Test", 892, 809, 90.69506726457399, 14415.610986547086, 4644, 191649, 9322.0, 13558.600000000002, 34785.54999999995, 172571.2799999993, 2.778617108431483, 244.47175027178736, 4.629943522348865], "isController": true}, {"data": ["https://sampleapp.tricentis.com/101/app.php-22", 124, 10, 8.064516129032258, 1011.3548387096765, 211, 7776, 509.5, 2712.0, 3070.75, 6898.25, 0.02693883580779575, 0.4183763967732054, 0.014127104324986638], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-23", 124, 9, 7.258064516129032, 869.8870967741935, 210, 4211, 416.0, 2112.5, 3205.0, 4071.25, 0.026939263041699156, 0.08422593177805436, 0.013995789002132764], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-2", 124, 10, 8.064516129032258, 1283.7338709677415, 220, 6890, 1175.5, 1850.5, 2439.25, 6146.5, 0.026933043151513573, 0.6709266758760298, 0.014323239075827375], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-3", 124, 9, 7.258064516129032, 1054.4919354838705, 228, 4064, 957.5, 1695.5, 1843.25, 3694.25, 0.02693322449993799, 0.29869437223486467, 0.01409785969918629], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-0", 124, 0, 0.0, 23416.717741935492, 1328, 110358, 9875.5, 77634.0, 86719.75, 110037.25, 0.3835921549217348, 24.345138805644066, 0.1929198826022397], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-1", 124, 9, 7.258064516129032, 775.1290322580646, 218, 4655, 737.0, 1409.5, 1752.25, 4100.25, 0.026933236199920198, 0.035421142416654124, 0.013782241961677915], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-10", 124, 10, 8.064516129032258, 1017.6935483870964, 211, 3648, 965.0, 1606.0, 2012.0, 3415.0, 0.026934312641771686, 0.13274295646003198, 0.013756489757467375], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-13", 124, 9, 7.258064516129032, 536.491935483871, 210, 2719, 347.5, 1200.0, 1291.5, 2520.5, 0.02693065075094165, 0.12261425009594044, 0.014043913575198087], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/tcpdf/pdfs/quote.php", 883, 800, 90.60022650056625, 7518.910532276333, 2005, 109522, 4666.0, 6561.4000000000015, 16796.79999999992, 93410.95999999998, 2.8099184073522485, 8.062660156200277, 0.32369353114140603], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-14", 124, 9, 7.258064516129032, 502.5483870967744, 212, 1676, 347.0, 1210.5, 1382.75, 1660.25, 0.02693578118761597, 0.035912395010189974, 0.013783544279600358], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-11", 124, 11, 8.870967741935484, 1592.2741935483868, 212, 15240, 1397.5, 2036.5, 2443.75, 14425.5, 0.02693469877775116, 2.346494294866963, 0.013958841458778942], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-12", 124, 10, 8.064516129032258, 2614.0483870967746, 212, 32327, 1798.5, 2600.0, 15197.0, 30628.0, 0.026932464022897805, 5.522759075778831, 0.014150064105780293], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-6", 124, 9, 7.258064516129032, 1439.1370967741937, 713, 10955, 1220.5, 1884.5, 2028.5, 9724.5, 0.026933054851338224, 0.5654034637456103, 0.014045167275990833], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-17", 124, 10, 8.064516129032258, 526.3145161290327, 210, 1954, 341.5, 1246.5, 1573.75, 1927.25, 0.026938314951916193, 0.0220176427225599, 0.014258365921815015], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-7", 124, 10, 8.064516129032258, 1501.854838709677, 211, 12864, 1206.0, 1795.5, 2904.0, 12532.75, 0.02692943424081907, 0.8070279091009976, 0.013832892979170733], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-18", 124, 9, 7.258064516129032, 615.8225806451615, 211, 4680, 350.5, 1348.0, 1921.0, 4203.0, 0.026938695350294282, 0.013689777555352502, 0.014284874585165816], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-4", 124, 9, 7.258064516129032, 1082.233870967742, 278, 3019, 968.0, 1613.5, 1722.5, 3018.5, 0.026933236199920198, 0.08864660990378537, 0.013966355881013307], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-15", 124, 10, 8.064516129032258, 962.2499999999999, 211, 11249, 632.0, 1738.5, 2015.25, 9634.25, 0.026937091897626886, 2.206078582883042, 0.014231412809195454], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-5", 124, 8, 6.451612903225806, 1474.1209677419351, 520, 10733, 1207.0, 1914.5, 2988.75, 9480.0, 0.026933236199920198, 0.47630440622314146, 0.014176771788825183], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-16", 124, 10, 8.064516129032258, 628.8629032258066, 210, 4502, 354.5, 1343.0, 1889.0, 4043.5, 0.02693777656026752, 0.056577477281569935, 0.014310693797642118], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-8", 124, 11, 8.870967741935484, 1761.8387096774193, 212, 16579, 1380.5, 2034.0, 4094.25, 16526.25, 0.026933493602100636, 1.1055633201275952, 0.013853856379426025], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-19", 124, 10, 8.064516129032258, 730.9919354838709, 210, 5076, 393.5, 1710.0, 2347.0, 4660.0, 0.026938818250527966, 0.2916179690499048, 0.014284939755895202], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-9", 124, 10, 8.064516129032258, 1158.1209677419356, 212, 2398, 1196.5, 1540.0, 1967.25, 2373.0, 0.026933803661259633, 0.6000937829884793, 0.014019255226026742], "isController": false}, {"data": ["Reaponse time test", 10, 10, 100.0, 19697.3, 11801, 38434, 15710.0, 37629.100000000006, 38434.0, 38434.0, 0.2581377939544129, 184.4950391159426, 3.785096656470224], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 238, 12.552742616033756, 4.702627939142462], "isController": false}, {"data": ["The operation lasted too long: It took 14,532 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 6,762 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 9,083 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 30,363 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 6,949 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Read timed out", 9, 0.47468354430379744, 0.17783046828689983], "isController": false}, {"data": ["The operation lasted too long: It took 7,991 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 6,026 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 7,355 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1610, 84.915611814346, 31.811894882434302], "isController": false}, {"data": ["The operation lasted too long: It took 8,626 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 10,843 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 19,542 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Connect timed out", 5, 0.26371308016877637, 0.09879470460383323], "isController": false}, {"data": ["The operation lasted too long: It took 4,972 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 7,211 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 6,649 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 9,833 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["Assertion failed", 14, 0.7383966244725738, 0.2766251728907331], "isController": false}, {"data": ["The operation lasted too long: It took 12,425 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 7,413 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 5,498 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 8,071 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}, {"data": ["The operation lasted too long: It took 6,829 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, 0.052742616033755275, 0.019758940920766646], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5061, 1896, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1610, "502/Bad Gateway", 238, "Assertion failed", 14, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Read timed out", 9, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Connect timed out", 5], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://sampleapp.tricentis.com/101/app.php-20", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php", 954, 854, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 825, "Assertion failed", 14, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Read timed out", 4, "The operation lasted too long: It took 19,542 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 14,532 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-21", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-24", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-25", 124, 11, "502/Bad Gateway", 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Connect timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-22", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-23", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-2", 124, 10, "502/Bad Gateway", 9, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-3", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-1", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-10", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-13", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/tcpdf/pdfs/quote.php", 883, 800, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 785, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Read timed out", 4, "The operation lasted too long: It took 8,626 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "The operation lasted too long: It took 10,843 milliseconds, but should not have lasted longer than 3,000 milliseconds.", 1, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Connect timed out", 1], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-14", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-11", 124, 11, "502/Bad Gateway", 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Connect timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-12", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-6", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-17", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-7", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-18", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-4", 124, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-15", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-5", 124, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-16", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-8", 124, 11, "502/Bad Gateway", 10, "Non HTTP response code: org.apache.http.conn.ConnectTimeoutException/Non HTTP response message: Connect to sampleapp.tricentis.com:443 [sampleapp.tricentis.com/172.214.27.34] failed: Connect timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-19", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://sampleapp.tricentis.com/101/app.php-9", 124, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
