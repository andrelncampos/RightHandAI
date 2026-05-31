#!/bin/bash
cd "$(dirname "$0")"
# macOS Gatekeeper: na primeira execucao, o usuario precisa clicar com
# botao direito no binario e selecionar "Open" para permitir a execucao
./RightHandAi --desktop
