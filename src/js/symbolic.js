import {parseCode} from './code-analyzer';

var variableMap;
var dicLines;
var mapColors;
export {initiateDics,initiateVariableMap,inserTtoVariableMap,parseNewCode,getMapColors,replaceVariables,symbole,parseArguments};
function inserTtoVariableMap(left,right)
{
    var tokenArray=getTokenArray(right);
    for (let i=0;i<tokenArray.length;i++)
    {
        if (tokenArray[i] in variableMap)
            right=right.replace(tokenArray[i],variableMap[tokenArray[i]]);
    }
    variableMap[left]=right;
}
/*function inserToVariableMapIfInVariavble(left,right)
{
    if (variableMap!=undefined) {
        if (left in variableMap)
            inserTtoVariableMap(left, right);
    }
}*/
function symbole(func)
{
    var parsedCode=parseCode(func);
    initiateDics();
    var dic=[];
    initiateDic(dic);
    parseNewCode(parsedCode,dic,undefined,1)[0];
    var final=AddLinesOfFunc(func);
    return final;
}
function initiateDic(dic)
{
    for (var value in variableMap)
    {
        dic[value]=variableMap[value];
    }
}
function initiateDics()
{
    dicLines=[];
    mapColors=[];
}
function getMapColors()
{
    return mapColors;
}
let line=1;
function parseNewCode(parsedCode,dictinoary,lastIf,lineIn) {
    if (lineIn!=undefined)
        line=lineIn;
    if (parsedCode!=null){
        switch (parsedCode.type) {
        case 'FunctionDeclaration':
            return handleFunctionDeclaration(parsedCode, dictinoary, lastIf);
        default:
            return handleNext(parsedCode, dictinoary, lastIf);
        }
    }
}

function handleNext(parsedCode,dictinoary,lastIf) {
    switch (parsedCode.type) {
    case 'VariableDeclarator':return handleVariableDeclarator(parsedCode,dictinoary,lastIf);
    case 'BlockStatement':return handleBlockStatement(parsedCode,dictinoary,lastIf);
    case 'ExpressionStatement':return handleExpressionStatement(parsedCode,dictinoary,lastIf);
    default:return handleSecond(parsedCode,dictinoary,lastIf);
    }
}
function handleSecond(parsedCode,dictinoary,lastIf) {
    switch (parsedCode.type) {
    case 'AssignmentExpression':return handleAssignmentExpression(parsedCode,dictinoary,lastIf);
    case 'WhileStatement':return handleWhileStatement(parsedCode,dictinoary,lastIf);
    case 'BinaryExpression':return handleBinaryExpression(parsedCode,dictinoary,lastIf);
    case 'Identifier':return handleIdentifier(parsedCode,dictinoary,lastIf);
    default:return handleThird(parsedCode,dictinoary,lastIf);
    }
}

function handleThird(parsedCode,dictinoary,lastIf) {
    switch (parsedCode.type) {
    case 'Literal':return handleLiteral(parsedCode,dictinoary,lastIf);
    case 'ElseIfStatment':return handleElseIfStatment(parsedCode,dictinoary,lastIf);
    case 'ReturnStatement':return handleReturnStatement(parsedCode,dictinoary,lastIf);
    case 'UnaryExpression':return handleUnaryExpression(parsedCode,dictinoary,lastIf);
    default:return handleForth(parsedCode,dictinoary,lastIf);
    }
}

