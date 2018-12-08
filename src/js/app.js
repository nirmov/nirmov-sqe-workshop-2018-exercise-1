import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseNewCode} from './Parser';
import {symbole,getMapColors,parseArguments} from './symbolic';

var table = document.getElementById('Result');
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        ClearTable();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        addRow();
        var Ans=parseNewCode(parsedCode,1);
        var i=0;
        for (i=0;i<Ans[0].length;i++) {
            addWholeLine(Ans[0][i].line, Ans[0][i].type, Ans[0][i].name, Ans[0][i].condition, Ans[0][i].value);
            addRow();
        }
        parseArguments(document.getElementById('arguments').value);
        var final=symbole(codeToParse);
        document.getElementById('functionAfter').innerHTML = '';
        printNewFunc(final);
    });
});
function printNewFunc(final)
{
    var mapColors=getMapColors();
    var indexIf=0;
    for (let i=0;i<final.length;i++)
    {
        var line=final[i];
        var color=getBackgroundColor(line,indexIf,mapColors);
        if (color!='white') {
            indexIf++;
        }
        $('#functionAfter').append(
            $('<div>' + line + '</div>').addClass(color)
        );
    }
}

function getBackgroundColor(line,indexIf,mapColors)
{
    if (line.includes('if')||line.includes('else'))
    {
        var color=mapColors[indexIf];
        if (color==true)
            return 'green';
        return 'red';
    }
    return 'white';
}
var newRow;
function addRow()
{
    newRow=table.insertRow(table.rows.length);
}
function addColumn(index,text)
{
    var newCell  = newRow.insertCell(index);
    var newText  = document.createTextNode(text);
    newCell.appendChild(newText);
}
function addWholeLine(line,type,name,condition,value)
{
    addColumn(0,line);
    addColumn(1,type);
    addColumn(2,name);
    addColumn(3,condition);
    addColumn(4,value);

}
function ClearTable()
{
    var Rows = table.getElementsByTagName('tr');
    var Count = Rows.length;

    for(var i=Count-1; i>0; i--) {
        table.deleteRow(i);
    }
}