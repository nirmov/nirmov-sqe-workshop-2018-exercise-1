import assert from 'assert';
import {symbole,parseArguments,getMapColors,initiateVariableMap} from '../src/js/symbolic';
import {parseCode} from '../src/js/code-analyzer';
import {parseNewCode} from '../src/js/Parser';
describe('The javascript parser', () => {
    it('is parsing to empty function', () => {
        var input="function foo(x, y, z){\n" +
            "}\n";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=[false,'nir',3],y=7,z=8");
        initiateVariableMap();
        var functiondec="function foo(x, y, z){";
        assert.equal(symbole(input)[0],functiondec);
    });
    it('is parsing to return function', () => {
        var input="function foo(){\n" +
            "     return 7;\n" +
            "}";
        parseArguments("x=[false,'nir',3],y=7,z=8");
        var functiondec="     return 7;";
        assert.equal(symbole(input)[1],functiondec);
    });
    it('is parsing to if function', () => {
        var input="function foo(x){\n" +
            "     if (x<7){\n" +
            "       return false;\n" +
            "}\n" +
            "     return true;\n" +
            "}\n";
        parseArguments("x=7,y=7,z=8");
        var functiondec="     if (x<7){";
        assert.equal(symbole(input)[1],functiondec);
    });
    it('is parsing to while function', () => {
        var input="function foo(x){\n" +
            "     while (x<7){\n" +
            "       return false;\n" +
            "}\n" +
            "     return true;\n" +
            "}\n";
        parseArguments("x=7,y=7,z=8");
        var functiondec="     while (x<7){";
        var symboles=symbole(input);
        assert.equal(symboles[1],functiondec);
        assert.equal(symboles.length-1,6);
    });
    it('is parsing to if else if else function', () => {
        var input="function foo(x){\n" +
            "     if (x<7){\n" +
            "       return false;\n" +
            "     }\n" +
            "     else if (y<8){\n" +
            "        return x;\n" +
            "     }\n" +
            "     else{\n" +
            "        let a=8;\n" +
            "        return z+a;\n" +
            "     }\n" +
            "     return true;\n" +
            "}";
        parseArguments("x=3,y=7,z=8");
        var functiondec="        return z+8;";
        var symboles=symbole(input);
        assert.equal(symboles[8],functiondec);
        assert.equal(symboles.length-1,11);
        assert.equal(getMapColors()[0],true);
        assert.equal(getMapColors()[1],false);
        assert.equal(getMapColors()[2],false);
    });
    it('is parsing to if else if else function', () => {
        var input="function foo(x,y){\n" +
            "let a=x+y;\n" +
            "let b=a+4;\n" +
            "let c=0;\n" +
            "while (a<b){\n" +
            "     if (x<7){\n" +
            "       return false;\n" +
            "     }\n" +
            "     else if (y<8){\n" +
            "        return x;\n" +
            "     }\n" +
            "     else{\n" +
            "        let a=8;\n" +
            "        return z+a;\n" +
            "     }\n" +
            "     return true;\n" +
            "}\n" +
            "}";
        parseArguments("x=3,y=7,z=8");
        var functiondec="while ((x+y)<((x+y)+4)){";
        var symboles=symbole(input);
        assert.equal(symboles[1],functiondec);
        assert.equal(symboles.length-1,13);
        assert.equal(getMapColors()[0],true);
        assert.equal(getMapColors()[1],false);
        assert.equal(getMapColors()[2],false);
    });
    it('is parsing to if else if else and assigment changes function', () => {
        var input="   function foo (x,y,z)\n" +
            "    {\n" +
            "        var a=x+7;\n" +
            "        var c=z[0]+4;\n" +
            "        if (a==z[0]){\n" +
            "            c=c+4;\n" +
            "            return c;\n" +
            "        }\n" +
            "        else if (z[1]=='nir1'){\n" +
            "            c=c+5;\n" +
            "            return c;\n" +
            "        }\n" +
            "        else  {\n" +
            "            return c;\n" +
            "        }\n" +
            "        return false;\n" +
            "    }";
        parseArguments("x=7,y=8,z=[2,'nir',false]");
        var functiondec="        else if (z[1]=='nir1'){";
        var symboles=symbole(input);
        assert.equal(symboles[5],functiondec);
        assert.equal(symboles.length-1,12);
        assert.equal(getMapColors()[0],false);
        assert.equal(getMapColors()[1],false);
        assert.equal(getMapColors()[2],true);
    });
    it('is parsing to while and assigment to argument function', () => {
        var input="function foo (x,y,z)\n" +
            "{\n" +
            "  var a=x+7;\n" +
            "  var c=0;\n" +
            "  var d=true;\n" +
            "  while (a==z[0]){\n" +
            "     x=c+4;\n" +
            "     return c;\n" +
            "  }\n" +
            "}";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        parseArguments("x=7,y=8,z=[2,'nir',false]");
        var functiondec="  while ((x+7)==z[0]){";
        var symboles=symbole(input);
        assert.equal(symboles[2],functiondec);
        assert.equal(symboles.length-1,6);
    });
    it('is parsing to global variables', () => {
        var input="function nir()\n" +
            "{\n" +
            " if (x=='nir')\n" +
            "   return true;\n" +
            "}\n" +
            "let x='nir';";
        parseArguments("");
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        var functiondec=" if (x=='nir')";
        var symboles=symbole(input);
        assert.equal(symboles[2],functiondec);
        assert.equal(symboles.length-1,4);
    });
    it('is parsing to global assigments variables', () => {
        var input="let x=1\n" +
            "function nir (){\n" +
            "  let a=-1;\n" +
            "  if (a==x)\n" +
            "   return true;\n" +
            "}";

        parseArguments("");
        var functiondec="  if (-1==x)";
        var symboles=symbole(input);

        assert.equal(symboles[1],functiondec);
        assert.equal(symboles.length-1,3);
    });
    it('null check', () => {
        var after=symbole("");
        assert.equal(after.length,1);
    });
    it('is parsing to global assigments variables', () => {
        var input="let x=1;\n" +
            "function nir (){\n" +
            "  let a=-1;\n" +
            "  if (z==2){\n" +
            "   return true;\n" +
            "   if (x==1){\n" +
            "    return true;\n" +
            "  }\n" +
            "  }\n" +
            "}\n" +
            "let z=x+1;\n" +
            "let w=2;";
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);

        parseArguments("");
        var functiondec="  if (z==2){";
        var symboles=symbole(input);

        assert.equal(symboles[1],functiondec);
        assert.equal(symboles.length-1,7);
    });
    it('is parsing to global variables', () => {
        var input="let w;\n" +
            "function nir()\n" +
            "{\n" +
            " if (w==1)\n" +
            "  return true;\n" +
            "}";
        parseArguments("w=1");
        var parsedCode=parseCode(input);
        parseNewCode(parsedCode);
        var functiondec=" if (w==1)";
        var symboles=symbole(input);
        assert.equal(symboles[2],functiondec);
        assert.equal(symboles.length-1,4);
    });
});