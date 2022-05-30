// Variables Globales
var rowSelected;
var usersTable;
var userObj;
var employeeTable;
var employeeObj;
var employeeEmailTable;
var employeeEmailObj;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    // $('#nav-Employee').addClass('active');
    // $('#collapseFour').addClass('show');
    // $('#CollapseMenuItemEmployee').addClass('active');
    // Show DataTables
    Read();
    LoadEmployee();

    // Establecer Actualizar
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);

    // Establecer Eliminar
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);
}

function Read() {
    usersTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/User/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Employee.Id" },
            { "data": "Employee.FullName" },
            { "data": "Employee.BranchOffice.Name" },
            { "data": "Employee.EmployeePosition.Name" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1"><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function ShowEmployeeCreate() {
    $("#FormModalEmployee").modal("show");
    employeeTable.ajax.reload();
    employeeTable.columns.adjust().responsive.recalc();
}

function LoadEmployee() {
    employeeTable = $('#dataTableEmployee').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Employee/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            {
                "data": "Id", render: function (_, _, row, _) {
                    return "<button class='btn btn-sm btn-success' type='button' onclick='employeeSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>"
                },
                "orderable": false,
                "searchable": false
            },
            { "data": "Id" },
            { "data": "FullName" },
            { "data": "EmployeePosition.Name" },
            { "data": "BranchOffice.Name" }
        ],
        "columnDefs": [
            { "width": "10%", "targets": [0, 1] }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[3, "asc"]]
    });
}

function employeeSelect(json) {
    employeeObj = json;
    $("#FormModalEmployee").modal("hide");
    ShowEmailCreate();
}

function ShowEmailCreate() {
    $("#FormModalEmployeeEmailCreate").modal("show");
    LoadEmployeeEmailCreate(employeeObj.Id);
}

function LoadEmployeeEmailCreate(employeeId) {

    if ($.fn.DataTable.isDataTable('#dataTableEmployeeEmailCreate')) {
        $('#dataTableEmployeeEmailCreate').DataTable().destroy();
    }

    employeeEmailTable = $('#dataTableEmployeeEmailCreate').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/EmployeeEmail/ReadByEmployeId',
            type: "POST",
            data: { employeeId: employeeId }
        },
        "columns": [
            {
                "data": "Id", render: function (_, _, row, _) {
                    return "<button class='btn btn-sm btn-success' type='button' onclick='employeeEmailSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>"
                },
                "orderable": false,
                "searchable": false
            },
            { "data": "Id" },
            { "data": "Email" }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[1, "asc"]]
    });
}

function employeeEmailSelect(json) {
    employeeEmailObj = json;
    $("#FormModalEmployeeEmailCreate").modal("hide");
    showUserCreate();
}

function showUserCreate() {
    $("#FormModalCreate").modal("show");
    $("#ErrorCreate").hide();
    $("#ActiveCreate").val(1);
    $("#EmailCreate").val(employeeEmailObj.Email);
    $("#EmployeeNameCreate").val(employeeObj.FullName);
    $("#BranchOfficeCreate").val(employeeObj.BranchOffice.Name);
    $("#EmployeePositionCreate").val(employeeObj.EmployeePosition.Name);
}

