import * as vscode from 'vscode';
import { authenticate } from './authenticate';
import { SidebarProvider } from './SidebarProvider';
import { TokenManager } from './TokenManager';

export function activate(context: vscode.ExtensionContext) {
	TokenManager.globalState = context.globalState;

	// Jot Down sidebar view/provider
	const sidebarProvider = new SidebarProvider(context.extensionUri);

	// add note command button
	const item = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right
	  );
	  item.text = "$(note) Add Note";
	  item.command = "jot-down.addNote";
	  item.show();

	  
	context.subscriptions.push(
	  vscode.window.registerWebviewViewProvider(
		"jot-down-sidebar",
		sidebarProvider
	  )
	);
  

	// add jot down item from selection in editor
	context.subscriptions.push(
		vscode.commands.registerCommand("jot-down.addNote", () => {
		  const { activeTextEditor } = vscode.window;
	
		  if (!activeTextEditor) {
			vscode.window.showInformationMessage("No active text editor");
			return;
		  }
	
		  const text = activeTextEditor.document.getText(
			activeTextEditor.selection
		  );
	
		  sidebarProvider._view?.webview.postMessage({
			command: "new-note",
			value: text,
		  });
		})
	  );


	  // sign in/authenticate
	  context.subscriptions.push(
		vscode.commands.registerCommand("jot-down.signIn", () => {
		  try {
			authenticate();
		  } catch (err) {
			console.log(err);
		  }
		})
	  );

	// reload sidebar webview/panel
	context.subscriptions.push(
		vscode.commands.registerCommand('jot-down.refresh', async () => {
			// open views and devTools on reload command
			await vscode.commands.executeCommand("workbench.action.closeSidebar");
			await vscode.commands.executeCommand("workbench.view.extension.jot-down-sidebar-view");
			
			// For DEV
			//setTimeout(() => {
			//	vscode.commands.executeCommand(
			//		"workbench.action.webview.openDeveloperTools"
			//	
			//	);
			//}, 500);
			
		})
	);

}


export function deactivate() {}
