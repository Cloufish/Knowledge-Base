#!/bin/bash
knowledge_base_dir="$HOME/Projects/knowledge-base/content/garden"
vimwiki_dir="$HOME/Projects/vimwiki/📋 PUBLISHING"

rm -rf "${knowledge_base_dir:?}"/*
cp -r "$vimwiki_dir"/* "$knowledge_base_dir"
cd "$knowledge_base_dir" || exit

npm run deploy
git add -A
git commit -m "Update"
git push origin main
