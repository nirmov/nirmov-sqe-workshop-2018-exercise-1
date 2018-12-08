import assert from 'assert';
import {
    parseNewCode
} from '../src/js/Parser';
import $ from 'jquery';
import {parseCode} from '../src/js/code-analyzer';
describe('The javascript parser', () => {
    it('is parsing to literal', () => {
        var literal = {
            'type': 'Literal',
            'value': 0 ,
            'raw' : '1'
        };
        assert.equal(JSON.stringify(parseNewCode(literal)),'0');
    });
    it('is parsing to Identifier', () => {
        var identifier = {
            'type': 'Identifier',
            'name': 'lows'
        };
        assert.equal(parseNewCode(identifier),'lows');
    });
    it('is parsing to handleMemberExpression', () => {
        var member = {
            "type": "MemberExpression",
            "computed": true,
            "object": {
                "type": "Identifier",
                "name": "V"
            },
            "property": {
                "type": "Identifier",
                "name": "mid"
            }
        };
        assert.equal(parseNewCode(member),'V[mid]');
    });
    it('is parsing to BinaryExpression', () => {
        var binary = {
            "type": "BinaryExpression",
            "operator": "-",
            "left": {
                "type": "Identifier",
                "name": "mid"
            },
            "right": {
                "type": "Literal",
                "value": 1,
                "raw": "1"
            }
        };
        assert.equal(parseNewCode(binary),'(mid-1)');
    });
    it('is parsing to UnaryExpression', () => {
        var unary = {
            "type": "UnaryExpression",
            "operator": "-",
            "argument": {
                "type": "Literal",
                "value": 1,
                "raw": "1"
            }
        };
        assert.equal(parseNewCode(unary),'-1');
    });
    it('is parsing to handleAssignmentExpression', () => {
        var unary = {
            "type": "Program",
            "body": [
                {
                    "type": "ExpressionStatement",
                    "expression": {
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "type": "Identifier",
                            "name": "x"
                        },
                        "right": {
                            "type": "BinaryExpression",
                            "operator": "+",
                            "left": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "right": {
                                "type": "Literal",
                                "value": 1,
                                "raw": "1"
                            }
                        }
                    }
                }
            ],
            "sourceType": "script"
        };
        var ans=
            {
                "line" :null,
                "type":"assignment expression",
                "name":"x",
                "condition":"",
                "value":'(x+1)'
            };
        var ans1=[];
        ans1[0]=[];
        ans1[0][0]=ans;
        var toCheck=parseNewCode(unary);
        toCheck[0][0].line=null;
        assert.equal(JSON.stringify(toCheck),JSON.stringify(ans1));
    });
    it('is parsing to handleAssignmentExpression', () => {
        var returns = {
            "type": "ReturnStatement",
            "argument": {
                "type": "Identifier",
                "name": "mid"
            }
        };
        var ans=
            {
                "line" :null,
                "type":"return statment",
                "name":'',
                "condition":'',
                "value":"mid"
            };
        var ans1=[];
        ans1[0]=ans;
        var tocheck=parseNewCode(returns);
        tocheck[0].line=null;
        assert.equal(JSON.stringify(tocheck),JSON.stringify(ans1));
    });
    it('is parsing to while', () => {
        var whil = {
            "type": "WhileStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": "<",
                "left": {
                    "type": "Identifier",
                    "name": "x"
                },
                "right": {
                    "type": "Literal",
                    "value": 10,
                    "raw": "10"
                }
            },
            "body": {
                "type": "BlockStatement",
                "body": []
            }
        };
        var ans=
            {
                "line" :null,
                "type":"while statment",
                "name":'',
                "condition":'(x<10)',
                "value":""
            };
        var ans1=[];
        ans1[0]=ans;
        var Return=parseNewCode(whil);
        Return[0].line=null;
        assert.equal(JSON.stringify(Return),JSON.stringify(ans1));
    });
    it('is parsing to handleAssignmentExpression', () => {
        var ifState = {
            "type": "IfStatement",
            "test": {
                "type": "BinaryExpression",
                "operator": "<",
                "left": {
                    "type": "Identifier",
                    "name": "x"
                },
                "right": {
                    "type": "Literal",
                    "value": 10,
                    "raw": "10"
                }
            },
            "consequent": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "right": {
                                "type": "BinaryExpression",
                                "operator": "+",
                                "left": {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 1,
                                    "raw": "1"
                                }
                            }
                        }
                    }
                ]
            },
            "alternate": {
                "type": "BlockStatement",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "AssignmentExpression",
                            "operator": "=",
                            "left": {
                                "type": "Identifier",
                                "name": "x"
                            },
                            "right": {
                                "type": "BinaryExpression",
                                "operator": "-",
                                "left": {
                                    "type": "Identifier",
                                    "name": "x"
                                },
                                "right": {
                                    "type": "Literal",
                                    "value": 1,
                                    "raw": "1"
                                }
                            }
                        }
                    }
                ]
            }
        };
        var ans=
            {
                "line" :null,
                "type":"if statment",
                "name":'',
                "condition":'(x<10)',
                "value":""
            };
        var ans1=
            {
                "line" :null,
                "type":"assignment expression",
                "name":'x',
                "condition":'',
                "value":"(x+1)"
            };
        var ans2=
            {
                "line" :null,
                "type":"else",
                "name":'',
                "condition":'',
                "value":""
            };
        var ans3=
            {
                "line" :null,
                "type":"assignment expression",
                "name":'x',
                "condition":'',
                "value":"(x-1)"
            };
        var anss=[];
        anss[0]=ans;
        anss[1]=ans1;
        anss[2]=ans2;
        anss[3]=ans3;
        var toRetun=parseNewCode(ifState,"if statment");
        toRetun[0].line=null;toRetun[1].line=null;toRetun[2].line=null;toRetun[3].line=null;
        assert.equal(JSON.stringify(toRetun),JSON.stringify(anss));
    });
    it('is parsing to declaration', () => {
        var declare = {
            "type": "VariableDeclaration",
            "declarations": [
                {
                    "type": "VariableDeclarator",
                    "id": {
                        "type": "Identifier",
                        "name": "x"
                    },
                    "init": null
                }
            ],
            "kind": "var"
        };
        var ans=
            {
                "line" :null,
                "type":"variable declaration",
                "name":'x',
                "condition":'',
                "value":null
            };
        var ans1=[];
        ans1[0]=ans;
        var Return=parseNewCode(declare);
        Return[0].line=null;
        assert.equal(JSON.stringify(Return),JSON.stringify(ans1));
    });
    it('is parsing to ifElse', () => {
        var toParse='if (x>7)\n' +
            '{\n' +
            'x=x+1;\n' +
            '}\n' +
            'else if (x<6)\n' +
            '{\n' +
            ' x=2;\n' +
            '}\n' +
            'else \n' +
            ' x=9;';
        var Parsed=parseCode(toParse);
        var after=parseNewCode(Parsed,1);
        assert.equal(after[0].length,6);
    });
    it('is parsing to function declaration', () => {
        var toParse='function binarySearch(X, V, n){\n' +
            '}'
        var Parsed=parseCode(toParse);
        var after=parseNewCode(Parsed);
        assert.equal(after[0].length,4);
    });
    it('null check', () => {
        var after=parseNewCode(null);
        assert.equal(after,null);
    });
    it('if check', () => {
        var toParse='if (x>9)\n' +
            '  x=x+1';
        var Parsed=parseCode(toParse);
        var after=parseNewCode(Parsed,1);
        assert.equal(after[0].length,2);
    });
    it('fpr check', () => {
        var toParse='for(i=0;i<7;i++)\n' +
            '{\n' +
            '   var j=5;\n' +
            '}';
        var Parsed=parseCode(toParse);
        var after=parseNewCode(Parsed,1);
        assert.equal(after[0].length,3);
    });
});


