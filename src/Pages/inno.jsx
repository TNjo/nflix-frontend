#define MyAppName "NFLIX"
#define MyAppVersion "2.0"
#define MyAppPublisher "My Company, Inc."
#define MyAppURL "https://www.example.com/"
#define MyAppExeName "app.exe"
 
[Setup]
AppId={{91AA0969-08EA-42EB-BB2B-B805AE88DC9B}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
UninstallDisplayIcon={app}\{#MyAppExeName}
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible
DisableProgramGroupPage=yes
OutputDir=D:\PythonProjects\NFLIX\dist
OutputBaseFilename=mysetup
SetupIconFile=D:\PythonProjects\NFLIX\dist\NFLIX.ico
SolidCompression=yes
WizardStyle=modern
 
[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"
 
[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
 
[Files]
Source: "D:\PythonProjects\NFLIX\dist\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
Source: "D:\PythonProjects\NFLIX\dist\vlc-3.0.21-win32.exe"; DestDir: "{app}"; Flags: ignoreversion
Source: "D:\PythonProjects\NFLIX\dist\install_node.bat"; DestDir: "{app}"; Flags: ignoreversion
 
 
[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
 
[Run]
; Check if Node.js is installed by trying to run 'node -v'
Filename: "cmd.exe"; Parameters: "/C node -v"; StatusMsg: "Checking if Node.js is installed..."; Flags: shellexec waituntilterminated skipifsilent
 
; If Node.js is not installed, run the batch script to install FNM, Node.js version 23, and WebTorrent
Filename: "{app}\install_node.bat"; StatusMsg: "Installing FNM, Node.js version 23, and WebTorrent..."; Flags: shellexec waituntilterminated; Check: IsNodeJsNotInstalled
 
 
; If Node.js is already installed, just install WebTorrent
Filename: "cmd.exe"; Parameters: "/K npm install -g webtorrent && echo WebTorrent Installed"; StatusMsg: "Installing WebTorrent..."; Flags: shellexec waituntilterminated; Check: IsNodeJsInstalled
 
; Run VLC setup after installing Node.js and WebTorrent
Filename: "{app}\vlc-3.0.21-win32.exe"; Parameters: "/S"; StatusMsg: "Running VLC Setup..."; Flags: waituntilterminated
 
[Code]
function IsNodeJsNotInstalled: Boolean;
var
  ResultCode: Integer;
begin
  Exec('cmd.exe', '/C node -v', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);  { Show the window to check the output }
  Result := (ResultCode <> 0);  { If the result code is non-zero, Node.js is not installed }
end;
 
function IsNodeJsInstalled: Boolean;
var
  ResultCode: Integer;
begin
  Exec('cmd.exe', '/C node -v', '', SW_SHOW, ewWaitUntilTerminated, ResultCode);  { Show the window to check the output }
  Result := (ResultCode = 0);  { If the result code is zero, Node.js is installed }
end;