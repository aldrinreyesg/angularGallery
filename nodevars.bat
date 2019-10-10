@echo off

set LOCAL_PATH=c:\PortableApps\PortableApps\node-v12.11.1-win-x64

rem Ensure this Node.js and npm are first in the PATH
set "PATH=%APPDATA%\npm;%~dp0;%LOCAL_PATH%;%PATH%"

setlocal enabledelayedexpansion
pushd "%~dp0"

rem Figure out the Node.js version.
set print_version=.\node.exe -p -e "process.versions.node + ' (' + process.arch + ')'"
for /F "usebackq delims=" %%v in (`%print_version%`) do set version=%%v

rem Print message.
if exist npm.cmd (
  echo Your environment has been set up for using Node.js !version! and npm.
) else (
  echo Your environment has been set up for using Node.js !version!.
)

popd
endlocal

rem If we're in the Node.js directory, change to the user's home dir.
rem if "%CD%\"=="%~dp0" cd /d "%HOMEDRIVE%%HOMEPATH%"
