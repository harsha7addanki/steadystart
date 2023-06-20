import * as inquirer from 'inquirer';
import * as fs from 'node:fs/promises';
import { exec } from 'child_process';
import Spinnies from 'spinnies';
import chalk from 'chalk';
const spinners = new Spinnies();
console.log(chalk.blueBright("\r\n _____ _____ _____  ___ ________   __\r\n\/  ___|_   _|  ___|\/ _ \\|  _  \\ \\ \/ \/\r\n\\ `--.  | | | |__ \/ \/_\\ \\ | | |\\ V \/ \r\n `--. \\ | | |  __||  _  | | | | \\ \/  \r\n\/\\__\/ \/ | | | |___| | | | |\/ \/  | |  \r\n\\____\/  \\_\/ \\____\/\\_| |_\/___\/   \\_\/  \r\n                                     \r\n                                     \r\n _____ _____ ___  ______ _____       \r\n\/  ___|_   _\/ _ \\ | ___ \\_   _|      \r\n\\ `--.  | |\/ \/_\\ \\| |_\/ \/ | |        \r\n `--. \\ | ||  _  ||    \/  | |        \r\n\/\\__\/ \/ | || | | || |\\ \\  | |        \r\n\\____\/  \\_\/\\_| |_\/\\_| \\_| \\_\/"));
inquirer.default
    .prompt([
    {
        name: 'projectName',
        message: 'What Should Be the Name of Your Project'
    },
    {
        type: "list",
        name: 'projectUIType',
        message: 'What Should Be the UI of Your Project',
        choices: [
            'minute.js',
            'JSX'
        ]
    },
    {
        type: 'checkbox',
        name: 'extraModules',
        message: 'Which extra APIS whould you like in your project?',
        choices: [
            'prisma', 'aws-sdk', 'firebase', 'graphql', 'twilio', 'stripe',
        ],
    },
])
    .then(async (answers) => {
    spinners.add("dir", {
        spinnerColor: "green",
        text: "Making Project Dir"
    });
    spinners.add("npminit", {
        spinnerColor: "green",
        text: "Initalising NPM"
    });
    await fs.mkdir(answers.projectName);
    process.chdir(answers.projectName);
    spinners.succeed("dir", {
        text: "Directory Created"
    });
    spinners.add("views", { text: "creating views" });
    spinners.add("controllers", { text: "creating controllers" });
    fs.mkdir("views").then(() => {
        fs.writeFile("views/ExampleView.ts", `import { createElement } from \'@steadyjs\/minute\'\r\n\r\nfunction ExampleView(){\r\n   return createElement(\"h1\",\"Hello, World\")\r\n}`);
        spinners.succeed("views", { text: "Created views" });
    });
    fs.mkdir("controllers").then(() => {
        spinners.succeed("controllers", { text: "created controllers" });
    });
    exec("npm init -y", (error, stdout, stderr) => {
        if (error) {
            spinners.fail("npminit", {
                text: `NPM Initialisation failed: ${error}`
            });
            return;
        }
        if (stderr) {
            spinners.fail("npminit", {
                text: `NPM Initialisation failed: ${stderr}`
            });
            return;
        }
        spinners.succeed("npminit", {
            text: "NPM Initialised"
        });
        if (answers.extraModules.length != 0) {
            spinners.add("npminstall", {
                spinnerColor: "green",
                text: "Installing npm packages"
            });
            let packed_packages = '';
            for (let module of answers.extraModules) {
                packed_packages += module + " ";
            }
            exec(`npm i ${packed_packages}`, (error, stdout, stderr) => {
                if (stderr) {
                    spinners.fail("npminstall", { text: `NPM Package Install Failed: ${stderr}` });
                    return;
                }
                if (error) {
                    spinners.fail("npminstall", { text: `NPM Package Install Failed: ${error}` });
                    return;
                }
                spinners.succeed("npminstall", { text: "NPM Install Success" });
            });
        }
        spinners.add();
    });
});
