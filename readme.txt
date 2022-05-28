#how to create new project:

#javascript/React project
npx create-react-app my-new-app

OR directly create typescript/React project:
npx create-react-app my-app --template typescript

cd my-new-app
npm start

#install bootstrap
npm install react-bootstrap bootstrap@5.1.3
npm install react-bootstrap bootstrap

#install routing:
npm install --save react-router-dom@5 --save-exactnp
npm install --save-dev react-router-dom

#install style (eg for drawer):
npm install --save react-transition-group

#for http requests
npm install axios --save

#fix issues
npm audit fix

#wordpress table plugins:
https://kinsta.com/de/blog/wordpress-tabellen-plugins/

#example advanced filter:
https://kinsta.com/de/blog/wordpress-tabellen-plugins/

#lokale datenbank mit xampp
https://www.heise.de/download/blog/Wordpress-mit-XAMPP-auf-dem-eigenen-Rechner-ausprobieren-3286703

#install typescript 
npm install typescript --save-dev

#install react-native-datefield
npm install react-native-datefield --save-dev



### ERRORS AND SOLUTIONS ###

#fix vulnerabilities:
https://github.com/facebook/create-react-app/issues/11174
in package.json move react-scripts to devDependencies
npm audit --production

# 'React' must be in scope when using JSX
https://dev.to/chandelieraxel/why-do-react-need-to-be-in-scope-for-jsx-3hen