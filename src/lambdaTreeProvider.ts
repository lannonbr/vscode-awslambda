import * as vscode from "vscode";
import { config, Lambda, SharedIniFileCredentials } from "aws-sdk";

config.credentials = new SharedIniFileCredentials({
  profile: "default"
});

config.update({ region: "us-east-1" });

export class LambdaTreeProvider implements vscode.TreeDataProvider<LambdaFunc> {
  onDidChangeTreeData?: vscode.Event<LambdaFunc | null | undefined> | undefined;

  getTreeItem(element: LambdaFunc): vscode.TreeItem {
    return element;
  }

  getChildren(element?: LambdaFunc): Thenable<LambdaFunc[]> {
    return this.getFunctions();
  }

  private getFunctions(): Thenable<LambdaFunc[]> {
    const toFunc = (funcName: string): LambdaFunc => {
      return new LambdaFunc(funcName, vscode.TreeItemCollapsibleState.None);
    };

    var lambda = new Lambda();

    return new Promise((resolve, reject) => {
      lambda.listFunctions({}, function(err, data) {
        if (err) reject(err);
        else {
          if (data.Functions) {
            let funcs = data.Functions.map(
              func => func.FunctionName
            ) as string[];
            resolve(funcs.map(toFunc));
          }
        }
      });
    });
  }
}

class LambdaFunc extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState);
  }

  get tooltip(): string {
    return this.label;
  }
}
