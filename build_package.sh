#!/bin/sh -e

ng build --configuration production
cp -r ../esgbu-api dist/esgbu-webapp/api
cd dist/esgbu-webapp/api
rm -rf .idea .gitlab-ci.yaml .gitignore .git var nbproject database.export database_export public/database.export .settings .scannerwork
rm -rf updates.db esgbu_documentary_structures.json esgbu_institutions.json
rm -rf esgbu_physical_libraries.json esgbu_mapping_*.json public/editorial_files public/database_export.info
rm -rf public/database_export.lock public/table_export public/database_export sql/esgbu-values.sql Mercure/mercure.db
rm -rf public/pdf_export public/routes_files
cd ..
zip -r esgbu-webapp . -x "[a-z][a-z].[a-z0-9]*.svg" "[a-z][a-z]-[a-z][a-z].[a-z0-9]*.svg" "[a-z][a-z]-[a-z][a-z][a-z].[a-z0-9]*.svg"
zip -u esgbu-webapp.zip fr.*.svg gb.*.svg

