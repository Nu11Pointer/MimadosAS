// Variables Globales
var rowSelected;
var supplierTable;
var supplierObj;
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
    $('#CollapseMenuSupplier').addClass('active');
    $('#collapseSix').addClass('show');
    $('#CollapseMenuItemSupplier').addClass('active');

    // Show DataTable
    Read();

    // Cargar Selectores
    LoadSelectors();

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
    supplierTable = $('#dataTable').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/Supplier/Read',
            type: "GET",
            dataType: "json"
        },
        "columns": [
            { "data": "Id" },
            { "data": "Name" },
            {
                "data": "Active", "render": function (value) {
                    if (value)
                        return '<h5><span class="badge badge-success">Habilitado</span></h5>';
                    else
                        return '<h5><span class="badge badge-danger">Deshabilitado</span></h5>';
                }
            },
            {
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1 data-toggle="tooltip" title="Editar proveedor""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar proveedor""><i class="fas fa-trash"></i></button>' +
                    '<button type="button" class="btn btn-info btn-circle btn-sm ms-2 btn-email mr-1 mb-1 data-toggle="tooltip" title="Ver correos""><i class="fas fa-envelope"></i></button>' +
                    '<button type="button" class="btn btn-success btn-circle btn-sm ms-2 btn-phone mr-1 mb-1 data-toggle="tooltip" title="Ver teléfonos""><i class="fas fa-phone-alt"></i></button>',
                "orderable": false,
                "searchable": false
            }
        ],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
        }
    });
}