// Crear Usuario
function Create() {

    // Crear Objeto Usuario
    userObj = {
        "Employee": employeeObj,
        "EmployeeEmail": employeeEmailObj,
        "Password": "",
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    // Realizar La Petición
    jQuery.ajax({
        url: '/User/Create',
        type: "POST",
        data: JSON.stringify({ user: userObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                usersTable.ajax.reload();
                successAudio.play();
                swal("Buen trabajo!", "Haz creado un nuevo usuario!", "success")
            }
            // Sino entonces notificar
            else {
                errorAudio.play();
                swal("¡Algo salió mal!", response.message, "error");
            }
        },
        error: function (error) {
            errorAudio.play();
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorCreate").text(error.responseText);
            $("#ErrorCreate").show();
        },
        beforeSend: function () {
            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowUpdateModal() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    userObj = usersTable.row(rowSelected).data();
    employeeEmailObj = userObj.EmployeeEmail;
    employeeObj = userObj.Employee;

    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
    $("#ActiveUpdate").val(userObj.Active ? 1 : 0);
    $("#EmailUpdate").val(employeeEmailObj.Email);
    $("#EmployeeNameUpdate").val(employeeObj.FullName);
    $("#BranchOfficeUpdate").val(employeeObj.BranchOffice.Name);
    $("#EmployeePositionUpdate").val(employeeObj.EmployeePosition.Name);
}

function Update() {

    // Crear Objeto Usuario
    userObj = {
        "Employee": employeeObj,
        "EmployeeEmail": employeeEmailObj,
        "Password": "",
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    // Realizar La Petición
    jQuery.ajax({
        url: '/User/Update',
        type: "POST",
        data: JSON.stringify({ user: userObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                usersTable.ajax.reload();
                successAudio.play();
                swal("Buen trabajo!", "Haz actualizado el usuario!", "success");
            }
            // Sino entonces notificar
            else {
                swal("¡Algo salió mal!", response.message, "error");
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {
            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

function ShowEmailUpdate() {
    $("#FormModalUpdate").modal("hide");
    $("#FormModalEmployeeEmailUpdate").modal("show");
    LoadEmployeeEmailUpdate(employeeObj.Id);
}

function LoadEmployeeEmailUpdate(employeeId) {

    if ($.fn.DataTable.isDataTable('#dataTableEmployeeEmailUpdate')) {
        $('#dataTableEmployeeEmailUpdate').DataTable().destroy();
    }

    employeeEmailTable = $('#dataTableEmployeeEmailUpdate').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/EmployeeEmail/ReadByEmployeId',
            type: "POST",
            data: { employeeId: employeeId }
        },
        "columns": [
            {
                "data": "Id", render: function (_, _, row, _) {
                    return "<button class='btn btn-sm btn-success' type='button' onclick='employeeEmailUpdateSelect(" + JSON.stringify(row) + ")'><i class='fas fa-check'></i></button>"
                },
                "orderable": false,
                "searchable": false
            },
            { "data": "Id" },
            { "data": "Email" }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        },
        "order": [[1, "asc"]]
    });
}

function employeeEmailUpdateSelect(json) {
    employeeEmailObj = json;
    $("#FormModalEmployeeEmailUpdate").modal("hide");
    $("#FormModalUpdate").modal("show");
    $("#EmailUpdate").val(employeeEmailObj.Email);
}

function ResendPassword() {
    // Realizar La Petición
    jQuery.ajax({
        url: '/User/ResendPassword',
        type: "POST",
        data: JSON.stringify({ user: userObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                usersTable.ajax.reload();
                successAudio.play();
                swal("Buen trabajo!", "Hemos enviado al correo una nueva contraseña!", "success");
            }
            // Sino entonces notificar
            else {
                swal("¡Algo salió mal!", response.message, "error");
            }
        },
        error: function (error) {
            $(".modal-body").LoadingOverlay("hide");
            $("#ErrorUpdate").text(error.responseText);
            $("#ErrorUpdate").show();
        },
        beforeSend: function () {
            $(".modal-body").LoadingOverlay("show", {
                imageResizeFactor: 2,
                text: "Cargando...",
                size: 14
            });
        }
    });
}

// Borrar Producto
function Delete() {
    // Seleccionar Fila Con La Información Requerida
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    // Crear Objeto
    userObj = usersTable.row(rowSelected).data();

    warningAudio.play();
    // Preguntar antes de eliminar
    swal({
        title: "¿Estás seguro?",
        text: "¡No podrás recuperar este usuario!",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        confirmButtonText: "¡Sí, bórralo!",
        cancelButtonText: "¡No, cancela por favor!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
        function (isConfirm) {
            // Si el usuario confirma entonces eliminarlo
            if (isConfirm) {
                jQuery.ajax({
                    url: '/User/Delete',
                    type: "POST",
                    data: JSON.stringify({ user: userObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal("¡Eliminado!", "Su usuario ha sido eliminado.", "success");
                            usersTable.ajax.reload();
                        }
                        // Sino Entonces Notificar Error
                        else {
                            errorAudio.play();
                            if (response.message.includes("\"FK__SaleDetai__Produ__0A9D95DB\"")) {
                                swal("¡Algo salió mal!", "El producto que tratas de eliminar está siendo utilizado. Intenta deshabilitarlo.", "error");
                            }
                            else {
                                swal("¡Algo salió mal!", response.message, "error");
                            }
                        }
                    },
                    error: function (error) {
                        errorAudio.play();
                        console.log(error);
                    },
                    beforeSend: function () { }
                });
            }
            // Sino entonces notificar la cancelación
            else {
                swal.close();
            }
        }
    );
}
