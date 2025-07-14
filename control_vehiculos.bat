::[Bat To Exe Converter]
::
::YAwzoRdxOk+EWAjk
::fBw5plQjdCyDJGyX8VAjFBNbQgeLAE+/Fb4I5/jHzMWpln8yeN0JXafy+YGiD9Ms2GDFVqIR1XtXkcQCCQgWdxGkDg==
::YAwzuBVtJxjWCl3EqQJgSA==
::ZR4luwNxJguZRRnk
::Yhs/ulQjdF+5
::cxAkpRVqdFKZSzk=
::cBs/ulQjdF+5
::ZR41oxFsdFKZSDk=
::eBoioBt6dFKZSDk=
::cRo6pxp7LAbNWATEpCI=
::egkzugNsPRvcWATEpCI=
::dAsiuh18IRvcCxnZtBJQ
::cRYluBh/LU+EWAnk
::YxY4rhs+aU+JeA==
::cxY6rQJ7JhzQF1fEqQJQ
::ZQ05rAF9IBncCkqN+0xwdVs0
::ZQ05rAF9IAHYFVzEqQJQ
::eg0/rx1wNQPfEVWB+kM9LVsJDGQ=
::fBEirQZwNQPfEVWB+kM9LVsJDGQ=
::cRolqwZ3JBvQF1fEqQJQ
::dhA7uBVwLU+EWDk=
::YQ03rBFzNR3SWATElA==
::dhAmsQZ3MwfNWATElA==
::ZQ0/vhVqMQ3MEVWAtB9wSA==
::Zg8zqx1/OA3MEVWAtB9wSA==
::dhA7pRFwIByZRRnk
::Zh4grVQjdCmDJHqr2nYCBzdreiGqFUiPKpov19rezsmznWk4ZM4QQbPY1bqaMu8f1VPhfZ8uw3ZVi4UJFB44
::YB416Ek+ZG8=
::
::
::978f952a14a936cc963da21a135fa983
@echo off

rem Inicia backend en una consola minimizada
start "" /min cmd /c "cd /d C:\CONTROL_VEHICULOS_REACT\backend && npm start"

rem Inicia frontend en otra consola minimizada
start "" /min cmd /c "cd /d C:\CONTROL_VEHICULOS_REACT\frontend && npm run dev"

rem Espera 5 segundos para que ambos arranquen
timeout /t 5 >nul

rem Abre navegador apuntando a frontend (puerto 5173)
start "" "http://localhost:5173/login"

exit
