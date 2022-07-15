import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";

export const authenticate =  (fn?: () => void) => {
  const app = polka();

  app.get(`/auth/:token`, async (req, res) => {
    const { token } = req.params;
    if (!token) {
        res.end(`Error: something went wrong`);
        return;
    }

    
    await TokenManager.setToken(token);
    fn?.();
    
    
   res.end(`Login successful, you can close this window.`);
    (app as any).server.close();
    
  });

  app.listen(51777, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
      );
    }
  });
};