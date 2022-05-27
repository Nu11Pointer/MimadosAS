// Variables Globales
var rowSelected;
var employeeTable;
var employeeObj;
var phoneTable;
var phoneObj;
var emailTable;
var emailObj;

// Evento Document Loaded
document.addEventListener('DOMContentLoaded', function () {
    SetUp();
});

// Función Principal
function SetUp() {
    // Pintar Menu Collapse
    $('#nav-Employee').addClass('active');
    // $('#collapseFour').addClass('show');
    // $('#CollapseMenuItemEmployee').addClass('active');

    // Show DataTable
    Read();

    // Fill Selectors
    DeparmentLoad();
    BranchOfficeLoad();
    EmployeePositionLoad();

    // Crear Validaciones
    Validator();

    // Establecer Actualizar
    $("#dataTable tbody").on("click", '.btn-update', ShowUpdateModal);

    // Establecer Eliminar
    $("#dataTable tbody").on("click", '.btn-detelete', Delete);

    // Phone
    $("#dataTable tbody").on("click", '.btn-phone', ShowPhone);
    $("#dataTablePhone tbody").on("click", '.btn-update', ShowPhoneUpdate);
    $("#dataTablePhone tbody").on("click", '.btn-detelete', DeletePhone);

    // Email
    $("#dataTable tbody").on("click", '.btn-email', ShowEmail);
    $("#dataTableEmail tbody").on("click", '.btn-update', ShowEmailUpdate);
    $("#dataTableEmail tbody").on("click", '.btn-detelete', DeleteEmail);
}

