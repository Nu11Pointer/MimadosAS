// Variables Globales
var rowSelected;
var employeeTable;
var employeeObj;
var phoneTable;
var phoneObj;
var emailTable;
var emailObj;
var CreateForm;
var UpdateForm;
var CreatePhoneForm;
var UpdatePhoneForm;
var CreateEmailForm;
var UpdateEmailForm;

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
            { "data": "FullName" },
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
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1 data-toggle="tooltip" title="Editar empleado""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar empleado""><i class="fas fa-trash"></i></button>' +
                    '<button type="button" class="btn btn-info btn-circle btn-sm ms-2 btn-email mr-1 mb-1 data-toggle="tooltip" title="Ver correo""><i class="fas fa-envelope"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm ms-2 btn-phone mr-1 mb-1 data-toggle="tooltip" title="Ver teléfono""><i class="fas fa-phone-alt"></i></button>',
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
    CreateForm.resetForm();
    $("#FormModalCreate").modal("show");
    $("#ErrorCreate").hide();
}

function Validator() {

    // Create Custom Rules

    jQuery.validator.addMethod("identification", function (value, element) {
        var date = moment(value.substring(4, 10), "DDMMYY");
        return this.optional(element) || /^((00[1-9])|(04[1-8])|(08[1-9])|(09[0-3])|(12[1-9])|(130)|(16[1-6])|(20[1-4])|(24[1-7])|(28[1-9])|(29[0-1])|(32[1-9])|(36[1-6])|(40[1-9])|(44[1-9])|(45[0-3])|(48[1-9])|(49[0-3])|(52[1-6])|(56[1-9])|(570)|(601)|(60[3-6])|(616)|(619)|(624)|(62[6-8])|(607)|(608)|(61[0-2])|(615)|(454)|(602))-((?!00)\d{2}){3}-(?!0000).{4}[A-Z]$/i.test(value) && date.isValid();
    }, "Ingrese una cédula válida.");

    jQuery.validator.addMethod("phoneNumber", function (value, element) {
        return this.optional(element) || /^[0-9]{4}-[0-9]{4}$/i.test(value);
    }, "Ingrese un teléfono válido.");

    jQuery.validator.addMethod("email", function (value, element) {
        return this.optional(element) || /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(value);
    }, "Ingrese un correo válido.");

    // Rules For ...
    CreateForm = $("#CreateForm").validate({
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
                required: "Este campo es obligatorio."
            },
            NameCreate: {
                required: "Este campo es obligatorio."
            },
            SurNameCreate: {
                required: "Este campo es obligatorio."
            },
            AddressCreate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    UpdateForm = $("#UpdateForm").validate({
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
                required: "Este campo es obligatorio."
            },
            NameUpdate: {
                required: "Este campo es obligatorio."
            },
            SurNameUpdate: {
                required: "Este campo es obligatorio."
            },
            AddressUpdate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    CreatePhoneForm = $("#CreatePhoneForm").validate({
        rules: {
            PhoneCreate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneCreate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    UpdatePhoneForm = $("#UpdatePhoneForm").validate({
        rules: {
            PhoneUpdate: {
                required: true,
                phoneNumber: true
            }
        },
        messages: {
            PhoneUpdate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    CreateEmailForm = $("#CreateEmailForm").validate({
        rules: {
            EmailCreate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailCreate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    UpdateEmailForm = $("#UpdateEmailForm").validate({
        rules: {
            EmailUpdate: {
                required: true,
                email: true
            }
        },
        messages: {
            EmailUpdate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
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
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalCreate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has creado un nuevo empleado!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        employeeTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
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
    UpdateForm.resetForm();
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
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalUpdate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has actualizado el empleado!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        employeeTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
                    confirmButtonClass: "btn-danger",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
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

function Delete() {

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    employeeObj = employeeTable.row(rowSelected).data();

    if (!employeeObj.Active) {
        warningAudio.play();
        swal("Información", "El emplado se encuentra deshabilitado, no puede realizar esta acción.", "info");
        return;
    }

    warningAudio.play();
    // Preguntar antes de eliminar
    swal({
        title: "Eliminar Empleado",
        text: "¡No podrás recuperar este empleado!",
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
                    url: '/Employee/Delete',
                    type: "POST",
                    data: JSON.stringify({ employee: employeeObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "Su empleado ha sido eliminado.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    employeeTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            if (response.message.includes("\"FK__Sale__EmployeeId__03F0984C\"")) {
                                text = "El empleado que tratas de eliminar está siendo utilizado en el registro de ventas.";
                            }
                            if (response.message.includes("\"FK__Purchase__Employ__44952D46\"")) {
                                text = "El empleado que tratas de eliminar está siendo utilizado en el registro de compras.";
                            }
                            if (response.message.includes("\"FK__EmployeeE__Emplo__4CA06362\"")) {
                                text = "El empleado que tratas de eliminar está siendo utilizado.";
                            }
                            errorAudio.play();
                            swal({
                                title: "¡Algo salió mal!",
                                text: text,
                                type: "error",
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            });
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    beforeSend: function () { }
                });
            }
            // Sino entonces notificar la cancelación
            else {
                swal("Cancelado", "Su empleado está intacto.", "info");
            }
        }
    );
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
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1  data-toggle="tooltip" title="Editar teléfono""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1  data-toggle="tooltip" title="Eliminar teléfono""><i class="fas fa-trash"></i></button>',
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
    CreatePhoneForm.resetForm();
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

            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalPhoneCreate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has creado un nuevo teléfono!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        phoneTable.ajax.reload();
                        $("#FormModalPhone").modal("show");
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Employee__85FB4E38DE444818'")) {
                    text = "El teléfono que intenta agregar ya existe.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
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
    UpdatePhoneForm.resetForm();
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
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalPhoneUpdate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has actualizado el teléfono!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhone").modal("show");
                        phoneTable.ajax.reload();
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Employee__85FB4E38DE444818'")) {
                    text = "El teléfono al que intenta utilizar ya existe.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
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

    if (!phoneObj.Active) {
        warningAudio.play();
        swal({
            title: "Información",
            text: "El teléfono se encuentra deshabilitado, no puede realizar esta acción.",
            type: "info",
            confirmButtonClass: "btn-info",
            confirmButtonText: "Aceptar",
            closeOnConfirm: true
        },
            function () {
                $("#FormModalPhone").modal("show");
            }
        );
        return;
    }

    // Preguntar antes de eliminar
    warningAudio.play();
    swal({
        title: "Eliminar Teléfono",
        text: "¿Estás seguro de que deseas eliminar este teléfono?",
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
                    url: '/BranchOffice/DeleteBranchOfficePhone',
                    type: "POST",
                    data: JSON.stringify({ branchOfficePhone: phoneObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {

                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "Su teléfono ha sido eliminado.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    $("#FormModalPhone").modal("show");
                                    phoneTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            errorAudio.play();
                            swal({
                                title: "¡Algo salió mal!",
                                text: text,
                                type: "error",
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            });
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    beforeSend: function () { }
                });
            }
            // Sino entonces notificar la cancelación
            else {
                swal({
                    title: "Cancelado",
                    text: "Su teléfono está intacto.",
                    type: "info",
                    confirmButtonClass: "btn-info",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalPhone").modal("show");
                    }
                );
            }
        }
    );
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
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1  data-toggle="tooltip" title="Editar correo""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1  data-toggle="tooltip" title="Eliminar correo""><i class="fas fa-trash"></i></button>',
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
    CreateEmailForm.resetForm();
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

            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalEmailCreate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has creado un nuevo correo!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        emailTable.ajax.reload();
                        $("#FormModalEmail").modal("show");
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Employee__A9D105349DACE215'")) {
                    text = "El correo que intenta agregar ya existe.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
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
    UpdateEmailForm.resetForm();
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
            // Ocultar Carga y Modal
            $(".modal-body").LoadingOverlay("hide");
            $("#FormModalEmailUpdate").modal("hide");

            // Si se creo entonces notificar
            if (response.result) {
                successAudio.play();
                swal({
                    title: "¡Buen trabajo!",
                    text: "¡Has actualizado el correo!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        emailTable.ajax.reload();
                        $("#FormModalEmail").modal("show");
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Employee__A9D105349DACE215'")) {
                    text = "El correo que intenta utilizar ya existe.";
                }
                errorAudio.play();
                swal({
                    title: "¡Algo salió mal!",
                    text: text,
                    type: "error",
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

    if (!emailObj.Active) {
        warningAudio.play();
        swal({
            title: "Información",
            text: "El correo se encuentra deshabilitado, no puede realizar esta acción.",
            type: "info",
            confirmButtonClass: "btn-info",
            confirmButtonText: "Aceptar",
            closeOnConfirm: true
        },
            function () {
                $("#FormModalEmail").modal("show");
            }
        );
        return;
    }

    // Preguntar antes de eliminar
    warningAudio.play();
    swal({
        title: "Eliminar Correo",
        text: "¿Estás seguro de que deseas eliminar este correo?",
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
                    url: '/EmployeeEmail/Delete',
                    type: "POST",
                    data: JSON.stringify({ employeeEmail: emailObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "Su correo ha sido eliminado.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    $("#FormModalEmail").modal("show");
                                    emailTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            var text = response.message;
                            if (response.message.includes("\"FK__User__EmployeeEm__00AA174D\"")) {
                                text = "El correo que desea eliminar está asociado a una cuenta del sistema.";
                            }
                            errorAudio.play();
                            swal({
                                title: "¡Algo salió mal!",
                                text: text,
                                type: "error",
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    $("#FormModalEmail").modal("show");
                                }
                            );
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    },
                    beforeSend: function () { }
                });
            }
            // Sino entonces notificar la cancelación
            else {
                swal({
                    title: "Cancelado",
                    text: "Su teléfono está intacto.",
                    type: "info",
                    confirmButtonClass: "btn-info",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        $("#FormModalEmail").modal("show");
                    }
                );
            }
        }
    );

    return;
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
