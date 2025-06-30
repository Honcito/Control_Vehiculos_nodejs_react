@echo off
cd /d "C:\CONTROL_VEHICULOS_REACT\backend"

:: Iniciar el backend en una nueva ventana de cmd que queda abierta
start cmd /k "npm start"

:: Esperar 3 segundos para que el backend arranque (puedes ajustar)
timeout /t 3

:: Abrir navegador en localhost:3000 (donde esperas que esté la app frontend servida)
start http://localhost:3000

:: Mostrar mensaje con VBScript (tu mensaje.vbs debe estar en la ruta indicada)
start wscript "C:\CONTROL_VEHICULOS_REACT\mensaje.vbs"

exit
