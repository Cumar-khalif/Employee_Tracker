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
    console.log("Viewing All Departments")

    connection.promise().query("SELECT * FROM department")
        .then(([rows]) => {
            const result = rows;
            console.table(result)
            start();
        })
}

function viewAllRoles() {
    console.log("Viewing All Roles")

    connection.promise().query("SELECT * FROM role")
        .then(([rows]) => {
            const result = rows;
            console.table(result)
            start();
        })
}

function viewAllEmployees() {
    console.log("Viewing All Employees")

    connection.promise().query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;")
    //  connection.promise().query("SELECT * FROM employee")

// // Select emp.id as EmployeeID, concat(emp.first_name,"  ",emp.last_name ) as EmployeeName , ro.title as Job_tittle, ro.salary as Salary,dept.name as Department_Name,concat(emp2.first_name,"  ",emp2.last_name) as ManagerName from employee_tracker.employee as emp left join employee_tracker.employee as emp2 on emp2.id=emp.manager_id left join employee_tracker.Role as ro on emp.role_id=ro.id left join employee_tracker.department as dept on dept.id = ro.department_id'

    .then(([rows]) => {
        const result = rows;
        console.table(result)
        start();
    })
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
    let roleData = {
        title:"",
        salary: 0,
        department_id: null
    }

    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "What is the employee title?"
        },
        {
            type: "input",
            name: "salary",
            message: "What is the salary"
        },
        {
            type: "input",
            name: "department_id",
            message: "What department?"
        }
])
    .then((answer) => {
        roleData.title = answer.title;
        roleData.salary = answer.salary;
        roleData.department_id = answer.department_id;

        connection.promise().query("INSERT INTO role SET ?", roleData)
            .then(([rows]) => {
                const result = rows;
                console.log("Successfully added a role!")
                start();
            })
    })
}

function addEmployee() {
    console.log("Add Employee")
    let employeeData = {
        first_name:"",
        last_name: "",
        role_id: null,
        manager_id: null
    }

    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee last name"
        },
        {
            type: "input",
            name: "role_id",
            message: "What is the employee role id?"
        },
        {
            type: "input",
            name: "manager_id",
            message: "What is your manager id?"
        } 
])
    .then((answer) => {
        employeeData.first_name = answer.first_name;
        employeeData.last_name = answer.last_name;
        employeeData.role_id = answer.role_id;
        employeeData.manager_id = answer.manager_id

        connection.promise().query("INSERT INTO employee SET ?", employeeData)
            .then(([rows]) => {
                const result = rows;
                console.log("Successfully added an employee!")
                start();
            })
    })
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
                "Add Department",
                "Add Role",
                "Add Employee",
                "View All Departments",
                "View All Roles",
                "View All Employees",
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
                    viewAllRoles();
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