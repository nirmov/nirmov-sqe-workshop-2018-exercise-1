export {parseNewCode,handleLiteral,handleIfStatement,handleUnaryExpression,handleWhileStatement,handleVariableDeclaration,handleAssignmentExpression,handleMemberExpression,handleIdentifier,handleReturnStatement,handleBinaryExpression};
let line=1;
function parseNewCode(parsedCode,lineIn) {
    if (lineIn!=undefined)
        line=lineIn;
    if (parsedCode != null && parsedCode.type != null) {
        switch (parsedCode.type) {
        case 'FunctionDeclaration':return handleFunctionDeclaration(parsedCode);
        default:return handleNext(parsedCode);
        }
    } else
        return null;
}

function handleNext(parsedCode) {
    switch (parsedCode.type) {
    case 'VariableDeclarator':return handleVariableDeclarator(parsedCode);
    case 'BlockStatement':return handleBlockStatement(parsedCode);
    case 'ExpressionStatement':return handleExpressionStatement(parsedCode);
    default:return handleSecond(parsedCode);
    }
}
function handleSecond(parsedCode) {
    switch (parsedCode.type) {
    case 'AssignmentExpression':return handleAssignmentExpression(parsedCode);
    case 'WhileStatement':return handleWhileStatement(parsedCode);
    case 'BinaryExpression':return handleBinaryExpression(parsedCode);
    case 'Identifier':return handleIdentifier(parsedCode);
    default:return handleThird(parsedCode);
    }
}

function handleThird(parsedCode) {
    switch (parsedCode.type) {
    case 'Literal':return handleLiteral(parsedCode);
    case 'ElseIfStatment':return handleElseIfStatment(parsedCode);
    case 'ReturnStatement':return handleReturnStatement(parsedCode);
    case 'UnaryExpression':return handleUnaryExpression(parsedCode);
    default:return handleForth(parsedCode);
    }
}

function handleForth(parsedCode) {
    switch (parsedCode.type) {
    case 'IfStatement':return handleIfStatement(parsedCode, 'if statment');
    case 'VariableDeclaration':return handleVariableDeclaration(parsedCode);
    case 'Program':return handleProgram(parsedCode);
    default:return handleMemberExpression(parsedCode);
    }
}

function handleProgram(parsedCode) {
    let toReturn = [];
    var i;
    for (i = 0; i < parsedCode.body.length; i++) {
        toReturn[i] = parseNewCode(parsedCode.body[i]);
    }
    return toReturn;
}

function handleFunctionDeclaration(parsedCode) {
    let toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, 'function declaration', parseNewCode(parsedCode.id), '', '');
    var i;
    for (i = 0; i < parsedCode.params.length; i++) {
        toReturn[i + 1] = {};
        addToObj(toReturn[i + 1], line, 'variable declaration', parseNewCode(parsedCode.params[i]), '', '');
    }
    line += 1;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body));
    return toReturn;
}

function handleVariableDeclaration(parsedCode) {
    var toReturn = [];
    var i;
    for (i = 0; i < parsedCode.declarations.length; i++) {
        toReturn[i] = {};
        var objReturned = parseNewCode(parsedCode.declarations[i]);
        addToObj(toReturn[i], line, 'variable declaration', objReturned.name, objReturned.condition, objReturned.value);
    }
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

function handleBlockStatement(parsedCode) {
    var toReturn = [];
    var i;
    for (i = 0; i < parsedCode.body.length; i++) {
        var mid = parseNewCode(parsedCode.body[i]);
        Array.prototype.push.apply(toReturn, mid);
    }
    return toReturn;
}

function handleExpressionStatement(parsedCode) {

    var toReturn = [];
    toReturn[0] = parseNewCode(parsedCode.expression);
    line += 1;
    return toReturn;
}

function handleAssignmentExpression(parsedCode) {
    var obj = {};
    addToObj(obj, line, 'assignment expression', parseNewCode(parsedCode.left), '', parseNewCode(parsedCode.right));
    return obj;
}

function handleWhileStatement(parsedCode) {
    var toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, 'while statment', '', parseNewCode(parsedCode.test), '');
    line++;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.body));
    return toReturn;
}

function handleBinaryExpression(parsedCode) {
    var left = parseNewCode(parsedCode.left);
    var right = parseNewCode(parsedCode.right);
    return left + parsedCode.operator + right;
}

function handleIdentifier(parsedCode) {
    return parsedCode.name;
}

function handleLiteral(parsedCode) {
    return parsedCode.value;
}

function handleElseIfStatment(parsedCode) {
    return handleIfStatement(parsedCode, 'else if statment');
}

function handleIfStatement(parsedCode, type) {
    var toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, type, '', parseNewCode(parsedCode.test), '');
    line++;
    Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.consequent));
    if (parsedCode.alternate != null) {
        if (parsedCode.alternate.type == 'IfStatement')
            parsedCode.alternate.type = 'ElseIfStatment';
        else {
            toReturn[toReturn.length] = {};
            addToObj(toReturn[toReturn.length - 1], line, 'else', '', '', '');
            line++;
        }
        Array.prototype.push.apply(toReturn, parseNewCode(parsedCode.alternate));
    }
    return toReturn;
}

function handleReturnStatement(parsedCode) {
    var toReturn = [];
    toReturn[0] = {};
    addToObj(toReturn[0], line, 'return statment', '', '', parseNewCode(parsedCode.argument));
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