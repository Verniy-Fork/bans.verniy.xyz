var global_JSON_Data = ""
var archive_URL_Text = "[Archive Link]"

var table = document.getElementById("bansTable");
var count = document.getElementById("count");
var counter = 0;
var pg1_counter;

var max_counter;
var minus_counter = 0;
var current_page;
var max_page;

var pg1_set = false;
var init = false;	
var table_built = false;

var page_load_amount = 1000;

window.onload = loadFunction;

//sets global data in table and count if not set already. First to be called.
function loadFunction(){
	//set a refresh message
	if(init)count.innerHTML = "...Refreshing...";
	else window.location.hash = '#' + 1;
	//load ledger data
	var xhttp_ledger = new XMLHttpRequest();
	xhttp_ledger.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var all_data = this.responseText.split("\n");
			//read the total entries in file
			max_counter = all_data[0];
			//set the first file which is also the highest numbered.
			if(!init) {current_page = max_page = all_data[1]}
			else {current_page = current_page}
			//load the log data
			var xhttp_log = new XMLHttpRequest();
			xhttp_log.onreadystatechange = function(){		
				table = document.getElementById("bansTable");
				count = document.getElementById("count");
				if (this.readyState == 4 && this.status == 200) {
					while(table.hasChildNodes()) table.removeChild(table.lastChild);

					global_JSON_Data = this.responseText;
					global_JSON_Data = global_JSON_Data.split("\n");
					constructTable();
					buildPages();
					
					init = true;
				}
				else if(this.readyState == 4 && this.status != 200){				
					table.innerHTML = "<tr><td>Page Load Error. Try Changing Pages</td></tr>";
				}
			}
			xhttp_log.open("GET", "Logs/4Chan_Bans_Log-Reverse_Chrono-" + current_page + ".txt", true);
			xhttp_log.send();
		}
		else if(this.readyState == 4 && this.status != 200){
			table.innerHTML = "<tr><td>Ledger Load Error . Try Refreshing</td></tr>";
		} 			
	  };
	xhttp_ledger.open("GET", "4Chan_Bans_Log-Ledger.txt", true);
	xhttp_ledger.send();
}

function refreshFunction(){
	table_built = false;
	loadFunction();
}
	
