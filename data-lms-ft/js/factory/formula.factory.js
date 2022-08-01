/**
 * Created by JA
 */

materialAdmin.factory('formulaFactory',
	[
        '$rootScope',
		function(
            $rootScope
        ){

            return function (formulaKey, bindingKey = false) {
                if(!formulaKey)
                    return false;

                const OPERATOR_REGEX = /[+%-/*() ]/g;
                let formula = $rootScope.$configs.formula && $rootScope.$configs.formula[formulaKey] || $rootScope.$constants.formula[formulaKey] ;
                let operand;
                let bindingFromula;
                let isValid;

                bindingKey && binding(bindingKey);

				return {
                    bind: binding,
                    eval: evaluator
                };

                function binding(oBinding){
                    isValid = true;
                    operand = formula.replace(OPERATOR_REGEX, replaceString => ('+-*/%'.indexOf(replaceString)+1) ? ',' : '').split(',');
                    bindingFromula = formula;
                    try{
                        operand.forEach(op => {
                            // if(typeof oBinding[op] === 'undefined')
                            //     throw new Error(`Binding not Defind For ${op}`);
                            bindingFromula = bindingFromula.replace(op, oBinding[op] || 0);
                        });
                    }catch(e){
                        console.log(e);
                        isValid = false;
                        return false;
                    }
                }

                function evaluator(){
                    return isValid ? eval(bindingFromula) : 0;
                }
            };
		}
	]
);