function Read() {
    employeeTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Employee/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
            { "data": "BranchOffice.Name" },
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
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1"><i class="fas fa-trash"></i></button>' +
                    '<button type="button" class="btn btn-info btn-circle btn-sm ms-2 btn-email mr-1 mb-1"><i class="fas fa-envelope"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm ms-2 btn-phone mr-1 mb-1"><i class="fas fa-phone-alt"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function DeparmentLoad() {
    // Load Selector Department
    jQuery.ajax({
        url: '/Deparment/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#DepartmentUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    }).done(MunicipalityOnChange);
}

function MunicipalityOnChange() {

    $("#MunicipalityCreate option").remove();
    $("#MunicipalityUpdate option").remove();

    // Load Selector Municipality
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentCreate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityCreate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
    jQuery.ajax({
        url: '/Municipality/ReadByDepartment',
        type: "POST",
        data: JSON.stringify({ deparmentId: $("#DepartmentUpdate option:selected").val() }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#MunicipalityUpdate");
                try {
                    if (employeeObj.Municipality.Id != -1) {
                        $("#MunicipalityUpdate").val(employeeObj.Municipality.Id);
                        employeeObj.Municipality.Id = -1;
                    }
                } catch (e) { }
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function BranchOfficeLoad() {
    // Load Selector BranchOffice
    jQuery.ajax({
        url: '/BranchOffice/ReadBranchOffices',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#BranchOfficeCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#BranchOfficeUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function EmployeePositionLoad() {
    // Load Selector EmployeePositionLoad
    jQuery.ajax({
        url: '/EmployeePosition/Read',
        type: "GET",
        data: null,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $.each(data.data, function (_index, value) {
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#EmployeePositionCreate");
                $("<option>").attr({ "value": value.Id }).text(value.Name).appendTo("#EmployeePositionUpdate");
            })
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ShowCreateModal() {
    $("#IdentificationCreate").val("");
    $("#NameCreate").val("");
    $("#SurNameCreate").val("");
    $("#BranchOfficeCreate").val($("#BranchOfficeCreate option:first").val());
    $("#EmployeePositionCreate").val($("#EmployeePositionCreate option:first").val());
    $("#DepartmentCreate").val($("#DepartmentCreate option:first").val());
    $("#DepartmentCreate").trigger("change");
    $("#ActiveCreate").val(1);
    $("#AddressCreate").val("");
    $("#FormModalCreate").modal("show");
    $("#ErrorCreate").hide();
}

function Validator() {

    // Create Custom Rules

    jQuery.validator.addMethod("identification", function (value, element) {
        return this.optional(element) || /^((00[1-9])|(04[1-8])|(08[1-9])|(09[0-3])|(12[1-9])|(130)|(16[1-6])|(20[1-4])|(24[1-7])|(28[1-9])|(29[0-1])|(32[1-9])|(36[1-6])|(40[1-9])|(44[1-9])|(45[0-3])|(48[1-9])|(49[0-3])|(52[1-6])|(56[1-9])|(570)|(601)|(60[3-6])|(616)|(619)|(624)|(62[6-8])|(607)|(608)|(61[0-2])|(615)|(454)|(602))-((?!00)\d{2}){3}-(?!0000).{4}[A-Z]$/i.test(value);
    }, "El formato correcto es ###-ddmmyy-####A");

    jQuery.validator.addMethod("phoneNumber", function (value, element) {
        return this.optional(element) || /^[0-9]{4}-[0-9]{4}$/i.test(value);
    }, "El formato correcto es ####-####");

    jQuery.validator.addMethod("email", function (value, element) {
        return this.optional(element) || /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
    }, "Debes ingresar un correo electronico valido.");

    // Rules For ...
    $("#CreateForm").validate({
        rules: {
            IdentificationCreate: {
                required: true,
                identification: true
            },
            NameCreate: {
                required: true
            },
            SurNameCreate: {
                required: true,

            },
            AddressCreate: {
                required: true
            },
        },
        messages: {
            IdentificationCreate: {
                required: "- El campo \"Cédula\" es obligatorio."
            },
            NameCreate: {
                required: "- El campo \"Nombre\" es obligatorio."
            },
            SurNameCreate: {
                required: "- El campo \"Apellido\" es obligatorio."
            },
            AddressCreate: {
                required: "- El campo \"Dirección\" es obligatorio."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateForm").validate({
        rules: {
            IdentificationUpdate: {
                required: true,
                identification: true
            },
            NameUpdate: {
                required: true
            },
            SurNameUpdate: {
                required: true,

            },
            AddressUpdate: {
                required: true
            },
        },
        messages: {
            IdentificationUpdate: {
                required: "- El campo \"Cédula\" es obligatorio."
            },
            NameUpdate: {
                required: "- El campo \"Nombre\" es obligatorio."
            },
            SurNameUpdate: {
                required: "- El campo \"Apellido\" es obligatorio."
            },
            AddressUpdate: {
                required: "- El campo \"Dirección\" es obligatorio."
            }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#CreatePhoneForm").validate({
        rules: {
            PhoneCreate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneCreate: { required: "- El campo \"Telefono\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdatePhoneForm").validate({
        rules: {
            PhoneUpdate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneUpdate: { required: "- El campo \"Telefono\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#CreateEmailForm").validate({
        rules: {
            EmailCreate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailCreate: { required: "- El campo \"Correo\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });

    $("#UpdateEmailForm").validate({
        rules: {
            EmailUpdate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailUpdate: { required: "- El campo \"Correo\" es obligatorio." }
        },
        errorElement: "div",
        errorClass: "form-label",
        errorLabelContainer: ".alert-danger"
    });
}

function Create() {

    if (!$("#CreateForm").valid()) {
        return;
    }

    employeeObj = {
        "Id": 0,
        "EmployeePosition": {
            "Id": $("#EmployeePositionCreate option:selected").val()
        },
        "BranchOffice": {
            "Id": $("#BranchOfficeCreate option:selected").val()
        },
        "IdentityCard": $("#IdentificationCreate").val(),
        "Name": $("#NameCreate").val(),
        "SurName": $("#SurNameCreate").val(),
        "Address": $("#AddressCreate").val(),
        "Municipality": {
            "Id": $("#MunicipalityCreate option:selected").val()
        },
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Employee/Create',
        type: "POST",
        data: JSON.stringify({ employee: employeeObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");
            if (response.result) {
                employeeTable.ajax.reload();
            }
            else {
                swal("No Se Logró Crear El Empleado.", response.message, "error");
            }
        },
        error: function (error) {
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

    employeeObj = employeeTable.row(rowSelected).data();

    $("#IdentificationUpdate").val(employeeObj.IdentityCard);
    $("#NameUpdate").val(employeeObj.Name);
    $("#SurNameUpdate").val(employeeObj.SurName);
    $("#BranchOfficeUpdate").val(employeeObj.BranchOffice.Id);
    $("#EmployeePositionUpdate").val(employeeObj.EmployeePosition.Id);
    $("#DepartmentUpdate").val(employeeObj.Municipality.Department.Id);
    $("#DepartmentUpdate").trigger("change");
    $("#ActiveUpdate").val(employeeObj.Active ? 1 : 0);
    $("#AddressUpdate").val(employeeObj.Address);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    employeeObj = {
        "Id": employeeObj.Id,
        "EmployeePosition": {
            "Id": $("#EmployeePositionUpdate option:selected").val()
        },
        "BranchOffice": {
            "Id": $("#BranchOfficeUpdate option:selected").val()
        },
        "IdentityCard": $("#IdentificationUpdate").val(),
        "Name": $("#NameUpdate").val(),
        "SurName": $("#SurNameUpdate").val(),
        "Address": $("#AddressUpdate").val(),
        "Municipality": {
            "Id": $("#MunicipalityUpdate option:selected").val()
        },
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Employee/Update',
        type: "POST",
        data: JSON.stringify({ employee: employeeObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");
            if (response.result) {

                employeeTable.ajax.reload();
            }
            else {
                swal("No Se Logró Actualizar el empleado.", response.message, "error");
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

function Delete() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    employeeObj = employeeTable.row(rowSelected).data();

    swal({
        title: "Eliminar Empleado",
        text: "¿Estas Seguro que Deseas Eliminar Este Empleado?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function () {

            jQuery.ajax({
                url: '/Employee/Delete',
                type: "POST",
                data: JSON.stringify({ employee: employeeObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        employeeTable.ajax.reload();
                    }
                    else {
                        swal("No Se Logró Eliminar el empleado.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}

function ShowPhone() {
    $("#FormModalPhone").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    employeeObj = employeeTable.row(rowSelected).data();

    if (phoneTable != null) {
        phoneTable.destroy();
    }

    phoneTable = $('#dataTablePhone').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/EmployeePhone/ReadByEmployeId',
            type: "POST",
            data: { employeeId: employeeObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "PhoneNumber" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
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

function ShowPhoneCreate() {
    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneCreate").modal("show");

    $("#PhoneCreate").val("");
    $("#ActivePhoneCreate").val(1);
    $("#ErrorPhoneCreate").hide();
}

function CreatePhone() {

    if (!$("#CreatePhoneForm").valid()) {
        return;
    }

    phoneObj = {
        "Employee": employeeObj,
        "PhoneNumber": $("#PhoneCreate").val(),
        "Active": $("#ActivePhoneCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/EmployeePhone/Create',
        type: "POST",
        data: JSON.stringify({ employeePhone: phoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneCreate").modal("hide");
                $("#FormModalPhone").modal("show");
                phoneTable.ajax.reload();
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneCreate").modal("hide");
                swal({
                    title: "No Logró Añadir el Teléfono.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhoneCreate").modal("show");
                    });
            }
        },
        error: function (error) {
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

function ShowPhoneUpdate() {

    $("#FormModalPhone").modal("hide");
    $("#FormModalPhoneUpdate").modal("show");
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    phoneObj = phoneTable.row(rowSelected).data();

    $("#PhoneUpdate").val(phoneObj.PhoneNumber);
    $("#ActivePhoneUpdate").val(phoneObj.Active ? 1 : 0);
    $("#ErrorPhoneUpdate").hide();
}

function UpdatePhone() {

    if (!$("#UpdatePhoneForm").valid()) {
        return;
    }

    phoneObj = {
        "Id": phoneObj.Id,
        "Employee": employeeObj,
        "PhoneNumber": $("#PhoneUpdate").val(),
        "Active": $("#ActivePhoneUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/EmployeePhone/Update',
        type: "POST",
        data: JSON.stringify({ employeePhone: phoneObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneUpdate").modal("hide");
                $("#FormModalPhone").modal("show");
                phoneTable.ajax.reload();
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalPhoneUpdate").modal("hide");
                swal({
                    title: "No Logró Actualizar el Teléfono.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhoneUpdate").modal("show");
                    });
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

function DeletePhone() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    phoneObj = phoneTable.row(rowSelected).data();

    $("#FormModalPhone").modal("hide");

    swal({
        title: "Eliminar Teléfono",
        text: "¿Estas Seguro que Deseas Eliminar este teléfono?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function (inputValue) {

            if (!inputValue) {
                $("#FormModalPhone").modal("show");
                return
            }

            jQuery.ajax({
                url: '/EmployeePhone/Delete',
                type: "POST",
                data: JSON.stringify({ employeePhone: phoneObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        phoneTable.ajax.reload();
                        $("#FormModalPhone").modal("show");
                    }
                    else {
                        swal("No Logró Eliminar el teléfono.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}

function ShowEmail() {
    $("#FormModalEmail").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    employeeObj = employeeTable.row(rowSelected).data();

    if (emailTable != null) {
        emailTable.destroy();
    }

    emailTable = $('#dataTableEmail').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/EmployeeEmail/ReadByEmployeId',
            type: "POST",
            data: { employeeId: employeeObj.Id }
        },
        "columns": [
            { "data": "Id" },
            { "data": "Email" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h4><span class="badge badge-success">Habilitado</span></h4>';
                    else
                        return '<h4><span class="badge badge-danger">Deshabilitado</span></h4>';
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

function ShowEmailCreate() {
    $("#FormModalEmail").modal("hide");
    $("#FormModalEmailCreate").modal("show");

    $("#EmailCreate").val("");
    $("#ActiveEmailCreate").val(1);
    $("#ErrorEmailCreate").hide();
}

function CreateEmail() {

    if (!$("#CreateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Employee": employeeObj,
        "Email": $("#EmailCreate").val(),
        "Active": $("#ActiveEmailCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/EmployeeEmail/Create',
        type: "POST",
        data: JSON.stringify({ employeeEmail: emailObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailCreate").modal("hide");
                $("#FormModalEmail").modal("show");
                emailTable.ajax.reload();
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailCreate").modal("hide");
                swal({
                    title: "No Logró Añadir el Correo.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalEmailCreate").modal("show");
                    });
            }
        },
        error: function (error) {
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

function ShowEmailUpdate() {

    $("#FormModalEmail").modal("hide");
    $("#FormModalEmailUpdate").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    emailObj = emailTable.row(rowSelected).data();

    $("#EmailUpdate").val(emailObj.Email);
    $("#ActiveEmailUpdate").val(emailObj.Active ? 1 : 0);
    $("#ErrorEmailUpdate").hide();
}

function UpdateEmail() {

    if (!$("#UpdateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Id": emailObj.Id,
        "Employee": employeeObj,
        "Email": $("#EmailUpdate").val(),
        "Active": $("#ActiveEmailUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/EmployeeEmail/Update',
        type: "POST",
        data: JSON.stringify({ employeeEmail: emailObj }),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {

            if (response.result) {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailUpdate").modal("hide");
                $("#FormModalEmail").modal("show");
                emailTable.ajax.reload();
            }
            else {
                $(".modal-body").LoadingOverlay("hide");
                $("#FormModalEmailUpdate").modal("hide");
                swal({
                    title: "No Logró Actualizar el Correo.",
                    text: response.message,
                    type: "error",
                    showCancelButton: true,
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalEmailUpdate").modal("show");
                    });
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

function DeleteEmail() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    emailObj = emailTable.row(rowSelected).data();

    $("#FormModalEmail").modal("hide");

    swal({
        title: "Eliminar Correo",
        text: "¿Estas Seguro que Deseas Eliminar este Correo?",
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-primary",
        confirmButtonText: "Si",
        cancelButtonText: "No",
        closeOnConfirm: true
    },
        function (inputValue) {

            if (!inputValue) {
                $("#FormModalEmail").modal("show");
                return
            }

            jQuery.ajax({
                url: '/EmployeeEmail/Delete',
                type: "POST",
                data: JSON.stringify({ employeeEmail: emailObj }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (response) {

                    if (response.result) {
                        emailTable.ajax.reload();
                        $("#FormModalEmail").modal("show");
                    }
                    else {
                        swal("No Logró Eliminar el Correo.", response.message, "error");
                    }
                },
                error: function (error) {
                    console.log(error);
                },
                beforeSend: function () { }
            });

        });
}
