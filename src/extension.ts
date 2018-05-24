import * as vscode from "vscode";
import { LambdaTreeProvider } from "./lambdaTreeProvider";

export function activate(context: vscode.ExtensionContext) {
  const lambdaTreeProvider = new LambdaTreeProvider();
  vscode.window.registerTreeDataProvider("lambda", lambdaTreeProvider);
}

export function deactivate() {}
