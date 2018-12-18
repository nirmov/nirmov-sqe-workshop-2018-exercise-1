import $ from 'jquery';
import {parseCode} from './code-analyzer';
import {parseNewCode} from './Parser';
import {startGraph} from './Graph';
import {symbole,getMapColors,parseArguments,initiateVariableMap} from './symbolic';
export {drawGraph};

var table = document.getElementById('Result');
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
        addRow();
        initiateVariableMap();
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
        startGraph(parsedCode);
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

<<<<<<< HEAD
}
function ClearTable()
{
    var Rows = table.getElementsByTagName('tr');
    var Count = Rows.length;

    for(var i=Count-1; i>0; i--) {
        table.deleteRow(i);
    }
}
function drawGraph(operands)
{
    var diagram = flowchart.parse(operands);
    diagram.drawSVG('diagram', {
        'x': 0,
        'y': 0,
        'line-width': 3,
        'line-length': 50,
        'text-margin': 10,
        'font-size': 14,
        'font-color': 'black',
        'line-color': 'black',
        'element-color': 'black',
        'fill': 'white',
        'yes-text': 'yes',
        'no-text': 'no',
        'arrow-end': 'block',
        'scale': 1,
        // style symbol types
        'symbols': {
            'start': {
                'font-color': 'red',
                'element-color': 'green',
                'fill': 'yellow'
            },
            'end':{
                'class': 'end-element'
            }
        },
        // even flowstate support ;-)
        'flowstate' : {
            // 'past' : { 'fill' : '#CCCCCC', 'font-size' : 12},
            // 'current' : {'fill' : 'yellow', 'font-color' : 'red', 'font-weight' : 'bold'},
            // 'future' : { 'fill' : '#FFFF99'},
            'green' : { 'fill' : 'green'},
            'white': {'fill' : 'red'}
            // 'approved' : { 'fill' : '#58C4A3', 'font-size' : 12, 'yes-text' : 'APPROVED', 'no-text' : 'n/a' },
            // 'rejected' : { 'fill' : '#C45879', 'font-size' : 12, 'yes-text' : 'n/a', 'no-text' : 'REJECTED' }
        }
    });
=======
>>>>>>> parent of d2ebbf9... final project
}