function LoadSelectors() {

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

            })
            try {
                if (supplierObj.Municipality.Id != -1) {
                    $("#MunicipalityUpdate").val(supplierObj.Municipality.Id);
                    supplierObj.Municipality.Id = -1;
                }
            } catch (e) { }
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function ShowCreateModal() {
    $("#NameCreate").val("");
    $("#AddressCreate").val("");
    $("#DepartmentCreate").val($("#DepartmentCreate option:first").val());
    $("#DepartmentCreate").trigger("change");
    $("#ActiveCreate").val($("#ActiveCreate option:first").val());
    $("#FormModalCreate").modal("show");
    $("#ErrorCreate").hide();
    CreateForm.resetForm();
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

    CreateForm = $("#CreateForm").validate({
        rules: {
            NameCreate: {
                required: true
            }
        },
        messages: {
            NameCreate: {
                required: "Este campo es obligatorio."
            }
        },
        errorClass: "errorTextForm",
        errorElement: "p"
    });

    UpdateForm = $("#UpdateForm").validate({
        rules: {
            NameUpdate: {
                required: true
            }
        },
        messages: {
            NameUpdate: {
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

    supplierObj = {
        "Id": 0,
        "Name": $("#NameCreate").val(),
        "Address": $("#AddressCreate").val(),
        "Municipality": {
            "Id": $("#MunicipalityCreate option:selected").val()
        },
        "Active": $("#ActiveCreate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Supplier/Create',
        type: "POST",
        data: JSON.stringify({ supplier: supplierObj }),
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
                    text: "¡Has creado un nuevo proveedor!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        supplierTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
                var text = response.message;
                if (response.message.includes("Referencia a objeto no establecida como instancia de un objeto.")) {
                    text = "No se proporcionó uno de los campos del formulario.";
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
                        $("#FormModalCreate").modal("show");
                    }
                );
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

    supplierObj = supplierTable.row(rowSelected).data();
    $("#NameUpdate").val(supplierObj.Name);
    $("#AddressUpdate").val(supplierObj.Address);
    $("#DepartmentUpdate").val(supplierObj.Municipality.Department.Id);
    $("#DepartmentUpdate").trigger("change");
    $("#ActiveUpdate").val(supplierObj.Active ? 1 : 0);
    $("#FormModalUpdate").modal("show");
    $("#ErrorUpdate").hide();
    UpdateForm.resetForm();
}

function Update() {

    if (!$("#UpdateForm").valid()) {
        return;
    }

    supplierObj = {
        "Id": supplierObj.Id,
        "Name": $("#NameUpdate").val(),
        "Address": $("#AddressUpdate").val(),
        "Municipality": {
            "Id": $("#MunicipalityUpdate option:selected").val()
        },
        "Active": $("#ActiveUpdate option:selected").val() == 1 ? true : false
    };

    jQuery.ajax({
        url: '/Supplier/Update',
        type: "POST",
        data: JSON.stringify({ supplier: supplierObj }),
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
                    text: "¡Has actualizado el proveedor!",
                    type: "success",
                    confirmButtonClass: "btn-success",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                    function () {
                        supplierTable.ajax.reload();
                    });
            }
            // Sino entonces notificar
            else {
                var text = response.message;
                if (response.message.includes("Referencia a objeto no establecida como instancia de un objeto.")) {
                    text = "No se proporcionó uno de los campos del formulario.";
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
                        $("#FormModalUpdate").modal("show");
                    }
                );
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

    supplierObj = supplierTable.row(rowSelected).data();

    if (!supplierObj.Active) {
        warningAudio.play();
        swal("Información", "El proveedor se encuentra deshabilitado, no puede realizar esta acción.", "info");
        return;
    }

    warningAudio.play();
    // Preguntar antes de eliminar
    swal({
        title: "Eliminar Proveedor",
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
                    url: '/Supplier/Delete',
                    type: "POST",
                    data: JSON.stringify({ supplier: supplierObj }),
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        // Si se eliminó entonces notificar y actualizar tabla
                        if (response.result) {
                            successAudio.play();
                            swal({
                                title: "¡Eliminado!",
                                text: "El proveedor ha sido eliminado.",
                                type: "success",
                                confirmButtonClass: "btn-success",
                                confirmButtonText: "Aceptar",
                                closeOnConfirm: true
                            },
                                function () {
                                    supplierTable.ajax.reload();
                                }
                            );
                        }
                        // Sino Entonces Notificar Error
                        else {
                            var text = response.message;
                            if (response.message.includes("\"FK__Purchase__Suppli__43A1090D\"")) {
                                text = "El proveedor que tratas de eliminar está siendo utilizado los registros de compras.";
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
                swal("Cancelado", "Su proveedor está intacto.", "info");
            }
        }
    );
}

// Teléfono

function ShowPhone() {
    $("#FormModalPhone").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    supplierObj = supplierTable.row(rowSelected).data();

    if (phoneTable != null) {
        phoneTable.destroy();
    }

    phoneTable = $('#dataTablePhone').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/SupplierPhone/ReadByEmployeId',
            type: "POST",
            data: { employeeId: supplierObj.Id }
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
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1 data-toggle="tooltip" title="Editar teléfono""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar teléfono""><i class="fas fa-trash"></i></button>',
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
    CreatePhoneForm.resetForm();
}

function CreatePhone() {

    if (!$("#CreatePhoneForm").valid()) {
        return;
    }

    phoneObj = {
        "Supplier": supplierObj,
        "PhoneNumber": $("#PhoneCreate").val(),
        "Active": $("#ActivePhoneCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/SupplierPhone/Create',
        type: "POST",
        data: JSON.stringify({ supplierPhone: phoneObj }),
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
                        $("#FormModalPhone").modal("show");
                        phoneTable.ajax.reload();
                    });
            }
            // Sino entonces notificar 
            else {
                var text = response.message;
                if (response.message.includes("'UQ__Supplier__85FB4E381858DA0B'")) {
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
    $("#FormModalPhoneUpdate").modal("show");
    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    phoneObj = phoneTable.row(rowSelected).data();

    $("#PhoneUpdate").val(phoneObj.PhoneNumber);
    $("#ActivePhoneUpdate").val(phoneObj.Active ? 1 : 0);
    $("#ErrorPhoneUpdate").hide();
    UpdatePhoneForm.resetForm();
}

function UpdatePhone() {

    if (!$("#UpdatePhoneForm").valid()) {
        return;
    }

    phoneObj = {
        "Id": phoneObj.Id,
        "Supplier": supplierObj,
        "PhoneNumber": $("#PhoneUpdate").val(),
        "Active": $("#ActivePhoneUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/SupplierPhone/Update',
        type: "POST",
        data: JSON.stringify({ supplierPhone: phoneObj }),
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
                if (response.message.includes("'UQ__Supplier__85FB4E381858DA0B'")) {
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
                    url: '/SupplierPhone/Delete',
                    type: "POST",
                    data: JSON.stringify({ supplierPhone: phoneObj }),
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

// Correo

function ShowEmail() {
    $("#FormModalEmail").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    supplierObj = supplierTable.row(rowSelected).data();

    if (emailTable != null) {
        emailTable.destroy();
    }

    emailTable = $('#dataTableEmail').DataTable({
        responsive: true,
        ordering: true,
        "ajax": {
            url: '/supplierEmail/ReadByEmployeId',
            type: "POST",
            data: { employeeId: supplierObj.Id }
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
                "defaultContent": '<button type="button" class="btn btn-primary btn-circle btn-sm btn-update mr-1 mb-1 data-toggle="tooltip" title="Editar correo""><i class="fas fa-pen"></i></button>' +
                    '<button type="button" class="btn btn-danger btn-circle btn-sm ms-2 btn-detelete mr-1 mb-1 data-toggle="tooltip" title="Eliminar correo""><i class="fas fa-trash"></i></button>',
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
    CreateEmailForm.resetForm();
}

function CreateEmail() {

    if (!$("#CreateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Supplier": supplierObj,
        "Email": $("#EmailCreate").val(),
        "Active": $("#ActiveEmailCreate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/supplierEmail/Create',
        type: "POST",
        data: JSON.stringify({ supplierEmail: emailObj }),
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
                if (response.message.includes("'UQ__Supplier__A9D1053490658E30'")) {
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
    $("#FormModalEmailUpdate").modal("show");

    rowSelected = $(this).closest("tr");
    if ($(rowSelected).hasClass('child')) {
        rowSelected = $(rowSelected).prev();
    }

    emailObj = emailTable.row(rowSelected).data();

    $("#EmailUpdate").val(emailObj.Email);
    $("#ActiveEmailUpdate").val(emailObj.Active ? 1 : 0);
    $("#ErrorEmailUpdate").hide();
    UpdateEmailForm.resetForm();
}

function UpdateEmail() {

    if (!$("#UpdateEmailForm").valid()) {
        return;
    }

    emailObj = {
        "Id": emailObj.Id,
        "Supplier": supplierObj,
        "Email": $("#EmailUpdate").val(),
        "Active": $("#ActiveEmailUpdate option:selected").val() == 1
    }

    jQuery.ajax({
        url: '/supplierEmail/Update',
        type: "POST",
        data: JSON.stringify({ supplierEmail: emailObj }),
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
                if (response.message.includes("'UQ__Supplier__A9D1053490658E30'")) {
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
                    url: '/supplierEmail/Delete',
                    type: "POST",
                    data: JSON.stringify({ supplierEmail: emailObj }),
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
}
