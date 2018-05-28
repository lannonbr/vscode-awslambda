import * as vscode from "vscode";
import { config, Lambda, SharedIniFileCredentials } from "aws-sdk";

config.credentials = new SharedIniFileCredentials({
  profile: "default"
});

config.update({ region: "us-east-1" });

export class LambdaTreeProvider implements vscode.TreeDataProvider<LambdaFunc> {
  getTreeItem(element: LambdaFunc): vscode.TreeItem {
    return element;
  }

  getChildren(element?: LambdaFunc): Thenable<LambdaFunc[]> {
    if (element) {
      return this.returnFunctionData(element);
    } else {
      return this.getFunctions();
    }
  }

  private returnFunctionData(element: LambdaFunc): Thenable<LambdaFunc[]> {
    return new Promise((resolve, reject) => {
      if (element.funcObj != null) {
        const arn = new LambdaFunc(
          `ARN: ${element.funcObj.FunctionArn}`,
          vscode.TreeItemCollapsibleState.None
        );
        const runtime = new LambdaFunc(
          `Runtime: ${element.funcObj.Runtime}`,
          vscode.TreeItemCollapsibleState.None
        );
        resolve([arn, runtime]);
      } else {
        reject("funcObj is null");
      }
    });
  }

  private getFunctions(): Thenable<LambdaFunc[]> {
    var lambda = new Lambda();

    return new Promise((resolve, reject) => {
      lambda.listFunctions({}, function(err, data) {
        if (err) reject(err);
        else {
          if (data.Functions) {
            console.log(data.Functions);
            resolve(
              data.Functions.map(func => {
                return new LambdaFunc(
                  func.FunctionName as string,
                  vscode.TreeItemCollapsibleState.Collapsed,
                  func
                );
              })
            );
          }
        }
      });
    });
  }
}

class LambdaFunc extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly funcObj?: Lambda.FunctionConfiguration
  ) {
    super(label, collapsibleState);
  }

  get tooltip(): string {
    return this.label;
  }
}