function addArchiveToJSON(index){
	var A = "";
	switch(global_JSON_Data[index]["board"]){
		case "a": case "cm": case "co":case "ic":case "sci":case "tg":case "v":case "vg":case "vip":case "y": 
			A = "https://boards.fireden.net/" + global_JSON_Data[index]["board"] + "/search/";
			break;
		case "adv": case "f": case "hr":case "o":case "pol":case "s4s":case "sp":case "tg":case "trv":case "tv": case "x":
			A = "https://archive.4plebs.org/" + global_JSON_Data[index]["board"] + "/search/";
			break;
		case "aco": case "an": case "c":case "d":case "fit":case "gif":case "his":case "int":case "k":case "m": case "mlp": case "qa":case "r9k":case "trash":case "vr":case "wsg":
			A = "https://desuarchive.org/" + global_JSON_Data[index]["board"] + "/search/";
			break;
		case "mu": case "cgl": case "g":
			A = "https://rbt.asia/" + global_JSON_Data[index]["board"] + "/search/";
			break;
		case "bant": case "vp": case "c":case "con":case "e":case "n":case "news":case "out":case "p":case "toy":case "vip":case "vp":case "w":case "wg":case "wsr":
			A = "https://archive.nyafuu.org/"  + global_JSON_Data[index]["board"] + "/search/";
			break
		default: 
			A = "https://archived.moe/" + global_JSON_Data[index]["board"] + "/search/";
		
	}
	var B = "";
	var comment = global_JSON_Data[index]["com"] + "";
	if(comment !== ""){
		var Bi = comment.replace(/<wbr>/g, "");
		Bi = Bi.replace(/(<span class=.*\">|<\/span>|<div>|<\/div>|<table><\/table>|<a>|<\/a>|<p>|<\/p>|<s>|<\/s>|<br>|<\/br>|&#60;|&gt|&lt;|&#62;|^#|[?><\/.,'";:\]\[}{=\-+_)(*^%$@!~`])/g, " ");
		var B = Bi.substr(0,Bi.indexOf(" ", 50));
		if (B === "") B = Bi;
		B = "text/" +  B + "/";
	}
	else B = "";
	var C = (function(){
		var S = global_JSON_Data[index]["now"].split("/");
		return "end/20" + S[2].substr(0,2) + "-" + S[0] + "-" + (parseInt(S[1])+1) + "/";		
	})();
	var D 
	if(global_JSON_Data[index]["filename"] !== undefined)
		D  =  "filename/" + global_JSON_Data[index]["filename"];
	else D = "";
	var URL  = A + B + C + D;
	if(B !== ""){
		global_JSON_Data[index]["com"] =  global_JSON_Data[index]["com"] +  "</br></br><details><summary>" + archive_URL_Text + "</summary><a href = \"" + URL  + "\">" + URL + "</a></details>";
}
	else
		global_JSON_Data[index]["com"] =  global_JSON_Data[index]["com"] +  "<details><summary>" + archive_URL_Text + "</summary><a href = \"" + URL  + "\">" + URL + "</a></details>";
};


function buildFullTable(){	
	var len = global_JSON_Data.length;
	counter = 0;//current_page == max_page ? counter = 0 : counter = 0;	
	
	//go through all retrived JSON
	for(var i = len -1 ; i >= 0 ; i--){

		var tr = document.createElement("TR");
		table.appendChild(tr);
		var lineLen;

		//first run clean up JSON data
		if(!table_built) {
			if(global_JSON_Data[i].trim() == "") continue;		
			global_JSON_Data[i]  = JSON.parse(global_JSON_Data[i]);
			lineLen = global_JSON_Data[i].length;

			addArchiveToJSON(i);
		}
		else if(global_JSON_Data[i] === "") continue;

		counter++;
		
		//build table with data
		var line = global_JSON_Data[i];
		var td =  document.createElement("TD");
		var tdBoard = document.createTextNode("/" + line["board"] + "/");
		td.appendChild(tdBoard);
		tr.appendChild(td);
		
		var td =  document.createElement("TD");
		var tdName = document.createTextNode(line["name"]);
		td.setAttribute("style","max-width:150px");
		td.appendChild(tdName);
		tr.appendChild(td);
		
		if(line["trip"] === undefined || line["trip"] === null) line["trip"] = "";
		var td =  document.createElement("TD");
		var tdTrip = document.createTextNode(line["trip"]);
		td.setAttribute("style","max-width:100px");
		td.appendChild(tdTrip);
		tr.appendChild(td);
		
		var td =  document.createElement("TD");
		td.setAttribute("style","max-width:800px");
		td.innerHTML = (line["com"]);
		tr.appendChild(td);
		
		var td =  document.createElement("TD");
		td.innerHTML = (line["action"]);
		tr.appendChild(td);	
		
		var td =  document.createElement("TD");
		td.innerHTML = (line["length"]);
		tr.appendChild(td);	
		
		var td =  document.createElement("TD");
		td.innerHTML = (line["reason"]);
		tr.appendChild(td);	
		
		var td =  document.createElement("TD");
		td.innerHTML = (line["now"]);
		tr.appendChild(td);				
	}	
	if(!pg1_set) pg1_counter = counter;
	pg1_set = true;	
	table_built = true;
}
	
	//make alterations to the table without effecting the data.
function constructTable(){
	//filter data down to certain boards
	var boardRefine = document.getElementById("refinement").value.trim();
	
	minus_counter = 0;
	
	//rebuild	
	while(table.hasChildNodes()) table.removeChild(table.lastChild);
	buildFullTable();
	//and refine 
	if(boardRefine !== ""){
		//call global table
		var tableChilds = table.childNodes;
		for(var i = tableChilds.length - 1 ; i >=  0 ; i--){
			var fchild = tableChilds[i].firstChild;
			//check for empty
			if(fchild !== null)
				var curChildBoard = fchild.textContent;
			else continue;
			//not empty then check if it's in refine
			if(curChildBoard !== boardRefine && curChildBoard !== "/" + boardRefine + "/"){
				table.removeChild(tableChilds[i]);
				minus_counter++;
			}
		}
	}
	//change the counter
	buildEntryCounter(boardRefine);
}

function buildEntryCounter(boardRefine){
	if(boardRefine !== ""){
		var rhs = Math.floor((counter - minus_counter) / 1000);
		var lhs = (counter - minus_counter) % 1000 + "";
		while(lhs.length < 3) lhs = "0" + lhs;
		if(rhs == 0) count.innerHTML = "Displaying <strong>"  + lhs +  "</strong> results";
		else count.innerHTML = "Displaying <strong>"  + rhs + "," +  lhs + "</strong> results";
	}
	else{
		if(current_page - max_page != 0) counter += page_load_amount * (max_page - current_page - 1) + pg1_counter;
		console.log(page_load_amount  + " " + max_page + " " + (current_page) + " " + pg1_counter + "==" + counter)
		//current
		var rhs = Math.floor(counter / 1000) + "";
		var lhs = counter % 1000 + "";
		while(lhs.length < 3) lhs = "0" + lhs;
		var current;
		if(rhs == 0) current = lhs;
		else current = rhs + "," + lhs;
		//max
		var rhs_max =  Math.floor(max_counter / 1000)+ "";
		var lhs_max = max_counter % 1000 + "";
		while(lhs_max.length < 3) lhs_max = "0" + lhs_max;
		var max;
		if(rhs_max == 0) max = lhs_max;
		else max = rhs_max + "," + lhs_max;
		//min(maybe for use later?)
		counter -= page_load_amount * (max_page - current_page - 1) + pg1_counter;
		var rhs_min = Math.floor(counter / 1000);
		var lhs_min = counter % 1000 + "";
		while(lhs_min.length < 3) lhs_min  = "0" + lhs_min;
		var min;
		if(rhs_min == 0) min = lhs_min;
		else min = rhs_min + "," + lhs_min;

		count.innerHTML = "Displaying <strong>" + current +  "</strong> of <em>" + max +  "</em> results";
	} 
}

function buildPages(){
	var page_tables = document.getElementsByClassName("page_table");
	while(page_tables[0].hasChildNodes()){
		page_tables[0].removeChild(page_tables[0].firstChild);
		page_tables[1].removeChild(page_tables[1].firstChild);
	}
	var main_row = document.createElement("TR");
	var page_limit = parseInt(max_page) + 1;
	for(var page = 1; page <=  page_limit; page++){
		for(var tables = 0; tables < 2 ; tables++){
			var entry = document.createElement("TD");
			var entry_link = document.createElement("A");
			entry_link.innerHTML = "<a href = \"javascript:void(0)\">Page " + page + "</a>";
			(function (_page){ 
				entry_link.addEventListener("click", function(){
					while(table.hasChildNodes()){
						table.removeChild(table.firstChild);
					}
					current_page = max_page - (_page - 1);
					table.innerHTML = "<tr><td>...Loading New Entries - page " + _page + " ...</td></tr>";
					window.location.hash = '#' + _page;
					table_built = false;
					loadFunction();
				});
			})(page);
			entry.appendChild(entry_link);
			page_tables[tables].appendChild(entry);
		}
	}
}