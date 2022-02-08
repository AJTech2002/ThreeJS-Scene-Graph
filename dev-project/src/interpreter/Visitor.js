export default class Visitor {




    constructor(memStore) {
        this.memoryStore = memStore;
        this.verbose = false;
    }

    /* Deal with nodes in an array */
    visitNodes(nodes) {
        for (const node of nodes) this.visitNode(node);
    }
    /* Dispatch each type of node to a function */
    visitNode(node) {
        switch (node.type) {
            case 'Program': return this.visitProgram(node);
            case 'VariableDeclaration': return this.visitVariableDeclaration(node);
            case 'VariableDeclarator': return this.visitVariableDeclarator(node);
            case 'ExpressionStatement': return this.visitExpressionStatement(node);
            case 'Identifier': return this.visitIdentifier(node);
            case 'BinaryExpression': return this.visitBinaryExpression(node);
            case 'MemberExpression': return this.visitMemberExpression(node);
            case 'ThisExpression': return this.visitThisExpression(node);
            case 'CallExpression': return this.visitCallExpression(node);
            case 'Literal': return this.visitLiteral(node);
            case 'IfStatement': return this.visitIfStatement(node);
            case 'BlockStatement': return this.visitBlockStatement(node);
            case 'LogicalExpression': return this.visitLogicalExpression(node);
        }
    }

    getValue(node) {
        switch (node.type) {
            case 'Identifier': return this.memoryStore.findVariable(this.visitIdentifier(node));
            case 'Literal': return this.visitLiteral(node);
            case 'BinaryExpression': return this.visitBinaryExpression(node);
            case 'CallExpression': return this.visitCallExpression(node);
            case 'MemberExpression': return this.evaluateMemberExpression(node);
            case 'ThisExpression': return this.memoryStore.memoryStore['this'];
            case 'UnaryExpression': return this.evaluateUnaryExpression(node);
            default: return this.visitNode(node);
        }
    }


    evaluateUnaryExpression(node) {
        let val = this.getValue(node.argument);
        if (node.operator === "-") return val * -1;
    }

    visitLogicalExpression(node) {
        let leftValue = this.getValue(node.left);
        let rightValue = this.getValue(node.right);

        //TODO: Remove EVAL it has too many privileges -- check symbol & execute logic on that ((https://stackoverflow.com/questions/2276021/evaluating-a-string-as-a-mathematical-expression-in-javascript))
        return eval(`${leftValue} ${node.operator} ${rightValue}`);
    }

    visitIfStatement(node) {
        let testResult = this.visitNode(node.test);

        if (testResult === true) {
            this.visitNode(node.consequent);
        }
        else {
            if (node?.alternate)
                this.visitNode(node.alternate);
        }
    }

    visitBlockStatement(node) {
        return this.visitNodes(node.body);
    }

    visitBinaryExpression(node) {
        let leftValue = this.getValue(node.left);
        let rightValue = this.getValue(node.right);

        if (this.verbose)
            console.log(`${leftValue} ${node.operator} ${rightValue}`, eval(`${leftValue} ${node.operator} ${rightValue}`));
        //TODO: Remove EVAL it has too many privileges -- check symbol & execute logic on that ((https://stackoverflow.com/questions/2276021/evaluating-a-string-as-a-mathematical-expression-in-javascript))
        return eval(`${leftValue} ${node.operator} ${rightValue}`);
    }


    isString(s) {
        if (typeof s === 'string') return true;
        return false;
    }

    setMemberedExpression(callList, value) {
        callList = this.convToArray(callList);
        if (callList[0] !== 'this' && this.memoryStore.variableExists(callList[0])) {

            //Fix this mess later
            if (callList.length === 1)
                this.memoryStore.setVariable(callList[0], value);
            else if (callList.length === 2)
                this.memoryStore.findVariable(callList[0])[callList[1]] = value;
            else if (callList.length === 3)
                this.memoryStore.findVariable(callList[0])[callList[1]][callList[2]] = value;
            else if (callList.length === 4)
                this.memoryStore.findVariable(callList[0])[callList[1]][callList[2]][callList[3]] = value;
        }
        else if (callList[0] === 'this') {
            if (this.memoryStore.availableVariables.includes(callList[1])) {
                if (this.memoryStore.readOnlyVariables.includes(callList[1])) {
                    console.log("Can't Assign to read only variable", callList[1]);
                }
                else {
                    this.memoryStore.findVariable('this')[callList[1]] = value;
                }
            }
        }
        else {
            window[callList[0]] = value;
        }
    }

    convToArray(v) {
        var val = [];
        if (this.isString(v)) {
            val = [v];
        }
        else val = v;

        return val;
    }

    visitAssignmentExpression(expression) {
        let expressionIdentifier = this.visitNode(expression.left);
        if (this.verbose)
            console.log(expressionIdentifier);
        this.setMemberedExpression(expressionIdentifier, this.visitNode(expression.right));
    }

    visitCallExpression(expression) {
        let currentObject = this.getValue(expression.callee);
        let evaledArgs = [];

        expression.arguments.map((arg) => {
            evaledArgs.push(this.getValue(arg));
        });
        if (this.verbose) {
            console.log(currentObject);
            console.log(currentObject, "CALLS", evaledArgs, currentObject(...evaledArgs));
        }
        return currentObject(...evaledArgs);
    }

    visitMemberExpression(expression) {
        let objectName = this.visitNode(expression.object);

        let decomposedObj = this.visitNode(expression.property);

        if (this.verbose)
            console.log("Object Name", objectName);
        if (this.verbose)
            console.log("Property ", decomposedObj);
        if (typeof decomposedObj === 'string') {
            if (typeof objectName === 'string')
                var objectHierarchy = [objectName, decomposedObj];
            else
                var objectHierarchy = [...objectName, decomposedObj];
        }
        else {
            if (typeof objectName === 'string')
                var objectHierarchy = [objectName, ...decomposedObj];
            else
                var objectHierarchy = [...objectName, ...decomposedObj];
        }

        //console.log("OBJ HIER", objectHierarchy);

        return objectHierarchy;
    }

    evaluateMemberExpression(memberNode) {

        let callHierarchy = this.visitNode(memberNode);
        let lookingForLocalObject = false;
        if (this.verbose)
            console.log(callHierarchy);

        if (typeof (callHierarchy) === 'string')
            callHierarchy = [callHierarchy];

        if (callHierarchy.length > 0) {
            if (this.memoryStore.variableExists(callHierarchy[0])) {
                lookingForLocalObject = true;
            }

            var currentObject = (lookingForLocalObject) ? this.memoryStore.findVariable(callHierarchy[0]) : window[callHierarchy[0]];
            if (this.verbose)
                console.log(currentObject);

            for (let i = 1; i < callHierarchy.length; i++) {

                if (lookingForLocalObject && callHierarchy[i - 1] === 'this' && !this.memoryStore.availableVariables.includes(callHierarchy[i])) {
                    //Private Variable Case
                    return undefined;
                }

                currentObject = currentObject[callHierarchy[i]];
                if (this.verbose)
                    console.log(currentObject);

            }
        }

        return currentObject;
    }

    visitThisExpression(memberNode) {
        return 'this';
    }

    visitExpressionStatement(node) {
        switch (node.expression.type) {
            case 'AssignmentExpression': return this.visitAssignmentExpression(node.expression);
            case 'CallExpression': return this.visitCallExpression(node.expression);
        }

        return this.visitNodes(node.body);
    }

    /* Functions to deal with each type of node */
    visitProgram(node) {
        //console.log("PROG", node);
        return this.visitNodes(node.body);
    }

    visitVariableDeclaration(node) {
        //console.log("Variable Declaration", node);
        return this.visitNodes(node.declarations);
    }

    visitVariableDeclarator(node) {
        //console.log("Variable Declarator", node);
        var nodeId = this.visitNode(node.id);
        var nodeValue = this.getValue(node.init);
        this.memoryStore.createVariable(nodeId, nodeValue);

        return this.visitNode(node.init);
    }

    visitIdentifier(node) {
        //console.log("Identifier", node);
        return node.name;
    }
    visitLiteral(node) {
        //console.log("Literal", node);
        return node.value;
    }
}