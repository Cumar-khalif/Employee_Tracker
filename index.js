const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

// establise a db connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Apple125',
    database: 'employees'
})

connection.connect(function (err,) {
    if (err) throw err;
})

async function viewAllDepartments() {
    console.log("View All Departments")

    connection.promise().query("SELECT * FROM department")
        .then(([rows]) => {
            const result = rows;
            console.table(result)
            start();
        })
}

function viewAllRoles() {
    console.log("View All Roles")
}

function viewAllEmployees() {
    console.log("View All Employees")
}

function addDepartment() {
    console.log("Add Department")

    let departmentData = {
        name: ""
    }

    inquirer.prompt([{
        type: "input",
        name: "name",
        message: "What is the name of the new department?"
    }])
    .then((answer) => {
        departmentData.name = answer.name

        connection.promise().query("INSERT INTO department SET ?", departmentData)
            .then(([rows]) => {
                const result = rows;
                console.log("Successfully added a department!")
                start();
            })
    })

}

function addRole() {
    console.log("Add Role")
}

function addEmployee() {
    console.log("Add Employee")
}

function updateEmployeeRole() {
    console.log("Update Employee Role")
}



function start() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Exit"
            ]
        }
    ])
        .then((answer) => {
            switch (answer.action) {
                case "View All Departments":
                    viewAllDepartments();
                    break;
                case "View All Roles":
                    viewRoleAllRoles();
                    break;
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Add Role":
                    addRole();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                default:
                    console.log("Goodbye!");
                    process.exit(1)
                    break;
            }
        })
}


start();