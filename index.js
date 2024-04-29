(async function () {
  const data = await fetch("./data.json");
  const res = await data.json();

  let employees = res;
  let selectedEmployeeId = employees[0].id;
  let selectedEmployee = employees[0];

  const employeeList = document.querySelector(".employees-list");
  const employeeInfo = document.querySelector(".employee-info");

  //add employee
  const createEmployee = document.querySelector(".create-employee");
  const addEmployeeModal = document.querySelector(".add-employee");
  const addEmployeeForm = document.querySelector(".add-employee-form");

  createEmployee.addEventListener("click", () => {
    addEmployeeModal.style.display = "flex";
  });

  addEmployeeModal.addEventListener("click", (e) => {
    if (e.target.className === "add-employee") {
      addEmployeeModal.style.display = "none";
    }
  });

  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addEmployeeForm);
    const values = [...formData.entries()];
    let empData = {};
    values.forEach((val) => {
      empData[val[0]] = val[1];
    });
    empData.id = employees[employees.length - 1].id + 1;
    empData.age =
      new Date().getFullYear() - parseInt(empData.dob.slice(0, 4), 10);
    empData.imageUrl =
      empData.imageUrl || "https://cdn-icons-png.flaticon.com/512/0/93.png";
    employees.push(empData);
    renderEmployees();
    addEmployeeForm.reset();
    addEmployeeModal.style.display = "none";
  });

  //select employee
  const selectEmployee = (e) => {
    if (e.target.tagName === "SPAN" && selectedEmployeeId !== e.target.id) {
      selectedEmployeeId = e.target.id;
      renderEmployees();
      renderSingleEmployee();
    }

    //delete employee
    if (e.target.tagName === "I") {
      employees = employees.filter(
        (emp) => String(emp.id) !== e.target.parentNode.id
      );
      if (String(selectedEmployeeId) === e.target.parentNode.id) {
        selectedEmployeeId = employees[0]?.id || -1;
        selectedEmployee = employees[0] || {};
        renderSingleEmployee();
      }
      renderEmployees();
    }
  };
  employeeList.addEventListener("click", selectEmployee);

  //employee info
  const renderSingleEmployee = () => {
    if (selectedEmployeeId === -1) {
      employeeInfo.innerHTML = "";
      return;
    }

    employeeInfo.innerHTML = `
    <img src="${selectedEmployee.imageUrl}" />
    <span class='employee-single-heading'>${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.age})</span>
    <span>${selectedEmployee.address}</span>
    <span>Mobile - ${selectedEmployee.contactNumber}</span>
    <span>DOB - ${selectedEmployee.dob}</span>
    <span>${selectedEmployee.email}</span>
    `;
  };

  //render
  const renderEmployees = () => {
    employeeList.innerHTML = "";
    employees.forEach((emp) => {
      const employee = document.createElement("span");
      employee.classList.add("employees-list-item");

      if (parseInt(selectedEmployeeId, 10) === emp.id) {
        employee.classList.add("selected");
        selectedEmployee = emp;
      }

      employee.setAttribute("id", emp.id);
      employee.innerHTML = `${emp.firstName}  ${emp.lastName} <i class='delete-employee-icon'>❌</i>`;
      employeeList.append(employee);
    });
  };
  renderEmployees();
  if (selectedEmployee) renderSingleEmployee();
})();
