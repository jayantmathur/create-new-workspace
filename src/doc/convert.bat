@echo off

if (%1) == () exit

echo Converting %1
call quarto convert %1