function handleForth(parsedCode,dictinoary,lastIf) {
    switch (parsedCode.type) {
    case 'IfStatement':return handleIfStatement(parsedCode, 'if statment',dictinoary,lastIf);
    case 'VariableDeclaration':return handleVariableDeclaration(parsedCode,dictinoary,lastIf);
    case 'Program':return handleProgram(parsedCode,dictinoary,lastIf);
    default:return handleMemberExpression(parsedCode,dictinoary,lastIf);
    }
}
function handleProgram(parsedCode,dictinoary,lastIf) {
    let toReturn = [];
    var i;
    for (i = 0; i < parsedCode.body.length; i++) {
        var tempDic=copyDicToTemp(dictinoary);
        Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body[i],dictinoary,lastIf));
        dictinoary=tempDic;
    }
    let to=[];
    to[0]=toReturn;
    return to;
}
function copyDicToTemp(dic)
{
    var temp=[];
    for (var key in dic)
    {
        temp[key]=dic[key];
    }
    return temp;
}
function handleFunctionDeclaration(parsedCode,dictinoary,lastIf) {
    let toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, 'function declaration', parseNewCode(parsedCode.id), '', '');
    var i;
    for (i = 0; i < parsedCode.params.length; i++) {
        toReturn[i + 1] = {};
        dictinoary[parseNewCode(parsedCode.params[i],dictinoary)]=parseNewCode(parsedCode.params[i],dictinoary);
        addToObj(toReturn[i + 1], line, 'variable declaration', parseNewCode(parsedCode.params[i],dictinoary), '', '');
    }
    copyDicToDic(dictinoary);
    line += 1;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body,dictinoary,lastIf));
    return toReturn;
}
function copyDicToDic(dictinoary)
{
    var obj=[];
    for (var key in dictinoary)
    {
        obj[key]=dictinoary[key];
    }
    dicLines[line]=obj;
}
function handleVariableDeclaration(parsedCode,dictinoary,lastIf) {
    var toReturn = [];
    var i;
    for (i = 0; i < parsedCode.declarations.length; i++) {
        toReturn[i] = {};
        var objReturned = parseNewCode(parsedCode.declarations[i],dictinoary,lastIf);
        addToObj(toReturn[i], line, 'variable declaration', objReturned.name, objReturned.condition, objReturned.value);
        addToDic(objReturned.name,objReturned.value,dictinoary);
    }
    copyDicToDic(dictinoary);
    line += 1;
    return toReturn;
}

function handleVariableDeclarator(parsedCode) {
    var obj = {};
    obj.name = parseNewCode(parsedCode.id);
    obj.condition = '';
    obj.value = parseNewCode(parsedCode.init);
    return obj;
}

function handleBlockStatement(parsedCode,dictinoary,lastIf) {
    var toReturn = [];
    var i;
    for (i = 0; i < parsedCode.body.length; i++) {
        var mid = parseNewCode(parsedCode.body[i],dictinoary,lastIf);
        Array.prototype.push.apply(toReturn, mid);
    }
    return toReturn;
}

function handleExpressionStatement(parsedCode,dictinoary,lastIf) {

    var toReturn = [];
    toReturn[0] = parseNewCode(parsedCode.expression,dictinoary,lastIf);
    copyDicToDic(dictinoary);
    line += 1;
    return toReturn;
}

function handleAssignmentExpression(parsedCode,dictinoary,lastIf) {
    var obj = {};
    var left=parseNewCode(parsedCode.left,dictinoary,lastIf);
    var right=parseNewCode(parsedCode.right,dictinoary,lastIf);
    addToObj(obj, line, 'assignment expression',left , '', right);
    addToDic(left,right,dictinoary);
    return obj;
}

function handleWhileStatement(parsedCode,dictinoary,lastIf) {
    var toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, 'while statment', '', parseNewCode(parsedCode.test,dictinoary,lastIf), '');
    copyDicToDic(dictinoary);
    line++;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body,dictinoary,lastIf));
    return toReturn;
}

function handleBinaryExpression(parsedCode) {
    var left = parseNewCode(parsedCode.left);
    var right = parseNewCode(parsedCode.right);
    return '('+ left+ parsedCode.operator + right+')';
}

function handleIdentifier(parsedCode) {
    return parsedCode.name;
}

function handleLiteral(parsedCode) {
    if (isNaN(parsedCode.value)) {
        return '\'' + parsedCode.value + '\'';
    }
    return parsedCode.value;
}

function handleElseIfStatment(parsedCode,dictinoary,lastIf) {
    return handleIfStatement(parsedCode, 'else if statment',dictinoary,lastIf);
}

