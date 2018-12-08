import {parseCode} from './code-analyzer';
import {initiateDics,setVariableMap,parseNewCode,getMapColors,replaceVariables} from './symbolic';
export {symbole,getColorsMap,parseArguments};
var dictinoary;
var dicLines;
var ArrayAfterParse;
var variableMap;
function symbole(func) {
    dictinoary=[];
    dicLines=[];
    var parsedCode=parseCode(func);
    initiateDics();
    setVariableMap(variableMap);
    var dic=[];
    ArrayAfterParse = parseNewCode(parsedCode,dic,undefined,1)[0];
    mapColors=getMapColors();
    //dicLines=getDicLines();
   /* insertParamtersToDic(ArrayAfterParse);
    for (var i=0;i<ArrayAfterParse.length;i++)
    {
        var line=ArrayAfterParse[i];
        handleBody(line,i);
    }
    handlePaint(ArrayAfterParse);
    */
    var final=AddLinesOfFunc(func);
    return final;
}
function parseArguments(subject)
{
    variableMap=[];
    var result = subject.split(/,(?![^\(\[]*[\]\)])/g);
    for (let i=0;i<result.length;i++)
    {
        var variable=result[i];
        var vari=result[i].split('=');
        variable=vari[0];
        insertToDicArguments(variable,vari[1]);
    }
}

function insertToDicArguments(variableName,variableValue)
{

    if (variableValue[0]=='[')
    {
        variableValue=variableValue.substring(1,variableValue.length-1);
        var values=variableValue.split(',');
        for (let i=0;i<values.length;i++)
        {
            insertToDicArguments(variableName+'['+i+']',values[i]);
        }
    }
    else
        variableMap[variableName]=variableValue;
}
function AddLinesOfFunc(func) {
    let lines=func.split(/\r?\n/);
    var finall=[];
    var del=0;
    for (var i=0;i<lines.length;i++)
    {
        var sentence=lines[i];
        var sentence_without_spaces=sentence.replace('\t','');
        sentence_without_spaces=sentence_without_spaces.replace(' ','');
        while (sentence_without_spaces.includes(' '))
            sentence_without_spaces=sentence_without_spaces.replace(' ','');
        if (checkValidLine(sentence_without_spaces)) {
            del++;
            finall.push(sentence);
        }
        else if (needToPresent(i-del+1,sentence))
            finall.push(getStringToPresent( i-del,sentence));
    }
    return finall;
}
function checkValidLine(sentence_without_spaces) {
    return sentence_without_spaces=='{'||sentence_without_spaces=='}'||sentence_without_spaces=='';
}
function needToPresent(index,sentence) {
    if (needToPresent2(sentence))
        return true;
    return sentence.includes('else')||sentence.includes('if')||sentence.includes('return')||sentence.includes('while');
}
function needToPresent2(sentence)
{
    if (sentence.includes('function'))
        return true;
    var name= getAssigmentName(sentence);
    if (name in variableMap)
        return true;
    return false;
}
function getAssigmentName(sentence)
{
    if (sentence.includes('=')) {
        var array = sentence.split('').filter(a => a !== ' ');
        return array[0];
    }
    return '';
}
function getStringToPresent(index,sentence)
{
    var dic=dicLines[index+1];
    return replaceVariables(sentence,dic,true);
}
function handleBody(line,position)
{
    if (line.type=='assignment expression'||(line.type=='variable declaration'&&(line.value!=''||line.value=='0')))
    {
        insertToDic(line.name,line.value,position-1,true);
        dicLines[dicLines.length]={name:line.name,line:line.line,value:dictinoary[line.name]};
    }
}
function getRealPositionFromDic(position)
{
    for (var i=0;i<ArrayAfterParse.length-1;i++)
    {
        if (ArrayAfterParse[i].line==position)
            return i;
    }
}
function getLastVal(name,position)
{
    var dup=ArrayAfterParse;
    for (var i=position;i>0;i--)
    {
        var line=dup[i];
        if (line.name==name)
            return getValFromDicInSpecificLine(line.line,name);
        if (partOfScope(line))
            i=getFirstIf(i,dup);
    }
    return dictinoary[name];
}
function partOfScope(line)
{
    return line.type=='else'||line.type=='else if statment';
}
// return value of variable in specific line
function getValFromDicInSpecificLine(line,name)
{
    for (var i=dicLines.length-1;i>=0;i--)
    {
        if (dicLines[i].name==name&&dicLines[i].line<=line)
            return dicLines[i].value;
    }
}
// return the last ocurance of if from specific line
function getFirstIf(i,dup)
{
    for(var j=i;j>=0;j--)
    {
        if (dup[j].type=='if statment')
        {
            return j;
        }
    }
}

