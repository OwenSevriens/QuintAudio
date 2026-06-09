#!/bin/bash

# Navigeer naar de map van dit script
cd "$(dirname "$0")"

echo "📁 Map: $(pwd)"
echo ""

# Git initialiseren
echo "▶ git init..."
git init

echo ""
echo "▶ Bestanden toevoegen..."
git add .

echo ""
echo "▶ Eerste commit aanmaken..."
git commit -m "eerste commit"

echo ""
echo "▶ Verbinden met GitHub..."
git remote add origin https://github.com/OwenSevriens/QuintAudio.git 2>/dev/null || echo "(remote bestaat al, wordt overgeslagen)"

echo ""
echo "▶ Branch hernoemen naar main..."
git branch -M main

echo ""
echo "▶ Pushen naar GitHub..."
echo "   → Voer je GitHub gebruikersnaam in: OwenSevriens"
echo "   → Voer je Personal Access Token in als wachtwoord"
echo ""
git push -u origin main

echo ""
echo "✅ Klaar! Je website staat nu op GitHub."
echo "   https://github.com/OwenSevriens/QuintAudio"
echo ""
read -p "Druk op Enter om dit venster te sluiten..."
