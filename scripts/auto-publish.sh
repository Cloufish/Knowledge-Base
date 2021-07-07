#!/bin/bash
knowledge_base_dir="~/Projects/knowledge-base/content/garden"
vimwiki_dir="~/Projects/vimwiki/📋 PUBLISHING"

rm -rf "$knowledge_base_dir"/*
cp "$vimwiki_dir"/* "$knowledge_base_dir"
cd "$knowledge_base_dir"

npm run deploy
git add -A
git commit -m "Update"
git push origin main