// insert to dictionary or return the line after replacing variables
function insertToDic(name,value,line,bool)
{
    var ArrayOfTokens=getTokenArray(value);
    for (let i=0;i<ArrayOfTokens.length;i++)
    {
        var tok=ArrayOfTokens[i];
        var tokInDic=tok;
        if (dictinoary[tok]!=undefined) {
            if (!(tokInDic in variableMap))
                tokInDic = getLastVal(tok, line);
        }
        value=value.replace(tok,tokInDic);
    }
    if (bool) {
        value = replaceNumbers(value);
        dictinoary[name] = value;
    }
    else
        return value;
}
// replace pharses if posible

function replaceNumbers(value)
{
    if (isNaN(value)) {
        var values = value.split(/[\s<>=]+/);
        var tokens = value.split(/[^\s<>=]+/);
        var toReturn = '';
        for (var i = 0; i < values.length; i++) {
            toReturn += evalPharse(values[i]) + tokens[i + 1];
        }
        return toReturn;
    }
    return value;
}
// calculate value if posible
function evalPharse(value)
{
    var toReturn;
    try
    {
        toReturn=eval(value);
    }
    catch(e)
    {
        toReturn=value;
    }
    return toReturn;
}
// return the value splited into array of numbers/variables
function getTokenArray(value) {
    var result = [];
    if (!isNaN(value))
        return result;
    var numbers=value.split(/[\s<>,=()*/;{}%+-]+/);
    return numbers;
}


//PARAMAETERS INSERT .

function insertParamtersToDic(array,line)
{
    var i;
    for (i=0;i<array.length;i++)
    {
        if (array[i].type=='function declaration')
        {
            line=array[i].line;
        }
        if (array[i].line==line)
        {
            if (array[i].type=='variable declaration')
            {
                dictinoary[array[i].name]=array[i].name;
                dicLines[dicLines.length]={name:array[i].name,line:array[i].line,value:dictinoary[array[i].name]};
            }
        }
    }
}

// PAINT CASES




// check if the condition is true or false
function checkColor(line,lineNumber)
{
    var condition=line.condition;
    var array=condition.split(/[\s()<>*/%+-]+/).filter(a=>a!==' ');
    for (var i=0;i<array.length;i++)
    {
        var valInDic=insertToDic('n',array[i],lineNumber-1,false);
        condition=condition.replace(array[i],valInDic);
    }
    array=condition.split(/[\s<>,=()*/;{}%+-]+/).filter(a=>a!==' ');
    for (i=0;i<array.length;i++)
    {
        if (array[i] in variableMap)
            condition=condition.replace(array[i],variableMap[array[i]]);
    }
    return eval(condition);
}

// loop over the input and in if and else cases , then add it to map colors .

var mapColors;
function handlePaint(array)
{
    mapColors=[];
    var index=0;
    for (let i=0;i<array.length;i++) {
        var line=array[i];
        var lastIf;
        if (line.type =='if statment' ) {
            lastIf = checkColor(line,i-1);
            mapColors[index]=lastIf;
            index++;
        }
        if (line.type=='else if statment') {
            if (!lastIf) {
                lastIf = checkColor(line, i - 1);
                mapColors[index] = lastIf;
                index++;
            }
            else {
                mapColors[index] = !lastIf;
                index++;
            }
        }
        if (line.type=='else') {
            mapColors[index] = !lastIf;
            index++;
        }
    }
}
function getColorsMap()
{
    return mapColors;
}