function handleIfStatement(parsedCode, type,dictinoary,lastIf) {
    var toReturn = [];
    toReturn[0] = {};
    var test=parseNewCode(parsedCode.test,dictinoary,lastIf);
    addToObj(toReturn[0], line, type, '', test, '');
    var isIn=calculatePharse(test,dictinoary,lastIf);
    mapColors.push(isIn);
    if (isIn)
        lastIf=false;
    copyDicToDic(dictinoary);
    line++;
    var tempDic=copyDicToTemp(dictinoary);
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.consequent,dictinoary,isIn));
    dictinoary=tempDic;
    return handleAlternate(parsedCode,type,dictinoary,lastIf,tempDic,toReturn);

}
function handleAlternate(parsedCode, type,dictinoary,lastIf,tempDic,toReturn)
{
    if (parsedCode.alternate != null) {
        if (parsedCode.alternate.type == 'IfStatement')
            parsedCode.alternate.type = 'ElseIfStatment';
        else {
            toReturn[toReturn.length] = {};
            addToObj(toReturn[toReturn.length - 1], line, 'else', '', '', '');
            if (lastIf!=false)
                mapColors.push(true);
            else
                mapColors.push(false);
            copyDicToDic(dictinoary);line++;
        }
        tempDic=copyDicToTemp(dictinoary);
        Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.alternate,dictinoary,lastIf));
        dictinoary=tempDic;
    }
    return toReturn;
}
function initiateVariableMap()
{
    variableMap=[];
}
function calculatePharse(pharse,dictinoary,lastIf)
{
    var value=replaceVariablesCalc(pharse,dictinoary);
    var array=value.split(/[\s<>,=()*/;{}%+-]+/).filter(a=>a!==' ');
    for (let i=0;i<array.length;i++)
    {
        if (array[i] in variableMap)
            value=replaceAll(value,array[i],variableMap[array[i]]);
    }
    var isTrue= eval(value);
    if (lastIf==undefined)
        return isTrue;
    else
    {
        if (lastIf==true)
            return isTrue;
        return false;
    }
}
function replaceAll(str, find, replace) {
    return str.split(find).join(replace);
}
function handleReturnStatement(parsedCode,dictinoary) {
    var toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, 'return statment', '', '', parseNewCode(parsedCode.argument));
    copyDicToDic(dictinoary);
    line++;
    return toReturn;
}

function handleUnaryExpression(parsedCode) {
    var toReturn = parseNewCode(parsedCode.argument);
    var to = parsedCode.operator + toReturn;
    return to;
}

function handleMemberExpression(parsedCode) {
    return parseNewCode(parsedCode.object) + '[' + parseNewCode(parsedCode.property) + ']';
}

function addToObj(obj, line, type, name, condition, value) {
    obj.line = line;
    obj.type = type;
    obj.name = name;
    obj.condition = condition;
    obj.value = value;
}
//return the value splited into array of numbers/variables
function getTokenArray(value) {
    var result = [];
    if (!isNaN(value))
        return result;
    var numbers=value.split(/[\s<>,=()*/;{}%+-]+/);
    return numbers;
}
function addToDic(name,value,dictinoary)
{
    if (value==null)
        value='';
    value=replaceVariables(value,dictinoary);
    dictinoary[name] = value;
}
function replaceVariables(value,dictinoary,bool)
{
    var ArrayOfTokens=getTokenArray(value);
    for (let i=0;i<ArrayOfTokens.length;i++)
    {
        var tok=ArrayOfTokens[i];
        var tokInDic=tok;
        if (dictinoary[tok]!=undefined) {
            if (!(tokInDic in variableMap))
                tokInDic = dictinoary[tok];
        }
        value=value.replace(tok,tokInDic);
    }
    if (bool) {
        return value;
    }
    value = replaceNumbers(value);
    return value;
}
function replaceVariablesCalc(value,dictinoary)
{
    var ArrayOfTokens=getTokenArray(value);
    for (let i=0;i<ArrayOfTokens.length;i++)
    {
        var tok=ArrayOfTokens[i];
        var tokInDic=tok;
        if (dictinoary[tok]!=undefined) {
            tokInDic = dictinoary[tok];
        }
        value=value.replace(tok,tokInDic);
    }
    value = replaceNumbers(value);
    return value;
}
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
function evalPharse(value)
{
    var toReturn;
    try
    {
        toReturn=eval(value);
        if (/^[a-zA-Z]+$/.test(toReturn))
            toReturn=value;
    }
    catch(e)
    {
        toReturn=value;
    }
    return toReturn;
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
function getStringToPresent(index,sentence)
{
    var dic=dicLines[index+1];
    return replaceVariables(sentence,dic,true);
}
function getAssigmentName(sentence)
{
    if (sentence.includes('=')) {
        var array =getTokenArray(sentence).filter(a=>a!=='');
        return array[0];
    }
    return '';
}
function parseArguments(subject)
{
    if (variableMap==undefined)
        variableMap=[];
    //var dummy = '';
    //var regex_string = `${dummy}`;
    var result = subject.split(/,(?![^([]*[\])])/g).filter(a=>a!=='');
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